import { Component, OnInit } from '@angular/core';
import { BasketService } from '../basket.service';
import { IBasket, IBasketItem } from '../../core/shared/Models/Basket';

@Component({
  selector: 'app-basket',
  standalone: false,
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.scss'
})
export class BasketComponent implements OnInit {
  constructor(private basketService: BasketService) {}
  basket: IBasket;

  ngOnInit(): void {
    this.basketService.basket.subscribe({
      next: (basket) => {
        this.basket = basket;
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  incrementQuantity(item: IBasketItem) {
    this.basketService.addItemToBasket(item, 1);
  }

  decrementQuantity(item: IBasketItem) {
    if (item.quantity > 1) {
      this.basketService.addItemToBasket(item, -1);
    } else {
      this.removeBasketItem(item);
    }
  }

  removeBasketItem(item: IBasketItem) {
    this.basketService.removeItemFromBasket(item);
  }

  calculateTotal(): number {
    if (!this.basket?.basketItems) return 0;
    return this.basket.basketItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}
