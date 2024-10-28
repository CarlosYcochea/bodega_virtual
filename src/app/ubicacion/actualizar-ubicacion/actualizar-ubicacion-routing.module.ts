import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActualizarUbicacionPage } from './actualizar-ubicacion.page';

const routes: Routes = [
  {
    path: '',
    component: ActualizarUbicacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActualizarUbicacionPageRoutingModule {}
