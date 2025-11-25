import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Address, AddressType } from '../types/address';

interface AddressContextType {
  addresses: Address[];
  addAddress: (address: Omit<Address, 'id'>) => Promise<void>;
  updateAddress: (id: string, address: Partial<Address>) => Promise<void>;
  removeAddress: (id: string) => Promise<void>;
  getAddressById: (id: string) => Address | undefined;
  getDefaultAddress: (type?: AddressType) => Address | undefined;
  setDefaultAddress: (id: string) => Promise<void>;
  getAddressesByType: (type: AddressType) => Address[];
  isLoading: boolean;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export const AddressProvider = ({ children }: { children: ReactNode }) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from AsyncStorage on mount
  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const savedAddresses = await AsyncStorage.getItem('addresses');
      if (savedAddresses) {
        setAddresses(JSON.parse(savedAddresses));
      } else {
        // Initialize with sample data
        const sampleAddresses: Address[] = [
          {
            id: '1',
            fullName: 'John Doe',
            phone: '+964 770 123 4567',
            addressLine1: 'Al-Mansour Street, Building 15',
            addressLine2: 'Apartment 3A',
            city: 'Baghdad',
            state: 'Baghdad Governorate',
            zipCode: '10001',
            country: 'Iraq',
            type: 'both',
            isDefault: true,
          },
          {
            id: '2',
            fullName: 'John Doe',
            phone: '+964 770 123 4567',
            addressLine1: 'Erbil City Center',
            addressLine2: 'Office 201',
            city: 'Erbil',
            state: 'Erbil Governorate',
            zipCode: '44001',
            country: 'Iraq',
            type: 'billing',
            isDefault: false,
          },
        ];
        setAddresses(sampleAddresses);
        await AsyncStorage.setItem('addresses', JSON.stringify(sampleAddresses));
      }
    } catch (error) {
      console.error('Failed to load addresses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveAddresses = async (newAddresses: Address[]) => {
    try {
      await AsyncStorage.setItem('addresses', JSON.stringify(newAddresses));
    } catch (error) {
      console.error('Failed to save addresses:', error);
    }
  };

  const addAddress = async (address: Omit<Address, 'id'>) => {
    const newAddress: Address = {
      ...address,
      id: Date.now().toString(),
    };

    let updatedAddresses: Address[];

    // If this is the first address or marked as default, make it default
    if (addresses.length === 0 || newAddress.isDefault) {
      // Remove default from other addresses of the same type
      updatedAddresses = [
        ...addresses.map(addr => {
          if (addr.type === newAddress.type || newAddress.type === 'both' || addr.type === 'both') {
            return { ...addr, isDefault: false };
          }
          return addr;
        }),
        newAddress,
      ];
    } else {
      updatedAddresses = [...addresses, newAddress];
    }

    setAddresses(updatedAddresses);
    await saveAddresses(updatedAddresses);
  };

  const updateAddress = async (id: string, updates: Partial<Address>) => {
    const updatedAddresses = addresses.map(addr => {
      if (addr.id === id) {
        const updated = { ...addr, ...updates };
        return updated;
      }
      
      // If updating address to default, remove default from others
      if (updates.isDefault && addr.id !== id) {
        const targetType = addresses.find(a => a.id === id)?.type;
        if (targetType && (addr.type === targetType || targetType === 'both' || addr.type === 'both')) {
          return { ...addr, isDefault: false };
        }
      }
      
      return addr;
    });

    setAddresses(updatedAddresses);
    await saveAddresses(updatedAddresses);
  };

  const removeAddress = async (id: string) => {
    const addressToRemove = addresses.find(addr => addr.id === id);
    const updatedAddresses = addresses.filter(addr => addr.id !== id);
    
    // If removed address was default, set another one as default
    if (addressToRemove?.isDefault && updatedAddresses.length > 0) {
      const remainingOfSameType = updatedAddresses.filter(
        addr => addr.type === addressToRemove.type || addr.type === 'both' || addressToRemove.type === 'both'
      );
      if (remainingOfSameType.length > 0) {
        remainingOfSameType[0].isDefault = true;
      }
    }

    setAddresses(updatedAddresses);
    await saveAddresses(updatedAddresses);
  };

  const getAddressById = (id: string) => {
    return addresses.find(addr => addr.id === id);
  };

  const getDefaultAddress = (type?: AddressType) => {
    if (!type) {
      return addresses.find(addr => addr.isDefault);
    }
    
    return addresses.find(addr => 
      addr.isDefault && (addr.type === type || addr.type === 'both')
    );
  };

  const setDefaultAddress = async (id: string) => {
    const address = addresses.find(addr => addr.id === id);
    if (!address) return;
    
    const updatedAddresses = addresses.map(addr => {
      if (addr.id === id) {
        return { ...addr, isDefault: true };
      }
      
      // Remove default from others of the same type
      if (addr.type === address.type || address.type === 'both' || addr.type === 'both') {
        return { ...addr, isDefault: false };
      }
      
      return addr;
    });

    setAddresses(updatedAddresses);
    await saveAddresses(updatedAddresses);
  };

  const getAddressesByType = (type: AddressType) => {
    return addresses.filter(addr => addr.type === type || addr.type === 'both');
  };

  return (
    <AddressContext.Provider
      value={{
        addresses,
        addAddress,
        updateAddress,
        removeAddress,
        getAddressById,
        getDefaultAddress,
        setDefaultAddress,
        getAddressesByType,
        isLoading,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};

export const useAddresses = () => {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error('useAddresses must be used within AddressProvider');
  }
  return context;
};
