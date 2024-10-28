import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgregarUbicacionPage } from './agregar-ubicacion.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarUbicacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgregarUbicacionPageRoutingModule {}
