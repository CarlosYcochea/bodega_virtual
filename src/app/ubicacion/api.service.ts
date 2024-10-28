import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly apiUrl = 'http://10.16.56.110:3000/ubicaciones'; // URL de tu API

  constructor(private http: HttpClient) { }

  // Agregar ubicación en la API
  agregarUbicacion(ubicacion: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, ubicacion).pipe(
      catchError(error => {
        console.error('Error al agregar ubicación en la API:', error);
        return of(null);
      })
    );
  }

  // Modificar ubicación en la API
  modificarUbicacion(id: number, ubicacion: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, ubicacion).pipe(
      catchError(error => {
        console.error('Error al modificar ubicación en la API:', error);
        return of(null);
      })
    );
  }

  // Eliminar ubicación en la API
  eliminarUbicacion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error al eliminar ubicación en la API:', error);
        return of(null);
      })
    );
  }

  // Obtener todas las ubicaciones desde la API
  obtenerUbicaciones(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`).pipe(
      catchError(error => {
        console.error('Error al obtener ubicaciones desde la API:', error);
        return of([]);
      })
    );
  }
}
