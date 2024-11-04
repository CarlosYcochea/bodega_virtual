import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SqliteService {

  private dbInstance: SQLiteObject | null = null;
  private readonly dbName: string = 'ubicaciones.db';
  private readonly tableName: string = 'ubicaciones';

  constructor(private sqlite: SQLite, private platform: Platform) {
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

  // Modificar una ubicación en SQLite
  modificarUbicacion(id: number, ubicacion: any): Observable<any> {
    const query = `UPDATE ${this.tableName} SET nombre = ?, rack = ?, ubicacion = ?, cantidad = ? WHERE id = ?`;
    const params = [ubicacion.nombre, ubicacion.rack, ubicacion.ubicacion, ubicacion.cantidad, id];

    return from(this.getDbInstance().then(db => db.executeSql(query, params))).pipe(
      map((res) => {
        console.log('Ubicación modificada en SQLite:', res);
        return res;
      }),
      catchError((error) => {
        console.error('Error al modificar ubicación:', error);
        return of(null); // Manejar error
      })
    );
  }

  // Eliminar una ubicación en SQLite
  eliminarUbicacion(id: number): Observable<any> {
    const query = `DELETE FROM ${this.tableName} WHERE id = ?`;

    return from(this.getDbInstance().then(db => db.executeSql(query, [id]))).pipe(
      map((res) => {
        console.log('Ubicación eliminada en SQLite:', res);
        return res;
      }),
      catchError((error) => {
        console.error('Error al eliminar ubicación:', error);
        return of(null); // Manejar error
      })
    );
  }

  // Obtener todas las ubicaciones desde SQLite
  obtenerUbicaciones(): Observable<any[]> {
    return from(this.getDbInstance().then(db => db.executeSql(`SELECT * FROM ${this.tableName}`, []))).pipe(
      map((res) => {
        const ubicaciones = [];
        for (let i = 0; i < res.rows.length; i++) {
          ubicaciones.push(res.rows.item(i));
        }
        console.log('Ubicaciones obtenidas de SQLite:', ubicaciones);
        return ubicaciones;
      }),
      catchError((error) => {
        console.error('Error al obtener ubicaciones:', error);
        return of([]); // Retornar lista vacía si hay error
      })
    );
  }
  
  // Obtener una ubicación específica desde SQLite
  obtenerUbicacion(id: number): Observable<any> {
    const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    
    return from(this.getDbInstance().then(db => db.executeSql(query, [id]))).pipe(
      map((res) => {
        if (res.rows.length > 0) {
          console.log('Ubicación obtenida de SQLite:', res.rows.item(0));
          return res.rows.item(0);
        } else {
          throw new Error('Ubicación no encontrada en SQLite');
        }
      }),
      catchError((error) => {
        console.error('Error al obtener ubicación:', error);
        return of(null); // Retornar null si hay error
      })
    );
  }
}