import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function LotteryPurchaseScreen({ navigation }: any) {
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [showSuccess, setShowSuccess] = useState(false);
  const ticketPrice = 10;

  const handlePurchase = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      navigation.goBack();
    }, 3000);
  };

  const total = quantity * ticketPrice;

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#1e3a8a', '#3b82f6']}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Buy Lottery Tickets</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      {/* Lottery Info */}
      <View style={styles.lotteryInfo}>
        <View style={styles.lotteryHeader}>
          <Ionicons name="trophy" size={40} color="#fbbf24" />
          <View style={styles.lotteryDetails}>
            <Text style={styles.lotteryName}>Golden Draw</Text>
            <Text style={styles.lotteryPrize}>$10,000 Grand Prize</Text>
          </View>
        </View>
        <View style={styles.drawDate}>
          <Ionicons name="calendar" size={16} color="#64748b" />
          <Text style={styles.drawDateText}>Draw: Feb 1, 2025</Text>
        </View>
      </View>

      {/* Quantity Selector */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Number of Tickets</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Ionicons name="remove" size={24} color="#3b82f6" />
          </TouchableOpacity>
          <TextInput
            style={styles.quantityInput}
            value={quantity.toString()}
            onChangeText={(text) => setQuantity(Math.max(1, parseInt(text) || 1))}
            keyboardType="numeric"
          />
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => setQuantity(quantity + 1)}
          >
            <Ionicons name="add" size={24} color="#3b82f6" />
          </TouchableOpacity>
        </View>
        <View style={styles.quickSelect}>
          {[5, 10, 20, 50].map((num) => (
            <TouchableOpacity
              key={num}
              style={[styles.quickButton, quantity === num && styles.quickButtonActive]}
              onPress={() => setQuantity(num)}
            >
              <Text style={[styles.quickButtonText, quantity === num && styles.quickButtonTextActive]}>
                {num}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Price Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Price Breakdown</Text>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Price per ticket</Text>
          <Text style={styles.priceValue}>${ticketPrice.toFixed(2)}</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Quantity</Text>
          <Text style={styles.priceValue}>{quantity}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.priceRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
        </View>
      </View>

      {/* Payment Method */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <TouchableOpacity
          style={[styles.paymentOption, paymentMethod === 'card' && styles.paymentOptionActive]}
          onPress={() => setPaymentMethod('card')}
        >
          <Ionicons name="card" size={24} color={paymentMethod === 'card' ? '#3b82f6' : '#64748b'} />
          <Text style={[styles.paymentText, paymentMethod === 'card' && styles.paymentTextActive]}>
            Credit/Debit Card
          </Text>
          {paymentMethod === 'card' && <Ionicons name="checkmark-circle" size={24} color="#3b82f6" />}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.paymentOption, paymentMethod === 'paypal' && styles.paymentOptionActive]}
          onPress={() => setPaymentMethod('paypal')}
        >
          <Ionicons name="logo-paypal" size={24} color={paymentMethod === 'paypal' ? '#3b82f6' : '#64748b'} />
          <Text style={[styles.paymentText, paymentMethod === 'paypal' && styles.paymentTextActive]}>
            PayPal
          </Text>
          {paymentMethod === 'paypal' && <Ionicons name="checkmark-circle" size={24} color="#3b82f6" />}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.paymentOption, paymentMethod === 'wallet' && styles.paymentOptionActive]}
          onPress={() => setPaymentMethod('wallet')}
        >
          <Ionicons name="wallet" size={24} color={paymentMethod === 'wallet' ? '#3b82f6' : '#64748b'} />
          <Text style={[styles.paymentText, paymentMethod === 'wallet' && styles.paymentTextActive]}>
            Wallet Balance
          </Text>
          {paymentMethod === 'wallet' && <Ionicons name="checkmark-circle" size={24} color="#3b82f6" />}
        </TouchableOpacity>
      </View>

      {/* Purchase Button */}
      <TouchableOpacity style={styles.purchaseButton} onPress={handlePurchase}>
        <Text style={styles.purchaseButtonText}>Complete Purchase</Text>
        <Ionicons name="arrow-forward" size={20} color="#fff" />
      </TouchableOpacity>

      {/* Success Modal */}
      <Modal
        visible={showSuccess}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successModal}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark-circle" size={80} color="#10b981" />
            </View>
            <Text style={styles.successTitle}>Purchase Successful!</Text>
            <Text style={styles.successMessage}>
              You've purchased {quantity} lottery {quantity === 1 ? 'ticket' : 'tickets'}
            </Text>
            <Text style={styles.successSubtext}>
              Your tickets: #{Math.floor(Math.random() * 10000)} - #{Math.floor(Math.random() * 10000) + quantity - 1}
            </Text>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  lotteryInfo: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
  },
  lotteryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  lotteryDetails: {
    marginLeft: 16,
  },
  lotteryName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  lotteryPrize: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  drawDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  drawDateText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 8,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  quantityButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityInput: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginHorizontal: 32,
    minWidth: 60,
  },
  quickSelect: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
  },
  quickButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  quickButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  quickButtonTextActive: {
    color: '#fff',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  priceValue: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    marginBottom: 12,
  },
  paymentOptionActive: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  paymentText: {
    flex: 1,
    fontSize: 16,
    color: '#64748b',
    marginLeft: 12,
  },
  paymentTextActive: {
    color: '#1e293b',
    fontWeight: '600',
  },
  purchaseButton: {
    backgroundColor: '#3b82f6',
    marginHorizontal: 16,
    marginBottom: 32,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  purchaseButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successModal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    width: '80%',
  },
  successIcon: {
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 8,
  },
  successSubtext: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
});
