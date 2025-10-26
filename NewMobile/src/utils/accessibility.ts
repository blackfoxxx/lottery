import { AccessibilityInfo } from 'react-native';

export interface AccessibilityUtils {
  // Screen reader announcements
  announceForAccessibility: (message: string) => void;
  
  // Check if screen reader is enabled
  isScreenReaderEnabled: () => Promise<boolean>;
  
  // Generate accessible labels
  generateAccessibleLabel: (item: any, type: 'product' | 'ticket' | 'category') => string;
  
  // Add accessibility props to components
  addAccessibilityProps: (element: any, options: AccessibilityOptions) => any;
}

export interface AccessibilityOptions {
  role?: 'button' | 'text' | 'image' | 'header' | 'link' | 'none';
  label?: string;
  hint?: string;
  value?: string;
  states?: string[];
}

// Announce message to screen readers
export const announceForAccessibility = (message: string): void => {
  if (AccessibilityInfo && AccessibilityInfo.announceForAccessibility) {
    AccessibilityInfo.announceForAccessibility(message);
  }
};

// Check if screen reader is currently enabled
export const isScreenReaderEnabled = async (): Promise<boolean> => {
  try {
    return await AccessibilityInfo.isScreenReaderEnabled();
  } catch (error) {
    console.warn('Error checking screen reader status:', error);
    return false;
  }
};

// Generate accessible labels for different content types
export const generateAccessibleLabel = (
  item: any, 
  type: 'product' | 'ticket' | 'category'
): string => {
  switch (type) {
    case 'product':
      return `Product: ${item.name}. Price: ${item.price} Iraqi Dinar. Category: ${item.ticket_category}. ${item.in_stock ? 'In stock' : 'Out of stock'}.`;
    
    case 'ticket':
      return `Lottery ticket ${item.ticket_number}. ${item.is_winner ? 'Winner' : 'Not drawn yet'}. Created on ${new Date(item.created_at).toLocaleDateString()}.`;
    
    case 'category':
      return `Category: ${item.display_name}. ${item.description}. Ticket price: ${item.ticket_amount} Iraqi Dinar.`;
    
    default:
      return item.name || item.title || 'Interactive element';
  }
};

// Add comprehensive accessibility props to components
export const addAccessibilityProps = (
  baseProps: any,
  options: AccessibilityOptions
): any => {
  const accessibilityProps: any = { ...baseProps };

  if (options.role) {
    accessibilityProps.accessibilityRole = options.role;
  }

  if (options.label) {
    accessibilityProps.accessibilityLabel = options.label;
  }

  if (options.hint) {
    accessibilityProps.accessibilityHint = options.hint;
  }

  if (options.value) {
    accessibilityProps.accessibilityValue = { text: options.value };
  }

  if (options.states && options.states.length > 0) {
    accessibilityProps.accessibilityState = {};
    options.states.forEach(state => {
      accessibilityProps.accessibilityState[state] = true;
    });
  }

  // Ensure focusable elements are accessible
  if (options.role === 'button' || options.role === 'link') {
    accessibilityProps.accessible = true;
  }

  return accessibilityProps;
};

// Common accessibility configurations for the Iraqi lottery app
export const accessibilityConfigs = {
  // Products
  productCard: (product: any) => ({
    role: 'button' as const,
    label: generateAccessibleLabel(product, 'product'),
    hint: 'Double tap to view product details and purchase tickets',
  }),

  // Tickets
  ticketCard: (ticket: any) => ({
    role: 'button' as const,
    label: generateAccessibleLabel(ticket, 'ticket'),
    hint: 'Double tap to view ticket details',
  }),

  // Categories
  categoryItem: (category: any) => ({
    role: 'button' as const,
    label: generateAccessibleLabel(category, 'category'),
    hint: 'Double tap to browse products in this category',
  }),

  // Navigation
  navigationTab: (tabName: string, isSelected: boolean) => ({
    role: 'button' as const,
    label: `${tabName} tab`,
    hint: isSelected ? 'Currently selected' : 'Double tap to navigate',
    states: isSelected ? ['selected'] : [],
  }),

  // Forms
  textInput: (fieldName: string, isRequired: boolean = false) => ({
    role: 'none' as const,
    label: `${fieldName}${isRequired ? ', required' : ''}`,
    hint: 'Text input field',
  }),

  // Actions
  primaryButton: (action: string) => ({
    role: 'button' as const,
    label: action,
    hint: 'Double tap to perform action',
  }),

  // Status indicators
  statusIndicator: (status: string, description: string) => ({
    role: 'text' as const,
    label: `Status: ${status}. ${description}`,
  }),
};

// Helper function to format currency for screen readers
export const formatCurrencyForAccessibility = (amount: number): string => {
  return `${amount.toLocaleString()} Iraqi Dinar`;
};

// Helper function to format dates for screen readers
export const formatDateForAccessibility = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default {
  announceForAccessibility,
  isScreenReaderEnabled,
  generateAccessibleLabel,
  addAccessibilityProps,
  accessibilityConfigs,
  formatCurrencyForAccessibility,
  formatDateForAccessibility,
};
