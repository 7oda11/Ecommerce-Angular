import { Component, Input } from '@angular/core';
import { IProduct } from '../../core/shared/Models/Products';

@Component({
  selector: 'app-shop-item',
  standalone: false,
  templateUrl: './shop-item.component.html',
  styleUrl: './shop-item.component.scss'
})
export class ShopItemComponent {
@Input() Product:IProduct;
}
