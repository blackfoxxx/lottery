import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart = new BehaviorSubject<CartItem[]>([]);
  
  constructor() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      this.cart.next(JSON.parse(storedCart));
    }
  }

  getCart() {
    return this.cart.asObservable();
  }

  addToCart(product: any) {
    const currentCart = this.cart.value;
    const existingItem = currentCart.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      currentCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image_url: product.image_url
      });
    }

    this.cart.next(currentCart);
    this.persistCart();
  }

  removeFromCart(itemId: number) {
    const currentCart = this.cart.value.filter(item => item.id !== itemId);
    this.cart.next(currentCart);
    this.persistCart();
  }
  
  updateQuantity(itemId: number, quantity: number) {
    const currentCart = this.cart.value;
    const item = currentCart.find(item => item.id === itemId);
    if(item) {
        item.quantity = quantity;
        this.cart.next(currentCart);
        this.persistCart();
    }
  }

  clearCart() {
    this.cart.next([]);
    this.persistCart();
  }

  getTotal() {
    return this.cart.value.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  private persistCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart.value));
  }
}
