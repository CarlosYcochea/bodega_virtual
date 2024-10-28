import { Component, OnInit } from '@angular/core';
import { SqliteService } from '../sqlite.service'; // Servicio para manejar la base de datos
import { AlertController, LoadingController } from '@ionic/angular'; // Controladores para mostrar alertas y el spinner
import { ActivatedRoute, Router } from '@angular/router'; // Para manejar la ruta y navegación

@Component({
  selector: 'app-eliminar-ubicacion',
  templateUrl: './eliminar-ubicacion.page.html',
  styleUrls: ['./eliminar-ubicacion.page.scss'],
})
export class EliminarUbicacionPage implements OnInit {

  ubicacion: any; // Información de la ubicación a eliminar
  eliminando: boolean = false; // Estado para mostrar el mensaje "Eliminando..."

  constructor(
    private sqliteService: SqliteService,
    private alertController: AlertController,
    private loadingController: LoadingController, // Controlador de carga
    private route: ActivatedRoute, // Para obtener el id de la ubicación
    private router: Router // Para redirigir después de eliminar
  ) {}

  ngOnInit() {
    this.obtenerUbicacion(); // Cargar la ubicación al iniciar la página
  }

  // Obtener los detalles de la ubicación a eliminar
  obtenerUbicacion() {
    const id = this.route.snapshot.paramMap.get('id'); // Obtener el id de la ruta
    if (id !== null) {
      const numericId = parseInt(id, 10);
      this.sqliteService.obtenerUbicacion(numericId).subscribe(
        (ubicacion) => {
          this.ubicacion = ubicacion; // Guardar la información de la ubicación
        },
        (error) => {
          this.presentAlert('Error', 'No se pudo cargar la ubicación.');
          console.error('Error al cargar ubicación: ', error);
        }
      );
    } else {
      this.presentAlert('Error', 'ID de ubicación no válido.');
    }
  }
  // Mostrar cuadro de confirmación antes de eliminar
  async confirmarEliminar() {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de que deseas eliminar la ubicación "${this.ubicacion.nombre}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Eliminación cancelada');
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.eliminarUbicacion(); // Llamar a la función para eliminar la ubicación
          }
        }
      ]
    });

    await alert.present();
  }

  // Función para eliminar la ubicación
  async eliminarUbicacion() {
    const loading = await this.loadingController.create({
      message: 'Eliminando ubicación...'
    });
    await loading.present(); // Mostrar el mensaje de "Eliminando..."

    this.sqliteService.eliminarUbicacion(this.ubicacion.id).subscribe(
      () => {
        loading.dismiss(); // Ocultar el mensaje de carga después de eliminar
        this.presentAlert('Éxito', 'Ubicación eliminada correctamente.');
        this.router.navigate(['/ubicaciones']); // Redirigir a la página de ubicaciones
      },
      (error) => {
        loading.dismiss(); // Ocultar el mensaje en caso de error
        this.presentAlert('Error', 'No se pudo eliminar la ubicación.');
        console.error('Error al eliminar ubicación: ', error);
      }
    );
  }

  // Mostrar una alerta de éxito o error
  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }
}
