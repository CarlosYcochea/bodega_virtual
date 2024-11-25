// Importaciones necesarias de Angular y RxJS
import { Injectable } from '@angular/core';
import { MLproducto } from '../producto/model/MLproducto';

import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

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
  // Constructor que inyecta el cliente HTTP
  constructor(private http: HttpClient) { }

  // Método privado para manejar errores en las operaciones HTTP
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

  // Método para crear un nuevo producto
  agregarProducto(producto: MLproducto): Observable<MLproducto> {
    return this.http.post<MLproducto>(apiUrl, producto, httpOptions).pipe(
      // Registra en consola cuando se agrega exitosamente
      tap((producto: MLproducto) => console.log(`added producto w/ id=${producto.id}`)),
      // Maneja cualquier error que ocurra
      catchError(this.handleError<MLproducto>('agregarProducto'))
    );
  }

  // Método para obtener todos los productos
  obtenerProductos(): Observable<MLproducto[]> {
    return this.http.get<MLproducto[]>(apiUrl)
      .pipe(
        // Registra en consola cuando se obtienen los productos
        tap(heroes => console.log('fetched productos')),
        catchError(this.handleError('obtenerProductos', []))
      );
  }

  // Método para obtener un producto específico por ID
  obtenerProducto(id: String): Observable<MLproducto> {
    console.log("getProduct ID:" + id);
    return this.http.get<MLproducto>(apiUrl + "/" + id).pipe(
      // Registra en consola cuando se obtiene el producto
      tap(_ => console.log('fetched producto id=${id}')),
      catchError(this.handleError<MLproducto>('obtenerProducto id=${id}'))
    );
  }

  // Método para eliminar un producto por ID
  eliminarProducto(id: number): Observable<MLproducto> {
    return this.http.delete<MLproducto>(apiUrl + "/" + id, httpOptions).pipe(
      // Registra en consola cuando se elimina el producto
      tap(_ => console.log('deleted producto id=${id}')),
      catchError(this.handleError<MLproducto>('eliminarProducto'))
    );
  }

  // Método para actualizar un producto existente
  actualizarProducto(id: number, producto: MLproducto): Observable<MLproducto> {
    return this.http.put<MLproducto>(apiUrl + "/" + id, producto, httpOptions).pipe(
      // Registra en consola cuando se actualiza el producto
      tap(_ => console.log('updated producto id=${id}')),
      catchError(this.handleError<any>('actualizarProducto'))
    );
  }
}