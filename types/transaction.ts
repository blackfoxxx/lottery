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

export const formatTransactionAmount = (transaction: Transaction): string => {
  const prefix = transaction.type === 'refund' || transaction.type === 'wallet_topup' || transaction.type === 'lottery_win' ? '+' : '-';
  return `${prefix}${transaction.currency}${transaction.amount.toFixed(2)}`;
};
