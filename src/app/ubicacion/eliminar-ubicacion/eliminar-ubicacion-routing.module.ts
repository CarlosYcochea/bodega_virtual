import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EliminarUbicacionPage } from './eliminar-ubicacion.page';

const routes: Routes = [
  {
    path: '',
    component: EliminarUbicacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EliminarUbicacionPageRoutingModule {}
