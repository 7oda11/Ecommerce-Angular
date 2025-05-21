import { Component, OnInit } from '@angular/core';
import { BasketService } from '../../basket/basket.service';

@Component({
  selector: 'app-nav-bar',
  standalone: false,
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent implements OnInit {
  constructor(private basketService: BasketService) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      const basketId = localStorage.getItem('basketId');
      if (basketId) {
        this.basketService.GetBasket(basketId).subscribe({
          next: (basket) => {
            // console.log("heool");
            console.log('Basket loaded:', basket);
          },
          error: (error) => {
            console.error('Error loading basket:', error);
          },
        });
      }
    }
  }
}
