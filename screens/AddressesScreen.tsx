import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useAddresses } from '../contexts/AddressContext';
import { Address, ADDRESS_TYPE_LABELS, formatAddress } from '../types/address';

export default function AddressesScreen({ navigation }: any) {
  const { t } = useTranslation();
  const { addresses, removeAddress, setDefaultAddress } = useAddresses();

  const handleRemove = (address: Address) => {
    Alert.alert(
      'Remove Address',
      `Are you sure you want to remove this address?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeAddress(address.id),
        },
      ]
    );
  };

  const handleSetDefault = async (id: string) => {
    await setDefaultAddress(id);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Addresses</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('AddAddress')}
          style={styles.addButton}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {addresses.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="location-outline" size={64} color="#666" />
            <Text style={styles.emptyText}>No addresses saved</Text>
            <TouchableOpacity
              style={styles.addFirstButton}
              onPress={() => navigation.navigate('AddAddress')}
            >
              <Ionicons name="add" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.addFirstButtonText}>Add Your First Address</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.addressList}>
            {addresses.map((address) => (
              <View
                key={address.id}
                style={[
                  styles.addressCard,
                  address.isDefault && styles.addressCardDefault,
                ]}
              >
                <View style={styles.addressHeader}>
                  <View style={styles.addressHeaderLeft}>
                    <Text style={styles.addressName}>{address.fullName}</Text>
                    {address.isDefault && (
                      <View style={styles.defaultBadge}>
                        <Ionicons name="star" size={12} color="#fbbf24" />
                        <Text style={styles.defaultText}>Default</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.typeBadge}>
                    <Text style={styles.typeText}>
                      {ADDRESS_TYPE_LABELS[address.type]}
                    </Text>
                  </View>
                </View>

                <Text style={styles.addressPhone}>{address.phone}</Text>
                <Text style={styles.addressText}>{formatAddress(address)}</Text>

                <View style={styles.addressActions}>
                  {!address.isDefault && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleSetDefault(address.id)}
                    >
                      <Ionicons name="star-outline" size={18} color="#3b82f6" />
                      <Text style={styles.actionButtonText}>Set Default</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() =>
                      navigation.navigate('AddAddress', { editAddress: address })
                    }
                  >
                    <Ionicons name="create-outline" size={18} color="#3b82f6" />
                    <Text style={styles.actionButtonText}>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleRemove(address)}
                  >
                    <Ionicons name="trash-outline" size={18} color="#ef4444" />
                    <Text style={[styles.actionButtonText, { color: '#ef4444' }]}>
                      Remove
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
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
  addButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
    marginBottom: 24,
  },
  addFirstButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addFirstButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  addressList: {
    padding: 16,
  },
  addressCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  addressCardDefault: {
    borderColor: '#3b82f6',
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  addressHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  addressName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 8,
  },
  defaultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fbbf2420',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fbbf24',
    marginLeft: 4,
  },
  typeBadge: {
    backgroundColor: '#3b82f620',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3b82f6',
  },
  addressPhone: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#999',
    lineHeight: 20,
  },
  addressActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
    marginLeft: 6,
  },
});
