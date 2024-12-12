import { Component, OnInit} from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { MovimientosService } from '../services/movimientos.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  username: string = '';
  movimientos: any[] = [];

  constructor(private alertController: AlertController, private route: ActivatedRoute, private router: Router, private movimientoService: MovimientosService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        this.username = this.router.getCurrentNavigation()?.extras.state?.['user'];
        this.presentWelcomeAlert();
      }
    });
    this.cargarMovimientos();
  }


  async presentWelcomeAlert() {
    const alert = await this.alertController.create({
      header: '¡Bienvenido!',
      message: `Hola, ${this.username}. Has iniciado sesión correctamente.`,
      buttons: ['OK']
    });

    await alert.present();
  }

  // Método para cargar los movimientos
  cargarMovimientos() {
    this.movimientoService.obtenerMovimientos().subscribe({
      next: (data) => {
        this.movimientos = data;  // Guardar los movimientos recibidos
      },
      error: (err) => {
        console.error('Error al cargar los movimientos', err);
      }
    });
  }



}
