import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  viewChild,
} from '@angular/core';
import { ShopService } from './shop.service';
import { IPagination } from '../core/shared/Models/Pagination';
import { IProduct } from '../core/shared/Models/Products';
import { ICategory } from '../core/shared/Models/Category';

@Component({
  selector: 'app-shop',
  standalone: false,
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss',
})
export class ShopComponent implements OnInit {
  public product: IProduct[];
  public category: ICategory[];
  public categoryId: number;
  public sortSelected: string = 'PriceDes';

  constructor(private shopService: ShopService) {}

  ngOnInit(): void {
    console.log('Initial sortSelected:', this.sortSelected);
    this.GetAllProduct();
    this.GetAllCategory();
  }

  GetAllProduct() {
    console.log('Getting products with sort:', this.sortSelected, this.search);
    this.shopService
      .getProduct(this.categoryId, this.sortSelected, this.search)
      .subscribe({
        next: (value: IPagination) => {
          console.log('Products received:', value.data);
          this.product = value.data;
        },
        error: (err: any) => {
          console.error('Error fetching products:', err);
          this.product = [];
        },
      });
  }

  GetAllCategory() {
    this.shopService.getCategory().subscribe({
      next: (value: any) => {
        this.category = value;
      },
    });
  }

  SelectedId(id: number) {
    this.categoryId = id;
    this.GetAllProduct();
  }

  SortingOption = [
    { name: 'Price', value: 'Name' },
    { name: 'Price:max-min', value: 'PriceDes' },
    { name: 'Price:min-max', value: 'PriceAsn' },
  ];

  SortingByPrice(event: any) {
    const newSort = event.target.value;
    console.log('Sort changed from', this.sortSelected, 'to', newSort);
    this.sortSelected = newSort;
    this.GetAllProduct();
  }
  //filter product by word
  search: string;
  OnSearch(search: string) {
    this.search = search;
    this.GetAllProduct();
  }
  @ViewChild('search') searchInput: ElementRef;
  @ViewChild('selectItem') selectItem: ElementRef;
  OnReset() {
    this.searchInput.nativeElement.value = '';
    this.search = '';
    this.categoryId = 0;
    this.selectItem.nativeElement.selectedIndex = 0;
    this.sortSelected = this.SortingOption[0].value;
    this.GetAllProduct();
  }
}
