import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction, TransactionType, TransactionStatus } from '../types/transaction';

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  getTransactionById: (id: string) => Transaction | undefined;
  getTransactionsByType: (type: TransactionType) => Transaction[];
  getTransactionsByStatus: (status: TransactionStatus) => Transaction[];
  getTotalSpent: () => number;
  getTotalRefunded: () => number;
  getTotalWalletTopups: () => number;
  getTotalLotteryWins: () => number;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    } else {
      // Initialize with sample data
      const sampleTransactions: Transaction[] = [
        {
          id: '1',
          type: 'purchase',
          status: 'completed',
          amount: 299.99,
          currency: '$',
          description: 'Order #12345 - 3 items',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          paymentMethod: 'Visa',
          paymentMethodLast4: '4242',
          orderId: '12345',
          orderItems: 3,
        },
        {
          id: '2',
          type: 'wallet_topup',
          status: 'completed',
          amount: 100.00,
          currency: '$',
          description: 'Wallet top-up',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          paymentMethod: 'Visa',
          paymentMethodLast4: '4242',
          walletBalanceBefore: 50.00,
          walletBalanceAfter: 150.00,
        },
        {
          id: '3',
          type: 'purchase',
          status: 'completed',
          amount: 149.99,
          currency: '$',
          description: 'Order #12344 - 2 items',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          paymentMethod: 'PayPal',
          orderId: '12344',
          orderItems: 2,
        },
        {
          id: '4',
          type: 'lottery_win',
          status: 'completed',
          amount: 500.00,
          currency: '$',
          description: 'Lottery prize - Golden Draw',
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          lotteryDrawId: 'GD-2024-001',
          lotteryTicketNumber: 'LT-123456',
        },
        {
          id: '5',
          type: 'refund',
          status: 'completed',
          amount: 49.99,
          currency: '$',
          description: 'Refund for Order #12343',
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          refundReason: 'Product damaged',
          originalTransactionId: '6',
        },
        {
          id: '6',
          type: 'purchase',
          status: 'completed',
          amount: 49.99,
          currency: '$',
          description: 'Order #12343 - 1 item',
          createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
          paymentMethod: 'Wallet',
          orderId: '12343',
          orderItems: 1,
        },
        {
          id: '7',
          type: 'purchase',
          status: 'pending',
          amount: 199.99,
          currency: '$',
          description: 'Order #12346 - 2 items',
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          paymentMethod: 'Visa',
          paymentMethodLast4: '4242',
          orderId: '12346',
          orderItems: 2,
        },
      ];
      setTransactions(sampleTransactions);
      localStorage.setItem('transactions', JSON.stringify(sampleTransactions));
    }
  }, []);

  // Save to localStorage whenever transactions change
  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem('transactions', JSON.stringify(transactions));
    }
  }, [transactions]);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    setTransactions(prev => [newTransaction, ...prev]);
  };

  const getTransactionById = (id: string) => {
    return transactions.find(t => t.id === id);
  };

  const getTransactionsByType = (type: TransactionType) => {
    return transactions.filter(t => t.type === type);
  };

  const getTransactionsByStatus = (status: TransactionStatus) => {
    return transactions.filter(t => t.status === status);
  };

  const getTotalSpent = () => {
    return transactions
      .filter(t => t.type === 'purchase' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalRefunded = () => {
    return transactions
      .filter(t => t.type === 'refund' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalWalletTopups = () => {
    return transactions
      .filter(t => t.type === 'wallet_topup' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalLotteryWins = () => {
    return transactions
      .filter(t => t.type === 'lottery_win' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        getTransactionById,
        getTransactionsByType,
        getTransactionsByStatus,
        getTotalSpent,
        getTotalRefunded,
        getTotalWalletTopups,
        getTotalLotteryWins,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within TransactionProvider');
  }
  return context;
};
