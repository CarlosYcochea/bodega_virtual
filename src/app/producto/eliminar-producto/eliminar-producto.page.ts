import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { MLproducto } from '../model/MLproducto';
import { ProductoService } from '../producto.service';
import { Storage } from '@ionic/storage-angular'; // Importar servicio de almacenamiento

@Component({
  selector: 'app-eliminar-producto', // Selector CSS para usar el componente
  templateUrl: './eliminar-producto.page.html', // Plantilla HTML asociada
  styleUrls: ['./eliminar-producto.page.scss'], // Estilos CSS asociados
})
export class EliminarProductoPage implements OnInit {
  // Inicialización del objeto producto con valores por defecto
  producto: MLproducto = { id: 2, nombre: '', materialidad: '' };
  usuario: string = ''; // Variable para almacenar el nombre de usuario

  // Constructor que inyecta los servicios necesarios
  constructor(
    public restApi: ProductoService, // Servicio para operaciones CRUD de productos
    public loadingController: LoadingController, // Controlador para mostrar indicador de carga
    public alertController: AlertController, // Controlador para mostrar alertas
    public route: ActivatedRoute, // Servicio para obtener parámetros de la ruta
    public router: Router, // Servicio para navegación
    private storage: Storage // Servicio de almacenamiento para obtener el nombre del usuario
  ) { }

  // Método que se ejecuta al inicializar el componente
  ngOnInit() {
    this.obtenerProducto();
    // Obtener el nombre de usuario almacenado
    this.storage.get('nombre').then((nombre) => {
      this.usuario = nombre || ''; // Si no hay nombre, se asigna un valor vacío
    });
  }

  // Método asíncrono para obtener los datos de un producto específico
  async obtenerProducto() {
    // Crear y mostrar el indicador de carga
    const loading = await this.loadingController.create({
      message: 'Cargando...'
    });
    await loading.present();

    // Llamada al servicio para obtener el producto por ID
    await this.restApi.obtenerProducto(this.route.snapshot.params['id']).subscribe({
      next: (res) => { // Callback de éxito
        this.producto = res; // Almacenar la respuesta en la variable producto
        loading.dismiss(); // Ocultar el indicador de carga
      },
      error: (err) => { // Callback de error
        console.log(err); // Mostrar error en consola
        loading.dismiss(); // Ocultar el indicador de carga
      }
    });
  }

  // Método asíncrono para eliminar un producto
  async eliminarProducto(id: number) {
    // Crear y mostrar el indicador de carga
    const loading = await this.loadingController.create({
      message: 'Eliminando producto...'
    });
    await loading.present();

    // Llamada al servicio para eliminar el producto
    await this.restApi.eliminarProducto(id, this.usuario).subscribe({
      next: (res) => { // Callback de éxito
        loading.dismiss(); // Ocultar el indicador de carga
        this.router.navigate(['/gestion']); // Navegar a la página de gestión
      },
      error: (err) => { // Callback de error
        console.log(err); // Mostrar error en consola
        loading.dismiss(); // Ocultar el indicador de carga
      }
    });
  }

  // Método para mostrar un diálogo de confirmación
  async presentAlertConfirm(message: string) {
    // Crear el diálogo de alerta
    const alert = await this.alertController.create({
      header: 'Confirm!', // Título de la alerta
      message: message, // Mensaje personalizado
      buttons: [
        {
          text: 'Cancel', // Botón de cancelar
          role: 'cancel', // Rol del botón
          cssClass: 'secondary', // Clase CSS
          handler: (blah) => { // Manejador del evento de cancelar
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay', // Botón de confirmar
          handler: () => { // Manejador del evento de confirmar
            console.log('Confirm Okay');
            this.eliminarProducto(this.producto.id); // Llamar a eliminar el producto
          }
        }
      ]
    });

    await alert.present(); // Mostrar el diálogo de alerta
  }
}
