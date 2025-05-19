import { IPagination } from './core/shared/Models/Pagination';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IProduct } from './core/shared/Models/Products';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  /**
   *
   */
  constructor() {}

  ngOnInit(): void {

  }
  title = 'client';
}
