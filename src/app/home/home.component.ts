import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Make an HTTP request to demonstrate the loader
    this.http.get('https://fakestoreapi.com/products').subscribe({
      next: (response) => {
        console.log('Products loaded:', response);
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }
}
