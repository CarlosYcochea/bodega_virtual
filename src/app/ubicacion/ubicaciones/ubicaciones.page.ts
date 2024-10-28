import { Component, OnInit } from '@angular/core';
import { SqliteService } from '../sqlite.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-ubicaciones',
  templateUrl: './ubicaciones.page.html',
  styleUrls: ['./ubicaciones.page.scss'],
})
export class UbicacionesPage implements OnInit {

  ubicaciones: any[] = []; // Arreglo para almacenar las ubicaciones
  nuevaUbicacion = { nombre: '', rack: '', ubicacion: '', cantidad: 0 }; // Modelo para agregar/modificar ubicación

  constructor(
    private sqliteService: SqliteService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.cargarUbicaciones(); // Cargar las ubicaciones al inicializar la página
  }

  // Cargar ubicaciones, ya sea desde la API o desde SQLite según disponibilidad
  cargarUbicaciones() {
    this.sqliteService.obtenerUbicaciones().subscribe((ubicaciones: any[]) => {
      this.ubicaciones = ubicaciones;
    }, error => {
      this.presentAlert('Error', 'No se pudo cargar las ubicaciones.');
    });
  }

  // Función para mostrar alertas
  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }
}

