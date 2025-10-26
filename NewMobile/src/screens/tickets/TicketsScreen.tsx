import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ticket, Category } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { SIZES } from '../../constants';
import { formatDateTime, getCategoryColor, getCategoryEmoji, getErrorMessage } from '../../utils/helpers';
import { apiManager } from '../../services/ApiManager';
import LoadingSpinner from '../../components/LoadingSpinner';
import CustomButton from '../../components/CustomButton';

const TicketsScreen: React.FC = () => {
  const { colors, isDarkMode } = useTheme();
  const { t, isRTL } = useLanguage();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dynamic styles based on theme
  const dynamicStyles = StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },
    header: {
      borderBottomColor: colors.border,
    },
    title: {
      color: colors.text,
    },
    subtitle: {
      color: colors.textSecondary,
    },
    emptyContainer: {
      backgroundColor: colors.background,
    },
    emptyTitle: {
      color: colors.text,
    },
    emptyText: {
      color: colors.textSecondary,
    },
    ticketCard: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      shadowColor: isDarkMode ? colors.border : '#000',
    },
    categoryText: {
      color: colors.background,
    },
    statusText: {
      color: colors.background,
    },
    ticketNumber: {
      color: colors.primary,
    },
    productName: {
      color: colors.text,
    },
    dateText: {
      color: colors.textSecondary,
    },
    prizeText: {
      color: colors.success,
    },
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [ticketsData, categoriesData] = await Promise.all([
        apiManager.getTickets().catch(() => []), // Handle 404 gracefully
        apiManager.getCategories().catch(() => []), // Handle 404 gracefully
      ]);

      setTickets(ticketsData);
      setCategories(categoriesData);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const renderTicket = ({ item }: { item: Ticket }) => {
    const category = categories.find(cat => cat.id === item.category_id);
    const categoryName = category?.name || item.category?.name || 'Unknown';
    
    return (
      <View style={[styles.ticketCard, dynamicStyles.ticketCard]}>
        <View style={styles.ticketHeader}>
          <View style={[
            styles.categoryBadge,
            { backgroundColor: getCategoryColor(categoryName) }
          ]}>
            <Text style={[styles.categoryText, dynamicStyles.categoryText]}>
              {getCategoryEmoji(categoryName)} {categoryName.toUpperCase()}
            </Text>
          </View>
          <View style={[
            styles.statusBadge,
            { backgroundColor: item.is_winner ? colors.success : colors.textSecondary }
          ]}>
            <Text style={[styles.statusText, dynamicStyles.statusText]}>
              {item.is_winner ? '🏆 WINNER' : '🎫 ACTIVE'}
            </Text>
          </View>
        </View>

        <Text style={[styles.ticketNumber, dynamicStyles.ticketNumber]}>#{item.ticket_number}</Text>
        
        {item.product && (
          <Text style={[styles.productName, dynamicStyles.productName]}>{item.product.name}</Text>
        )}

        <View style={styles.ticketFooter}>
          <Text style={[styles.dateText, dynamicStyles.dateText]}>
            Created: {formatDateTime(item.created_at)}
          </Text>
          {item.is_winner && item.prize_amount && (
            <Text style={[styles.prizeText, dynamicStyles.prizeText]}>
              Prize: {item.prize_amount} IQD
            </Text>
          )}
        </View>
      </View>
    );
  };

  const generateSampleTickets = () => {
    // Generate sample tickets for demo
    const sampleTickets: Ticket[] = [
      {
        id: 1,
        user_id: 1,
        product_id: 1,
        category_id: 1,
        ticket_number: 'TKT-001-ABC123',
        is_winner: false,
        prize_amount: null,
        drawn_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        product: {
          id: 1,
          name: 'iPhone 15 Pro',
          description: 'Latest iPhone',
          price: 1500000,
          ticket_category: 'golden',
          ticket_count: 100,
          image_url: null,
          in_stock: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      },
      {
        id: 2,
        user_id: 1,
        product_id: 2,
        category_id: 2,
        ticket_number: 'TKT-002-DEF456',
        is_winner: true,
        prize_amount: 50000,
        drawn_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        product: {
          id: 2,
          name: 'Samsung Galaxy S24',
          description: 'Premium Android smartphone',
          price: 1200000,
          ticket_category: 'silver',
          ticket_count: 80,
          image_url: null,
          in_stock: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      }
    ];
    setTickets(sampleTickets);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={[styles.container, dynamicStyles.container]}>
      <View style={[styles.header, dynamicStyles.header]}>
        <Text style={[styles.title, dynamicStyles.title]}>
          {t('myTickets')}
        </Text>
        <Text style={[styles.subtitle, dynamicStyles.subtitle]}>
          {tickets.length} {t('tickets')} {t('total')}
        </Text>
      </View>

      {tickets.length === 0 ? (
        <View style={[styles.emptyContainer, dynamicStyles.emptyContainer]}>
          <Text style={[styles.emptyTitle, dynamicStyles.emptyTitle]}>
            🎫 {t('noTicketsYet')}
          </Text>
          <Text style={[styles.emptyText, dynamicStyles.emptyText]}>
            {t('purchaseToGetTickets')}
          </Text>
          <CustomButton
            title={t('generateSampleTickets')}
            onPress={generateSampleTickets}
            style={styles.sampleButton}
          />
        </View>
      ) : (
        <FlatList
          data={tickets}
          renderItem={renderTicket}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: SIZES.paddingLarge,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: SIZES.fontXXLarge,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: SIZES.fontMedium,
    marginTop: SIZES.marginSmall,
  },
  listContainer: {
    padding: SIZES.paddingLarge,
  },
  ticketCard: {
    borderRadius: SIZES.borderRadiusLarge,
    padding: SIZES.paddingLarge,
    marginBottom: SIZES.marginMedium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.marginMedium,
  },
  categoryBadge: {
    paddingHorizontal: SIZES.paddingMedium,
    paddingVertical: SIZES.paddingSmall,
    borderRadius: SIZES.borderRadiusMedium,
  },
  categoryText: {
    fontSize: SIZES.fontSmall,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: SIZES.paddingMedium,
    paddingVertical: SIZES.paddingSmall,
    borderRadius: SIZES.borderRadiusMedium,
  },
  statusText: {
    fontSize: SIZES.fontSmall,
    fontWeight: '600',
  },
  ticketNumber: {
    fontSize: SIZES.fontLarge,
    fontWeight: 'bold',
    marginBottom: SIZES.marginSmall,
  },
  productName: {
    fontSize: SIZES.fontMedium,
    marginBottom: SIZES.marginMedium,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: SIZES.fontSmall,
  },
  prizeText: {
    fontSize: SIZES.fontMedium,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.paddingLarge,
  },
  emptyTitle: {
    fontSize: SIZES.fontXLarge,
    fontWeight: 'bold',
    marginBottom: SIZES.marginMedium,
  },
  emptyText: {
    fontSize: SIZES.fontMedium,
    textAlign: 'center',
    marginBottom: SIZES.marginLarge,
  },
  sampleButton: {
    marginTop: SIZES.marginMedium,
  },
});

export default TicketsScreen;
