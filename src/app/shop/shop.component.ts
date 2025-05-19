import { Component, OnInit } from '@angular/core';
import { ShopService } from './shop.service';
import { IPagination } from '../core/shared/Models/Pagination';
import { IProduct } from '../core/shared/Models/Products';

@Component({
  selector: 'app-shop',
  standalone: false,
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss',
})
export class ShopComponent implements OnInit {
  public product: IProduct[] 
  /**
   *
   */
  constructor(private shopService: ShopService) {}
  ngOnInit(): void {
    this.GetAllProduct();
  }
  GetAllProduct() {
    this.shopService.getProduct().subscribe({
      next: (value: IPagination) => {
        // console.log(value.data);
        this.product = value.data;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
}
