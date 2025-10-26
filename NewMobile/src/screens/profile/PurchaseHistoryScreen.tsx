import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { apiService } from '../../services/ApiService';
import LoadingSpinner from '../../components/LoadingSpinner';
import { SIZES } from '../../constants';
import { formatDate } from '../../utils/helpers';

interface Order {
  id: number;
  product_name: string;
  product_id: number;
  quantity: number;
  price: number;
  total: number;
  status: string;
  ticket_numbers?: string[];
  created_at: string;
  updated_at: string;
}

const PurchaseHistoryScreen: React.FC = () => {
  const navigation = useNavigation();
  const { colors, isDarkMode } = useTheme();
  const { t, isRTL } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await apiService.getOrders();
      setOrders(ordersData || []);
    } catch (error) {
      console.error('Failed to load orders:', error);
      Alert.alert(t('error'), t('failedToLoadOrders'));
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'success':
        return '#34C759';
      case 'pending':
        return '#FF9500';
      case 'failed':
      case 'cancelled':
        return '#FF3B30';
      default:
        return colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'success':
        return 'checkmark-circle';
      case 'pending':
        return 'time';
      case 'failed':
      case 'cancelled':
        return 'close-circle';
      default:
        return 'information-circle';
    }
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity 
      style={[styles.orderCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
      activeOpacity={0.7}
    >
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={[styles.productName, { color: colors.text }]} numberOfLines={2}>
            {item.product_name || `${t('product')} #${item.product_id}`}
          </Text>
          <Text style={[styles.orderDate, { color: colors.textSecondary }]}>
            {formatDate(item.created_at)}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Ionicons 
            name={getStatusIcon(item.status) as any} 
            size={16} 
            color={getStatusColor(item.status)} 
          />
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {t(item.status.toLowerCase()) || item.status}
          </Text>
        </View>
      </View>

      <View style={styles.orderDetails}>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
            {t('quantity')}:
          </Text>
          <Text style={[styles.detailValue, { color: colors.text }]}>
            {item.quantity} {item.quantity > 1 ? t('items') : t('item')}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
            {t('price')}:
          </Text>
          <Text style={[styles.detailValue, { color: colors.text }]}>
            {Number(item.price || 0).toLocaleString()} IQD
          </Text>
        </View>

        <View style={[styles.detailRow, styles.totalRow]}>
          <Text style={[styles.detailLabel, styles.totalLabel, { color: colors.text }]}>
            {t('total')}:
          </Text>
          <Text style={[styles.detailValue, styles.totalValue, { color: colors.primary }]}>
            {Number(item.total || item.price * item.quantity).toLocaleString()} IQD
          </Text>
        </View>
      </View>

      {item.ticket_numbers && item.ticket_numbers.length > 0 && (
        <View style={[styles.ticketsSection, { backgroundColor: colors.background }]}>
          <View style={styles.ticketsHeader}>
            <Ionicons name="ticket" size={16} color={colors.primary} />
            <Text style={[styles.ticketsLabel, { color: colors.text }]}>
              {t('ticketsGenerated')}: {item.ticket_numbers.length}
            </Text>
          </View>
          <View style={styles.ticketNumbers}>
            {item.ticket_numbers.slice(0, 3).map((ticket, index) => (
              <View key={index} style={[styles.ticketBadge, { backgroundColor: colors.surface }]}>
                <Text style={[styles.ticketNumber, { color: colors.primary }]}>
                  #{ticket}
                </Text>
              </View>
            ))}
            {item.ticket_numbers.length > 3 && (
              <Text style={[styles.moreTickets, { color: colors.textSecondary }]}>
                +{item.ticket_numbers.length - 3} {t('more')}
              </Text>
            )}
          </View>
        </View>
      )}

      <View style={styles.orderFooter}>
        <Text style={[styles.orderIdText, { color: colors.textSecondary }]}>
          {t('orderID')}: #{item.id}
        </Text>
        <TouchableOpacity style={styles.viewDetailsButton}>
          <Text style={[styles.viewDetailsText, { color: colors.primary }]}>
            {t('viewDetails')}
          </Text>
          <Ionicons 
            name={isRTL ? "chevron-back" : "chevron-forward"} 
            size={16} 
            color={colors.primary} 
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="receipt-outline" size={80} color={colors.textSecondary} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        {t('noPurchasesYet')}
      </Text>
      <Text style={[styles.emptyDescription, { color: colors.textSecondary }]}>
        {t('purchaseProductsMessage')}
      </Text>
      <TouchableOpacity 
        style={[styles.browseButton, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate('Products' as never)}
      >
        <Ionicons name="storefront" size={20} color="#FFFFFF" />
        <Text style={styles.browseButtonText}>
          {t('browseProducts')}
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons 
            name={isRTL ? "chevron-forward" : "chevron-back"} 
            size={24} 
            color={colors.text} 
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {t('purchaseHistory')}
        </Text>
        <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
          <Ionicons name="refresh" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={[
          styles.listContent,
          orders.length === 0 && styles.emptyListContent,
        ]}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.paddingLarge,
    paddingVertical: SIZES.paddingMedium,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: SIZES.paddingSmall,
  },
  headerTitle: {
    fontSize: SIZES.fontXLarge,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  refreshButton: {
    padding: SIZES.paddingSmall,
  },
  listContent: {
    padding: SIZES.paddingLarge,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  orderCard: {
    borderRadius: SIZES.borderRadiusLarge,
    padding: SIZES.paddingLarge,
    marginBottom: SIZES.marginLarge,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SIZES.marginMedium,
  },
  orderInfo: {
    flex: 1,
    marginRight: SIZES.marginMedium,
  },
  productName: {
    fontSize: SIZES.fontLarge,
    fontWeight: '600',
    marginBottom: SIZES.marginSmall,
  },
  orderDate: {
    fontSize: SIZES.fontSmall,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.paddingMedium,
    paddingVertical: SIZES.paddingSmall,
    borderRadius: SIZES.borderRadiusMedium,
    gap: 4,
  },
  statusText: {
    fontSize: SIZES.fontSmall,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  orderDetails: {
    marginBottom: SIZES.marginMedium,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.marginSmall,
  },
  detailLabel: {
    fontSize: SIZES.fontMedium,
  },
  detailValue: {
    fontSize: SIZES.fontMedium,
    fontWeight: '500',
  },
  totalRow: {
    marginTop: SIZES.marginSmall,
    paddingTop: SIZES.paddingSmall,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  totalLabel: {
    fontWeight: '600',
  },
  totalValue: {
    fontSize: SIZES.fontLarge,
    fontWeight: 'bold',
  },
  ticketsSection: {
    borderRadius: SIZES.borderRadiusMedium,
    padding: SIZES.paddingMedium,
    marginBottom: SIZES.marginMedium,
  },
  ticketsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.marginSmall,
    gap: 6,
  },
  ticketsLabel: {
    fontSize: SIZES.fontMedium,
    fontWeight: '500',
  },
  ticketNumbers: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ticketBadge: {
    paddingHorizontal: SIZES.paddingMedium,
    paddingVertical: SIZES.paddingSmall,
    borderRadius: SIZES.borderRadiusSmall,
  },
  ticketNumber: {
    fontSize: SIZES.fontSmall,
    fontWeight: '600',
  },
  moreTickets: {
    fontSize: SIZES.fontSmall,
    alignSelf: 'center',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderIdText: {
    fontSize: SIZES.fontSmall,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewDetailsText: {
    fontSize: SIZES.fontSmall,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SIZES.paddingXLarge * 2,
    paddingHorizontal: SIZES.paddingXLarge,
  },
  emptyTitle: {
    fontSize: SIZES.fontXXLarge,
    fontWeight: 'bold',
    marginTop: SIZES.marginXLarge,
    marginBottom: SIZES.marginMedium,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: SIZES.fontMedium,
    textAlign: 'center',
    marginBottom: SIZES.marginXLarge,
    lineHeight: 22,
  },
  browseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: SIZES.paddingXLarge,
    paddingVertical: SIZES.paddingMedium,
    borderRadius: SIZES.borderRadiusMedium,
    marginTop: SIZES.marginMedium,
  },
  browseButtonText: {
    color: '#FFFFFF',
    fontSize: SIZES.fontMedium,
    fontWeight: '600',
  },
});

export default PurchaseHistoryScreen;
