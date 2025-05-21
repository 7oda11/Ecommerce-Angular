import { Component, OnInit } from '@angular/core';
import { ShopService } from '../shop.service';
import { IProduct } from '../../core/shared/Models/Products';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BasketService } from '../../basket/basket.service';

@Component({
  selector: 'app-product-details',
  standalone: false,
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {
  /**
   *
   */
  constructor(
    private shopService: ShopService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private basketService: BasketService
  ) {}
  product: IProduct;
  ngOnInit(): void {
    this.LoadProduct();
  }
  MainImage: string;
  quantity: number = 1;
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
          this.toastr.error('Failed to load product details', 'Error');
        },
      });
  }
  PeplaceImage(imageName: string) {
    this.MainImage = imageName;
  }
  IncrementBasket() {
    if (this.quantity < 10) {
      this.quantity++;
    } else {
      this.toastr.error('You cannot add more than 10 items to the basket', "ENOUGH");
    }
  }
  DecrementBasket() {
    if (this.quantity > 1) {
      this.quantity--;
    } else {
      this.toastr.error('You cannot remove more than 1 item from the basket', "ERROR");
    }
  }

  addToWishlist() {
    // TODO: Implement wishlist functionality
    this.toastr.info('Wishlist functionality coming soon!', 'Info');
  }

  addToCart() {
    if (!this.product) {
      this.toastr.error('Product not loaded', 'Error');
      return;
    }

    this.basketService.addItemToBasket(this.product, this.quantity).subscribe({
      next: () => {
        this.toastr.success(`Added ${this.quantity} items to cart`, 'Success');
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
        this.toastr.error('Failed to add item to cart', 'Error');
      }
    });
  }

  continueShopping() {
    this.router.navigate(['/shop']);
  }
  CalculateDiscount(oldPrice: number, newPrice: number): number {
    if (!oldPrice || !newPrice || oldPrice <= 0 || newPrice <= 0) {
      return 0;
    }

    if (newPrice >= oldPrice) {
      return 0;
    }

    const discount = ((oldPrice - newPrice) / oldPrice) * 100;
    return Math.round(discount * 10) / 10; // Round to 1 decimal place
  }
}
