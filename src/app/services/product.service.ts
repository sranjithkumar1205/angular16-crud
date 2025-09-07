import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private products$ = new BehaviorSubject<Product[]>([
    { id: 1, name: 'Sample A', description: 'First sample', price: 9.99 },
    { id: 2, name: 'Sample B', description: 'Second sample', price: 19.99 }
  ]);

  private nextId = 3;

  list(): Observable<Product[]> {
    return this.products$.asObservable();
  }

  get(id: number): Observable<Product | undefined> {
    return this.products$.pipe(
      map(list => list.find(p => p.id === id))
    );
  }

  create(payload: Omit<Product, 'id'>): Observable<Product> {
    const item: Product = { id: this.nextId++, ...payload };
    const next = [...this.products$.value, item];
    this.products$.next(next);
    return of(item);
  }

  update(id: number, payload: Partial<Product>): Observable<Product | undefined> {
    const list = this.products$.value.slice();
    const idx = list.findIndex(p => p.id === id);
    if (idx === -1) return of(undefined);
    const updatedProduct = { ...list[idx], ...payload };
    list[idx] = updatedProduct;
    this.products$.next(list);
    return of(updatedProduct);
  }

  delete(id: number): Observable<boolean> {
    const list = this.products$.value.slice();
    const idx = list.findIndex(p => p.id === id);
    if (idx === -1) return of(false);
    const filtered = list.filter(p => p.id !== id);
    this.products$.next(filtered);
    return of(true);
  }
}
