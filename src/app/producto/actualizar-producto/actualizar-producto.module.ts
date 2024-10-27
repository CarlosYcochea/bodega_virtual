import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';

import { ActualizarProductoPageRoutingModule } from './actualizar-producto-routing.module';

import { ActualizarProductoPage } from './actualizar-producto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActualizarProductoPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ActualizarProductoPage]
})
export class ActualizarProductoPageModule {}
