import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../services/product.service';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;

  const mockProducts = [
    { id: 1, name: 'A', description: 'a', price: 1 },
    { id: 2, name: 'B', description: 'b', price: 2 }
  ];

  const productServiceStub = {
    list: () => of(mockProducts),
    delete: (id: number) => of(true)
  } as Partial<ProductService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ProductListComponent],
      providers: [{ provide: ProductService, useValue: productServiceStub }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('shows products', () => {
    component.products$.subscribe(list => {
      expect(list.length).toBe(2);
    });
  });
});
