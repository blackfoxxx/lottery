export type TransactionType = 'purchase' | 'wallet_topup' | 'refund' | 'lottery_win';
export type TransactionStatus = 'completed' | 'pending' | 'failed' | 'cancelled';

export interface Transaction {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  currency: string;
  description: string;
  createdAt: string;
  
  // Payment method used
  paymentMethod?: string;
  paymentMethodLast4?: string;
  
  // Order-specific fields
  orderId?: string;
  orderItems?: number;
  
  // Wallet-specific fields
  walletBalanceBefore?: number;
  walletBalanceAfter?: number;
  
  // Lottery-specific fields
  lotteryDrawId?: string;
  lotteryTicketNumber?: string;
  
  // Refund-specific fields
  refundReason?: string;
  originalTransactionId?: string;
}

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  purchase: 'Purchase',
  wallet_topup: 'Wallet Top-up',
  refund: 'Refund',
  lottery_win: 'Lottery Win',
};

export const TRANSACTION_STATUS_LABELS: Record<TransactionStatus, string> = {
  completed: 'Completed',
  pending: 'Pending',
  failed: 'Failed',
  cancelled: 'Cancelled',
};

export const TRANSACTION_TYPE_COLORS: Record<TransactionType, string> = {
  purchase: 'text-blue-600',
  wallet_topup: 'text-green-600',
  refund: 'text-orange-600',
  lottery_win: 'text-yellow-600',
};

export const TRANSACTION_STATUS_COLORS: Record<TransactionStatus, string> = {
  completed: 'text-green-600',
  pending: 'text-yellow-600',
  failed: 'text-red-600',
  cancelled: 'text-gray-600',
};

export interface TransactionFilters {
  type?: TransactionType | 'all';
  status?: TransactionStatus | 'all';
  dateFrom?: string;
  dateTo?: string;
  searchQuery?: string;
}

export const formatTransactionAmount = (transaction: Transaction): string => {
  const prefix = transaction.type === 'refund' || transaction.type === 'wallet_topup' || transaction.type === 'lottery_win' ? '+' : '-';
  return `${prefix}${transaction.currency}${transaction.amount.toFixed(2)}`;
};

export const getTransactionIcon = (type: TransactionType): string => {
  switch (type) {
    case 'purchase':
      return 'shopping-cart';
    case 'wallet_topup':
      return 'wallet';
    case 'refund':
      return 'arrow-back';
    case 'lottery_win':
      return 'trophy';
    default:
      return 'document';
  }
};
