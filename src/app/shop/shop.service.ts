import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPagination } from '../core/shared/Models/Pagination';
import { IProduct } from '../core/shared/Models/Products';
import { ICategory } from '../core/shared/Models/Category';
import { ProductParam } from '../core/shared/Models/ProductParam';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  product: IProduct[];
  constructor(private http: HttpClient) {}
  baseUrl = 'https://localhost:44306/api/';

  getProduct(productParams: ProductParam) {
    let param = new HttpParams();
    if (productParams.categoryId && productParams.categoryId != 0) {
      param = param.append('CategotyId', productParams.categoryId);
    }
    if (productParams.sortSelected) {
      param = param.append('sort', productParams.sortSelected);
    }
    if (productParams.search) {
      param = param.append('Search', productParams.search);
    }
    param = param.append('pageNumber', productParams.pageNumber);
    param = param.append('pageSize', productParams.pageSize);

    console.log('API Parameters:', param.toString());
    console.log(
      'Full URL:',
      this.baseUrl + 'Product/get-all?' + param.toString()
    );

    return this.http.get<IPagination>(this.baseUrl + 'Product/get-all', {
      params: param,
    });
  }
  getCategory() {
    return this.http.get<ICategory[]>(this.baseUrl + 'Categoty/get-all');
  }
}
