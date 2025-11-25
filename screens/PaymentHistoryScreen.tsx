import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  RefreshControl,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTransactions } from '../contexts/TransactionContext';
import {
  Transaction,
  TransactionType,
  TransactionStatus,
  TRANSACTION_TYPE_LABELS,
  TRANSACTION_STATUS_LABELS,
  formatTransactionAmount,
} from '../types/transaction';
import { format } from 'date-fns';

export default function PaymentHistoryScreen({ navigation }: any) {
  const { t } = useTranslation();
  const {
    transactions,
    getTotalSpent,
    getTotalRefunded,
    getTotalWalletTopups,
    getTotalLotteryWins,
    refreshTransactions,
    isLoading,
  } = useTransactions();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<TransactionStatus | 'all'>('all');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshTransactions();
    setRefreshing(false);
  };

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case 'purchase':
        return 'cart';
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

  const getTransactionColor = (type: TransactionType) => {
    switch (type) {
      case 'purchase':
        return '#3b82f6';
      case 'wallet_topup':
        return '#10b981';
      case 'refund':
        return '#f59e0b';
      case 'lottery_win':
        return '#fbbf24';
      default:
        return '#6b7280';
    }
  };

  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case 'completed':
        return '#10b981';
      case 'pending':
        return '#fbbf24';
      case 'failed':
        return '#ef4444';
      case 'cancelled':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment History</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3b82f6" />
        }
      >
        {/* Summary Cards */}
        <View style={styles.summaryGrid}>
          <View style={[styles.summaryCard, { backgroundColor: '#3b82f620' }]}>
            <Ionicons name="trending-down" size={24} color="#3b82f6" />
            <Text style={styles.summaryLabel}>Total Spent</Text>
            <Text style={styles.summaryValue}>${getTotalSpent().toFixed(2)}</Text>
          </View>

          <View style={[styles.summaryCard, { backgroundColor: '#f59e0b20' }]}>
            <Ionicons name="arrow-back" size={24} color="#f59e0b" />
            <Text style={styles.summaryLabel}>Refunded</Text>
            <Text style={styles.summaryValue}>${getTotalRefunded().toFixed(2)}</Text>
          </View>

          <View style={[styles.summaryCard, { backgroundColor: '#10b98120' }]}>
            <Ionicons name="trending-up" size={24} color="#10b981" />
            <Text style={styles.summaryLabel}>Top-ups</Text>
            <Text style={styles.summaryValue}>${getTotalWalletTopups().toFixed(2)}</Text>
          </View>

          <View style={[styles.summaryCard, { backgroundColor: '#fbbf2420' }]}>
            <Ionicons name="trophy" size={24} color="#fbbf24" />
            <Text style={styles.summaryLabel}>Wins</Text>
            <Text style={styles.summaryValue}>${getTotalLotteryWins().toFixed(2)}</Text>
          </View>
        </View>

        {/* Search and Filters */}
        <View style={styles.filtersContainer}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search transactions..."
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterChips}>
            <TouchableOpacity
              style={[styles.filterChip, filterType === 'all' && styles.filterChipActive]}
              onPress={() => setFilterType('all')}
            >
              <Text style={[styles.filterChipText, filterType === 'all' && styles.filterChipTextActive]}>
                All Types
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterChip, filterType === 'purchase' && styles.filterChipActive]}
              onPress={() => setFilterType('purchase')}
            >
              <Text style={[styles.filterChipText, filterType === 'purchase' && styles.filterChipTextActive]}>
                Purchases
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterChip, filterType === 'wallet_topup' && styles.filterChipActive]}
              onPress={() => setFilterType('wallet_topup')}
            >
              <Text style={[styles.filterChipText, filterType === 'wallet_topup' && styles.filterChipTextActive]}>
                Top-ups
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterChip, filterType === 'refund' && styles.filterChipActive]}
              onPress={() => setFilterType('refund')}
            >
              <Text style={[styles.filterChipText, filterType === 'refund' && styles.filterChipTextActive]}>
                Refunds
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterChip, filterType === 'lottery_win' && styles.filterChipActive]}
              onPress={() => setFilterType('lottery_win')}
            >
              <Text style={[styles.filterChipText, filterType === 'lottery_win' && styles.filterChipTextActive]}>
                Wins
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Transactions List */}
        <View style={styles.transactionsContainer}>
          <Text style={styles.sectionTitle}>
            {filteredTransactions.length} Transaction{filteredTransactions.length !== 1 ? 's' : ''}
          </Text>

          {filteredTransactions.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={64} color="#666" />
              <Text style={styles.emptyText}>No transactions found</Text>
            </View>
          ) : (
            filteredTransactions.map((transaction) => (
              <TouchableOpacity
                key={transaction.id}
                style={styles.transactionCard}
                onPress={() => setSelectedTransaction(transaction)}
              >
                <View style={styles.transactionLeft}>
                  <View
                    style={[
                      styles.transactionIcon,
                      { backgroundColor: `${getTransactionColor(transaction.type)}20` },
                    ]}
                  >
                    <Ionicons
                      name={getTransactionIcon(transaction.type)}
                      size={24}
                      color={getTransactionColor(transaction.type)}
                    />
                  </View>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionDescription}>{transaction.description}</Text>
                    <View style={styles.transactionMeta}>
                      <Text style={styles.transactionDate}>
                        {format(new Date(transaction.createdAt), 'MMM dd, yyyy HH:mm')}
                      </Text>
                      {transaction.paymentMethod && (
                        <>
                          <Text style={styles.metaDivider}>•</Text>
                          <Text style={styles.transactionPayment}>
                            {transaction.paymentMethod}
                            {transaction.paymentMethodLast4 && ` •••• ${transaction.paymentMethodLast4}`}
                          </Text>
                        </>
                      )}
                    </View>
                  </View>
                </View>

                <View style={styles.transactionRight}>
                  <Text
                    style={[
                      styles.transactionAmount,
                      { color: getTransactionColor(transaction.type) },
                    ]}
                  >
                    {formatTransactionAmount(transaction)}
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: `${getStatusColor(transaction.status)}20` },
                    ]}
                  >
                    <Text style={[styles.statusText, { color: getStatusColor(transaction.status) }]}>
                      {TRANSACTION_STATUS_LABELS[transaction.status]}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* Transaction Details Modal */}
      <Modal
        visible={!!selectedTransaction}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedTransaction(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Transaction Details</Text>
              <TouchableOpacity onPress={() => setSelectedTransaction(null)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {selectedTransaction && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Transaction ID</Text>
                  <Text style={styles.detailValue}>{selectedTransaction.id}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Type</Text>
                  <Text style={styles.detailValue}>
                    {TRANSACTION_TYPE_LABELS[selectedTransaction.type]}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: `${getStatusColor(selectedTransaction.status)}20` },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: getStatusColor(selectedTransaction.status) },
                      ]}
                    >
                      {TRANSACTION_STATUS_LABELS[selectedTransaction.status]}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Amount</Text>
                  <Text style={styles.detailValue}>
                    {formatTransactionAmount(selectedTransaction)}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Date</Text>
                  <Text style={styles.detailValue}>
                    {format(new Date(selectedTransaction.createdAt), 'MMM dd, yyyy HH:mm')}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Description</Text>
                  <Text style={styles.detailValue}>{selectedTransaction.description}</Text>
                </View>

                {selectedTransaction.paymentMethod && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Payment Method</Text>
                    <Text style={styles.detailValue}>
                      {selectedTransaction.paymentMethod}
                      {selectedTransaction.paymentMethodLast4 &&
                        ` •••• ${selectedTransaction.paymentMethodLast4}`}
                    </Text>
                  </View>
                )}

                {selectedTransaction.orderId && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Order ID</Text>
                    <Text style={styles.detailValue}>#{selectedTransaction.orderId}</Text>
                  </View>
                )}

                {selectedTransaction.lotteryDrawId && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Lottery Draw</Text>
                    <Text style={styles.detailValue}>{selectedTransaction.lotteryDrawId}</Text>
                  </View>
                )}

                {selectedTransaction.lotteryTicketNumber && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Ticket Number</Text>
                    <Text style={styles.detailValue}>
                      {selectedTransaction.lotteryTicketNumber}
                    </Text>
                  </View>
                )}

                {selectedTransaction.refundReason && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Refund Reason</Text>
                    <Text style={styles.detailValue}>{selectedTransaction.refundReason}</Text>
                  </View>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    paddingBottom: 16,
    backgroundColor: '#2d2d2d',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    minWidth: '47%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d2d2d',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    paddingVertical: 12,
  },
  filterChips: {
    flexDirection: 'row',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#2d2d2d',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#3b82f6',
  },
  filterChipText: {
    fontSize: 14,
    color: '#999',
  },
  filterChipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  transactionsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
    marginBottom: 12,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2d2d2d',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionDate: {
    fontSize: 12,
    color: '#999',
  },
  metaDivider: {
    fontSize: 12,
    color: '#666',
    marginHorizontal: 6,
  },
  transactionPayment: {
    fontSize: 12,
    color: '#999',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#2d2d2d',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalBody: {
    padding: 20,
  },
  detailRow: {
    marginBottom: 20,
  },
  detailLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 6,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
