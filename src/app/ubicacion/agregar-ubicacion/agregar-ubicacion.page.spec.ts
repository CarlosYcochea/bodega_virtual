import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarUbicacionPage } from './agregar-ubicacion.page';

describe('AgregarUbicacionPage', () => {
  let component: AgregarUbicacionPage;
  let fixture: ComponentFixture<AgregarUbicacionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarUbicacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
