// Importaciones necesarias de Angular y otras librerías
import { Component, OnInit } from '@angular/core';                                         // Importa decoradores y interfaces básicas de Angular
import { MLproducto } from '../model/MLproducto';                                         // Importa el modelo de datos del producto
import { ProductoService } from '../producto.service';                                     // Importa el servicio para manejar productos
import { FormBuilder, FormGroup, NgForm, Validators , FormControlName} from '@angular/forms'; // Importa utilidades para manejo de formularios
import { Router } from '@angular/router';                                                  // Importa el servicio de enrutamiento
import { LoadingController } from '@ionic/angular';                                        // Importa el controlador de carga de Ionic
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';            // Importa el escáner de códigos de barras

// Decorador del componente con sus metadatos
@Component({
  selector: 'app-agregar-producto',                                                       // Selector para usar el componente
  templateUrl: './agregar-producto.page.html',                                            // Plantilla HTML asociada
  styleUrls: ['./agregar-producto.page.scss'],                                            // Estilos CSS asociados
})
export class AgregarProductoPage implements OnInit {

  productoForm!: FormGroup;                                                               // Declaración del formulario reactivo

  // Inicialización del objeto producto con valores por defecto
  producto: MLproducto = {
    id: 2,                                                                                // ID por defecto
    nombre: '',                                                                           // Nombre vacío inicial
    materialidad: ''                                                                      // Materialidad vacía inicial
  };

  // Constructor con inyección de dependencias
  constructor( 
    private restApi: ProductoService,                                                     // Servicio para operaciones con productos
    private router: Router,                                                               // Servicio para navegación
    private formBuilder: FormBuilder,                                                     // Constructor de formularios
    private loadingController: LoadingController,                                         // Controlador de indicador de carga
    private barcodeScanner: BarcodeScanner                                               // Servicio de escáner de códigos
  ) {}

  // Método que se ejecuta al inicializar el componente
  ngOnInit() {
    this.productoForm = this.formBuilder.group({                                         // Inicialización del formulario reactivo
      "nombre": [null, Validators.required],                                              // Campo nombre con validación requerida
      'materialidad': [null, Validators.required],                                        // Campo materialidad con validación requerida
    });
  }

  // Método para manejar el envío del formulario
  async onFormSubmit(form: NgForm) {
    const loading = await this.loadingController.create({                                 // Crea indicador de carga
      message: 'Cargando...',
    });
    await loading.present();                                                              // Muestra el indicador de carga

    this.producto = this.productoForm.value;                                             // Obtiene los valores del formulario

    // Llama al servicio para agregar el producto
    await this.restApi.agregarProducto(this.producto)
    .subscribe({
      next: (res) => {                                                                   // Manejo de respuesta exitosa
        console.log(res);
        loading.dismiss();                                                               // Oculta el indicador de carga
        this.router.navigate(['/gestion']);                                              // Navega a la página de gestión
      },
      error: (err) => {                                                                  // Manejo de errores
        console.log(err);
        loading.dismiss();                                                               // Oculta el indicador de carga
      }
    });
  }

  // Método para escanear código de barras
  async scan() {
    this.barcodeScanner.scan().then(barcodeData => {                                    // Inicia el escaneo
      console.log('Barcode data:', barcodeData);
      this.productoForm.patchValue({                                                     // Actualiza el campo nombre con el código escaneado
        nombre: barcodeData.text,
      });
    }).catch(err => {                                                                    // Manejo de errores del escáner
      console.log('Error:', err);
    });
  }
}