import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { from, Observable, of, forkJoin } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

interface Ubicacion {
  id: number;
  nombre: string;
  rack: string;
  ubicacion: string;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class SqliteService {

  private dbInstance: SQLiteObject | null = null;
  private readonly dbName: string = 'ubicaciones.db';
  private readonly tableName: string = 'ubicaciones';

  constructor(private sqlite: SQLite, private platform: Platform, private http: HttpClient) {
    // Esperar a que la plataforma esté lista antes de inicializar la base de datos
    this.platform.ready().then(() => {
      this.initializeDatabase();
    });
  }

  // Inicializar la base de datos SQLite
  async initializeDatabase(): Promise<void> {
    try {
      this.dbInstance = await this.sqlite.create({
        name: this.dbName,
        location: 'default'
      });

      // Crear la tabla de ubicaciones si no existe
      await this.dbInstance.executeSql(
        `CREATE TABLE IF NOT EXISTS ${this.tableName} (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT, rack TEXT, ubicacion TEXT, cantidad INTEGER)`,
        []
      );
      console.log('Base de datos SQLite inicializada');
    } catch (error) {
      console.error('Error al inicializar la base de datos SQLite:', error);
    }
  }

  // Verificar si la base de datos está disponible antes de cualquier operación
  private async getDbInstance(): Promise<SQLiteObject> {
    if (this.dbInstance) {
      return this.dbInstance;
    } else {
      throw new Error('Base de datos no inicializada');
    }
  }

  // Agregar una ubicación en SQLite
  agregarUbicacion(ubicacion: any): Observable<any> {
    const query = `INSERT INTO ${this.tableName} (nombre, rack, ubicacion, cantidad) VALUES (?, ?, ?, ?)`;
    const params = [ubicacion.nombre, ubicacion.rack, ubicacion.ubicacion, ubicacion.cantidad];

    return from(this.getDbInstance().then(db => db.executeSql(query, params))).pipe(
      map((res) => {
        console.log('Ubicación agregada en SQLite con id:', res.insertId);
        return res.insertId;
      }),
      catchError((error) => {
        console.error('Error al agregar ubicación:', error);
        return of(null); // Manejar error y retornar valor null
      })
    );
  }

  modificarUbicacion(id: number, ubicacion: any): Observable<any> {
    return this.verificarApiRest().pipe(
      switchMap(estaConectado => {
        if (estaConectado) {
          return this.http.put(`https://6743d15ab7464b1c2a65f46e.mockapi.io/ubicaciones/${id}`, ubicacion);
        } else {
          const query = `UPDATE ${this.tableName} SET nombre = ?, rack = ?, ubicacion = ?, cantidad = ? WHERE id = ?`;
          const params = [ubicacion.nombre, ubicacion.rack, ubicacion.ubicacion, ubicacion.cantidad, id];
          return from(this.getDbInstance().then(db => db.executeSql(query, params)));
        }
      }),
      catchError(error => {
        console.error('Error al modificar ubicación:', error);
        return of(null);
      })
    );
  }
  
  eliminarUbicacion(id: number): Observable<any> {
    return this.verificarApiRest().pipe(
      switchMap(estaConectado => {
        if (estaConectado) {
          return this.http.delete(`https://6743d15ab7464b1c2a65f46e.mockapi.io/ubicaciones/${id}`);
        } else {
          return from(this.getDbInstance()
            .then(db => db.executeSql(`DELETE FROM ${this.tableName} WHERE id = ?`, [id])));
        }
      }),
      catchError(error => {
        console.error('Error al eliminar ubicación:', error);
        return of(null);
      })
    );
  }

  obtenerUbicaciones(): Observable<any[]> {
    return this.verificarApiRest().pipe(
      switchMap(estaConectado => {
        if (estaConectado) {
          // Primero obtener datos de SQLite
          return from(this.getDbInstance().then(db => 
            db.executeSql(`SELECT * FROM ${this.tableName}`, [])
          )).pipe(
            switchMap((res) => {
              const ubicacionesSqlite: Ubicacion[] = [];
              for (let i = 0; i < res.rows.length; i++) {
                ubicacionesSqlite.push({
                  id: res.rows.item(i).id,
                  nombre: res.rows.item(i).nombre,
                  rack: res.rows.item(i).rack,
                  ubicacion: res.rows.item(i).ubicacion,
                  cantidad: res.rows.item(i).cantidad
                });
              }
  
              // Si hay datos en SQLite, enviarlos a la API
              if (ubicacionesSqlite.length > 0) {
                const envios = ubicacionesSqlite.map(ubicacion => 
                  this.enviarDatosApiRest(ubicacion)
                );
  
                return forkJoin(envios).pipe(
                  switchMap(() => {
                    // Después de enviar todos los datos, eliminar registros de SQLite
                    return this.eliminarTodosLosDatos().pipe(
                      switchMap(() => {
                        // Finalmente, obtener datos actualizados de la API
                        return this.http.get<Ubicacion[]>('https://6743d15ab7464b1c2a65f46e.mockapi.io/ubicaciones');
                      })
                    );
                  })
                );
              } else {
                // Si no hay datos en SQLite, solo obtener de la API
                return this.http.get<Ubicacion[]>('https://6743d15ab7464b1c2a65f46e.mockapi.io/ubicaciones');
              }
            })
          );
        } else {
          // Si no hay conexión, obtener datos de SQLite
          return from(this.getDbInstance().then(db => 
            db.executeSql(`SELECT * FROM ${this.tableName}`, [])
          )).pipe(
            map((res) => {
              const ubicaciones: Ubicacion[] = [];
              for (let i = 0; i < res.rows.length; i++) {
                ubicaciones.push({
                  id: res.rows.item(i).id,
                  nombre: res.rows.item(i).nombre,
                  rack: res.rows.item(i).rack,
                  ubicacion: res.rows.item(i).ubicacion,
                  cantidad: res.rows.item(i).cantidad
                });
              }
              return ubicaciones;
            })
          );
        }
      }),
      catchError((error) => {
        console.error('Error al obtener ubicaciones:', error);
        return of([]);
      })
    );
  }
  obtenerUbicacion(id: number): Observable<any> {
    return this.verificarApiRest().pipe(
      switchMap(estaConectado => {
        if (estaConectado) {
          return this.http.get(`https://6743d15ab7464b1c2a65f46e.mockapi.io/ubicaciones/${id}`);
        } else {
          return from(this.getDbInstance()
            .then(db => db.executeSql(`SELECT * FROM ${this.tableName} WHERE id = ?`, [id])))
            .pipe(
              map(res => res.rows.length > 0 ? res.rows.item(0) : null)
            );
        }
      }),
      catchError(error => {
        console.error('Error al obtener ubicación:', error);
        return of(null);
      })
    );
  }

  // verificar si esta conectado la api rest
  verificarApiRest(): Observable<boolean> {
    return this.http.get('https://6743d15ab7464b1c2a65f46e.mockapi.io/ubicaciones').pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  // Enviar datos a la api rest
  enviarDatosApiRest(ubicacion: Ubicacion): Observable<any> {
    const datoFormateado = {
      id: ubicacion.id,
      nombre: ubicacion.nombre,
      rack: ubicacion.rack,
      ubicacion: ubicacion.ubicacion,
      cantidad: ubicacion.cantidad
    };

    return this.http.post('https://6743d15ab7464b1c2a65f46e.mockapi.io/ubicaciones', datoFormateado);
  }

  // Eliminar todos los datos de la base de datos de SQLite
  eliminarTodosLosDatos(): Observable<any> {
    return from(this.getDbInstance().then(db => db.executeSql(`DELETE FROM ${this.tableName}`, [])));
  }
}