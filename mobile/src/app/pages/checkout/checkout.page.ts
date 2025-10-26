import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Api } from '../../services/api';
import { CartService, CartItem } from '../../services/cart.service';
import { NotificationService } from '../../services/notification';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {
  checkoutForm: FormGroup;
  cartItems: CartItem[] = [];
  total = 0;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private api: Api,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      phone: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.cartService.getCart().subscribe(items => {
      this.cartItems = items;
      this.total = this.cartService.getTotal();
    });
  }

  placeOrder() {
    if (this.checkoutForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    const orderData = {
      ...this.checkoutForm.value,
      items: this.cartItems.map(item => ({ product_id: item.id, quantity: item.quantity }))
    };

    this.api.purchaseProduct(orderData).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.cartService.clearCart();
        this.notificationService.success('تم الطلب بنجاح', 'شكراً لك على طلبك!');
        this.router.navigate(['/purchase-history']);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.notificationService.error('خطأ', 'حدث خطأ أثناء إتمام الطلب.');
      }
    });
  }
}
