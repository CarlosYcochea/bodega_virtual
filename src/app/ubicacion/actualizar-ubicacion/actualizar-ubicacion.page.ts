import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { SqliteService } from '../sqlite.service'; // Importar el servicio para SQLite y API

@Component({
  selector: 'app-actualizar-ubicacion',
  templateUrl: './actualizar-ubicacion.page.html',
  styleUrls: ['./actualizar-ubicacion.page.scss'],
})
export class ActualizarUbicacionPage implements OnInit {
  ubicacionForm: FormGroup; // Formulario reactivo
  id!: number; // ID de la ubicación

  constructor(
    private fb: FormBuilder,
    private sqliteService: SqliteService,
    private route: ActivatedRoute,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {
    // Crear el formulario con los campos necesarios y las validaciones
    this.ubicacionForm = this.fb.group({
      nombre: ['', Validators.required],
      rack: ['', Validators.required],
      ubicacion: ['', Validators.required],
      cantidad: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit() {
    // Obtener el ID de la ubicación de la ruta
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    // Cargar la ubicación al iniciar la página
    this.cargarUbicacion();
  }

  // Cargar la ubicación y asignar sus valores al formulario
  async cargarUbicacion() {
    const loading = await this.loadingController.create({
      message: 'Cargando ubicación...',
    });
    await loading.present();

    this.sqliteService.obtenerUbicacion(this.id).subscribe({
      next: (ubicacion) => {
        if (ubicacion) {
          // Cargar los valores de la ubicación en el formulario
          this.ubicacionForm.patchValue({
            nombre: ubicacion.nombre,
            rack: ubicacion.rack,
            ubicacion: ubicacion.ubicacion,
            cantidad: ubicacion.cantidad,
          });
        }
        loading.dismiss();
      },
      error: (err) => {
        console.error('Error al cargar ubicación:', err);
        loading.dismiss();
      }
    });
  }

  // Actualizar la ubicación cuando se envía el formulario
  async actualizarUbicacion() {
    const loading = await this.loadingController.create({
      message: 'Actualizando ubicación...',
    });
    await loading.present();

    const ubicacionActualizada = this.ubicacionForm.value;
    
    this.sqliteService.modificarUbicacion(this.id, ubicacionActualizada).subscribe({
      next: async () => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Éxito',
          message: 'Ubicación actualizada correctamente.',
          buttons: ['OK'],
        });
        await alert.present();
        this.router.navigate(['/ubicaciones']); // Redirigir a la lista de ubicaciones
      },
      error: async (err) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'No se pudo actualizar la ubicación.',
          buttons: ['OK'],
        });
        await alert.present();
        console.error('Error al actualizar ubicación:', err);
      }
    });
  }
}
