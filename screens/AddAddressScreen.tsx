import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';
import { useAddresses } from '../contexts/AddressContext';
import { Address, AddressType, validateAddress } from '../types/address';

export default function AddAddressScreen({ navigation, route }: any) {
  const { t } = useTranslation();
  const { addAddress, updateAddress } = useAddresses();
  const editAddress = route.params?.editAddress as Address | undefined;
  const isEditing = !!editAddress;

  const [formData, setFormData] = useState({
    fullName: editAddress?.fullName || '',
    phone: editAddress?.phone || '',
    addressLine1: editAddress?.addressLine1 || '',
    addressLine2: editAddress?.addressLine2 || '',
    city: editAddress?.city || '',
    state: editAddress?.state || '',
    zipCode: editAddress?.zipCode || '',
    country: editAddress?.country || 'Iraq',
    type: (editAddress?.type || 'both') as AddressType,
    isDefault: editAddress?.isDefault || false,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const errors = validateAddress(formData);
    if (errors.length > 0) {
      Alert.alert('Validation Error', errors[0]);
      return;
    }

    try {
      if (isEditing && editAddress) {
        await updateAddress(editAddress.id, formData);
        Alert.alert('Success', 'Address updated successfully');
      } else {
        await addAddress(formData as Omit<Address, 'id'>);
        Alert.alert('Success', 'Address added successfully');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save address');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditing ? 'Edit Address' : 'Add New Address'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {/* Full Name */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.fullName}
              onChangeText={(value) => handleInputChange('fullName', value)}
              placeholder="John Doe"
              placeholderTextColor="#666"
            />
          </View>

          {/* Phone */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              placeholder="+964 770 123 4567"
              placeholderTextColor="#666"
              keyboardType="phone-pad"
            />
          </View>

          {/* Address Line 1 */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Address Line 1 *</Text>
            <TextInput
              style={styles.input}
              value={formData.addressLine1}
              onChangeText={(value) => handleInputChange('addressLine1', value)}
              placeholder="Street address, building number"
              placeholderTextColor="#666"
            />
          </View>

          {/* Address Line 2 */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Address Line 2</Text>
            <TextInput
              style={styles.input}
              value={formData.addressLine2}
              onChangeText={(value) => handleInputChange('addressLine2', value)}
              placeholder="Apartment, suite, unit, floor (optional)"
              placeholderTextColor="#666"
            />
          </View>

          {/* City and State */}
          <View style={styles.row}>
            <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>City *</Text>
              <TextInput
                style={styles.input}
                value={formData.city}
                onChangeText={(value) => handleInputChange('city', value)}
                placeholder="Baghdad"
                placeholderTextColor="#666"
              />
            </View>

            <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>State/Province *</Text>
              <TextInput
                style={styles.input}
                value={formData.state}
                onChangeText={(value) => handleInputChange('state', value)}
                placeholder="Baghdad Governorate"
                placeholderTextColor="#666"
              />
            </View>
          </View>

          {/* ZIP Code and Country */}
          <View style={styles.row}>
            <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>ZIP/Postal Code *</Text>
              <TextInput
                style={styles.input}
                value={formData.zipCode}
                onChangeText={(value) => handleInputChange('zipCode', value)}
                placeholder="10001"
                placeholderTextColor="#666"
              />
            </View>

            <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Country *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: '#1a1a1a' }]}
                value={formData.country}
                editable={false}
              />
            </View>
          </View>

          {/* Address Type */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Address Type *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.type}
                onValueChange={(value) => handleInputChange('type', value)}
                style={styles.picker}
                dropdownIconColor="#fff"
              >
                <Picker.Item label="Shipping Address" value="shipping" />
                <Picker.Item label="Billing Address" value="billing" />
                <Picker.Item label="Shipping & Billing" value="both" />
              </Picker>
            </View>
          </View>

          {/* Set as Default */}
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => handleInputChange('isDefault', !formData.isDefault)}
          >
            <View style={[styles.checkbox, formData.isDefault && styles.checkboxChecked]}>
              {formData.isDefault && <Ionicons name="checkmark" size={18} color="#fff" />}
            </View>
            <Text style={styles.checkboxLabel}>Set as default address</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>
            {isEditing ? 'Save Changes' : 'Add Address'}
          </Text>
        </TouchableOpacity>
      </View>
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
  content: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#2d2d2d',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#333',
  },
  row: {
    flexDirection: 'row',
  },
  pickerContainer: {
    backgroundColor: '#2d2d2d',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    overflow: 'hidden',
  },
  picker: {
    color: '#fff',
    backgroundColor: '#2d2d2d',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#666',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#fff',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#2d2d2d',
    borderTopWidth: 1,
    borderTopColor: '#333',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#333',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
