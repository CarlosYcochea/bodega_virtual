import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActualizarProductoPage } from './actualizar-producto.page';

const routes: Routes = [
  {
    path: '',
    component: ActualizarProductoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActualizarProductoPageRoutingModule {}
