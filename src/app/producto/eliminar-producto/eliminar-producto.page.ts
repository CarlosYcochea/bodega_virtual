import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { MLproducto } from '../model/MLproducto';
import { ProductoService } from '../producto.service';

@Component({
  selector: 'app-eliminar-producto',
  templateUrl: './eliminar-producto.page.html',
  styleUrls: ['./eliminar-producto.page.scss'],
})
export class EliminarProductoPage implements OnInit {
  producto: MLproducto = { id: 2, nombre: '', materialidad: '' };

  constructor(
    public restApi: ProductoService,
    public loadingController: LoadingController,
    public alertController: AlertController,
    public route: ActivatedRoute,
    public router: Router
  ) { }

  ngOnInit() {
    this.obtenerProducto();
  }

  // Obtener los datos del producto por su ID
  async obtenerProducto(){
    const loading = await this.loadingController.create({
      message: 'Cargando...'
    });
    await loading.present();

    await this.restApi.obtenerProducto(this.route.snapshot.params['id']).subscribe({
      next: (res) => {
        this.producto = res;
        loading.dismiss();
      },
      error: (err) => {
        console.log(err);
        loading.dismiss();
      }
    });
  }

  async eliminarProducto(id: number) {
    const loading = await this.loadingController.create({
      message: 'Eliminando producto...'
    });
    await loading.present();

    await this.restApi.eliminarProducto(id).subscribe({
      next: (res) => {
        loading.dismiss();
        this.router.navigate(['/gestion']);
      },
      error: (err) => {
        console.log(err);
        loading.dismiss();
      }
    });
  }

  async presentAlertConfirm(message: string) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    });
  }

}