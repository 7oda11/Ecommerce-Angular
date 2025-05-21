import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { Basket, IBasket, IBasketItem } from '../core/shared/Models/Basket';
import { IProduct } from '../core/shared/Models/Products';
import { v4 as uuidv4 } from 'uuid';
import { isPlatformBrowser } from '@angular/common';
import { catchError, tap, switchMap, finalize } from 'rxjs/operators';
//localhost:44306/api/Baskets/get-basket-item/basket1
@Injectable({
  providedIn: 'root',
})
export class BasketService {
  BaseURl = 'https://localhost:44306/api/';
  private basketSource = new BehaviorSubject<IBasket>(null);
  private loadingSource = new BehaviorSubject<boolean>(false);
  basket$ = this.basketSource.asObservable();
  loading$ = this.loadingSource.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loadBasket();
  }

  private loadBasket() {
    if (isPlatformBrowser(this.platformId)) {
      const basketId = localStorage.getItem('basketId');
      if (basketId) {
        this.GetBasket(basketId).subscribe();
      }
    }
  }

  GetBasket(id: string): Observable<IBasket> {
    this.loadingSource.next(true);
    return this.http.get<IBasket>(this.BaseURl + 'Baskets/get-basket-item/' + id).pipe(
      tap(basket => {
        if (basket) {
          this.basketSource.next(basket);
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('basketId', basket.id);
          }
        } else {
          this.deleteLocalBasket();
        }
      }),
      catchError(error => {
        console.error('Error getting basket:', error);
        this.deleteLocalBasket();
        return of(null);
      }),
      finalize(() => this.loadingSource.next(false))
    );
  }

  setBasket(basket: IBasket): Observable<IBasket> {
    if (!basket) return of(null);

    this.loadingSource.next(true);
    return this.http.post<IBasket>(this.BaseURl + 'Baskets/update-basket', basket).pipe(
      tap(response => {
        if (response) {
          this.basketSource.next(response);
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('basketId', response.id);
          }
        }
      }),
      catchError(error => {
        console.error('Error setting basket:', error);
        this.deleteLocalBasket();
        return of(null);
      }),
      finalize(() => this.loadingSource.next(false))
    );
  }

  getCurrentBasketValue(): IBasket {
    return this.basketSource.value;
  }

  addItemToBasket(item: IProduct | IBasketItem, quantity = 1): Observable<IBasket> {
    try {
      const itemToAdd: IBasketItem = this.MapProductToBasketItem(item, quantity);
      let basket = this.getCurrentBasketValue();

      if (!basket) {
        basket = this.createBasket();
      }

      if (!basket.basketItems) {
        basket.basketItems = [];
      }

      const existingItemIndex = basket.basketItems.findIndex(i => i.id === itemToAdd.id);

      if (existingItemIndex > -1) {
        const newQuantity = basket.basketItems[existingItemIndex].quantity + quantity;
        if (newQuantity > 10) {
          throw new Error('Cannot add more than 10 items');
        }
        if (newQuantity < 1) {
          throw new Error('Quantity cannot be less than 1');
        }
        basket.basketItems[existingItemIndex].quantity = newQuantity;
      } else {
        if (quantity > 10) {
          throw new Error('Cannot add more than 10 items');
        }
        basket.basketItems.push(itemToAdd);
      }

      return this.setBasket(basket).pipe(
        tap(response => {
          if (response) {
            this.basketSource.next(response);
          }
        }),
        catchError(error => {
          console.error('Error adding item to basket:', error);
          return of(null);
        })
      );
    } catch (error) {
      console.error('Error in addItemToBasket:', error);
      return of(null);
    }
  }

  removeItemFromBasket(item: IBasketItem): Observable<IBasket | void> {
    try {
      const basket = this.getCurrentBasketValue();
      if (!basket) return of(null);

      basket.basketItems = basket.basketItems.filter(i => i.id !== item.id);

      if (basket.basketItems.length > 0) {
        return this.setBasket(basket);
      } else {
        return this.deleteBasket(basket).pipe(
          tap(() => {
            this.deleteLocalBasket();
          }),
          catchError(error => {
            console.error('Error deleting basket:', error);
            return of(null);
          })
        );
      }
    } catch (error) {
      console.error('Error removing item from basket:', error);
      return of(null);
    }
  }

  deleteBasket(basket: IBasket): Observable<void> {
    if (!basket?.id) return of(null);

    this.loadingSource.next(true);
    return this.http.delete<void>(this.BaseURl + 'Baskets/delete-basket-item/' + basket.id).pipe(
      tap(() => {
        this.deleteLocalBasket();
      }),
      catchError(error => {
        console.error('Error deleting basket:', error);
        this.deleteLocalBasket();
        return of(null);
      }),
      finalize(() => this.loadingSource.next(false))
    );
  }

  private deleteLocalBasket() {
    this.basketSource.next(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('basketId');
    }
  }

  private addOrUpdateItem(
    basketItems: IBasketItem[],
    itemToAdd: IBasketItem,
    quantity: number
  ): IBasketItem[] {
    const index = basketItems.findIndex(i => i.id === itemToAdd.id);
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
    basket.id = uuidv4();
    basket.basketItems = [];
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('basketId', basket.id);
    }
    return basket;
  }

  private MapProductToBasketItem(
    item: IProduct | IBasketItem,
    quantity: number
  ): IBasketItem {
    if ('photos' in item) {
      if (!item || !item.photos || item.photos.length === 0) {
        throw new Error('Invalid product data');
      }

      return {
        id: item.id,
        name: item.name,
        image: item.photos[0].imageName,
        quantity: quantity,
        price: item.newPrice,
        category: item.categoryName,
        description: item.description,
      };
    } else {
      return {
        ...item,
        quantity: quantity,
      };
    }
  }
}
