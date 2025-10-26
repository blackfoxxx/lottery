import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ProductStackParamList, Product } from '../../types';
import { COLORS, SIZES } from '../../constants';
import { formatCurrency, getCategoryColor, getCategoryEmoji, getErrorMessage } from '../../utils/helpers';
import { useAuth } from '../../services/AuthContext';
import { apiManager } from '../../services/ApiManager';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';

type CheckoutScreenNavigationProp = StackNavigationProp<ProductStackParamList, 'Checkout'>;
type CheckoutScreenRouteProp = RouteProp<ProductStackParamList, 'Checkout'>;

interface Props {
  navigation: CheckoutScreenNavigationProp;
  route: CheckoutScreenRouteProp;
}

const CheckoutScreen: React.FC<Props> = ({ navigation, route }) => {
  const { product } = route.params;
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'bank'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');

  const handlePurchase = async () => {
    try {
      setProcessing(true);
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Call purchase API
      await apiManager.purchaseProduct(product.id);
      
      Alert.alert(
        '🎉 Purchase Successful!',
        `Congratulations! You have successfully purchased ${product.name}.\n\n${product.ticket_count} lottery ticket${product.ticket_count !== 1 ? 's' : ''} have been generated for you in the ${product.ticket_category} category.\n\nGood luck in the draw! 🍀`,
        [
          {
            text: 'View My Tickets',
            onPress: () => {
              // Navigate to tickets tab
              navigation.reset({
                index: 0,
                routes: [{ name: 'ProductList' }],
              });
            },
          },
          {
            text: 'Continue Shopping',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      Alert.alert('Payment Failed', errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  const renderPaymentMethod = (
    method: 'card' | 'paypal' | 'bank',
    icon: keyof typeof Ionicons.glyphMap,
    title: string,
    subtitle: string
  ) => (
    <TouchableOpacity
      style={[
        styles.paymentMethod,
        paymentMethod === method && styles.paymentMethodSelected
      ]}
      onPress={() => setPaymentMethod(method)}
    >
      <View style={styles.paymentMethodLeft}>
        <Ionicons 
          name={icon} 
          size={24} 
          color={paymentMethod === method ? COLORS.primary : COLORS.textSecondary} 
        />
        <View style={styles.paymentMethodText}>
          <Text style={[
            styles.paymentMethodTitle,
            paymentMethod === method && { color: COLORS.primary }
          ]}>
            {title}
          </Text>
          <Text style={styles.paymentMethodSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <View style={[
        styles.radioButton,
        paymentMethod === method && styles.radioButtonSelected
      ]}>
        {paymentMethod === method && (
          <View style={styles.radioButtonInner} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Product Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📦 Order Summary</Text>
          <View style={styles.productSummary}>
            <View style={styles.productHeader}>
              <View style={[
                styles.categoryBadge,
                { backgroundColor: getCategoryColor(product.ticket_category) }
              ]}>
                <Text style={styles.categoryText}>
                  {getCategoryEmoji(product.ticket_category)} {product.ticket_category.toUpperCase()}
                </Text>
              </View>
            </View>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productDescription} numberOfLines={2}>
              {product.description}
            </Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Product Price:</Text>
              <Text style={styles.priceValue}>{formatCurrency(product.price)}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.ticketLabel}>Lottery Tickets:</Text>
              <Text style={styles.ticketValue}>
                {product.ticket_count} ticket{product.ticket_count !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💳 Payment Method</Text>
          <View style={styles.paymentMethods}>
            {renderPaymentMethod(
              'card',
              'card-outline',
              'Credit/Debit Card',
              'Visa, Mastercard, American Express'
            )}
            {renderPaymentMethod(
              'paypal',
              'logo-paypal',
              'PayPal',
              'Pay with your PayPal account'
            )}
            {renderPaymentMethod(
              'bank',
              'business-outline',
              'Bank Transfer',
              'Direct bank transfer'
            )}
          </View>
        </View>

        {/* Payment Details */}
        {paymentMethod === 'card' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💳 Card Details</Text>
            <View style={styles.cardForm}>
              <CustomInput
                label="Cardholder Name"
                value={cardholderName}
                onChangeText={setCardholderName}
                placeholder="John Doe"
                leftIcon="person-outline"
              />
              <CustomInput
                label="Card Number"
                value={cardNumber}
                onChangeText={setCardNumber}
                placeholder="1234 5678 9012 3456"
                keyboardType="numeric"
                leftIcon="card-outline"
              />
              <View style={styles.cardRow}>
                <View style={styles.cardRowItem}>
                  <CustomInput
                    label="Expiry Date"
                    value={expiryDate}
                    onChangeText={setExpiryDate}
                    placeholder="MM/YY"
                    keyboardType="numeric"
                    leftIcon="calendar-outline"
                  />
                </View>
                <View style={styles.cardRowItem}>
                  <CustomInput
                    label="CVV"
                    value={cvv}
                    onChangeText={setCvv}
                    placeholder="123"
                    keyboardType="numeric"
                    leftIcon="shield-checkmark-outline"
                    isPassword
                  />
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Total */}
        <View style={styles.section}>
          <View style={styles.totalContainer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal:</Text>
              <Text style={styles.totalValue}>{formatCurrency(product.price)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Processing Fee:</Text>
              <Text style={styles.totalValue}>Free</Text>
            </View>
            <View style={[styles.totalRow, styles.totalRowFinal]}>
              <Text style={styles.totalLabelFinal}>Total:</Text>
              <Text style={styles.totalValueFinal}>{formatCurrency(product.price)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Purchase Button */}
      <View style={styles.footer}>
        <CustomButton
          title={processing ? 'Processing Payment...' : `Pay ${formatCurrency(product.price)}`}
          onPress={handlePurchase}
          loading={processing}
          style={styles.purchaseButton}
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
  section: {
    marginBottom: SIZES.marginXLarge,
  },
  sectionTitle: {
    fontSize: SIZES.fontLarge,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.marginMedium,
  },
  productSummary: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.borderRadiusLarge,
    padding: SIZES.paddingLarge,
  },
  productHeader: {
    marginBottom: SIZES.marginMedium,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SIZES.paddingMedium,
    paddingVertical: SIZES.paddingSmall,
    borderRadius: SIZES.borderRadiusMedium,
  },
  categoryText: {
    fontSize: SIZES.fontSmall,
    color: COLORS.background,
    fontWeight: '600',
  },
  productName: {
    fontSize: SIZES.fontLarge,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.marginSmall,
  },
  productDescription: {
    fontSize: SIZES.fontMedium,
    color: COLORS.textSecondary,
    marginBottom: SIZES.marginMedium,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.marginSmall,
  },
  priceLabel: {
    fontSize: SIZES.fontMedium,
    color: COLORS.textSecondary,
  },
  priceValue: {
    fontSize: SIZES.fontMedium,
    fontWeight: '600',
    color: COLORS.primary,
  },
  ticketLabel: {
    fontSize: SIZES.fontMedium,
    color: COLORS.textSecondary,
  },
  ticketValue: {
    fontSize: SIZES.fontMedium,
    fontWeight: '600',
    color: COLORS.text,
  },
  paymentMethods: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.borderRadiusLarge,
    overflow: 'hidden',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SIZES.paddingLarge,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  paymentMethodSelected: {
    backgroundColor: COLORS.background,
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentMethodText: {
    marginLeft: SIZES.marginMedium,
    flex: 1,
  },
  paymentMethodTitle: {
    fontSize: SIZES.fontMedium,
    fontWeight: '500',
    color: COLORS.text,
  },
  paymentMethodSubtitle: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: COLORS.primary,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  cardForm: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.borderRadiusLarge,
    padding: SIZES.paddingLarge,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardRowItem: {
    flex: 1,
    marginHorizontal: SIZES.marginSmall / 2,
  },
  totalContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.borderRadiusLarge,
    padding: SIZES.paddingLarge,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.marginSmall,
  },
  totalRowFinal: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SIZES.paddingMedium,
    marginTop: SIZES.marginMedium,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: SIZES.fontMedium,
    color: COLORS.textSecondary,
  },
  totalValue: {
    fontSize: SIZES.fontMedium,
    color: COLORS.text,
  },
  totalLabelFinal: {
    fontSize: SIZES.fontLarge,
    fontWeight: '600',
    color: COLORS.text,
  },
  totalValueFinal: {
    fontSize: SIZES.fontLarge,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  footer: {
    padding: SIZES.paddingLarge,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  purchaseButton: {
    marginTop: 0,
  },
});

export default CheckoutScreen;
