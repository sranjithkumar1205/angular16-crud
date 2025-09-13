import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private base = '/api/products';

  constructor(private http: HttpClient) { }

  list(): Observable<Product[]> {
    return this.http.get<Product[]>(this.base).pipe(
      catchError(() => of([]))
    );
  }

  get(id: number): Observable<Product | undefined> {
    return this.http.get<Product>(`${this.base}/${id}`).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 404) return of(undefined);
        throw err;
      })
    );
  }

  create(payload: Omit<Product, 'id'>): Observable<Product> {
    return this.http.post<Product>(this.base, payload);
  }

  update(id: number, payload: Partial<Product>): Observable<Product | undefined> {
    return this.http.put<Product>(`${this.base}/${id}`, payload).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 404) return of(undefined);
        throw err;
      })
    );
  }

  delete(id: number): Observable<boolean> {
    return this.http.delete<void>(`${this.base}/${id}`).pipe(
      map(() => true),
      catchError((err: HttpErrorResponse) => {
        if (err.status === 404) return of(false);
        throw err;
      })
    );
  }
}
