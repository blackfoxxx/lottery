export type AddressType = 'shipping' | 'billing' | 'both';

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  type: AddressType;
  isDefault: boolean;
}

export const ADDRESS_TYPE_LABELS: Record<AddressType, string> = {
  shipping: 'Shipping Address',
  billing: 'Billing Address',
  both: 'Shipping & Billing',
};

export const formatAddress = (address: Address): string => {
  const parts = [
    address.addressLine1,
    address.addressLine2,
    address.city,
    address.state,
    address.zipCode,
    address.country,
  ].filter(Boolean);
  
  return parts.join(', ');
};

export const validateAddress = (address: Partial<Address>): string[] => {
  const errors: string[] = [];
  
  if (!address.fullName) errors.push('Full name is required');
  if (!address.phone) errors.push('Phone number is required');
  if (!address.addressLine1) errors.push('Address line 1 is required');
  if (!address.city) errors.push('City is required');
  if (!address.state) errors.push('State/Province is required');
  if (!address.zipCode) errors.push('ZIP/Postal code is required');
  if (!address.country) errors.push('Country is required');
  if (!address.type) errors.push('Address type is required');
  
  // Validate phone number format (basic validation)
  if (address.phone && !/^[\d\s\-\+\(\)]+$/.test(address.phone)) {
    errors.push('Invalid phone number format');
  }
  
  // Validate ZIP code format (basic validation)
  if (address.zipCode && !/^[\w\s\-]+$/.test(address.zipCode)) {
    errors.push('Invalid ZIP/Postal code format');
  }
  
  return errors;
};
