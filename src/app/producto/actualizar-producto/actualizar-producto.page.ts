// Importaciones necesarias de Angular y Ionic
import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, NgForm, Validators , FormControlName,FormGroupDirective} from '@angular/forms';
import { MLproducto } from '../model/MLproducto';
import { ProductoService } from '../producto.service';

// Decorador que define los metadatos del componente
@Component({
  selector: 'app-actualizar-producto',
  templateUrl: './actualizar-producto.page.html',
  styleUrls: ['./actualizar-producto.page.scss'],
})
export class ActualizarProductoPage implements OnInit {
  // Declaración del formulario reactivo
  productoForm!: FormGroup;

  // Inicialización del objeto producto con valores por defecto
  producto: MLproducto = { id: 1, nombre: '', materialidad: '' };
  id: any = '';

  // Constructor con inyección de dependencias necesarias
  constructor(
    public loadingController: LoadingController,  // Para mostrar indicador de carga
    public alertController: AlertController,      // Para mostrar alertas
    public route: ActivatedRoute,                 // Para obtener parámetros de la ruta
    public router: Router,                        // Para la navegación
    private formBuilder: FormBuilder,             // Para crear formularios reactivos
    public restApi: ProductoService               // Servicio para operaciones con productos
  ) {}

  // Método que se ejecuta al inicializar el componente
  ngOnInit() {
    // Obtiene el producto según el ID en la URL
    this.obtenerProducto(this.route.snapshot.params['id']);

    // Inicialización del formulario con validaciones
    this.productoForm = this.formBuilder.group({
      'nombre': [null, Validators.required],        // Campo nombre obligatorio
      'materialidad': [null, Validators.required]   // Campo materialidad obligatorio
    });
  }

  // Método que se ejecuta al enviar el formulario
  async onFormSubmit(form: NgForm) {
    console.log("onFormSubmit ID:" + this.id)
    this.producto.id = this.id;

    // Llamada al servicio para actualizar el producto
    await this.restApi.actualizarProducto(this.id, this.producto).subscribe({
      next: (res) => {
        let id = res['id'];
        this.router.navigate(['/gestion', { id: id }]);  // Navega a la página de gestión
      },
      error: (err) => {
        console.log(err);
        this.presentAlertConfirm('Error updating product.');  // Muestra alerta de error
      },
      complete: () => {
        console.log('Producto actualizado');
      }
    });
  }

  // Método para obtener los datos del producto
  async obtenerProducto(id: number) {
    // Crea y muestra el indicador de carga
    const loading = await this.loadingController.create({
      message: 'Cargando...'
    });
    await loading.present();

    // Llamada al servicio para obtener el producto
    await this.restApi.obtenerProducto(id + "").subscribe({
      next: (data) => {
        // Actualiza el ID y los valores del formulario con los datos recibidos
        this.id = data.id;
        this.productoForm.setValue({
          nombre: data.nombre,
          materialidad: data.materialidad
        });
        loading.dismiss();  // Oculta el indicador de carga
      },
      complete: () => {
        console.log('Producto cargado');
      },
      error: (err) => {
        loading.dismiss();  // Oculta el indicador de carga en caso de error
      }
    });
  }

  // Método para mostrar alertas de confirmación
  async presentAlertConfirm(msg: string) {
    const alert = await this.alertController.create({
      header: 'Warning!',
      message: msg,
      buttons: [
        {
          text: 'Okay',
          handler: () => {
            this.router.navigate(['/gestion']);  // Navega a la página de gestión
          }
        }
      ]
    });
    await alert.present();  // Muestra la alerta
  }
}
