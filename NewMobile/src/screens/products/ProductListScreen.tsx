import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { ProductStackParamList, Product, Category } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { SIZES, COLORS } from '../../constants';
import { formatCurrency, getCategoryColor, getCategoryEmoji, getErrorMessage } from '../../utils/helpers';
import { apiManager } from '../../services/ApiManager';
import LoadingSpinner from '../../components/LoadingSpinner';
import CustomButton from '../../components/CustomButton';

type ProductListScreenNavigationProp = StackNavigationProp<ProductStackParamList, 'ProductList'>;
type ProductListScreenRouteProp = RouteProp<ProductStackParamList, 'ProductList'>;

interface Props {
  navigation: ProductListScreenNavigationProp;
  route: ProductListScreenRouteProp;
}

const ProductListScreen: React.FC<Props> = ({ navigation, route }) => {
  const { colors, isDarkMode } = useTheme();
  const { t, isRTL } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get initial category from route params
  const initialCategoryId = route?.params?.categoryId;
  const initialCategoryName = route?.params?.categoryName;

  // Dynamic styles based on theme
  const dynamicStyles = StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.surface,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      color: colors.text,
    },
    headerSubtitle: {
      color: colors.textSecondary,
    },
    categoryButton: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    categoryButtonActive: {
      backgroundColor: colors.primary,
    },
    categoryButtonText: {
      color: colors.text,
    },
    categoryButtonTextActive: {
      color: colors.background,
    },
    productCard: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      shadowColor: isDarkMode ? colors.border : '#000',
    },
    productName: {
      color: colors.text,
    },
    productPrice: {
      color: colors.primary,
    },
    productDescription: {
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
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Set initial category if provided in route params
    if (initialCategoryId && categories.length > 0) {
      const category = categories.find(cat => cat.id === initialCategoryId);
      if (category) {
        setSelectedCategory(category.name);
      }
    }
  }, [categories, initialCategoryId]);

  useEffect(() => {
    filterProducts();
  }, [products, selectedCategory]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [productsData, categoriesData] = await Promise.all([
        apiManager.getProducts(),
        apiManager.getCategories(),
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
      // Filter by ticket_category (primary method for prize-based categories)
      const filtered = products.filter(product => 
        product.ticket_category?.toLowerCase() === selectedCategory.toLowerCase()
      );
      setFilteredProducts(filtered);
    }
  };

  const handleCategoryPress = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', { productId: product.id });
  };

  const renderCategoryFilter = () => {
    const allCategories = [
      { name: 'all', display_name: t('categories'), icon: '📱' },
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
                dynamicStyles.categoryButton,
                selectedCategory === item.name && [styles.filterButtonActive, dynamicStyles.categoryButtonActive]
              ]}
              onPress={() => handleCategoryPress(item.name)}
            >
              <Text style={styles.categoryEmoji}>
                {item.icon || getCategoryEmoji(item.name)}
              </Text>
              <Text style={[
                styles.filterButtonText,
                dynamicStyles.categoryButtonText,
                selectedCategory === item.name && dynamicStyles.categoryButtonTextActive
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
      style={[styles.productCard, dynamicStyles.productCard]}
      onPress={() => handleProductPress(item)}
    >
      {/* Product Image */}
      {item.image_url && (
        <View style={styles.productImageContainer}>
          <Image
            source={{ uri: item.image_url }}
            style={styles.productImage}
            resizeMode="cover"
          />
        </View>
      )}

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
          <Text style={[styles.price, dynamicStyles.productPrice]}>
            {formatCurrency(item.price)}
          </Text>
        </View>
      </View>

      <Text style={[styles.productName, dynamicStyles.productName]}>{item.name}</Text>
      <Text style={[styles.productDescription, dynamicStyles.productDescription]} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.productFooter}>
        <Text style={[styles.ticketInfo, dynamicStyles.productDescription]}>
          {item.ticket_count} {t('tickets')} {t('available')}
        </Text>
        <View
          style={[
            styles.stockBadge,
            { backgroundColor: item.in_stock ? colors.success : colors.error }
          ]}
        >
          <Text style={[styles.stockBadgeText, { color: colors.background }]}>
            {item.in_stock ? t('inStock') : t('outOfStock')}
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
  filterButtonActive: {
    // Active state handled by dynamic styles
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
  productImageContainer: {
    width: '100%',
    height: 180,
    marginBottom: SIZES.marginMedium,
    borderRadius: SIZES.borderRadiusMedium,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
  },
  productImage: {
    width: '100%',
    height: '100%',
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
