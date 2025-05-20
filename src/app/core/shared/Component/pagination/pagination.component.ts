import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: false,
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent {
  @Input() pageSize: number;
  @Input() totalCount: number;
  @Output() PageChanged = new EventEmitter();
  OnChangePage(event: any) {
    this.PageChanged.emit(event);
  }
}
