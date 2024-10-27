import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, NgForm, Validators , FormControlName,FormGroupDirective} from '@angular/forms';
import { MLproducto } from '../model/MLproducto';
import { ProductoService } from '../producto.service';

@Component({
  selector: 'app-actualizar-producto',
  templateUrl: './actualizar-producto.page.html',
  styleUrls: ['./actualizar-producto.page.scss'],
})
export class ActualizarProductoPage implements OnInit {

  productoForm!: FormGroup;

  producto: MLproducto = { id: 1, nombre: '', materialidad: '' };
  id: any = '';

  constructor(
    public loadingController: LoadingController,
    public alertController: AlertController,
    public route: ActivatedRoute,
    public router: Router,
    private formBuilder: FormBuilder,
    public restApi: ProductoService
  ) {}

  ngOnInit() {
    this.obtenerProducto(this.route.snapshot.params['id']);

    this.productoForm = this.formBuilder.group({
      'nombre': [null, Validators.required],
      'materialidad': [null, Validators.required]
    });
  }

  async onFormSubmit(form: NgForm) {
    console.log("onFormSubmit ID:" + this.id)
    this.producto.id = this.id;


    await this.restApi.actualizarProducto(this.id, this.producto).subscribe({
      next: (res) => {
        let id = res['id'];
        this.router.navigate(['/gestion', { id: id }]);
      },
      error: (err) => {
        console.log(err);
        this.presentAlertConfirm('Error updating product.');
      },
      complete: () => {
        console.log('Producto actualizado');
      }
    });
  }

  async obtenerProducto(id: number) {
    const loading = await this.loadingController.create({
      message: 'Cargando...'
    });
    await loading.present();

    await this.restApi.obtenerProducto(id + "").subscribe({
      next: (data) => {

        this.id = data.id;
        this.productoForm.setValue({
          nombre: data.nombre,
          materialidad: data.materialidad
        });
        loading.dismiss();
      }
      ,complete: () => {
        console.log('Producto cargado');
      }
      ,error: (err) => {
        loading.dismiss();
      }
    });
  }
  async presentAlertConfirm(msg: string) {
    const alert = await this.alertController.create({
      header: 'Warning!',
      message: msg,
      buttons: [
        {
          text: 'Okay',
          handler: () => {
            this.router.navigate(['/gestion']);
          }
        }
      ]
    });
    await alert.present();
  }
}
