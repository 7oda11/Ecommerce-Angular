import { Component, OnInit } from '@angular/core';
import { BasketService } from '../../basket/basket.service';
import { Observable } from 'rxjs';
import { IBasket } from '../shared/Models/Basket';

@Component({
  selector: 'app-nav-bar',
  standalone: false,
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent implements OnInit {
  constructor(private basketService: BasketService) {}
  count: Observable<IBasket>;

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      const basketId = localStorage.getItem('basketId');
      if (basketId) {
        this.basketService.GetBasket(basketId).subscribe({
          next: (basket) => {
            // console.log("heool");
            console.log('Basket loaded:', basket);
            this.count = this.basketService.basket;
          },
          error: (error) => {
            console.error('Error loading basket:', error);
          },
        });
      }
    }
  }
}
