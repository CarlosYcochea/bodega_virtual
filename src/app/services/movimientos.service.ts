import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovimientosService {

  private apiUrl = 'https://6743d15ab7464b1c2a65f46e.mockapi.io/movimientos';

  constructor( private http: HttpClient) { }

  registrarMovimiento(usuario: String, accion: String, detalles: String): Observable<any>{
    const movimiento = {
      usuario: usuario,
      accion: accion,
      detalles: detalles,
      fecha: new Date().toISOString()
    };    
    return this.http.post(this.apiUrl, movimiento);
  }

  obtenerMovimientos(): Observable<any> {
    return this.http.get(this.apiUrl)
  }
} 
