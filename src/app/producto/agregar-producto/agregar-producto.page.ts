import { Component, OnInit } from '@angular/core'; // Importa decoradores y interfaces básicas de Angular
import { MLproducto } from '../model/MLproducto'; // Importa el modelo de datos del producto
import { ProductoService } from '../producto.service'; // Importa el servicio para manejar productos
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms'; // Importa utilidades para manejo de formularios
import { Router } from '@angular/router'; // Importa el servicio de enrutamiento
import { LoadingController } from '@ionic/angular'; // Importa el controlador de carga de Ionic
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx'; // Importa el escáner de códigos de barras
import { Storage } from '@ionic/storage-angular'; // Importa el servicio de almacenamiento

@Component({
  selector: 'app-agregar-producto', // Selector para usar el componente
  templateUrl: './agregar-producto.page.html', // Plantilla HTML asociada
  styleUrls: ['./agregar-producto.page.scss'], // Estilos CSS asociados
})
export class AgregarProductoPage implements OnInit {
  productoForm!: FormGroup; // Declaración del formulario reactivo

  // Inicialización del objeto producto con valores por defecto
  producto: MLproducto = {
    id: 2, // ID por defecto
    nombre: '', // Nombre vacío inicial
    materialidad: '', // Materialidad vacía inicial
  };

  // Variable para almacenar el nombre del usuario
  usuario: string = '';

  // Constructor con inyección de dependencias
  constructor(
    private restApi: ProductoService, // Servicio para operaciones con productos
    private router: Router, // Servicio para navegación
    private formBuilder: FormBuilder, // Constructor de formularios
    private loadingController: LoadingController, // Controlador de indicador de carga
    private barcodeScanner: BarcodeScanner, // Servicio de escáner de códigos
    private storage: Storage // Servicio de almacenamiento para obtener el nombre del usuario
  ) {}

  // Método que se ejecuta al inicializar el componente
  ngOnInit() {
    this.productoForm = this.formBuilder.group({
      nombre: [null, Validators.required], // Campo nombre con validación requerida
      materialidad: [null, Validators.required], // Campo materialidad con validación requerida
    });

    // Obtiene el nombre de usuario almacenado
    this.storage.get('nombre').then((nombre) => {
      this.usuario = nombre || ''; // Si no hay nombre en el almacenamiento, se asigna un valor vacío
    });
  }

  // Método para manejar el envío del formulario
  async onFormSubmit(form: NgForm) {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
    });
    await loading.present(); // Muestra el indicador de carga

    this.producto = this.productoForm.value; // Obtiene los valores del formulario

    // Llama al servicio para agregar el producto
    await this.restApi
      .agregarProducto(this.producto, this.usuario) // Pasa el producto y el nombre del usuario al servicio
      .subscribe({
        next: (res) => {
          console.log(res);
          loading.dismiss(); // Oculta el indicador de carga
          this.router.navigate(['/gestion']); // Navega a la página de gestión
        },
        error: (err) => {
          console.log(err);
          loading.dismiss(); // Oculta el indicador de carga
        },
      });
  }

  // Método para escanear código de barras
  async scan() {
    this.barcodeScanner.scan().then((barcodeData) => {
      console.log('Barcode data:', barcodeData);
      this.productoForm.patchValue({
        nombre: barcodeData.text, // Actualiza el campo nombre con el código escaneado
      });
    }).catch((err) => {
      console.log('Error:', err);
    });
  }
}
