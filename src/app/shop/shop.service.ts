import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPagination } from '../core/shared/Models/Pagination';
import { IProduct } from '../core/shared/Models/Products';
import { ICategory } from '../core/shared/Models/Category';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  product:IProduct[];
  constructor(private http: HttpClient) {}
  baseUrl = 'https://localhost:44306/api/';

  getProduct(categoryId?: number, sortSelected?: string, search?: string) {
    let param = new HttpParams();
    if (categoryId && categoryId != 0) {
      param = param.append('CategotyId', categoryId);
    }
    if (sortSelected) {
      param = param.append('sort', sortSelected);
    }
    if (search) {
      param = param.append('Search', search);
    }
    console.log('API Parameters:', param.toString());
    console.log('Full URL:', this.baseUrl + 'Product/get-all?' + param.toString());

    return this.http.get<IPagination>(
      this.baseUrl + 'Product/get-all',
      { params: param }
    );
  }
  getCategory()
  {
    return this.http.get<ICategory[]>(this.baseUrl + 'Categoty/get-all');
  }
}
