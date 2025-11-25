import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

interface PaymentMethodContextType {
  paymentMethods: PaymentMethod[];
  walletBalance: number;
  addPaymentMethod: (method: Omit<PaymentMethod, 'id' | 'createdAt'>) => Promise<void>;
  removePaymentMethod: (id: string) => Promise<void>;
  setDefaultPaymentMethod: (id: string) => Promise<void>;
  getDefaultPaymentMethod: () => PaymentMethod | undefined;
  topUpWallet: (amount: number) => Promise<void>;
  deductFromWallet: (amount: number) => Promise<boolean>;
  isLoading: boolean;
}

const PaymentMethodContext = createContext<PaymentMethodContextType | undefined>(undefined);

export const PaymentMethodProvider = ({ children }: { children: ReactNode }) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Load from AsyncStorage on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const savedMethods = await AsyncStorage.getItem('paymentMethods');
      const savedBalance = await AsyncStorage.getItem('walletBalance');
      
      if (savedMethods) {
        setPaymentMethods(JSON.parse(savedMethods));
      } else {
        // Initialize with sample data
        const sampleMethods: PaymentMethod[] = [
          {
            id: '1',
            type: 'credit_card',
            isDefault: true,
            cardBrand: 'visa',
            cardLast4: '4242',
            cardholderName: 'Ahmad Khalil',
            expiryMonth: '12',
            expiryYear: '2026',
            createdAt: new Date().toISOString(),
          },
          {
            id: '2',
            type: 'paypal',
            isDefault: false,
            paypalEmail: 'ahmad@example.com',
            createdAt: new Date().toISOString(),
          },
        ];
        setPaymentMethods(sampleMethods);
        await AsyncStorage.setItem('paymentMethods', JSON.stringify(sampleMethods));
      }
      
      if (savedBalance) {
        setWalletBalance(parseFloat(savedBalance));
      } else {
        setWalletBalance(150.00);
        await AsyncStorage.setItem('walletBalance', '150.00');
      }
    } catch (error) {
      console.error('Error loading payment data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addPaymentMethod = async (method: Omit<PaymentMethod, 'id' | 'createdAt'>) => {
    const newMethod: PaymentMethod = {
      ...method,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    let updatedMethods: PaymentMethod[];
    
    // If this is the first payment method or set as default, make it default
    if (paymentMethods.length === 0 || method.isDefault) {
      updatedMethods = [
        ...paymentMethods.map(m => ({ ...m, isDefault: false })),
        newMethod,
      ];
    } else {
      updatedMethods = [...paymentMethods, newMethod];
    }

    setPaymentMethods(updatedMethods);
    await AsyncStorage.setItem('paymentMethods', JSON.stringify(updatedMethods));
  };

  const removePaymentMethod = async (id: string) => {
    const methodToRemove = paymentMethods.find(m => m.id === id);
    const remainingMethods = paymentMethods.filter(m => m.id !== id);
    
    // If removing the default method, set the first remaining method as default
    if (methodToRemove?.isDefault && remainingMethods.length > 0) {
      remainingMethods[0].isDefault = true;
    }
    
    setPaymentMethods(remainingMethods);
    await AsyncStorage.setItem('paymentMethods', JSON.stringify(remainingMethods));
  };

  const setDefaultPaymentMethod = async (id: string) => {
    const updatedMethods = paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id,
    }));
    
    setPaymentMethods(updatedMethods);
    await AsyncStorage.setItem('paymentMethods', JSON.stringify(updatedMethods));
  };

  const getDefaultPaymentMethod = () => {
    return paymentMethods.find(m => m.isDefault);
  };

  const topUpWallet = async (amount: number) => {
    const newBalance = walletBalance + amount;
    setWalletBalance(newBalance);
    await AsyncStorage.setItem('walletBalance', newBalance.toString());
  };

  const deductFromWallet = async (amount: number): Promise<boolean> => {
    if (walletBalance >= amount) {
      const newBalance = walletBalance - amount;
      setWalletBalance(newBalance);
      await AsyncStorage.setItem('walletBalance', newBalance.toString());
      return true;
    }
    return false;
  };

  return (
    <PaymentMethodContext.Provider
      value={{
        paymentMethods,
        walletBalance,
        addPaymentMethod,
        removePaymentMethod,
        setDefaultPaymentMethod,
        getDefaultPaymentMethod,
        topUpWallet,
        deductFromWallet,
        isLoading,
      }}
    >
      {children}
    </PaymentMethodContext.Provider>
  );
};

export const usePaymentMethods = () => {
  const context = useContext(PaymentMethodContext);
  if (!context) {
    throw new Error('usePaymentMethods must be used within PaymentMethodProvider');
  }
  return context;
};

// Utility functions
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

export const maskCardNumber = (cardLast4: string): string => {
  return `•••• •••• •••• ${cardLast4}`;
};

export const validateCardNumber = (cardNumber: string): boolean => {
  const cleaned = cardNumber.replace(/\s/g, '');
  
  if (cleaned.length < 13 || cleaned.length > 19) return false;
  
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

export const getCardBrandInfo = (brand: CardBrand) => {
  const brands = {
    visa: { name: 'Visa', color: '#1A1F71', icon: 'card' },
    mastercard: { name: 'Mastercard', color: '#EB001B', icon: 'card' },
    amex: { name: 'American Express', color: '#006FCF', icon: 'card' },
    discover: { name: 'Discover', color: '#FF6000', icon: 'card' },
    other: { name: 'Card', color: '#666666', icon: 'card' },
  };
  return brands[brand];
};
