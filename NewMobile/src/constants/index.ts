// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://10.113.107.90:8000/api',
  TIMEOUT: 10000,
  ENABLE_PURCHASE_SIMULATION: false, // Disabled - using real backend flow
};

// API Endpoints
export const API_ENDPOINTS = {
  LOGIN: '/login',
  REGISTER: '/register',
  LOGOUT: '/logout',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products',
  CATEGORIES: '/categories',
  TICKETS: '/tickets',
  ORDERS: '/orders',
  USER: '/user',
  USER_STATS: '/user/stats',
  DRAWS: '/draws',
  HEALTH: '/health',
  NOTIFICATIONS: '/notifications',
  REGISTER_DEVICE: '/notifications/register-device',
  UNREGISTER_DEVICE: '/notifications/unregister-device',
};

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  LANGUAGE: 'app_language',
  THEME: 'app_theme',
  NOTIFICATIONS: 'app_notifications',
  PUSH_TOKEN: 'push_token',
  NOTIFICATION_SETTINGS: 'notification_settings',
};

// Colors
export const COLORS = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  background: '#FFFFFF',
  surface: '#F2F2F7',
  text: '#000000',
  textSecondary: '#8E8E93',
  border: '#C6C6C8',
  
  // Category Colors (matching backend)
  golden: '#fbbf24',
  silver: '#9ca3af',
  bronze: '#ea580c',
  platinum: '#e5e7eb',
  test_category: '#ff5722',
};

// Sizes
export const SIZES = {
  // Padding
  paddingSmall: 8,
  paddingMedium: 16,
  paddingLarge: 24,
  paddingXLarge: 32,
  
  // Margin
  marginSmall: 8,
  marginMedium: 16,
  marginLarge: 24,
  marginXLarge: 32,
  
  // Border Radius
  borderRadiusSmall: 4,
  borderRadiusMedium: 8,
  borderRadiusLarge: 12,
  borderRadiusXLarge: 16,
  
  // Font Sizes
  fontSmall: 12,
  fontMedium: 16,
  fontLarge: 20,
  fontXLarge: 24,
  fontXXLarge: 32,
};

// Messages
export const MESSAGES = {
  // English Messages
  LOADING: 'Loading...',
  ERROR_GENERIC: 'Something went wrong. Please try again.',
  ERROR_NETWORK: 'Network error. Please check your connection.',
  ERROR_UNAUTHORIZED: 'Please log in to continue.',
  SUCCESS_LOGIN: 'Login successful!',
  SUCCESS_REGISTER: 'Registration successful!',
  SUCCESS_LOGOUT: 'Logged out successfully.',
  
  // Arabic Messages (for future localization)
  LOADING_AR: 'جاري التحميل...',
  ERROR_GENERIC_AR: 'حدث خطأ ما. يرجى المحاولة مرة أخرى.',
  ERROR_NETWORK_AR: 'خطأ في الشبكة. يرجى التحقق من الاتصال.',
  ERROR_UNAUTHORIZED_AR: 'يرجى تسجيل الدخول للمتابعة.',
  SUCCESS_LOGIN_AR: 'تم تسجيل الدخول بنجاح!',
  SUCCESS_REGISTER_AR: 'تم التسجيل بنجاح!',
  SUCCESS_LOGOUT_AR: 'تم تسجيل الخروج بنجاح.',
};

// Screen Names
export const SCREEN_NAMES = {
  // Auth Stack
  LOGIN: 'Login',
  REGISTER: 'Register',
  
  // Main Tab
  HOME: 'Home',
  PRODUCTS: 'Products',
  TICKETS: 'Tickets',
  PROFILE: 'Profile',
  
  // Product Stack
  PRODUCT_LIST: 'ProductList',
  PRODUCT_DETAIL: 'ProductDetail',
};

// Component Test IDs (for testing)
export const TEST_IDS = {
  LOGIN_EMAIL_INPUT: 'login-email-input',
  LOGIN_PASSWORD_INPUT: 'login-password-input',
  LOGIN_BUTTON: 'login-button',
  REGISTER_BUTTON: 'register-button',
  PRODUCT_CARD: 'product-card',
  CATEGORY_FILTER: 'category-filter',
  LOADING_SPINNER: 'loading-spinner',
};
