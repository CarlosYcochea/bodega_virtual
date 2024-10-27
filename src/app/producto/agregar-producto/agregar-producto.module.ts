import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';

import { AgregarProductoPageRoutingModule } from './agregar-producto-routing.module';

import { AgregarProductoPage } from './agregar-producto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgregarProductoPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AgregarProductoPage]
})
export class AgregarProductoPageModule {}
