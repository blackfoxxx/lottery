import { useState } from 'react';
import { useTransactions } from '@/contexts/TransactionContext';
import {
  Transaction,
  TransactionType,
  TransactionStatus,
  TRANSACTION_TYPE_LABELS,
  TRANSACTION_STATUS_LABELS,
  TRANSACTION_TYPE_COLORS,
  TRANSACTION_STATUS_COLORS,
  formatTransactionAmount,
} from '@/types/transaction';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Search, Download, FileText, Calendar, DollarSign, TrendingUp, TrendingDown, Trophy } from 'lucide-react';
import { format } from 'date-fns';

export default function PaymentHistory() {
  const {
    transactions,
    getTotalSpent,
    getTotalRefunded,
    getTotalWalletTopups,
    getTotalLotteryWins,
  } = useTransactions();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<TransactionStatus | 'all'>('all');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleExportCSV = () => {
    const headers = ['ID', 'Date', 'Type', 'Description', 'Amount', 'Status', 'Payment Method'];
    const rows = filteredTransactions.map(t => [
      t.id,
      format(new Date(t.createdAt), 'yyyy-MM-dd HH:mm:ss'),
      TRANSACTION_TYPE_LABELS[t.type],
      t.description,
      formatTransactionAmount(t),
      TRANSACTION_STATUS_LABELS[t.status],
      t.paymentMethod || 'N/A',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payment-history-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Transaction history exported successfully');
  };

  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case 'purchase':
        return <TrendingDown className="h-5 w-5" />;
      case 'wallet_topup':
        return <TrendingUp className="h-5 w-5" />;
      case 'refund':
        return <TrendingUp className="h-5 w-5" />;
      case 'lottery_win':
        return <Trophy className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Payment History</h1>
        <p className="text-muted-foreground mb-8">
          View and manage your transaction history
        </p>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold">${getTotalSpent().toFixed(2)}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Refunded</p>
                  <p className="text-2xl font-bold">${getTotalRefunded().toFixed(2)}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Wallet Top-ups</p>
                  <p className="text-2xl font-bold">${getTotalWalletTopups().toFixed(2)}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Lottery Wins</p>
                  <p className="text-2xl font-bold">${getTotalLotteryWins().toFixed(2)}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by ID or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label>Type</Label>
                <Select value={filterType} onValueChange={(value) => setFilterType(value as TransactionType | 'all')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="purchase">Purchase</SelectItem>
                    <SelectItem value="wallet_topup">Wallet Top-up</SelectItem>
                    <SelectItem value="refund">Refund</SelectItem>
                    <SelectItem value="lottery_win">Lottery Win</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Status</Label>
                <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as TransactionStatus | 'all')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={handleExportCSV}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
            <CardDescription>
              {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No transactions found</p>
                </div>
              ) : (
                filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    onClick={() => setSelectedTransaction(transaction)}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-full bg-accent flex items-center justify-center ${TRANSACTION_TYPE_COLORS[transaction.type]}`}>
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(transaction.createdAt), 'MMM dd, yyyy HH:mm')}
                          </p>
                          {transaction.paymentMethod && (
                            <>
                              <span className="text-muted-foreground">•</span>
                              <p className="text-sm text-muted-foreground">
                                {transaction.paymentMethod}
                                {transaction.paymentMethodLast4 && ` •••• ${transaction.paymentMethodLast4}`}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className={`font-bold ${TRANSACTION_TYPE_COLORS[transaction.type]}`}>
                          {formatTransactionAmount(transaction)}
                        </p>
                        <Badge
                          variant="outline"
                          className={`mt-1 ${TRANSACTION_STATUS_COLORS[transaction.status]}`}
                        >
                          {TRANSACTION_STATUS_LABELS[transaction.status]}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Transaction Details Modal */}
        <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Transaction Details</DialogTitle>
              <DialogDescription>
                Transaction ID: {selectedTransaction?.id}
              </DialogDescription>
            </DialogHeader>

            {selectedTransaction && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Type</Label>
                    <p className="font-medium">{TRANSACTION_TYPE_LABELS[selectedTransaction.type]}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <Badge variant="outline" className={TRANSACTION_STATUS_COLORS[selectedTransaction.status]}>
                      {TRANSACTION_STATUS_LABELS[selectedTransaction.status]}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Amount</Label>
                    <p className="font-medium">{formatTransactionAmount(selectedTransaction)}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Date</Label>
                    <p className="font-medium">
                      {format(new Date(selectedTransaction.createdAt), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                </div>

                <div>
                  <Label className="text-muted-foreground">Description</Label>
                  <p className="font-medium">{selectedTransaction.description}</p>
                </div>

                {selectedTransaction.paymentMethod && (
                  <div>
                    <Label className="text-muted-foreground">Payment Method</Label>
                    <p className="font-medium">
                      {selectedTransaction.paymentMethod}
                      {selectedTransaction.paymentMethodLast4 && ` •••• ${selectedTransaction.paymentMethodLast4}`}
                    </p>
                  </div>
                )}

                {selectedTransaction.orderId && (
                  <div>
                    <Label className="text-muted-foreground">Order ID</Label>
                    <p className="font-medium">#{selectedTransaction.orderId}</p>
                  </div>
                )}

                {selectedTransaction.lotteryDrawId && (
                  <div>
                    <Label className="text-muted-foreground">Lottery Draw</Label>
                    <p className="font-medium">{selectedTransaction.lotteryDrawId}</p>
                  </div>
                )}

                {selectedTransaction.lotteryTicketNumber && (
                  <div>
                    <Label className="text-muted-foreground">Ticket Number</Label>
                    <p className="font-medium">{selectedTransaction.lotteryTicketNumber}</p>
                  </div>
                )}

                {selectedTransaction.refundReason && (
                  <div>
                    <Label className="text-muted-foreground">Refund Reason</Label>
                    <p className="font-medium">{selectedTransaction.refundReason}</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
