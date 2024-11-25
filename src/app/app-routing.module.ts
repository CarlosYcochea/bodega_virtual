import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'restablecer-contrasena',
    loadChildren: () => import('./restablecer-contrasena/restablecer-contrasena.module').then( m => m.RestablecerContrasenaPageModule)
  },
  {
    path: 'actualizar-producto/:id',
    loadChildren: () => import('./producto/actualizar-producto/actualizar-producto.module').then( m => m.ActualizarProductoPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'agregar-producto',
    loadChildren: () => import('./producto/agregar-producto/agregar-producto.module').then( m => m.AgregarProductoPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'eliminar-producto/:id',
    loadChildren: () => import('./producto/eliminar-producto/eliminar-producto.module').then( m => m.EliminarProductoPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'gestion',
    loadChildren: () => import('./producto/gestion/gestion.module').then( m => m.GestionPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'ubicaciones',
    loadChildren: () => import('./ubicacion/ubicaciones/ubicaciones.module').then( m => m.UbicacionesPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'actualizar-ubicacion/:id',
    loadChildren: () => import('./ubicacion/actualizar-ubicacion/actualizar-ubicacion.module').then( m => m.ActualizarUbicacionPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'agregar-ubicacion',
    loadChildren: () => import('./ubicacion/agregar-ubicacion/agregar-ubicacion.module').then( m => m.AgregarUbicacionPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'eliminar-ubicacion/:id',
    loadChildren: () => import('./ubicacion/eliminar-ubicacion/eliminar-ubicacion.module').then( m => m.EliminarUbicacionPageModule),
    canActivate: [AuthGuard]
  },




];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
