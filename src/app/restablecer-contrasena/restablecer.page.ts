import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../services/auth-service.service'; // Servicio de autenticación
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-restablecer-contrasena',
  templateUrl: './restablecer-contrasena.page.html',
  styleUrls: ['./restablecer-contrasena.page.scss'],
})
export class RestablecerContrasenaPage {

  nombre: string = '';

  constructor(
    private authService: AuthServiceService,
    private router: Router,
    private alertController: AlertController
  ) {}

  // Función para restablecer la contraseña
  async restablecerContrasena() {
    if (!this.nombre) {
      this.mostrarAlerta('Por favor, ingresa tu nombre de usuario.');
      return;
    }

    // Llamada al servicio para verificar si el usuario existe
    this.authService.verificarUsuario(this.nombre).subscribe(
      async (usuarios) => {
        if (usuarios.length > 0) {
          // Si el usuario existe, muestra el mensaje de éxito
          await this.mostrarAlerta('Se ha enviado un correo para restablecer tu contraseña.');
          // Redirigir a la página de login
          this.router.navigate(['/login']);
        } else {
          // Si el usuario no existe, muestra un mensaje de error
          await this.mostrarAlerta('El usuario no existe.');
        }
      },
      async (error) => {
        // Manejar posibles errores
        await this.mostrarAlerta('Ocurrió un error al procesar la solicitud.');
      }
    );
  }

  // Mostrar alerta
  async mostrarAlerta(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Atención',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }
}
