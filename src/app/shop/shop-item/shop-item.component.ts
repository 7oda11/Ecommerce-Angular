import { Component, Input } from '@angular/core';
import { IProduct } from '../../core/shared/Models/Products';
import { BasketService } from '../../basket/basket.service';

@Component({
  selector: 'app-shop-item',
  standalone: false,
  templateUrl: './shop-item.component.html',
  styleUrl: './shop-item.component.scss'
})
export class ShopItemComponent {
  constructor(private basketService: BasketService) {}

  @Input() Product: IProduct;

  SetBasketValue(item: IProduct) {
    try {
      this.basketService.addItemToBasket(item);
    } catch (error) {
      console.error('Error adding item to basket:', error);
    }
  }
}
