import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, take } from 'rxjs/operators';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  form!: FormGroup;
  id?: number;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private svc: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]]
    });

    this.route.paramMap.pipe(take(1)).subscribe(pm => {
      const id = pm.get('id');
      if (id && id !== 'new') {
        this.id = Number(id);
        this.isEdit = true;
        this.svc.get(this.id).pipe(take(1)).subscribe(p => {
          if (p) this.form.patchValue(p as Product);
        });
      }
    });
  }

  save() {
    if (this.form.invalid) return this.form.markAllAsTouched();
    const payload = this.form.value as Omit<Product, 'id'>;
    if (this.isEdit && this.id) {
      this.svc.update(this.id, payload).pipe(take(1)).subscribe(() => this.router.navigate(['/products']));
    } else {
      this.svc.create(payload).pipe(take(1)).subscribe(() => this.router.navigate(['/products']));
    }
  }

  cancel() {
    this.router.navigate(['/products']);
  }
}
