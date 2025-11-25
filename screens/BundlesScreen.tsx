import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface BundleProduct {
  id: number;
  name: string;
  price: number;
  image_url: string;
}

interface Bundle {
  id: number;
  name: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  is_active: boolean;
  products: BundleProduct[];
  total_price: number;
  discounted_price: number;
  savings: number;
}

export default function BundlesScreen() {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBundles();
  }, []);

  const loadBundles = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/v1/bundles');
      if (response.ok) {
        const data = await response.json();
        setBundles(data);
      }
    } catch (error) {
      console.error('Failed to load bundles:', error);
      Alert.alert('Error', 'Failed to load product bundles');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBundleToCart = async (bundle: Bundle) => {
    try {
      // Get existing cart
      const cartJson = await AsyncStorage.getItem('cart');
      const cart = cartJson ? JSON.parse(cartJson) : [];

      // Add all products in the bundle to cart
      bundle.products.forEach((product) => {
        const existingItem = cart.find((item: any) => item.product.id === product.id);
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          cart.push({
            product: {
              id: product.id,
              name: product.name,
              price: product.price,
              images: [product.image_url],
              description: '',
              stock_quantity: 100,
              lottery_tickets: 0,
            },
            quantity: 1,
          });
        }
      });

      await AsyncStorage.setItem('cart', JSON.stringify(cart));
      Alert.alert(
        'Success',
        `Added ${bundle.name} to cart with ${
          bundle.discount_type === 'percentage'
            ? bundle.discount_value + '%'
            : '$' + bundle.discount_value
        } discount!`
      );
    } catch (error) {
      console.error('Failed to add bundle to cart:', error);
      Alert.alert('Error', 'Failed to add bundle to cart');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E74C3C" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="cube" size={48} color="#E74C3C" />
        <Text style={styles.title}>Product Bundles</Text>
        <Text style={styles.subtitle}>Save more when you buy products together</Text>
      </View>

      {bundles.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cube-outline" size={64} color="#666" />
          <Text style={styles.emptyText}>No bundles available at the moment</Text>
        </View>
      ) : (
        <View style={styles.bundlesContainer}>
          {bundles.map((bundle) => (
            <View key={bundle.id} style={styles.bundleCard}>
              <View style={styles.bundleHeader}>
                <Text style={styles.bundleName}>{bundle.name}</Text>
                <View style={styles.savingsBadge}>
                  <Ionicons name="pricetag" size={12} color="#FFF" />
                  <Text style={styles.savingsBadgeText}>
                    Save{' '}
                    {bundle.discount_type === 'percentage'
                      ? `${bundle.discount_value}%`
                      : `$${bundle.discount_value}`}
                  </Text>
                </View>
              </View>

              <Text style={styles.bundleDescription}>{bundle.description}</Text>

              <Text style={styles.includesTitle}>Includes:</Text>
              <View style={styles.productsGrid}>
                {bundle.products.map((product) => (
                  <View key={product.id} style={styles.productItem}>
                    <Image source={{ uri: product.image_url }} style={styles.productImage} />
                    <View style={styles.productInfo}>
                      <Text style={styles.productName} numberOfLines={1}>
                        {product.name}
                      </Text>
                      <Text style={styles.productPrice}>${product.price}</Text>
                    </View>
                  </View>
                ))}
              </View>

              <View style={styles.pricingContainer}>
                <View style={styles.pricingRow}>
                  <Text style={styles.pricingLabel}>Regular Price:</Text>
                  <Text style={styles.regularPrice}>${bundle.total_price.toFixed(2)}</Text>
                </View>
                <View style={styles.pricingRow}>
                  <Text style={styles.pricingLabel}>You Save:</Text>
                  <Text style={styles.savingsAmount}>${bundle.savings.toFixed(2)}</Text>
                </View>
                <View style={styles.pricingRow}>
                  <Text style={styles.totalLabel}>Bundle Price:</Text>
                  <Text style={styles.totalPrice}>${bundle.discounted_price.toFixed(2)}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleAddBundleToCart(bundle)}
              >
                <Ionicons name="cart" size={20} color="#FFF" />
                <Text style={styles.addButtonText}>Add Bundle to Cart</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Why Buy Bundles?</Text>
        {[
          {
            step: '1',
            title: 'Save Money',
            description: 'Get automatic discounts when you buy products together',
          },
          {
            step: '2',
            title: 'Curated Collections',
            description: 'Products that work great together, handpicked by our team',
          },
          {
            step: '3',
            title: 'One-Click Shopping',
            description: 'Add multiple products to your cart with a single click',
          },
        ].map((item) => (
          <View key={item.step} style={styles.infoItem}>
            <View style={styles.stepCircle}>
              <Text style={styles.stepNumber}>{item.step}</Text>
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoItemTitle}>{item.title}</Text>
              <Text style={styles.infoItemDescription}>{item.description}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 14,
    color: '#AAA',
    textAlign: 'center',
    marginTop: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 48,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  bundlesContainer: {
    padding: 16,
    gap: 16,
  },
  bundleCard: {
    backgroundColor: '#16213E',
    borderRadius: 12,
    padding: 16,
  },
  bundleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bundleName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    flex: 1,
  },
  savingsBadge: {
    flexDirection: 'row',
    backgroundColor: '#10B981',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    alignItems: 'center',
  },
  savingsBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  bundleDescription: {
    fontSize: 14,
    color: '#AAA',
    marginBottom: 16,
  },
  includesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 8,
  },
  productsGrid: {
    gap: 8,
    marginBottom: 16,
  },
  productItem: {
    flexDirection: 'row',
    backgroundColor: '#1A1A2E',
    borderRadius: 8,
    padding: 8,
    gap: 8,
  },
  productImage: {
    width: 48,
    height: 48,
    borderRadius: 6,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFF',
  },
  productPrice: {
    fontSize: 11,
    color: '#AAA',
    marginTop: 2,
  },
  pricingContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
    gap: 8,
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pricingLabel: {
    fontSize: 14,
    color: '#AAA',
  },
  regularPrice: {
    fontSize: 14,
    color: '#AAA',
    textDecorationLine: 'line-through',
  },
  savingsAmount: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E74C3C',
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#E74C3C',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 8,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: '#16213E',
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumber: {
    color: '#E74C3C',
    fontWeight: 'bold',
    fontSize: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 4,
  },
  infoItemDescription: {
    fontSize: 12,
    color: '#AAA',
    lineHeight: 18,
  },
});
