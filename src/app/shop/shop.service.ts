import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPagination } from '../core/shared/Models/Pagination';
import { IProduct } from '../core/shared/Models/Products';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  product:IProduct[];
  constructor(private http: HttpClient) {}
  baseUrl = 'https://localhost:44306/api/';

  getProduct() {
    return this.http.get<IPagination>(
      this.baseUrl + 'Product/get-all?sort=a'
    );
  }
}
