export type PaymentMethodType = 'credit_card' | 'debit_card' | 'paypal' | 'wallet';

export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'discover' | 'other';

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  isDefault: boolean;
  createdAt: string;
  
  // Card-specific fields
  cardBrand?: CardBrand;
  cardLast4?: string;
  cardholderName?: string;
  expiryMonth?: string;
  expiryYear?: string;
  
  // PayPal-specific fields
  paypalEmail?: string;
  
  // Wallet-specific fields
  walletBalance?: number;
}

export interface CreditCardForm {
  cardNumber: string;
  cardholderName: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  saveCard: boolean;
}

export interface PayPalForm {
  email: string;
  saveAccount: boolean;
}

export interface WalletTopUp {
  amount: number;
  paymentMethodId: string;
}

export const CARD_BRANDS: Record<CardBrand, { name: string; icon: string; color: string }> = {
  visa: { name: 'Visa', icon: '💳', color: '#1A1F71' },
  mastercard: { name: 'Mastercard', icon: '💳', color: '#EB001B' },
  amex: { name: 'American Express', icon: '💳', color: '#006FCF' },
  discover: { name: 'Discover', icon: '💳', color: '#FF6000' },
  other: { name: 'Card', icon: '💳', color: '#666666' },
};

export const detectCardBrand = (cardNumber: string): CardBrand => {
  const cleaned = cardNumber.replace(/\s/g, '');
  
  if (/^4/.test(cleaned)) return 'visa';
  if (/^5[1-5]/.test(cleaned)) return 'mastercard';
  if (/^3[47]/.test(cleaned)) return 'amex';
  if (/^6(?:011|5)/.test(cleaned)) return 'discover';
  
  return 'other';
};

export const formatCardNumber = (value: string): string => {
  const cleaned = value.replace(/\s/g, '');
  const chunks = cleaned.match(/.{1,4}/g) || [];
  return chunks.join(' ');
};

export const maskCardNumber = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\s/g, '');
  const last4 = cleaned.slice(-4);
  return `•••• •••• •••• ${last4}`;
};

export const validateCardNumber = (cardNumber: string): boolean => {
  const cleaned = cardNumber.replace(/\s/g, '');
  
  // Luhn algorithm
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

export const validateExpiryDate = (month: string, year: string): boolean => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  
  const expMonth = parseInt(month, 10);
  const expYear = parseInt(year, 10);
  
  if (expMonth < 1 || expMonth > 12) return false;
  
  if (expYear < currentYear) return false;
  if (expYear === currentYear && expMonth < currentMonth) return false;
  
  return true;
};

export const validateCVV = (cvv: string, cardBrand: CardBrand): boolean => {
  if (cardBrand === 'amex') {
    return /^\d{4}$/.test(cvv);
  }
  return /^\d{3}$/.test(cvv);
};
