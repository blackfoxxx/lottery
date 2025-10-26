import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { ProductStackParamList, Product } from '../../types';
import { COLORS, SIZES } from '../../constants';
import { formatCurrency, getCategoryColor, getCategoryEmoji, formatDateTime, getErrorMessage } from '../../utils/helpers';
import { apiManager } from '../../services/ApiManager';
import LoadingSpinner from '../../components/LoadingSpinner';
import CustomButton from '../../components/CustomButton';

type ProductDetailScreenNavigationProp = StackNavigationProp<ProductStackParamList, 'ProductDetail'>;
type ProductDetailScreenRouteProp = RouteProp<ProductStackParamList, 'ProductDetail'>;

interface Props {
  navigation: ProductDetailScreenNavigationProp;
  route: ProductDetailScreenRouteProp;
}

const ProductDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const productData = await apiManager.getProduct(productId);
      setProduct(productData);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      Alert.alert('Error', errorMessage);
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!product) return;

    Alert.alert(
      'Purchase Product',
      `Are you sure you want to purchase ${product.name} for ${formatCurrency(product.price)}?\n\nThis will generate ${product.ticket_count} lottery ticket${product.ticket_count !== 1 ? 's' : ''} for you.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Purchase',
          onPress: async () => {
            try {
              setPurchasing(true);
              
              // Call backend purchase endpoint (creates order and generates tickets)
              const result = await apiManager.purchaseProduct(product.id, 1);
              
              console.log('✅ Purchase completed:', {
                order_id: result?.order?.id,
                tickets_generated: result?.tickets_count,
                batch_id: result?.batch_info?.batch_id
              });
              
              // Extract data from backend response
              const ticketsGenerated = result?.tickets_count || product.ticket_count;
              const orderTotal = result?.order?.total_price || product.price;
              const batchId = result?.batch_info?.batch_id;
              
              Alert.alert(
                '🎉 Purchase Successful!',
                `You have successfully purchased ${product.name}!\n\n✓ Order #${result?.order?.id} created\n✓ ${ticketsGenerated} lottery ticket${ticketsGenerated !== 1 ? 's' : ''} generated\n✓ Batch ID: ${batchId || 'N/A'}\n✓ Entered into ${product.ticket_category} category draw\n\nYour tickets are now available in the Tickets tab.`,
                [
                  {
                    text: 'View Tickets',
                    onPress: () => {
                      // Navigate to Tickets tab (assuming it's in main tab navigator)
                      navigation.navigate('ProductList');
                    },
                  },
                  {
                    text: 'OK',
                    style: 'default',
                    onPress: () => navigation.goBack(),
                  },
                ]
              );
            } catch (error: any) {
              console.error('❌ Purchase failed:', error);
              const errorMessage = getErrorMessage(error);
              
              // Show more helpful error message based on error type
              let helpText = '';
              if (errorMessage.includes('login') || errorMessage.includes('logged in')) {
                helpText = '\n\n💡 Tip: Make sure you are logged in with a valid account.';
              } else if (errorMessage.includes('out of stock')) {
                helpText = '\n\n💡 Tip: This product is currently unavailable. Please try another product.';
              } else if (errorMessage.includes('Invalid')) {
                helpText = '\n\n💡 Tip: Please refresh the page and try again.';
              }
              
              Alert.alert(
                '❌ Purchase Failed', 
                errorMessage + helpText,
                [{ text: 'OK', style: 'default' }]
              );
            } finally {
              setPurchasing(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return <LoadingSpinner text="Loading product details..." />;
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Product not found</Text>
          <CustomButton
            title="Go Back"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Product Image */}
        {product.image_url && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: product.image_url }}
              style={styles.productImage}
              resizeMode="cover"
            />
          </View>
        )}

        {/* Product Header */}
        <View style={styles.header}>
          <View style={[
            styles.categoryBadge,
            { backgroundColor: getCategoryColor(product.ticket_category) }
          ]}>
            <Text style={styles.categoryBadgeText}>
              {getCategoryEmoji(product.ticket_category)} {product.ticket_category?.toUpperCase() || 'GENERAL'}
            </Text>
          </View>
          
          <View style={[
            styles.stockBadge,
            { backgroundColor: product.in_stock ? COLORS.success : COLORS.error }
          ]}>
            <Text style={styles.stockBadgeText}>
              {product.in_stock ? 'In Stock' : 'Out of Stock'}
            </Text>
          </View>
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>{formatCurrency(product.price)}</Text>
          <Text style={styles.productDescription}>{product.description}</Text>
        </View>

        {/* Lottery Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎫 Lottery Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Tickets Generated:</Text>
              <Text style={styles.infoValue}>{product.ticket_count}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Category:</Text>
              <Text style={styles.infoValue}>{product.ticket_category || 'General'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Added:</Text>
              <Text style={styles.infoValue}>{formatDateTime(product.created_at)}</Text>
            </View>
            {product.updated_at !== product.created_at && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Updated:</Text>
                <Text style={styles.infoValue}>{formatDateTime(product.updated_at)}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Purchase Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 How it Works</Text>
          <View style={styles.infoCard}>
            <Text style={styles.howItWorksText}>
              • Purchase this product to automatically receive {product.ticket_count} lottery ticket{product.ticket_count !== 1 ? 's' : ''}
            </Text>
            <Text style={styles.howItWorksText}>
              • Your tickets will be entered into the {product.ticket_category || 'general'} category lottery
            </Text>
            <Text style={styles.howItWorksText}>
              • Check the Tickets tab to view your lottery tickets
            </Text>
            <Text style={styles.howItWorksText}>
              • Winners are drawn regularly - good luck! 🍀
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Purchase Button */}
      <View style={styles.footer}>
        <CustomButton
          title={purchasing ? 'Processing...' : `Purchase for ${formatCurrency(product.price)}`}
          onPress={handlePurchase}
          loading={purchasing}
          disabled={!product.in_stock || purchasing}
          style={{
            ...styles.purchaseButton,
            ...(!product.in_stock && styles.purchaseButtonDisabled)
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SIZES.paddingLarge,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    marginBottom: SIZES.marginLarge,
    borderRadius: SIZES.borderRadiusLarge,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.marginLarge,
  },
  categoryBadge: {
    paddingHorizontal: SIZES.paddingMedium,
    paddingVertical: SIZES.paddingSmall,
    borderRadius: SIZES.borderRadiusMedium,
  },
  categoryBadgeText: {
    fontSize: SIZES.fontSmall,
    color: COLORS.background,
    fontWeight: '600',
  },
  stockBadge: {
    paddingHorizontal: SIZES.paddingMedium,
    paddingVertical: SIZES.paddingSmall,
    borderRadius: SIZES.borderRadiusMedium,
  },
  stockBadgeText: {
    fontSize: SIZES.fontSmall,
    color: COLORS.background,
    fontWeight: '600',
  },
  productInfo: {
    marginBottom: SIZES.marginXLarge,
  },
  productName: {
    fontSize: SIZES.fontXXLarge,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.marginMedium,
  },
  productPrice: {
    fontSize: SIZES.fontXLarge,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SIZES.marginMedium,
  },
  productDescription: {
    fontSize: SIZES.fontMedium,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  section: {
    marginBottom: SIZES.marginXLarge,
  },
  sectionTitle: {
    fontSize: SIZES.fontLarge,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.marginMedium,
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    padding: SIZES.paddingLarge,
    borderRadius: SIZES.borderRadiusLarge,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.marginMedium,
  },
  infoLabel: {
    fontSize: SIZES.fontMedium,
    color: COLORS.textSecondary,
  },
  infoValue: {
    fontSize: SIZES.fontMedium,
    color: COLORS.text,
    fontWeight: '500',
  },
  howItWorksText: {
    fontSize: SIZES.fontMedium,
    color: COLORS.textSecondary,
    marginBottom: SIZES.marginSmall,
    lineHeight: 20,
  },
  footer: {
    padding: SIZES.paddingLarge,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  purchaseButton: {
    marginTop: 0,
  },
  purchaseButtonDisabled: {
    opacity: 0.6,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.paddingLarge,
  },
  errorText: {
    fontSize: SIZES.fontMedium,
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: SIZES.marginLarge,
  },
  backButton: {
    marginTop: SIZES.marginMedium,
  },
});

export default ProductDetailScreen;
