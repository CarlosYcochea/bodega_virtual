import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { AuthServiceService } from '../services/auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  nombre: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private storage: Storage,
    private authService: AuthServiceService
  ) {
    this.init();
  }

  // Inicializa el almacenamiento
  async init() {
    await this.storage.create();
  }

  ngOnInit() {
    this.clearLoginForm();
  }

  ionViewWillEnter() {
    this.clearLoginForm();
  }

  clearLoginForm() {
    this.nombre = '';
    this.password = '';
  }

  // Método para mostrar alertas en la interfaz
  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  // Método de login que utiliza el servicio de autenticación
  async login() {
    const isAuthenticated = await this.authService.login(this.nombre, this.password);
    
    if (!isAuthenticated) {
      await this.presentAlert('Error', 'Credenciales incorrectas.');
      return;
    }

    // Almacena la sesión del usuario y navega a la página de inicio
    await this.storage.set('nombre', this.nombre);
    await this.storage.set('isLoggedIn', true);

    // Define los extras de navegación para pasar el usuario a la siguiente página
    let navigationExtras: NavigationExtras = {
      state: {
        user: this.nombre, // Envía el nombre de usuario al componente de destino
      },
    };

    // Navega a la página de inicio
    this.router.navigate(['/home'], navigationExtras);
  }
}
