import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { AuthServiceService } from '../services/auth-service.service'; // Importar el servicio de autenticación
import * as $ from 'jquery';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  // Inyectar el servicio AuthService
  constructor(
    private router: Router, 
    private animationCtrl: AnimationController, 
    private alertController: AlertController,
    private authService: AuthServiceService // Inyectar el AuthService
  ) {}

  async mostrarAlerta(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Atención',
      message: mensaje,
      buttons: ['OK']
    });
  
    await alert.present();
  }

  async alertaRegistro() {
    const alert = await this.alertController.create({
      header: 'Registro exitoso',
      message: '¡Gracias por registrarte!',
      buttons: ['OK']
    });

    await alert.present();
  }

  ngOnInit() {
    $('#registroForm').on('submit', (e) =>{
      e.preventDefault();
      const nombre = $('#nombre').val() as string;
      const email = $('#email').val() as string;
      const password = $('#password').val() as string;

      const nombreValido = nombre.length >= 2;
      const emailValido = email.endsWith('@barronvieyra.cl');
      const passwordValido = /^(?=.*[A-Z])(?=.*[a-z]{3,})(?=.*\d{4,})/.test(password);

      if (nombreValido && emailValido && passwordValido) {
        // Si todo es válido, registramos al usuario en el servidor
        const nuevoUsuario = { nombre: nombre, email:email, password: password }; // Crear objeto usuario

        // Llamamos al servicio para registrar al usuario
        this.authService.registrarUsuario(nuevoUsuario).subscribe(
          (response) => {
            this.alertaRegistro(); // Mostrar mensaje de éxito
            this.router.navigate(['/login']); // Redirigir al login
          },
          (error) => {
            console.error('Error al registrar el usuario:', error);
            this.mostrarAlerta('Hubo un error en el registro, por favor intenta de nuevo.');
          }
        );
      } else {
        let mensaje = 'Por favor, corrija los siguientes errores:\n';
        if (!nombreValido) mensaje += '- El nombre debe tener al menos 2 caracteres.\n';
        if (!emailValido) mensaje += '- El correo electrónico debe tener el formato correcto (@barronvieyra.cl).\n';
        if (!passwordValido) mensaje += '- La contraseña debe tener 1 mayúscula, 3 caracteres y 4 números\n';
        this.mostrarAlerta(mensaje);
        this.shakeForm();
      }
    });
  }

  async animateSuccess() {
    const animation = this.animationCtrl.create()
      .addElement($('#registroForm')[0])
      .duration(1000)
      .iterations(1)
      .fromTo('opacity', '1', '0.5')
      .fromTo('transform', 'translateY(0px)', 'translateY(100px)');

    await animation.play();
  }

  async shakeForm() {
    const animation = this.animationCtrl.create()
      .addElement($('#registroForm')[0])
      .duration(300)
      .iterations(3)
      .keyframes([
        { offset: 0, transform: 'translateX(0px)' },
        { offset: 0.5, transform: 'translateX(10px)' },
        { offset: 1, transform: 'translateX(0px)' }
      ]);

    await animation.play();
    this.mostrarAlerta('Por favor, complete todos los campos');
  }
}