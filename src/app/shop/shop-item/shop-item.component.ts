import { Component, Input } from '@angular/core';
import { IProduct } from '../../core/shared/Models/Products';
import { BasketService } from '../../basket/basket.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-shop-item',
  standalone: false,
  templateUrl: './shop-item.component.html',
  styleUrl: './shop-item.component.scss'
})
export class ShopItemComponent {
  constructor(
    private basketService: BasketService,
    private toastr: ToastrService
  ) {}

  @Input() Product: IProduct;

  SetBasketValue(item: IProduct) {
    this.basketService.addItemToBasket(item, 1).subscribe({
      next: () => {
        this.toastr.success('Added to cart', 'Success');
      },
      error: (error) => {
        console.error('Error adding item to basket:', error);
        this.toastr.error('Failed to add item to cart', 'Error');
      }
    });
  }
}
