import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EliminarUbicacionPage } from './eliminar-ubicacion.page';

describe('EliminarUbicacionPage', () => {
  let component: EliminarUbicacionPage;
  let fixture: ComponentFixture<EliminarUbicacionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EliminarUbicacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
