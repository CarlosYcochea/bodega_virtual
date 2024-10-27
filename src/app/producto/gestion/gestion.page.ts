import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { MLproducto } from '../model/MLproducto';
import { ProductoService } from '../producto.service';

@Component({
  selector: 'app-gestion',
  templateUrl: './gestion.page.html',
  styleUrls: ['./gestion.page.scss'],
})
export class GestionPage implements OnInit {

  productos: MLproducto[] = [];

  constructor(public restApi: ProductoService
    , public loadingController: LoadingController
    , public router: Router) { }

  ngOnInit() {
    this.obtenerProductos();
  }

  async obtenerProductos(){
    const loading = await this.loadingController.create({
      message: 'Cargando...'
    });
    await loading.present();

    await this.restApi.obtenerProductos().subscribe({
      next:(res) => {
        this.productos = res;
        loading.dismiss();
      }
      , complete: () => {}
      , error: (err) => {
        loading.dismiss();
      } 
    })

  }

}
