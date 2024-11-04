import { Injectable } from '@angular/core';
import { MLproducto } from '../producto/model/MLproducto';

import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

const apiUrl = "http://192.168.1.125:3000/productos";
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  constructor(private http: HttpClient) { }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

  agregarProducto(producto: MLproducto): Observable<MLproducto> {
    return this.http.post<MLproducto>(apiUrl, producto, httpOptions).pipe(
      tap((producto: MLproducto) => console.log(`added producto w/ id=${producto.id}`)),
      catchError(this.handleError<MLproducto>('agregarProducto'))
    );
  }

  obtenerProductos(): Observable<MLproducto[]> {
    return this.http.get<MLproducto[]>(apiUrl)
      .pipe(
        tap(heroes => console.log('fetched productos')),
        catchError(this.handleError('obtenerProductos', []))
      );
  }


  obtenerProducto(id: String): Observable<MLproducto> {
    console.log("getProduct ID:" + id);
    return this.http.get<MLproducto>(apiUrl + "/" + id).pipe(
      tap(_ => console.log('fetched producto id=${id}')),
      catchError(this.handleError<MLproducto>('obtenerProducto id=${id}'))
    );
  }

  eliminarProducto(id: number): Observable<MLproducto> {
    return this.http.delete<MLproducto>(apiUrl + "/" + id, httpOptions).pipe(
      tap(_ => console.log('deleted producto id=${id}')),
      catchError(this.handleError<MLproducto>('eliminarProducto'))
    );
  }
  actualizarProducto(id: number, producto: MLproducto): Observable<MLproducto> {
    return this.http.put<MLproducto>(apiUrl + "/" + id, producto, httpOptions).pipe(
      tap(_ => console.log('updated producto id=${id}')),
      catchError(this.handleError<any>('actualizarProducto'))
    );
  }
}