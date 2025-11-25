import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Address, AddressType } from '../types/address';

interface AddressContextType {
  addresses: Address[];
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  removeAddress: (id: string) => void;
  getAddressById: (id: string) => Address | undefined;
  getDefaultAddress: (type?: AddressType) => Address | undefined;
  setDefaultAddress: (id: string) => void;
  getAddressesByType: (type: AddressType) => Address[];
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export const AddressProvider = ({ children }: { children: ReactNode }) => {
  const [addresses, setAddresses] = useState<Address[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedAddresses = localStorage.getItem('addresses');
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
      localStorage.setItem('addresses', JSON.stringify(sampleAddresses));
    }
  }, []);

  // Save to localStorage whenever addresses change
  useEffect(() => {
    if (addresses.length > 0) {
      localStorage.setItem('addresses', JSON.stringify(addresses));
    }
  }, [addresses]);

  const addAddress = (address: Omit<Address, 'id'>) => {
    const newAddress: Address = {
      ...address,
      id: Date.now().toString(),
    };

    // If this is the first address or marked as default, make it default
    if (addresses.length === 0 || newAddress.isDefault) {
      // Remove default from other addresses of the same type
      setAddresses(prev => [
        ...prev.map(addr => {
          if (addr.type === newAddress.type || newAddress.type === 'both' || addr.type === 'both') {
            return { ...addr, isDefault: false };
          }
          return addr;
        }),
        newAddress,
      ]);
    } else {
      setAddresses(prev => [...prev, newAddress]);
    }
  };

  const updateAddress = (id: string, updates: Partial<Address>) => {
    setAddresses(prev => prev.map(addr => {
      if (addr.id === id) {
        const updated = { ...addr, ...updates };
        
        // If setting as default, remove default from others
        if (updates.isDefault) {
          return updated;
        }
        return updated;
      }
      
      // If updating address to default, remove default from others
      if (updates.isDefault && addr.id !== id) {
        const targetType = prev.find(a => a.id === id)?.type;
        if (targetType && (addr.type === targetType || targetType === 'both' || addr.type === 'both')) {
          return { ...addr, isDefault: false };
        }
      }
      
      return addr;
    }));
  };

  const removeAddress = (id: string) => {
    const addressToRemove = addresses.find(addr => addr.id === id);
    setAddresses(prev => prev.filter(addr => addr.id !== id));
    
    // If removed address was default, set another one as default
    if (addressToRemove?.isDefault) {
      const remainingOfSameType = addresses.filter(
        addr => addr.id !== id && (addr.type === addressToRemove.type || addr.type === 'both' || addressToRemove.type === 'both')
      );
      if (remainingOfSameType.length > 0) {
        updateAddress(remainingOfSameType[0].id, { isDefault: true });
      }
    }
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

  const setDefaultAddress = (id: string) => {
    const address = addresses.find(addr => addr.id === id);
    if (!address) return;
    
    setAddresses(prev => prev.map(addr => {
      if (addr.id === id) {
        return { ...addr, isDefault: true };
      }
      
      // Remove default from others of the same type
      if (addr.type === address.type || address.type === 'both' || addr.type === 'both') {
        return { ...addr, isDefault: false };
      }
      
      return addr;
    }));
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
