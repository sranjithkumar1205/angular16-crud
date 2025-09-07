import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products$!: Observable<Product[]>;

  constructor(private svc: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.products$ = this.svc.list();
  }

  create() {
    this.router.navigate(['/products/new']);
  }

  edit(id: number) {
    this.router.navigate(['/products', id, 'edit']);
  }

  delete(id: number) {
    if (!confirm('Delete this product?')) return;
    this.svc.delete(id).subscribe();
  }
}
