import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-purchase-history',
  templateUrl: './purchase-history.page.html',
  styleUrls: ['./purchase-history.page.scss'],
})
export class PurchaseHistoryPage implements OnInit {
  orders: any[] = [];

  constructor() { }

  ngOnInit() {
    this.fetchOrders();
  }

  fetchOrders() {
    // In a real app, you would fetch this from your API service
    this.orders = [
      {
        id: 1234,
        date: new Date(),
        total: 50000,
        items: [
          { name: 'منتج 1', quantity: 1, price: 25000 },
          { name: 'منتج 2', quantity: 1, price: 25000 },
        ]
      },
      {
        id: 1235,
        date: new Date('2023-10-10'),
        total: 75000,
        items: [
          { name: 'منتج 3', quantity: 3, price: 25000 },
        ]
      }
    ];
  }
}
