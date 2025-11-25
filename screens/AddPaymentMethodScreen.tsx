import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import {
  usePaymentMethods,
  detectCardBrand,
  formatCardNumber,
  validateCardNumber,
  validateExpiryDate,
  validateCVV,
  getCardBrandInfo,
} from '../contexts/PaymentMethodContext';

type TabType = 'card' | 'paypal';

export default function AddPaymentMethodScreen({ navigation }: any) {
  const { t } = useTranslation();
  const { addPaymentMethod } = usePaymentMethods();

  const [activeTab, setActiveTab] = useState<TabType>('card');

  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [showCvv, setShowCvv] = useState(false);

  // PayPal form state
  const [paypalEmail, setPaypalEmail] = useState('');

  const cardBrand = detectCardBrand(cardNumber);
  const brandInfo = getCardBrandInfo(cardBrand);

  const handleAddCard = async () => {
    // Validation
    if (!cardNumber || !cardholderName || !expiryMonth || !expiryYear || !cvv) {
      Alert.alert(t('common.error'), 'Please fill in all fields');
      return;
    }

    if (!validateCardNumber(cardNumber.replace(/\s/g, ''))) {
      Alert.alert(t('common.error'), 'Invalid card number');
      return;
    }

    if (!validateExpiryDate(expiryMonth, expiryYear)) {
      Alert.alert(t('common.error'), 'Invalid expiry date');
      return;
    }

    if (!validateCVV(cvv, cardBrand)) {
      Alert.alert(t('common.error'), `Invalid CVV (${cardBrand === 'amex' ? '4' : '3'} digits required)`);
      return;
    }

    const cleanedCardNumber = cardNumber.replace(/\s/g, '');
    await addPaymentMethod({
      type: 'credit_card',
      isDefault: false,
      cardBrand,
      cardLast4: cleanedCardNumber.slice(-4),
      cardholderName,
      expiryMonth,
      expiryYear,
    });

    Alert.alert(t('common.success'), 'Card added successfully', [
      {
        text: t('common.done'),
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  const handleAddPayPal = async () => {
    if (!paypalEmail) {
      Alert.alert(t('common.error'), 'Please enter your PayPal email');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paypalEmail)) {
      Alert.alert(t('common.error'), 'Invalid email address');
      return;
    }

    await addPaymentMethod({
      type: 'paypal',
      isDefault: false,
      paypalEmail,
    });

    Alert.alert(t('common.success'), 'PayPal account linked successfully', [
      {
        text: t('common.done'),
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  const renderCardForm = () => (
    <View style={styles.form}>
      {/* Card Number */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Card Number</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="1234 5678 9012 3456"
            placeholderTextColor="#666"
            value={cardNumber}
            onChangeText={(text) => {
              const formatted = formatCardNumber(text.replace(/\D/g, ''));
              if (formatted.replace(/\s/g, '').length <= 16) {
                setCardNumber(formatted);
              }
            }}
            keyboardType="number-pad"
            maxLength={19}
          />
          {cardNumber && (
            <View style={styles.cardBrandBadge}>
              <Ionicons name="card" size={20} color={brandInfo.color} />
              <Text style={[styles.cardBrandText, { color: brandInfo.color }]}>
                {brandInfo.name}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Cardholder Name */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Cardholder Name</Text>
        <TextInput
          style={[styles.input, styles.inputFull]}
          placeholder="John Doe"
          placeholderTextColor="#666"
          value={cardholderName}
          onChangeText={setCardholderName}
          autoCapitalize="words"
        />
      </View>

      {/* Expiry Date & CVV */}
      <View style={styles.row}>
        <View style={[styles.inputGroup, styles.flex1]}>
          <Text style={styles.label}>Expiry Month</Text>
          <TextInput
            style={[styles.input, styles.inputFull]}
            placeholder="MM"
            placeholderTextColor="#666"
            value={expiryMonth}
            onChangeText={(text) => {
              const value = text.replace(/\D/g, '');
              if (value.length <= 2 && (value === '' || parseInt(value) <= 12)) {
                setExpiryMonth(value);
              }
            }}
            keyboardType="number-pad"
            maxLength={2}
          />
        </View>

        <View style={[styles.inputGroup, styles.flex1]}>
          <Text style={styles.label}>Expiry Year</Text>
          <TextInput
            style={[styles.input, styles.inputFull]}
            placeholder="YYYY"
            placeholderTextColor="#666"
            value={expiryYear}
            onChangeText={(text) => {
              const value = text.replace(/\D/g, '');
              if (value.length <= 4) {
                setExpiryYear(value);
              }
            }}
            keyboardType="number-pad"
            maxLength={4}
          />
        </View>

        <View style={[styles.inputGroup, styles.flex1]}>
          <Text style={styles.label}>CVV</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, styles.inputFull]}
              placeholder={cardBrand === 'amex' ? '1234' : '123'}
              placeholderTextColor="#666"
              value={cvv}
              onChangeText={(text) => {
                const value = text.replace(/\D/g, '');
                const maxLength = cardBrand === 'amex' ? 4 : 3;
                if (value.length <= maxLength) {
                  setCvv(value);
                }
              }}
              keyboardType="number-pad"
              secureTextEntry={!showCvv}
              maxLength={cardBrand === 'amex' ? 4 : 3}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowCvv(!showCvv)}
            >
              <Ionicons
                name={showCvv ? 'eye-off' : 'eye'}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Security Notice */}
      <View style={styles.securityNotice}>
        <Ionicons name="shield-checkmark" size={16} color="#10b981" />
        <Text style={styles.securityText}>
          Your card information is encrypted and secure
        </Text>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleAddCard}>
        <Text style={styles.submitButtonText}>Add Card</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPayPalForm = () => (
    <View style={styles.form}>
      <View style={styles.paypalHeader}>
        <Ionicons name="logo-paypal" size={48} color="#0070ba" />
        <Text style={styles.paypalTitle}>Link PayPal Account</Text>
        <Text style={styles.paypalSubtitle}>
          Enter your PayPal email to link your account
        </Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>PayPal Email</Text>
        <TextInput
          style={[styles.input, styles.inputFull]}
          placeholder="your@email.com"
          placeholderTextColor="#666"
          value={paypalEmail}
          onChangeText={setPaypalEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <TouchableOpacity style={[styles.submitButton, styles.paypalButton]} onPress={handleAddPayPal}>
        <Text style={styles.submitButtonText}>Link PayPal Account</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Payment Method</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'card' && styles.activeTab]}
          onPress={() => setActiveTab('card')}
        >
          <Ionicons
            name="card"
            size={20}
            color={activeTab === 'card' ? '#3b82f6' : '#666'}
          />
          <Text style={[styles.tabText, activeTab === 'card' && styles.activeTabText]}>
            Credit/Debit Card
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'paypal' && styles.activeTab]}
          onPress={() => setActiveTab('paypal')}
        >
          <Ionicons
            name="logo-paypal"
            size={20}
            color={activeTab === 'paypal' ? '#0070ba' : '#666'}
          />
          <Text style={[styles.tabText, activeTab === 'paypal' && styles.activeTabText]}>
            PayPal
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'card' ? renderCardForm() : renderPayPalForm()}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    paddingBottom: 16,
    backgroundColor: '#2d2d2d',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#2d2d2d',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#3b82f6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    marginBottom: 8,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    fontSize: 16,
    color: '#fff',
    backgroundColor: '#2d2d2d',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  inputFull: {
    width: '100%',
  },
  cardBrandBadge: {
    position: 'absolute',
    right: 12,
    top: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardBrandText: {
    fontSize: 12,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#10b98110',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#10b98130',
    marginBottom: 20,
  },
  securityText: {
    flex: 1,
    fontSize: 12,
    color: '#10b981',
  },
  submitButton: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  paypalButton: {
    backgroundColor: '#0070ba',
  },
  paypalHeader: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  paypalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
  },
  paypalSubtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});
