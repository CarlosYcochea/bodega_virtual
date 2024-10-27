import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EliminarProductoPage } from './eliminar-producto.page';

describe('EliminarProductoPage', () => {
  let component: EliminarProductoPage;
  let fixture: ComponentFixture<EliminarProductoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EliminarProductoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
