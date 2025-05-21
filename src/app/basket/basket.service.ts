import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Basket, IBasket, IBasketItem } from '../core/shared/Models/Basket';
import { IProduct } from '../core/shared/Models/Products';
import { v4 as uuidv4 } from 'uuid';
//localhost:44306/api/Baskets/get-basket-item/basket1
@Injectable({
  providedIn: 'root',
})
export class BasketService implements OnInit {
  BaseURl = 'https://localhost:44306/api/';
  private basketSource = new BehaviorSubject<IBasket>(null);
  basket = this.basketSource.asObservable();

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.initializeBasket();
  }

  private initializeBasket() {
    if (typeof window !== 'undefined') {
      const basketId = localStorage.getItem('basketId');
      if (basketId) {
        this.GetBasket(basketId).subscribe();
      }
    }
  }

  GetBasket(id: string) {
    return this.http
      .get<IBasket>(this.BaseURl + 'Baskets/get-basket-item/' + id)
      .pipe(
        map((basket) => {
          this.basketSource.next(basket);
          return basket;
        })
      );
  }

  setBasket(basket: IBasket) {
    console.log('Sending basket data:', basket);
    return this.http
      .post(this.BaseURl + 'Baskets/update-basket', basket)
      .subscribe({
        next: (response: IBasket) => {
          console.log('Basket update response:', response);
          this.basketSource.next(response);
          if (typeof window !== 'undefined') {
            localStorage.setItem('basketId', response.id);
          }
        },
        error: (err) => {
          console.error('Error setting basket:', err);
          if (err.status === 400) {
            console.error(
              'Bad Request: The server rejected the basket data:',
              err.error
            );
          }
          const currentBasket = this.GetCurrentValue();
          if (currentBasket) {
            this.basketSource.next(currentBasket);
          }
        },
      });
  }

  GetCurrentValue() {
    return this.basketSource.value;
  }

  addItemToBasket(item: IProduct, quantity = 1) {
    try {
      const itemToAdd: IBasketItem = this.MapProductToBasketItem(
        item,
        quantity
      );
      let basket = this.GetCurrentValue();
      if (basket.id == null) {
        basket = this.createBasket();
      }

      this.createBasket();

      if (!basket.id) {
        basket.id = uuidv4();
      }
      basket.basketItems = basket.basketItems ?? [];

      basket.basketItems = this.addOrUpdateItem(
        basket.basketItems,
        itemToAdd,
        quantity
      );

      console.log('Adding item to basket:', {
        basketId: basket.id,
        item: itemToAdd,
        totalItems: basket.basketItems.length,
      });

      return this.setBasket(basket);
    } catch (error) {
      console.error('Error in addItemToBasket:', error);
      throw error;
    }
  }

  private addOrUpdateItem(
    basketItems: IBasketItem[],
    itemToAdd: IBasketItem,
    quantity: number
  ): IBasketItem[] {
    const index = basketItems.findIndex((i) => i.id === itemToAdd.id);
    if (index === -1) {
      itemToAdd.quantity = quantity;
      basketItems.push(itemToAdd);
    } else {
      basketItems[index].quantity += quantity;
    }
    return basketItems;
  }

  private createBasket(): IBasket {
    const basket = new Basket();
    if (typeof window !== 'undefined') {
      localStorage.setItem('basketId', basket.id);
    }
    return basket;
  }

  private MapProductToBasketItem(
    item: IProduct,
    quantity: number
  ): IBasketItem {
    if (!item || !item.photos || item.photos.length === 0) {
      console.error('Invalid product data:', item);
      throw new Error('Invalid product data');
    }

    return {
      id: item.id,
      name: item.name,
      image: item.photos[0].imageName,
      quantity: quantity,
      price: item.newPrice,
      category: item.categoryName,
    };
  }
}
