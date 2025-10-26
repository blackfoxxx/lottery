import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { SIZES } from '../../constants';
import CustomButton from '../../components/CustomButton';
import LoadingSpinner from '../../components/LoadingSpinner';
import { ErrorHandler } from '../../services/ErrorHandler';

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'mobile';
  name: string;
  details: string;
  lastFour?: string;
  expiryDate?: string;
  isDefault: boolean;
  icon: keyof typeof Ionicons.glyphMap;
}

const PaymentMethodsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { t, isRTL } = useLanguage();
  
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      setLoading(true);
      // Mock payment methods - in a real app, this would come from the API
      const mockMethods: PaymentMethod[] = [
        {
          id: '1',
          type: 'card',
          name: 'Visa Card',
          details: 'Visa ending in 4242',
          lastFour: '4242',
          expiryDate: '12/26',
          isDefault: true,
          icon: 'card-outline',
        },
        {
          id: '2',
          type: 'bank',
          name: 'Bank Transfer',
          details: 'Iraq Development Bank',
          isDefault: false,
          icon: 'business-outline',
        },
        {
          id: '3',
          type: 'mobile',
          name: 'Mobile Wallet',
          details: 'Zain Cash',
          isDefault: false,
          icon: 'phone-portrait-outline',
        },
      ];
      setPaymentMethods(mockMethods);
    } catch (error) {
      ErrorHandler.handleError(error, true);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPaymentMethod = () => {
    Alert.alert(
      'Add Payment Method',
      'Choose a payment method type:',
      [
        { text: 'Credit/Debit Card', onPress: () => addCard() },
        { text: 'Bank Transfer', onPress: () => addBank() },
        { text: 'Mobile Wallet', onPress: () => addMobile() },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const addCard = () => {
    Alert.alert('Coming Soon', 'Credit card management will be available soon!');
  };

  const addBank = () => {
    Alert.alert('Coming Soon', 'Bank transfer setup will be available soon!');
  };

  const addMobile = () => {
    Alert.alert('Coming Soon', 'Mobile wallet integration will be available soon!');
  };

  const handleSetDefault = (methodId: string) => {
    setPaymentMethods(prev =>
      prev.map(method => ({
        ...method,
        isDefault: method.id === methodId,
      }))
    );
    Alert.alert('Success', 'Default payment method updated!');
  };

  const handleDeleteMethod = (methodId: string) => {
    Alert.alert(
      'Delete Payment Method',
      'Are you sure you want to delete this payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setPaymentMethods(prev => prev.filter(method => method.id !== methodId));
            Alert.alert('Success', 'Payment method deleted!');
          },
        },
      ]
    );
  };

  const renderPaymentMethod = ({ item }: { item: PaymentMethod }) => (
    <View style={[styles.paymentMethodCard, dynamicStyles.paymentMethodCard]}>
      <View style={styles.methodHeader}>
        <View style={styles.methodInfo}>
          <View style={[styles.iconContainer, dynamicStyles.iconContainer]}>
            <Ionicons name={item.icon} size={24} color={colors.primary} />
          </View>
          <View style={styles.methodDetails}>
            <Text style={[styles.methodName, dynamicStyles.methodName]}>
              {item.name}
            </Text>
            <Text style={[styles.methodSubtitle, dynamicStyles.methodSubtitle]}>
              {item.details}
            </Text>
            {item.expiryDate && (
              <Text style={[styles.expiryDate, dynamicStyles.methodSubtitle]}>
                Expires {item.expiryDate}
              </Text>
            )}
          </View>
        </View>
        
        {item.isDefault && (
          <View style={[styles.defaultBadge, dynamicStyles.defaultBadge]}>
            <Text style={[styles.defaultText, dynamicStyles.defaultText]}>
              Default
            </Text>
          </View>
        )}
      </View>

      <View style={styles.methodActions}>
        {!item.isDefault && (
          <TouchableOpacity
            style={[styles.actionButton, dynamicStyles.setDefaultButton]}
            onPress={() => handleSetDefault(item.id)}
          >
            <Text style={[styles.setDefaultText, dynamicStyles.setDefaultText]}>
              Set as Default
            </Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[styles.actionButton, dynamicStyles.deleteButton]}
          onPress={() => handleDeleteMethod(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color={colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

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
    content: {
      backgroundColor: colors.background,
    },
    emptyContainer: {
      backgroundColor: colors.surface,
    },
    emptyText: {
      color: colors.textSecondary,
    },
    paymentMethodCard: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    iconContainer: {
      backgroundColor: colors.primary + '20',
    },
    methodName: {
      color: colors.text,
    },
    methodSubtitle: {
      color: colors.textSecondary,
    },
    defaultBadge: {
      backgroundColor: colors.success,
    },
    defaultText: {
      color: colors.background,
    },
    setDefaultButton: {
      backgroundColor: colors.primary + '20',
    },
    setDefaultText: {
      color: colors.primary,
    },
    deleteButton: {
      backgroundColor: colors.error + '20',
    },
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={[styles.container, dynamicStyles.container]}>
      {/* Header */}
      <View style={[styles.header, dynamicStyles.header]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons 
            name={isRTL ? "chevron-forward" : "chevron-back"} 
            size={28} 
            color={colors.text} 
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, dynamicStyles.headerTitle]}>
          Payment Methods
        </Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddPaymentMethod}
        >
          <Ionicons name="add" size={28} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={[styles.content, dynamicStyles.content]}>
        {paymentMethods.length === 0 ? (
          <View style={[styles.emptyContainer, dynamicStyles.emptyContainer]}>
            <Ionicons name="card-outline" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyText, dynamicStyles.emptyText]}>
              No payment methods added yet
            </Text>
            <Text style={[styles.emptySubtext, dynamicStyles.emptyText]}>
              Add a payment method to start purchasing lottery tickets
            </Text>
            <CustomButton
              title="Add Payment Method"
              onPress={handleAddPaymentMethod}
              style={styles.addFirstButton}
            />
          </View>
        ) : (
          <FlatList
            data={paymentMethods}
            renderItem={renderPaymentMethod}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.paddingLarge,
    paddingVertical: SIZES.paddingMedium,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: SIZES.fontLarge,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  addButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  content: {
    flex: 1,
  },
  listContent: {
    padding: SIZES.paddingLarge,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: SIZES.marginLarge,
    padding: SIZES.paddingXLarge,
    borderRadius: SIZES.borderRadiusLarge,
  },
  emptyText: {
    fontSize: SIZES.fontLarge,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: SIZES.marginLarge,
  },
  emptySubtext: {
    fontSize: SIZES.fontMedium,
    textAlign: 'center',
    marginTop: SIZES.marginSmall,
    marginBottom: SIZES.marginXLarge,
  },
  addFirstButton: {
    marginHorizontal: 0,
    paddingHorizontal: SIZES.paddingXLarge,
  },
  paymentMethodCard: {
    borderRadius: SIZES.borderRadiusLarge,
    padding: SIZES.paddingLarge,
    marginBottom: SIZES.marginMedium,
    borderWidth: 1,
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SIZES.marginMedium,
  },
  methodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.marginMedium,
  },
  methodDetails: {
    flex: 1,
  },
  methodName: {
    fontSize: SIZES.fontMedium,
    fontWeight: '600',
    marginBottom: 2,
  },
  methodSubtitle: {
    fontSize: SIZES.fontSmall,
    marginBottom: 2,
  },
  expiryDate: {
    fontSize: SIZES.fontSmall,
  },
  defaultBadge: {
    paddingHorizontal: SIZES.paddingSmall,
    paddingVertical: 4,
    borderRadius: SIZES.borderRadiusSmall,
  },
  defaultText: {
    fontSize: SIZES.fontSmall,
    fontWeight: '600',
  },
  methodActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionButton: {
    paddingHorizontal: SIZES.paddingMedium,
    paddingVertical: SIZES.paddingSmall,
    borderRadius: SIZES.borderRadiusMedium,
    marginRight: SIZES.marginSmall,
  },
  setDefaultText: {
    fontSize: SIZES.fontSmall,
    fontWeight: '500',
  },
});

export default PaymentMethodsScreen;