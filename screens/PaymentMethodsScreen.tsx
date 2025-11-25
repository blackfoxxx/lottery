import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { usePaymentMethods, PaymentMethod, getCardBrandInfo, maskCardNumber } from '../contexts/PaymentMethodContext';

export default function PaymentMethodsScreen({ navigation }: any) {
  const { t } = useTranslation();
  const {
    paymentMethods,
    walletBalance,
    removePaymentMethod,
    setDefaultPaymentMethod,
    topUpWallet,
    isLoading,
  } = usePaymentMethods();

  const [isTopUpVisible, setIsTopUpVisible] = useState(false);

  const handleRemove = (id: string, methodName: string) => {
    Alert.alert(
      'Remove Payment Method',
      `Are you sure you want to remove ${methodName}?`,
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await removePaymentMethod(id);
            Alert.alert(t('common.success'), 'Payment method removed');
          },
        },
      ]
    );
  };

  const handleSetDefault = async (id: string) => {
    await setDefaultPaymentMethod(id);
    Alert.alert(t('common.success'), 'Default payment method updated');
  };

  const handleTopUp = (amount: number) => {
    Alert.alert(
      'Top Up Wallet',
      `Add $${amount.toFixed(2)} to your wallet?`,
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.confirm'),
          onPress: async () => {
            await topUpWallet(amount);
            Alert.alert(t('common.success'), `Wallet topped up with $${amount.toFixed(2)}`);
          },
        },
      ]
    );
  };

  const renderPaymentMethod = (method: PaymentMethod) => {
    let icon: any = 'card';
    let title = '';
    let subtitle = '';
    let color = '#3b82f6';

    if (method.type === 'credit_card' || method.type === 'debit_card') {
      const brandInfo = getCardBrandInfo(method.cardBrand!);
      icon = 'card';
      title = brandInfo.name;
      subtitle = maskCardNumber(method.cardLast4!);
      color = brandInfo.color;
    } else if (method.type === 'paypal') {
      icon = 'logo-paypal';
      title = 'PayPal';
      subtitle = method.paypalEmail!;
      color = '#0070ba';
    } else if (method.type === 'wallet') {
      icon = 'wallet';
      title = 'Wallet';
      subtitle = `Balance: $${method.walletBalance?.toFixed(2)}`;
      color = '#10b981';
    }

    return (
      <View key={method.id} style={[styles.methodCard, method.isDefault && styles.defaultCard]}>
        <View style={styles.methodHeader}>
          <View style={styles.methodInfo}>
            <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
              <Ionicons name={icon} size={24} color={color} />
            </View>
            <View style={styles.methodDetails}>
              <Text style={styles.methodTitle}>{title}</Text>
              <Text style={styles.methodSubtitle}>{subtitle}</Text>
              {method.expiryMonth && method.expiryYear && (
                <Text style={styles.methodExpiry}>
                  Expires {method.expiryMonth}/{method.expiryYear}
                </Text>
              )}
            </View>
          </View>

          <TouchableOpacity
            onPress={() => handleRemove(method.id, title)}
            style={styles.removeButton}
          >
            <Ionicons name="trash-outline" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>

        <View style={styles.methodActions}>
          {method.isDefault ? (
            <View style={styles.defaultBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#10b981" />
              <Text style={styles.defaultText}>Default</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.setDefaultButton}
              onPress={() => handleSetDefault(method.id)}
            >
              <Text style={styles.setDefaultText}>Set as Default</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('AddPaymentMethod')}
          style={styles.addButton}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Wallet Balance */}
        <View style={styles.walletCard}>
          <View style={styles.walletHeader}>
            <View style={styles.walletInfo}>
              <Ionicons name="wallet" size={32} color="#fff" />
              <View style={styles.walletDetails}>
                <Text style={styles.walletLabel}>Wallet Balance</Text>
                <Text style={styles.walletBalance}>${walletBalance.toFixed(2)}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.topUpButton}
              onPress={() => setIsTopUpVisible(!isTopUpVisible)}
            >
              <Ionicons name="add-circle" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {isTopUpVisible && (
            <View style={styles.topUpOptions}>
              <Text style={styles.topUpTitle}>Quick Top Up</Text>
              <View style={styles.topUpGrid}>
                {[10, 25, 50, 100].map((amount) => (
                  <TouchableOpacity
                    key={amount}
                    style={styles.topUpOption}
                    onPress={() => handleTopUp(amount)}
                  >
                    <Text style={styles.topUpAmount}>${amount}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Saved Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Saved Payment Methods</Text>

          {paymentMethods.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="card-outline" size={64} color="#666" />
              <Text style={styles.emptyText}>No payment methods saved</Text>
              <Text style={styles.emptySubtext}>
                Add a payment method to make checkout faster
              </Text>
              <TouchableOpacity
                style={styles.addFirstButton}
                onPress={() => navigation.navigate('AddPaymentMethod')}
              >
                <Ionicons name="add" size={20} color="#fff" />
                <Text style={styles.addFirstButtonText}>Add Payment Method</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.methodsList}>
              {paymentMethods.map(renderPaymentMethod)}
            </View>
          )}
        </View>

        {/* Security Notice */}
        <View style={styles.securityNotice}>
          <Ionicons name="shield-checkmark" size={20} color="#10b981" />
          <Text style={styles.securityText}>
            Your payment information is encrypted and secure
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  addButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  walletCard: {
    margin: 16,
    padding: 20,
    backgroundColor: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  walletInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  walletDetails: {
    gap: 4,
  },
  walletLabel: {
    fontSize: 14,
    color: '#e0e7ff',
  },
  walletBalance: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  topUpButton: {
    padding: 8,
  },
  topUpOptions: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  topUpTitle: {
    fontSize: 14,
    color: '#e0e7ff',
    marginBottom: 12,
  },
  topUpGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  topUpOption: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  topUpAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  methodsList: {
    gap: 12,
  },
  methodCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  defaultCard: {
    borderColor: '#3b82f6',
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  methodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodDetails: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  methodSubtitle: {
    fontSize: 14,
    color: '#999',
  },
  methodExpiry: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  removeButton: {
    padding: 8,
  },
  methodActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  defaultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#10b98120',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  defaultText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
  },
  setDefaultButton: {
    backgroundColor: '#3b82f620',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  setDefaultText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  addFirstButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#3b82f6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24,
  },
  addFirstButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    margin: 16,
    backgroundColor: '#10b98110',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#10b98130',
  },
  securityText: {
    flex: 1,
    fontSize: 14,
    color: '#10b981',
  },
});
