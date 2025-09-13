import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product } from '../models/product.model';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should list products (happy path)', done => {
    const mock: Product[] = [
      { id: 1, name: 'A', description: 'a', price: 1 },
      { id: 2, name: 'B', description: 'b', price: 2 }
    ];

    service.list().subscribe(list => {
      expect(list.length).toBe(2);
      expect(list).toEqual(mock);
      done();
    });

    const req = httpMock.expectOne('/api/products');
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('should return undefined for get when 404 (edge case)', done => {
    service.get(999).subscribe(res => {
      expect(res).toBeUndefined();
      done();
    });

    const req = httpMock.expectOne('/api/products/999');
    expect(req.request.method).toBe('GET');
    req.flush('Not found', { status: 404, statusText: 'Not Found' });
  });
});
