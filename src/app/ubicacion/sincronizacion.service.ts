import { Injectable } from '@angular/core';
import { SqliteService } from './sqlite.service';
import { ApiService } from './api.service';
import { Network } from '@awesome-cordova-plugins/network/ngx';

@Injectable({
  providedIn: 'root'
})
export class SincronizacionService {

  constructor(
    private sqliteService: SqliteService,
    private apiService: ApiService,
    private network: Network
  ) {
    // Monitorea cambios en la conexión de red
    this.network.onConnect().subscribe(() => {
      this.sincronizarConAPI();
    });
  }

  // Función para sincronizar datos desde SQLite a la API
  async sincronizarConAPI(): Promise<void> {
    try {
      const ubicaciones = await this.sqliteService.obtenerUbicaciones().toPromise();
      
      if (ubicaciones) {
        for (const ubicacion of ubicaciones) {
          const apiResult = await this.apiService.agregarUbicacion(ubicacion).toPromise();

        if (apiResult) {
          // Elimina la ubicación en SQLite después de sincronizar exitosamente
          await this.sqliteService.eliminarUbicacion(ubicacion.id).toPromise();
          }
        }
      }
    } catch (error) {
      console.error('Error al sincronizar con la API:', error);
    }
  }
}
