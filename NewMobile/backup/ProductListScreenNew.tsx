import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProductStackParamList, Product, Category } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { SIZES } from '../../constants';
import { formatCurrency, getCategoryColor, getCategoryEmoji, getErrorMessage } from '../../utils/helpers';
import apiService from '../../services/ApiService';
import LoadingSpinner from '../../components/LoadingSpinner';
import CustomButton from '../../components/CustomButton';

type ProductListScreenNavigationProp = StackNavigationProp<ProductStackParamList, 'ProductList'>;

interface Props {
  navigation: ProductListScreenNavigationProp;
}

const ProductListScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, selectedCategory]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [productsData, categoriesData] = await Promise.all([
        apiService.getProducts(),
        apiService.getCategories(),
      ]);

      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error: any) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const filterProducts = () => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        product => product.ticket_category.toLowerCase() === selectedCategory.toLowerCase()
      );
      setFilteredProducts(filtered);
    }
  };

  const handleCategoryPress = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', { product });
  };

  const renderCategoryFilter = () => {
    const allCategories = [
      { name: 'all', display_name: 'All Categories', icon: '📱' },
      ...categories,
    ];

    return (
      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={allCategories}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterButton,
                { backgroundColor: colors.surface },
                selectedCategory === item.name && { backgroundColor: colors.primary }
              ]}
              onPress={() => handleCategoryPress(item.name)}
            >
              <Text style={styles.categoryEmoji}>
                {item.icon || getCategoryEmoji(item.name)}
              </Text>
              <Text style={[
                styles.filterButtonText,
                { color: colors.text },
                selectedCategory === item.name && { color: colors.background }
              ]}>
                {item.display_name || item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={[styles.productCard, { 
        backgroundColor: colors.surface,
        borderColor: colors.border 
      }]}
      onPress={() => handleProductPress(item)}
    >
      <View style={styles.productHeader}>
        <View
          style={[
            styles.categoryBadge,
            { backgroundColor: getCategoryColor(item.ticket_category) }
          ]}
        >
          <Text style={[styles.categoryBadgeText, { color: colors.background }]}>
            {getCategoryEmoji(item.ticket_category)} {item.ticket_category}
          </Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={[styles.price, { color: colors.primary }]}>
            {formatCurrency(item.price)}
          </Text>
        </View>
      </View>

      <Text style={[styles.productName, { color: colors.text }]}>{item.name}</Text>
      <Text style={[styles.productDescription, { color: colors.textSecondary }]} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.productFooter}>
        <Text style={[styles.ticketInfo, { color: colors.textSecondary }]}>
          {item.ticket_count} tickets available
        </Text>
        <View
          style={[
            styles.stockBadge,
            { backgroundColor: item.in_stock ? colors.success : colors.error }
          ]}
        >
          <Text style={[styles.stockBadgeText, { color: colors.background }]}>
            {item.in_stock ? 'In Stock' : 'Out of Stock'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
          <CustomButton
            title="Try Again"
            onPress={loadData}
            style={styles.retryButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {renderCategoryFilter()}
      
      {filteredProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No products found in this category
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
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
  filterContainer: {
    paddingVertical: SIZES.paddingMedium,
    paddingHorizontal: SIZES.paddingLarge,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.paddingMedium,
    paddingVertical: SIZES.paddingSmall,
    borderRadius: SIZES.borderRadiusLarge,
    marginRight: SIZES.marginSmall,
    marginBottom: SIZES.marginSmall,
  },
  filterButtonText: {
    fontSize: SIZES.fontSmall,
    fontWeight: '500',
  },
  categoryEmoji: {
    fontSize: SIZES.fontSmall,
    marginRight: SIZES.marginSmall / 2,
  },
  listContainer: {
    padding: SIZES.paddingLarge,
  },
  productCard: {
    borderRadius: SIZES.borderRadiusLarge,
    padding: SIZES.paddingLarge,
    marginBottom: SIZES.marginMedium,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
  },
  productHeader: {
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
  categoryBadgeText: {
    fontSize: SIZES.fontSmall,
    fontWeight: '600',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: SIZES.fontLarge,
    fontWeight: 'bold',
  },
  productName: {
    fontSize: SIZES.fontLarge,
    fontWeight: '600',
    marginBottom: SIZES.marginSmall,
  },
  productDescription: {
    fontSize: SIZES.fontMedium,
    lineHeight: 20,
    marginBottom: SIZES.marginMedium,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketInfo: {
    fontSize: SIZES.fontSmall,
  },
  stockBadge: {
    paddingHorizontal: SIZES.paddingSmall,
    paddingVertical: 4,
    borderRadius: SIZES.borderRadiusSmall,
  },
  stockBadgeText: {
    fontSize: SIZES.fontSmall,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.paddingLarge,
  },
  errorText: {
    fontSize: SIZES.fontMedium,
    textAlign: 'center',
    marginBottom: SIZES.marginLarge,
  },
  retryButton: {
    marginTop: SIZES.marginMedium,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SIZES.paddingXLarge,
  },
  emptyText: {
    fontSize: SIZES.fontMedium,
    textAlign: 'center',
  },
});

export default ProductListScreen;
