import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActualizarUbicacionPage } from './actualizar-ubicacion.page';

describe('ActualizarUbicacionPage', () => {
  let component: ActualizarUbicacionPage;
  let fixture: ComponentFixture<ActualizarUbicacionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ActualizarUbicacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
