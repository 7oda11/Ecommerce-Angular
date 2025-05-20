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
import { ProductParam } from '../core/shared/Models/ProductParam';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-shop',
  standalone: false,
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss',
})
export class ShopComponent implements OnInit {
  public product: IProduct[];
  public category: ICategory[];
  public totalCount: number;
  // public categoryId: number;
  // public sortSelected: string = 'PriceDes';
  // search: string;
  productParams = new ProductParam();

  constructor(private shopService: ShopService, private _toastr: ToastrService) {}

  ngOnInit(): void {
    console.log('Initial sortSelected:', this.productParams.sortSelected);
    this.GetAllProduct();
    this.GetAllCategory();
  }

  GetAllProduct() {
    console.log(
      'Getting products with sort:',
      this.productParams.sortSelected,
      this.productParams.search
    );
    this.shopService.getProduct(this.productParams).subscribe({
      next: (value: IPagination) => {
        console.log('Products received:', value.data);
        this.product = value.data;
        this.totalCount = value.totalCount;
        this.productParams.pageNumber = value.pageNumber;
        this.productParams.pageSize = value.pageSize;
        this._toastr.success('Products fetched successfully',"SUCCESS");
      },
      error: (err: any) => {
        console.error('Error fetching products:', err);
        this.product = [];
      },
    });
  }
  OnChangePage(event: any) {
    this.productParams.pageNumber = event;
    this.GetAllProduct();
  }
  GetAllCategory() {
    this.shopService.getCategory().subscribe({
      next: (value: any) => {
        this.category = value;
      },
    });
  }

  SelectedId(id: number) {
    this.productParams.categoryId = id;
    this.GetAllProduct();
  }

  SortingOption = [
    { name: 'Price', value: 'Name' },
    { name: 'Price:max-min', value: 'PriceDes' },
    { name: 'Price:min-max', value: 'PriceAsn' },
  ];

  SortingByPrice(event: any) {
    const newSort = event.target.value;
    console.log(
      'Sort changed from',
      this.productParams.sortSelected,
      'to',
      newSort
    );
    this.productParams.sortSelected = newSort;
    this.GetAllProduct();
  }
  //filter product by word
  OnSearch(search: string) {
    this.productParams.search = search;
    this.GetAllProduct();
  }
  @ViewChild('search') searchInput: ElementRef;
  @ViewChild('selectItem') selectItem: ElementRef;
  OnReset() {
    this.searchInput.nativeElement.value = '';
    this.productParams.search = '';
    this.productParams.categoryId = 0;
    this.selectItem.nativeElement.selectedIndex = 0;
    this.productParams.sortSelected = this.SortingOption[0].value;
    this.GetAllProduct();
  }
}
