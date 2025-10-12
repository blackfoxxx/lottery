import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../services/notification';

@Component({
  selector: 'app-payment-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-form.html',
  styleUrl: './payment-form.scss'
})
export class PaymentFormComponent {
  @Input() product: any = null;
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() paymentSubmitted = new EventEmitter<any>();

  paymentForm = {
    // Payment method
    paymentMethod: 'credit_card',
    
    // Credit card details
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: '',
    
    // Shipping address
    shippingFirstName: '',
    shippingLastName: '',
    shippingPhone: '',
    shippingAddressLine1: '',
    shippingAddressLine2: '',
    shippingCity: '',
    shippingState: '',
    shippingPostalCode: '',
    shippingCountry: 'Iraq',
    
    // Billing address
    billingSameAsShipping: true,
    billingFirstName: '',
    billingLastName: '',
    billingAddressLine1: '',
    billingAddressLine2: '',
    billingCity: '',
    billingState: '',
    billingPostalCode: '',
    billingCountry: 'Iraq',
    
    // Additional
    orderNotes: ''
  };

  currentStep = 1;
  maxSteps = 3;
  
  // Form validation
  cardNumberValid = false;
  expiryValid = false;
  cvvValid = false;
  formValid = false;

  constructor(private notificationService: NotificationService) {}

  close(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.resetForm();
  }

  resetForm(): void {
    this.paymentForm = {
      paymentMethod: 'credit_card',
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      cardholderName: '',
      shippingFirstName: '',
      shippingLastName: '',
      shippingPhone: '',
      shippingAddressLine1: '',
      shippingAddressLine2: '',
      shippingCity: '',
      shippingState: '',
      shippingPostalCode: '',
      shippingCountry: 'Iraq',
      billingSameAsShipping: true,
      billingFirstName: '',
      billingLastName: '',
      billingAddressLine1: '',
      billingAddressLine2: '',
      billingCity: '',
      billingState: '',
      billingPostalCode: '',
      billingCountry: 'Iraq',
      orderNotes: ''
    };
    this.currentStep = 1;
  }

  nextStep(): void {
    if (this.currentStep < this.maxSteps) {
      if (this.validateCurrentStep()) {
        this.currentStep++;
      }
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  validateCurrentStep(): boolean {
    switch (this.currentStep) {
      case 1: // Payment method and card details
        return this.validatePaymentDetails();
      case 2: // Shipping address
        return this.validateShippingAddress();
      case 3: // Review and confirm
        return true;
      default:
        return false;
    }
  }

  validatePaymentDetails(): boolean {
    if (this.paymentForm.paymentMethod === 'credit_card') {
      const cardValid = this.paymentForm.cardNumber.replace(/\s/g, '').length >= 16;
      const expiryValid = this.paymentForm.expiryMonth && this.paymentForm.expiryYear;
      const cvvValid = this.paymentForm.cvv.length >= 3;
      const nameValid = this.paymentForm.cardholderName.trim().length > 0;
      
      if (!cardValid) {
        this.notificationService.error('Invalid Card', 'Please enter a valid card number.');
        return false;
      }
      if (!expiryValid) {
        this.notificationService.error('Invalid Expiry', 'Please enter a valid expiry date.');
        return false;
      }
      if (!cvvValid) {
        this.notificationService.error('Invalid CVV', 'Please enter a valid CVV code.');
        return false;
      }
      if (!nameValid) {
        this.notificationService.error('Invalid Name', 'Please enter the cardholder name.');
        return false;
      }
      
      return true;
    }
    return true; // For other payment methods
  }

  validateShippingAddress(): boolean {
    const required = ['shippingFirstName', 'shippingLastName', 'shippingPhone', 
                     'shippingAddressLine1', 'shippingCity', 'shippingState'];
    
    for (const field of required) {
      if (!this.paymentForm[field as keyof typeof this.paymentForm]?.toString().trim()) {
        this.notificationService.error('Missing Information', 'Please fill in all required shipping fields.');
        return false;
      }
    }
    return true;
  }

  submitPayment(): void {
    if (!this.validateCurrentStep()) {
      return;
    }

    // Copy billing address from shipping if needed
    if (this.paymentForm.billingSameAsShipping) {
      this.paymentForm.billingFirstName = this.paymentForm.shippingFirstName;
      this.paymentForm.billingLastName = this.paymentForm.shippingLastName;
      this.paymentForm.billingAddressLine1 = this.paymentForm.shippingAddressLine1;
      this.paymentForm.billingAddressLine2 = this.paymentForm.shippingAddressLine2;
      this.paymentForm.billingCity = this.paymentForm.shippingCity;
      this.paymentForm.billingState = this.paymentForm.shippingState;
      this.paymentForm.billingPostalCode = this.paymentForm.shippingPostalCode;
      this.paymentForm.billingCountry = this.paymentForm.shippingCountry;
    }

    const paymentData = {
      product_id: this.product.id,
      quantity: 1,
      payment_method: this.paymentForm.paymentMethod,
      payment_details: {
        card_number: this.paymentForm.cardNumber,
        expiry_month: this.paymentForm.expiryMonth,
        expiry_year: this.paymentForm.expiryYear,
        cvv: this.paymentForm.cvv,
        cardholder_name: this.paymentForm.cardholderName
      },
      shipping_address: {
        first_name: this.paymentForm.shippingFirstName,
        last_name: this.paymentForm.shippingLastName,
        phone: this.paymentForm.shippingPhone,
        address_line_1: this.paymentForm.shippingAddressLine1,
        address_line_2: this.paymentForm.shippingAddressLine2,
        city: this.paymentForm.shippingCity,
        state: this.paymentForm.shippingState,
        postal_code: this.paymentForm.shippingPostalCode,
        country: this.paymentForm.shippingCountry
      },
      billing_address: this.paymentForm.billingSameAsShipping ? null : {
        first_name: this.paymentForm.billingFirstName,
        last_name: this.paymentForm.billingLastName,
        address_line_1: this.paymentForm.billingAddressLine1,
        address_line_2: this.paymentForm.billingAddressLine2,
        city: this.paymentForm.billingCity,
        state: this.paymentForm.billingState,
        postal_code: this.paymentForm.billingPostalCode,
        country: this.paymentForm.billingCountry
      },
      order_notes: this.paymentForm.orderNotes
    };

    this.paymentSubmitted.emit(paymentData);
    this.close();
  }

  // Helper methods
  formatCardNumber(event: any): void {
    let value = event.target.value.replace(/\s/g, '');
    let formattedValue = value.replace(/(.{4})/g, '$1 ').trim();
    this.paymentForm.cardNumber = formattedValue;
    this.cardNumberValid = value.length >= 16;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US').format(price);
  }

  getCardBrand(): string {
    const number = this.paymentForm.cardNumber.replace(/\s/g, '');
    if (number.startsWith('4')) return 'Visa';
    if (number.startsWith('5') || number.startsWith('2')) return 'Mastercard';
    if (number.startsWith('3')) return 'American Express';
    return '';
  }

  getProgressPercentage(): number {
    return (this.currentStep / this.maxSteps) * 100;
  }
}
