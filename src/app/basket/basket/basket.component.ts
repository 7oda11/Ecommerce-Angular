import { Component, OnInit } from '@angular/core';
import { BasketService } from '../basket.service';
import { IBasket, IBasketItem } from '../../core/shared/Models/Basket';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-basket',
  standalone: false,
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.scss'
})
export class BasketComponent implements OnInit {
  basket: IBasket = null;
  loading$: Observable<boolean>;

  constructor(
    private basketService: BasketService,
    private toastr: ToastrService
  ) {
    this.loading$ = this.basketService.loading$;
  }

  ngOnInit(): void {
    this.basketService.basket$.subscribe({
      next: (basket) => {
        this.basket = basket;
      },
      error: (error) => {
        console.error('Error loading basket:', error);
        this.basket = null;
      }
    });
  }

  incrementQuantity(item: IBasketItem) {
    if (!this.basket) return;

    if (item.quantity >= 10) {
      this.toastr.warning('Maximum quantity limit is 10 items', 'Warning', {
        timeOut: 3000,
        positionClass: 'toast-top-right',
        closeButton: true
      });
      return;
    }

    this.basketService.addItemToBasket(item, 1).subscribe({
      next: () => {
        this.toastr.success('Quantity increased', 'Success', {
          timeOut: 3000,
          positionClass: 'toast-top-right',
          closeButton: true
        });
      },
      error: (error) => {
        console.error('Error incrementing quantity:', error);
        this.toastr.error('Failed to update quantity', 'Error', {
          timeOut: 3000,
          positionClass: 'toast-top-right',
          closeButton: true
        });
      }
    });
  }

  decrementQuantity(item: IBasketItem) {
    if (!this.basket) return;

    if (item.quantity <= 1) {
      this.toastr.warning('Minimum quantity is 1 item', 'Warning', {
        timeOut: 3000,
        positionClass: 'toast-top-right',
        closeButton: true
      });
      return;
    }

    this.basketService.addItemToBasket(item, -1).subscribe({
      next: () => {
        this.toastr.success('Quantity decreased', 'Success', {
          timeOut: 3000,
          positionClass: 'toast-top-right',
          closeButton: true
        });
      },
      error: (error) => {
        console.error('Error decrementing quantity:', error);
        this.toastr.error('Failed to update quantity', 'Error', {
          timeOut: 3000,
          positionClass: 'toast-top-right',
          closeButton: true
        });
      }
    });
  }

  removeBasketItem(item: IBasketItem) {
    if (!this.basket) return;

    this.basketService.removeItemFromBasket(item).subscribe({
      next: () => {
        this.toastr.success('Item removed from basket', 'Success', {
          timeOut: 3000,
          positionClass: 'toast-top-right',
          closeButton: true
        });
      },
      error: (error) => {
        console.error('Error removing item:', error);
        this.toastr.error('Failed to remove item', 'Error', {
          timeOut: 3000,
          positionClass: 'toast-top-right',
          closeButton: true
        });
      }
    });
  }

  calculateTotal(): number {
    if (!this.basket?.basketItems) return 0;
    return this.basket.basketItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}
