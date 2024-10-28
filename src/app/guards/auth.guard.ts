import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthServiceService } from '../services/auth-service.service'; // Importa AuthService para verificar la autenticación

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthServiceService // Inyecta AuthService para verificar el estado de autenticación
  ) {}

  // Método para proteger la ruta
  async canActivate(): Promise<boolean> {
    const isLoggedIn = await this.authService.isLoggedIn(); // Verifica si el usuario está autenticado
    if (!isLoggedIn) {
      // Si no está autenticado, redirige al login
      this.router.navigate(['/login']);
      return false; // Bloquea el acceso a la ruta
    }
    return true; // Permite el acceso si está autenticado
  }
}