import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { HttpClient } from '@angular/common/http'; // Importar HttpClient para interactuar con la API
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private apiUrl = 'http://192.168.1.125:3000/usuarios'; // URL del json-server
  private authState = new BehaviorSubject<boolean>(false);

  constructor(private storage: Storage, private http: HttpClient, private router: Router) {
    this.init();
  }

  // Inicializa el almacenamiento de Ionic
  async init() {
    const storage = await this.storage.create();
    this.storage = storage;
  }

  // Método para registrar un nuevo usuario en json-server
  registrarUsuario(usuario: any): Observable<any> {
    return this.http.post(this.apiUrl, usuario);
  }

  // Método para validar el login con json-server
  async login(nombre: string, password: string): Promise<boolean> {
    try {
      // Realiza una consulta a json-server para buscar el usuario
      const usuarios = await this.http.get<any[]>(`${this.apiUrl}?nombre=${nombre}&password=${password}`).toPromise();
      
      if (usuarios && usuarios.length > 0) {
        // Si se encuentra el usuario, guarda la sesión
        await this.setUserSession(usuarios[0].nombre);
        return true; // Login exitoso
      } else {
        return false; // Usuario o contraseña incorrectos
      }
    } catch (error) {
      console.error('Error al realizar el login:', error);
      return false;
    }
  }

  // Método para restablecer la contraseña
  verificarUsuario(nombre: string): Observable<any[]> {
    // Llama a la API para verificar si el usuario existe (json-server simula esto)
    return this.http.get<any[]>(`${this.apiUrl}?nombre=${nombre}`);
  }

  // Guarda la sesión del usuario en Ionic Storage
  async setUserSession(nombre: string): Promise<void> {
    await this.storage.set('isLoggedIn', true);  // Guarda el estado de autenticación
    await this.storage.set('nombre', nombre); // Guarda el nombre de usuario
    this.authState.next(true);
  }

  // Verifica si el usuario está autenticado (para AuthGuard)
  async isLoggedIn(): Promise<boolean> {
    const loggedIn = await this.storage.get('isLoggedIn');
    this.authState.next(loggedIn === true);
    return loggedIn === true;
  }

  // Cierra la sesión del usuario
  async logout(): Promise<void> {
    await this.storage.remove('isLoggedIn'); // Elimina el estado de autenticación
    await this.storage.remove('nombre');   // Elimina el nombre de usuario almacenado
    this.authState.next(false);
    this.router.navigate(['/login']);
  }

  // Obtiene el nombre de usuario del usuario autenticado
  async getUserUsername(): Promise<string | null> {
    return await this.storage.get('nombre');
  }

  getAuthState(): Observable<boolean> {
    return this.authState.asObservable();
  }
}
