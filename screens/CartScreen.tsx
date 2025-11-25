import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CartItem {
  id: number;
  product_id: number;
  name: string;
  name_ar: string;
  price: number;
  quantity: number;
  image: string;
  lottery_tickets: number;
  stock_quantity: number;
}

interface CartScreenProps {
  navigation: any;
}

const CartScreen: React.FC<CartScreenProps> = ({ navigation }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');

  const isRTL = language === 'ar';

  const texts = {
    ar: {
      cart: 'سلة التسوق',
      emptyCart: 'السلة فارغة',
      emptyCartDesc: 'لم تقم بإضافة أي منتجات بعد',
      continueShopping: 'متابعة التسوق',
      subtotal: 'المجموع الفرعي',
      totalTickets: 'إجمالي التذاكر',
      checkout: 'إتمام الطلب',
      remove: 'حذف',
      quantity: 'الكمية',
      sar: 'ر.س',
      tickets: 'تذكرة',
      confirmRemove: 'تأكيد الحذف',
      confirmRemoveMessage: 'هل تريد حذف هذا المنتج من السلة؟',
      cancel: 'إلغاء',
      yes: 'نعم',
    },
    en: {
      cart: 'Shopping Cart',
      emptyCart: 'Cart is Empty',
      emptyCartDesc: 'You haven\'t added any products yet',
      continueShopping: 'Continue Shopping',
      subtotal: 'Subtotal',
      totalTickets: 'Total Tickets',
      checkout: 'Checkout',
      remove: 'Remove',
      quantity: 'Quantity',
      sar: 'SAR',
      tickets: 'tickets',
      confirmRemove: 'Confirm Remove',
      confirmRemoveMessage: 'Do you want to remove this product from cart?',
      cancel: 'Cancel',
      yes: 'Yes',
    },
  };

  const t = texts[language];

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const cartData = await AsyncStorage.getItem('cart');
      if (cartData) {
        setCartItems(JSON.parse(cartData));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const saveCart = async (items: CartItem[]) => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(items));
      setCartItems(items);
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const updateQuantity = (itemId: number, delta: number) => {
    const updatedItems = cartItems.map(item => {
      if (item.id === itemId) {
        const newQuantity = Math.max(1, Math.min(item.stock_quantity, item.quantity + delta));
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    saveCart(updatedItems);
  };

  const removeItem = (itemId: number, itemName: string) => {
    Alert.alert(
      t.confirmRemove,
      t.confirmRemoveMessage,
      [
        { text: t.cancel, style: 'cancel' },
        {
          text: t.yes,
          style: 'destructive',
          onPress: () => {
            const updatedItems = cartItems.filter(item => item.id !== itemId);
            saveCart(updatedItems);
          },
        },
      ]
    );
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateTotalTickets = () => {
    return cartItems.reduce((sum, item) => sum + (item.lottery_tickets * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert(t.emptyCart, t.emptyCartDesc);
      return;
    }
    
    // TODO: Navigate to checkout screen
    Alert.alert('Checkout', 'Checkout functionality will be implemented soon!');
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <Image 
        source={{ uri: item.image }}
        style={styles.itemImage}
        resizeMode="cover"
      />
      
      <View style={styles.itemDetails}>
        <Text style={[styles.itemName, isRTL && styles.rtlText]} numberOfLines={2}>
          {isRTL ? item.name_ar : item.name}
        </Text>
        
        <Text style={styles.itemPrice}>
          {item.price} {t.sar}
        </Text>
        
        {item.lottery_tickets > 0 && (
          <View style={styles.ticketsRow}>
            <Ionicons name="ticket" size={14} color="#e74c3c" />
            <Text style={styles.ticketsText}>
              {item.lottery_tickets} {t.tickets}
            </Text>
          </View>
        )}
        
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, -1)}
            disabled={item.quantity <= 1}
          >
            <Ionicons name="remove" size={18} color={item.quantity <= 1 ? '#666' : '#fff'} />
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{item.quantity}</Text>
          
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, 1)}
            disabled={item.quantity >= item.stock_quantity}
          >
            <Ionicons name="add" size={18} color={item.quantity >= item.stock_quantity ? '#666' : '#fff'} />
          </TouchableOpacity>
        </View>
      </View>
      
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeItem(item.id, item.name)}
      >
        <Ionicons name="trash-outline" size={22} color="#e74c3c" />
      </TouchableOpacity>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="cart-outline" size={100} color="#666" />
      <Text style={[styles.emptyTitle, isRTL && styles.rtlText]}>{t.emptyCart}</Text>
      <Text style={[styles.emptyDescription, isRTL && styles.rtlText]}>
        {t.emptyCartDesc}
      </Text>
      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => navigation.navigate('Products')}
      >
        <Text style={styles.continueButtonText}>{t.continueShopping}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, isRTL && styles.rtlText]}>{t.cart}</Text>
        <TouchableOpacity onPress={() => setLanguage(language === 'ar' ? 'en' : 'ar')}>
          <Ionicons name="language" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Cart Items */}
      {cartItems.length > 0 ? (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
          />
          
          {/* Summary */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, isRTL && styles.rtlText]}>{t.subtotal}</Text>
              <Text style={styles.summaryValue}>
                {calculateSubtotal().toFixed(2)} {t.sar}
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, isRTL && styles.rtlText]}>{t.totalTickets}</Text>
              <View style={styles.ticketsValue}>
                <Ionicons name="ticket" size={16} color="#e74c3c" />
                <Text style={styles.summaryValue}> {calculateTotalTickets()}</Text>
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutButtonText}>{t.checkout}</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        renderEmpty()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#16213e',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  listContainer: {
    padding: 15,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  ticketsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ticketsText: {
    fontSize: 12,
    color: '#bbb',
    marginLeft: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginHorizontal: 15,
    minWidth: 30,
    textAlign: 'center',
  },
  removeButton: {
    padding: 8,
    justifyContent: 'center',
  },
  summaryContainer: {
    backgroundColor: '#16213e',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#bbb',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  ticketsValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkoutButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 12,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#bbb',
    textAlign: 'center',
    marginBottom: 30,
  },
  continueButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 12,
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // RTL Styles
  rtlText: {
    textAlign: 'right',
  },
});

export default CartScreen;
