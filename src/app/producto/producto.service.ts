// Importaciones necesarias de Angular y RxJS
import { Injectable } from '@angular/core';
import { MLproducto } from '../producto/model/MLproducto';

import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MovimientosService } from '../services/movimientos.service';

// URL de la API REST
const apiUrl = "https://6743cc7fb7464b1c2a65e236.mockapi.io/productos";
// Configuración de cabeceras HTTP
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

// Decorador que marca esta clase como un servicio inyectable
@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor(
    private http: HttpClient,
    private movimientosService: MovimientosService  // Asegúrate de tener un servicio para manejar los movimientos
  ) { }

  // Método privado para manejar errores en las operaciones HTTP
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

  // Método para crear un nuevo producto
  agregarProducto(producto: MLproducto, usuario: string): Observable<MLproducto> {
    // Registra el movimiento de agregar
    this.movimientosService.registrarMovimiento(usuario, 'agregar', `Se agregó el producto`)
      .subscribe();

    return this.http.post<MLproducto>(apiUrl, producto, httpOptions).pipe(
      tap((producto: MLproducto) => console.log(`added producto w/ id=${producto.id}`)),
      catchError(this.handleError<MLproducto>('agregarProducto'))
    );
  }

  // Método para obtener todos los productos
  obtenerProductos(): Observable<MLproducto[]> {
    return this.http.get<MLproducto[]>(apiUrl).pipe(
      tap(heroes => console.log('fetched productos')),
      catchError(this.handleError('obtenerProductos', []))
    );
  }

  // Método para obtener un producto específico por ID
  obtenerProducto(id: string): Observable<MLproducto> {
    console.log("getProduct ID:" + id);
    return this.http.get<MLproducto>(`${apiUrl}/${id}`).pipe(
      tap(_ => console.log(`fetched producto id=${id}`)),
      catchError(this.handleError<MLproducto>('obtenerProducto id=${id}'))
    );
  }

  // Método para eliminar un producto por ID
  eliminarProducto(id: number, usuario: string): Observable<MLproducto> {
    // Registra el movimiento de eliminación
    this.movimientosService.registrarMovimiento(usuario, 'eliminar', `Se eliminó el producto con ID: ${id}`)
      .subscribe();

    return this.http.delete<MLproducto>(`${apiUrl}/${id}`, httpOptions).pipe(
      tap(_ => console.log(`deleted producto id=${id}`)),
      catchError(this.handleError<MLproducto>('eliminarProducto'))
    );
  }

  // Método para actualizar un producto existente
  actualizarProducto(id: number, producto: MLproducto, usuario: string): Observable<MLproducto> {
    // Registra el movimiento de modificación
    this.movimientosService.registrarMovimiento(usuario, 'modificar', `Se modificó el producto con ID: ${id}`)
      .subscribe();

    return this.http.put<MLproducto>(`${apiUrl}/${id}`, producto, httpOptions).pipe(
      tap(_ => console.log(`updated producto id=${id}`)),
      catchError(this.handleError<any>('actualizarProducto'))
    );
  }
}
