import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SqliteService } from '../sqlite.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router'; // Importa el Router

@Component({
  selector: 'app-agregar-ubicacion',
  templateUrl: './agregar-ubicacion.page.html',
  styleUrls: ['./agregar-ubicacion.page.scss'],
})
export class AgregarUbicacionPage implements OnInit {

  ubicacionForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private sqliteService: SqliteService,
    private alertController: AlertController,
    private router: Router // Inyecta el Router
  ) {
    this.ubicacionForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      rack: ['', Validators.required],
      ubicacion: ['', Validators.required],
      cantidad: [0, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit() {}

  // Función para agregar una nueva ubicación
  agregarUbicacion() {
    if (this.ubicacionForm.valid) {
      const nuevaUbicacion = this.ubicacionForm.value;

      this.sqliteService.agregarUbicacion(nuevaUbicacion).subscribe(
        () => {
          this.presentAlert('Éxito', 'Ubicación agregada correctamente.');
          this.ubicacionForm.reset(); // Limpiar el formulario
          this.router.navigate(['/ubicaciones']); // Redirigir a la página de ubicaciones
        },
        (error) => {
          this.presentAlert('Error', 'No se pudo agregar la ubicación. Inténtelo de nuevo.');
          console.error('Error al agregar ubicación: ', error);
        }
      );
    } else {
      this.presentAlert('Error', 'Por favor, complete todos los campos correctamente.');
    }
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
