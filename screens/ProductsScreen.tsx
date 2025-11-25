import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Alert,
  I18nManager,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { productsAPI, categoriesAPI, Product, Category } from '../services/api';
import SocialProofBadge from '../components/SocialProofBadge';

interface ProductsScreenProps {
  navigation: any;
}

const ProductsScreen: React.FC<ProductsScreenProps> = ({ navigation }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');

  const isRTL = language === 'ar';

  const texts = {
    ar: {
      products: 'المنتجات',
      search: 'البحث عن المنتجات...',
      allCategories: 'جميع الفئات',
      noProducts: 'لا توجد منتجات',
      noProductsDesc: 'لم يتم العثور على منتجات في هذه الفئة',
      loadingMore: 'جاري تحميل المزيد...',
      error: 'خطأ',
      networkError: 'خطأ في الشبكة. يرجى المحاولة مرة أخرى.',
      addToCart: 'أضف للسلة',
      outOfStock: 'نفد المخزون',
      tickets: 'تذكرة',
      rating: 'التقييم',
      reviews: 'مراجعة',
      sar: 'ر.س',
      discount: 'خصم',
    },
    en: {
      products: 'Products',
      search: 'Search products...',
      allCategories: 'All Categories',
      noProducts: 'No Products',
      noProductsDesc: 'No products found in this category',
      loadingMore: 'Loading more...',
      error: 'Error',
      networkError: 'Network error. Please try again.',
      addToCart: 'Add to Cart',
      outOfStock: 'Out of Stock',
      tickets: 'tickets',
      rating: 'Rating',
      reviews: 'reviews',
      sar: 'SAR',
      discount: 'OFF',
    },
  };

  const t = texts[language];

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadProducts(true);
  }, [selectedCategory, searchQuery]);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      await Promise.all([
        loadCategories(),
        loadProducts(true),
      ]);
    } catch (error) {
      console.error('Error loading initial data:', error);
      Alert.alert(t.error, t.networkError);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await categoriesAPI.getCategories();
      if (response.success && response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadProducts = async (reset: boolean = false) => {
    try {
      if (reset) {
        setCurrentPage(1);
        setHasMorePages(true);
      }

      const page = reset ? 1 : currentPage;
      
      const params = {
        page,
        per_page: 10,
        ...(selectedCategory && { category_id: selectedCategory }),
        ...(searchQuery && { search: searchQuery }),
        in_stock: true,
      };

      const response = await productsAPI.getProducts(params);
      
      if (response.success && response.data) {
        const newProducts = response.data.data;
        
        if (reset) {
          setProducts(newProducts);
        } else {
          setProducts(prev => [...prev, ...newProducts]);
        }
        
        setHasMorePages(response.data.current_page < response.data.last_page);
        setCurrentPage(response.data.current_page + 1);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      if (reset) {
        Alert.alert(t.error, t.networkError);
      }
    }
  };

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadProducts(true);
    setIsRefreshing(false);
  }, [selectedCategory, searchQuery]);

  const loadMoreProducts = () => {
    if (hasMorePages && !isLoading) {
      loadProducts(false);
    }
  };

  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
  };

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', { productId: product.id });
  };

  const handleAddToCart = (product: Product) => {
    // TODO: Implement add to cart functionality
    Alert.alert('Success', `${product.name} added to cart!`);
  };

  const renderProduct = ({ item }: { item: Product }) => {
    const discountPercentage = item.original_price 
      ? Math.round(((item.original_price - item.price) / item.original_price) * 100)
      : 0;

    return (
      <TouchableOpacity 
        style={styles.productCard}
        onPress={() => handleProductPress(item)}
      >
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: item.images[0] || 'https://via.placeholder.com/200' }}
            style={styles.productImage}
            resizeMode="cover"
          />
          {discountPercentage > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>
                {discountPercentage}% {t.discount}
              </Text>
            </View>
          )}
          {item.lottery_tickets > 0 && (
            <View style={styles.lotteryBadge}>
              <Ionicons name="ticket" size={12} color="#fff" />
              <Text style={styles.lotteryText}>{item.lottery_tickets}</Text>
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={[styles.productName, isRTL && styles.rtlText]} numberOfLines={2}>
            {isRTL ? item.name_ar : item.name}
          </Text>
          
          {/* Social Proof Badge */}
          <SocialProofBadge productId={item.id} compact />
          
          {/* Rating */}
          <View style={[styles.ratingContainer, isRTL && styles.rtlRow]}>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name={star <= item.rating ? "star" : "star-outline"}
                  size={12}
                  color="#ffd700"
                />
              ))}
            </View>
            <Text style={styles.reviewsText}>
              ({item.reviews_count} {t.reviews})
            </Text>
          </View>

          {/* Price */}
          <View style={[styles.priceContainer, isRTL && styles.rtlRow]}>
            <Text style={styles.currentPrice}>
              {item.price} {t.sar}
            </Text>
            {item.original_price && item.original_price > item.price && (
              <Text style={styles.originalPrice}>
                {item.original_price} {t.sar}
              </Text>
            )}
          </View>

          {/* Add to Cart Button */}
          <TouchableOpacity
            style={[
              styles.addToCartButton,
              item.stock_quantity === 0 && styles.outOfStockButton
            ]}
            onPress={() => handleAddToCart(item)}
            disabled={item.stock_quantity === 0}
          >
            <Ionicons 
              name={item.stock_quantity === 0 ? "close-circle" : "cart"} 
              size={16} 
              color="#fff" 
            />
            <Text style={styles.addToCartText}>
              {item.stock_quantity === 0 ? t.outOfStock : t.addToCart}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        selectedCategory === item.id && styles.selectedCategoryChip
      ]}
      onPress={() => handleCategorySelect(item.id)}
    >
      <Text style={[
        styles.categoryText,
        selectedCategory === item.id && styles.selectedCategoryText,
        isRTL && styles.rtlText
      ]}>
        {isRTL ? item.name_ar : item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!hasMorePages) return null;
    
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#e74c3c" />
        <Text style={styles.loadingText}>{t.loadingMore}</Text>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="bag-outline" size={80} color="#666" />
      <Text style={[styles.emptyTitle, isRTL && styles.rtlText]}>{t.noProducts}</Text>
      <Text style={[styles.emptyDescription, isRTL && styles.rtlText]}>
        {t.noProductsDesc}
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e74c3c" />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, isRTL && styles.rtlText]}>{t.products}</Text>
        <TouchableOpacity onPress={() => setLanguage(language === 'ar' ? 'en' : 'ar')}>
          <Ionicons name="language" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, isRTL && styles.rtlSearchBar]}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, isRTL && styles.rtlSearchInput]}
            placeholder={t.search}
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            textAlign={isRTL ? 'right' : 'left'}
          />
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[{ id: null, name: t.allCategories, name_ar: t.allCategories }, ...categories]}
          renderItem={renderCategory}
          keyExtractor={(item) => `category-${item.id || 'all'}`}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Products List */}
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => `product-${item.id}`}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.productsList}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={['#e74c3c']}
            tintColor="#e74c3c"
          />
        }
        onEndReached={loadMoreProducts}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 45,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  categoriesContainer: {
    marginBottom: 15,
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  categoryChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  selectedCategoryChip: {
    backgroundColor: '#e74c3c',
  },
  categoryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  productsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  productCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    marginBottom: 15,
    width: '48%',
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 150,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#e74c3c',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  lotteryBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#f39c12',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  lotteryText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    lineHeight: 18,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 5,
  },
  reviewsText: {
    color: '#999',
    fontSize: 11,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  currentPrice: {
    color: '#e74c3c',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  originalPrice: {
    color: '#999',
    fontSize: 12,
    textDecorationLine: 'line-through',
  },
  addToCartButton: {
    backgroundColor: '#e74c3c',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 6,
  },
  outOfStockButton: {
    backgroundColor: '#666',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  footerLoader: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  emptyDescription: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
  },
  // RTL Styles
  rtlText: {
    textAlign: 'right',
  },
  rtlRow: {
    flexDirection: 'row-reverse',
  },
  rtlSearchBar: {
    flexDirection: 'row-reverse',
  },
  rtlSearchInput: {
    textAlign: 'right',
  },
});

export default ProductsScreen;
