// Importaciones necesarias de Angular y servicios
import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { MLproducto } from '../model/MLproducto';
import { ProductoService } from '../producto.service';

@Component({
  selector: 'app-gestion',
  templateUrl: './gestion.page.html',
  styleUrls: ['./gestion.page.scss'],
})
export class GestionPage implements OnInit {
  // Array para almacenar los productos
  productos: MLproducto[] = []; 
  // Variable para almacenar el término de búsqueda
  searchTerm: string = '';

  // Constructor con inyección de dependencias
  constructor(
    public restApi: ProductoService,        // Servicio para manejar productos
    public loadingController: LoadingController,  // Controlador de loading
    public router: Router                   // Router para navegación
  ) { }

  // Método que se ejecuta al inicializar el componente
  ngOnInit() {
    this.obtenerProductos();
  }

  // Método asíncrono para obtener productos del servidor
  async obtenerProductos(){
    // Crear y mostrar el indicador de carga
    const loading = await this.loadingController.create({
      message: 'Cargando...'
    });
    await loading.present();

    // Llamada al servicio para obtener productos
    await this.restApi.obtenerProductos().subscribe({
      next:(res) => {
        this.productos = res;
        loading.dismiss();  // Ocultar loading al recibir respuesta
      },
      complete: () => {},
      error: (err) => {
        loading.dismiss();  // Ocultar loading en caso de error
      } 
    })
  }

  // Método para filtrar productos según el término de búsqueda
  searchProducts() {
    this.productos = this.productos.filter(producto => 
      producto.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}