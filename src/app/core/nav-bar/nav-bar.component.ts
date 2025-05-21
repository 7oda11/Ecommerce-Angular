import { Component, OnInit } from '@angular/core';
import { BasketService } from '../../basket/basket.service';
import { IBasket } from '../shared/Models/Basket';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  standalone: false,
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent implements OnInit {
  private countSource = new BehaviorSubject<number>(0);
  count$ = this.countSource.asObservable();
  basket: IBasket;

  constructor(private basketService: BasketService) {}

  ngOnInit(): void {
    this.basketService.basket$.subscribe({
      next: (basket) => {
        this.basket = basket;
        this.countSource.next(basket?.basketItems?.length ?? 0);
      },
      error: (error) => {
        console.error('Error loading basket:', error);
      }
    });
  }
}
