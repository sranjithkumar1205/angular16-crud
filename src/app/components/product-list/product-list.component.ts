import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  private productsSubject = new BehaviorSubject<Product[]>([]);
  private searchTerms = new BehaviorSubject<string>('');
  private priceRange = new BehaviorSubject<{min?: number, max?: number}>({});
  private sortConfig = new BehaviorSubject<{field: 'name' | 'price', direction: 'asc' | 'desc'}>({
    field: 'name',
    direction: 'asc'
  });

  products$: Observable<Product[]>;

  constructor(private svc: ProductService, private router: Router) {
    this.products$ = combineLatest([
      this.productsSubject,
      this.searchTerms,
      this.priceRange,
      this.sortConfig
    ]).pipe(
      map(([products, search, range, sort]) => {
        let filtered = products;
        
        // Search filter
        if (search) {
          const searchLower = search.toLowerCase();
          filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(searchLower) ||
            (p.description && p.description.toLowerCase().includes(searchLower))
          );
        }

        // Price range filter
        if (range.min !== undefined) {
          filtered = filtered.filter(p => p.price >= range.min!);
        }
        if (range.max !== undefined) {
          filtered = filtered.filter(p => p.price <= range.max!);
        }

        // Sort
        return filtered.slice().sort((a, b) => {
          const factor = sort.direction === 'asc' ? 1 : -1;
          if (sort.field === 'name') {
            return a.name.localeCompare(b.name) * factor;
          } else {
            return (a.price - b.price) * factor;
          }
        });
      })
    );
  }

  ngOnInit(): void {
    this.refreshList();
  }

  refreshList() {
    this.svc.list().subscribe(products => this.productsSubject.next(products));
  }

  search(term: string) {
    this.searchTerms.next(term);
  }

  updatePriceRange(min?: number, max?: number) {
    this.priceRange.next({ min, max });
  }

  sort(field: 'name' | 'price') {
    const current = this.sortConfig.value;
    if (current.field === field) {
      // Toggle direction if same field
      this.sortConfig.next({
        field,
        direction: current.direction === 'asc' ? 'desc' : 'asc'
      });
    } else {
      // New field, start with asc
      this.sortConfig.next({ field, direction: 'asc' });
    }
  }

  getSortIndicator(field: 'name' | 'price'): string {
    const config = this.sortConfig.value;
    if (config.field !== field) return '';
    return config.direction === 'asc' ? '↑' : '↓';
  }

  create() {
    this.router.navigate(['/products/new']);
  }

  edit(id: number) {
    this.router.navigate(['/products', id, 'edit']);
  }

  delete(id: number) {
    if (!confirm('Delete this product?')) return;
    this.svc.delete(id).subscribe({
      next: () => {
        this.refreshList();
        alert('Product deleted successfully.');
      },
      error: (err) => {
        alert('Failed to delete product: ' + err.message);
      }
    });
  }
}
