import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PaymentMethod, PaymentMethodType, CardBrand } from '../types/payment';

interface PaymentMethodContextType {
  paymentMethods: PaymentMethod[];
  walletBalance: number;
  addPaymentMethod: (method: Omit<PaymentMethod, 'id' | 'createdAt'>) => void;
  removePaymentMethod: (id: string) => void;
  setDefaultPaymentMethod: (id: string) => void;
  getDefaultPaymentMethod: () => PaymentMethod | undefined;
  topUpWallet: (amount: number) => void;
  deductFromWallet: (amount: number) => boolean;
}

const PaymentMethodContext = createContext<PaymentMethodContextType | undefined>(undefined);

export const PaymentMethodProvider = ({ children }: { children: ReactNode }) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [walletBalance, setWalletBalance] = useState(0);

  // Load from localStorage on mount
  useEffect(() => {
    const savedMethods = localStorage.getItem('paymentMethods');
    const savedBalance = localStorage.getItem('walletBalance');
    
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
      localStorage.setItem('paymentMethods', JSON.stringify(sampleMethods));
    }
    
    if (savedBalance) {
      setWalletBalance(parseFloat(savedBalance));
    } else {
      setWalletBalance(150.00);
      localStorage.setItem('walletBalance', '150.00');
    }
  }, []);

  // Save to localStorage whenever paymentMethods change
  useEffect(() => {
    if (paymentMethods.length > 0) {
      localStorage.setItem('paymentMethods', JSON.stringify(paymentMethods));
    }
  }, [paymentMethods]);

  // Save wallet balance to localStorage
  useEffect(() => {
    localStorage.setItem('walletBalance', walletBalance.toString());
  }, [walletBalance]);

  const addPaymentMethod = (method: Omit<PaymentMethod, 'id' | 'createdAt'>) => {
    const newMethod: PaymentMethod = {
      ...method,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    // If this is the first payment method or set as default, make it default
    if (paymentMethods.length === 0 || method.isDefault) {
      setPaymentMethods(prev => [
        ...prev.map(m => ({ ...m, isDefault: false })),
        newMethod,
      ]);
    } else {
      setPaymentMethods(prev => [...prev, newMethod]);
    }
  };

  const removePaymentMethod = (id: string) => {
    const methodToRemove = paymentMethods.find(m => m.id === id);
    const remainingMethods = paymentMethods.filter(m => m.id !== id);
    
    // If removing the default method, set the first remaining method as default
    if (methodToRemove?.isDefault && remainingMethods.length > 0) {
      remainingMethods[0].isDefault = true;
    }
    
    setPaymentMethods(remainingMethods);
  };

  const setDefaultPaymentMethod = (id: string) => {
    setPaymentMethods(prev =>
      prev.map(method => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
  };

  const getDefaultPaymentMethod = () => {
    return paymentMethods.find(m => m.isDefault);
  };

  const topUpWallet = (amount: number) => {
    setWalletBalance(prev => prev + amount);
  };

  const deductFromWallet = (amount: number): boolean => {
    if (walletBalance >= amount) {
      setWalletBalance(prev => prev - amount);
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
