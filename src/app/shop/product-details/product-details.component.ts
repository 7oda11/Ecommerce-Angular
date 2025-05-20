import { LocaleData } from './../../../../node_modules/ngx-bootstrap/chronos/locale/locale.class.d';
import { Component, OnInit } from '@angular/core';
import { ShopService } from '../shop.service';
import { IProduct } from '../../core/shared/Models/Products';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-details',
  standalone: false,
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit {
  /**
   *
   */
  constructor(
    private shopService: ShopService,
    private route: ActivatedRoute
  ) {}
  product: IProduct;
  ngOnInit(): void {
    this.LoadProduct();
  }
  MainImage: string;

  LoadProduct() {
    this.shopService
      .getProductDetails(parseInt(this.route.snapshot.params['id']))
      .subscribe({
        next: (product) => {
          this.product = product;
          this.MainImage = product.photos[0].imageName;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
  PeplaceImage(imageName: string) {
    this.MainImage = imageName;
  }
}
