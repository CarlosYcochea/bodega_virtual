import { Component, OnInit } from '@angular/core';
import { MLproducto } from '../model/MLproducto';
import { ProductoService } from '../producto.service';
import { FormBuilder, FormGroup, NgForm, Validators , FormControlName} from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';


@Component({
  selector: 'app-agregar-producto',
  templateUrl: './agregar-producto.page.html',
  styleUrls: ['./agregar-producto.page.scss'],
})
export class AgregarProductoPage implements OnInit {

  productoForm!: FormGroup;

  producto: MLproducto = {
    id: 2,
    nombre: 'hola',
    materialidad: 'hulo'
  };

  constructor( private restApi: ProductoService,
    private router: Router,
    private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private barcodeScanner: BarcodeScanner
    ) {}

  ngOnInit() {
    this.productoForm = this.formBuilder.group({
      "nombre": [null, Validators.required],
      'materialidad': [null, Validators.required],
    });
  }

  async onFormSubmit(form: NgForm) {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
    });
    await loading.present();

    this.producto = this.productoForm.value;

    await this.restApi.agregarProducto(this.producto)
    .subscribe({
      next: (res) => {
        console.log(res);
        loading.dismiss();
        this.router.navigate(['/gestion']);
      },
      error: (err) => {
        console.log(err);
        loading.dismiss();
      }
    });
  }

  async scan() {
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data:', barcodeData);
      this.productoForm.patchValue({
        nombre: barcodeData.text,
      });
    }).catch(err => {
      console.log('Error:', err);
    });
  }
}
