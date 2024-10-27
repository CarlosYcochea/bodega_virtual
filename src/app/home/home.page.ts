import { Component, OnInit} from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  username: string = '';

  constructor(private alertController: AlertController, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        this.username = this.router.getCurrentNavigation()?.extras.state?.['user'];
        this.presentWelcomeAlert();
      }
    });
  }


  async presentWelcomeAlert() {
    const alert = await this.alertController.create({
      header: '¡Bienvenido!',
      message: `Hola, ${this.username}. Has iniciado sesión correctamente.`,
      buttons: ['OK']
    });

    await alert.present();
  }



}
