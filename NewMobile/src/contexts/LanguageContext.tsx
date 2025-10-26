import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';

export type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  isRTL: boolean;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Translation strings
const translations = {
  en: {
    // Navigation
    home: 'Home',
    products: 'Products',
    tickets: 'My Tickets',
    profile: 'Profile',
    
    // Auth
    login: 'Login',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    name: 'Full Name',
    phone: 'Phone Number',
    forgotPassword: 'Forgot Password?',
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: 'Already have an account?',
    
    // General
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    refresh: 'Refresh',
    tryAgain: 'Try Again',
    comingSoon: 'Coming soon!',
    
    // Home Screen
    appName: 'بلخير',
    welcomeBack: 'Welcome back',
    quickStats: 'Quick Stats',
    quickActions: 'Quick Actions',
    featuredCategories: 'Featured Categories',
    browseProducts: 'Browse Products',
    findYourLuck: 'Find your luck',
    myTickets: 'My Tickets',
    checkResults: 'Check results',
    confirmLogout: 'Are you sure you want to logout?',
    categories: 'Categories',
    
    // Countdown Banner
    nextDraw: 'Next Draw',
    upcoming: 'Upcoming',
    drawIn: 'Draw in',
    days: 'days',
    hours: 'hours',
    minutes: 'minutes',
    seconds: 'seconds',
    prizePool: 'Prize Pool',
    totalTickets: 'Total Tickets',
    noUpcomingDraws: 'No upcoming draws',
    checkBackLater: 'Check back later for the next draw',
    
    // Notifications
    notificationSettings: 'Notification Settings',
    enableNotifications: 'Enable Notifications',
    receiveUpdatesAndAlerts: 'Receive updates and alerts',
    notificationTypes: 'Notification Types',
    drawReminders: 'Draw Reminders',
    drawRemindersDescription: 'Get notified 1 hour before lottery draws',
    orderUpdates: 'Order Updates',
    orderUpdatesDescription: 'Updates about your orders and tickets',
    winNotifications: 'Win Notifications',
    winNotificationsDescription: 'Be the first to know when you win',
    promotions: 'Promotions & Offers',
    promotionsDescription: 'Receive special offers and promotions',
    sendTestNotification: 'Send Test Notification',
    testNotificationSent: 'Test notification sent successfully!',
    enableNotificationsFirst: 'Please enable notifications first',
    notificationInfoMessage: 'You can manage your notification preferences here. Notifications help you stay updated on draws, orders, and wins.',
    notificationsDisabled: 'Notifications Disabled',
    enableNotificationsMessage: 'Enable notifications to receive important updates',
    enable: 'Enable',
    permissionDenied: 'Permission Denied',
    notificationPermissionMessage: 'Please allow notifications in your device settings to receive updates',
    openSettings: 'Open Settings',
    
    // Products
    addToCart: 'Add to Cart',
    buyNow: 'Buy Now',
    price: 'Price',
    category: 'Category',
    description: 'Description',
    outOfStock: 'Out of Stock',
    inStock: 'In Stock',
    
    // Tickets
    ticketNumber: 'Ticket Number',
    drawDate: 'Draw Date',
    status: 'Status',
    active: 'Active',
    completed: 'Completed',
    
    // Profile
    settings: 'Settings',
    language: 'Language',
    theme: 'Theme',
    notifications: 'Notifications',
    support: 'Support',
    about: 'About',
    logout: 'Logout',
    account: 'Account',
    changePassword: 'Change Password',
    paymentMethods: 'Payment Methods',
    purchaseHistory: 'Purchase History',
    helpFAQ: 'Help & FAQ',
    termsConditions: 'Terms & Conditions',
    privacyPolicy: 'Privacy Policy',
    updatePersonalInfo: 'Update your personal information',
    updateAccountPassword: 'Update your account password',
    managePaymentOptions: 'Manage your payment options',
    viewPastTransactions: 'View your past transactions',
    getAnswers: 'Get answers to common questions',
    readTerms: 'Read our terms of service',
    dataProtection: 'How we protect your data',
    lotteryUpdates: 'Lottery results and updates',
    memberSince: 'Member since',
    wins: 'Wins',
    purchases: 'Purchases',
    
    // Checkout
    checkout: 'Checkout',
    total: 'Total',
    subtotal: 'Subtotal',
    tax: 'Tax',
    shipping: 'Shipping',
    paymentMethod: 'Payment Method',
    creditCard: 'Credit Card',
    cash: 'Cash on Delivery',
    placeOrder: 'Place Order',
    
    // Products Screen
    available: 'available',
    noProductsFound: 'No products found in this category',
    
    // Product Detail
    purchaseProduct: 'Purchase Product',
    purchaseConfirm: 'Are you sure you want to purchase',
    forPrice: 'for',
    willGenerate: 'This will generate',
    lotteryTickets: 'lottery tickets',
    forYou: 'for you',
    purchase: 'Purchase',
    purchaseSuccessful: 'Purchase Successful!',
    successfullyPurchased: 'You have successfully purchased',
    viewInTicketsTab: 'and can be viewed in the Tickets tab',
    ok: 'OK',
    purchaseFailed: 'Purchase Failed',
    productNotFound: 'Product not found',
    goBack: 'Go Back',
    lotteryInformation: 'Lottery Information',
    added: 'Added',
    updated: 'Updated',
    howItWorks: 'How it Works',
    howItWorksPoint1: 'Purchase this product to automatically receive lottery tickets',
    howItWorksPoint2: 'Your tickets will be entered into the category lottery',
    howItWorksPoint3: 'Check the Tickets tab to view your lottery tickets',
    howItWorksPoint4: 'Winners are drawn regularly - good luck!',
    processing: 'Processing...',
    purchaseFor: 'Purchase for',
    viewTickets: 'View Tickets',
    
    // Tickets Screen
    noTicketsYet: 'No tickets yet',
    purchaseToGetTickets: 'Purchase products to get lottery tickets',
    generateSampleTickets: 'Generate Sample Tickets',
    
    // Messages
    loginSuccess: 'Login successful!',
    registerSuccess: 'Registration successful!',
    logoutSuccess: 'Logged out successfully',
    orderSuccess: 'Order placed successfully!',
    networkError: 'Network error. Please check your connection.',
    genericError: 'Something went wrong. Please try again.',
    
    // Purchase History
    quantity: 'Quantity',
    product: 'Product',
    orderID: 'Order ID',
    viewDetails: 'View Details',
    noPurchasesYet: 'No Purchases Yet',
    purchaseProductsMessage: 'Start shopping to see your purchase history here',
    failedToLoadOrders: 'Failed to load purchase history. Please try again.',
    ticketsGenerated: 'Lottery Tickets',
    more: 'more',
    item: 'item',
    items: 'items',
    pending: 'Pending',
    failed: 'Failed',
    cancelled: 'Cancelled',
    dark: 'Dark',
    light: 'Light',
  },
  ar: {
    // Navigation
    home: 'الرئيسية',
    products: 'المنتجات',
    tickets: 'تذاكري',
    profile: 'الملف الشخصي',
    
    // Auth
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    name: 'الاسم الكامل',
    phone: 'رقم الهاتف',
    forgotPassword: 'نسيت كلمة المرور؟',
    dontHaveAccount: 'ليس لديك حساب؟',
    alreadyHaveAccount: 'لديك حساب بالفعل؟',
    
    // General
    loading: 'جاري التحميل...',
    error: 'خطأ',
    success: 'نجح',
    cancel: 'إلغاء',
    confirm: 'تأكيد',
    save: 'حفظ',
    edit: 'تعديل',
    delete: 'حذف',
    refresh: 'تحديث',
    tryAgain: 'حاول مرة أخرى',
    comingSoon: 'قريباً!',
    
    // Home Screen
    appName: 'بلخير',
    welcomeBack: 'مرحباً بعودتك',
    quickStats: 'إحصائيات سريعة',
    quickActions: 'إجراءات سريعة',
    featuredCategories: 'الفئات المميزة',
    browseProducts: 'تصفح المنتجات',
    findYourLuck: 'ابحث عن حظك',
    myTickets: 'تذاكري',
    checkResults: 'تحقق من النتائج',
    confirmLogout: 'هل تريد بالتأكيد تسجيل الخروج؟',
    categories: 'الفئات',
    
    // Countdown Banner
    nextDraw: 'السحب القادم',
    upcoming: 'قادم',
    drawIn: 'السحب خلال',
    days: 'أيام',
    hours: 'ساعات',
    minutes: 'دقائق',
    seconds: 'ثواني',
    prizePool: 'مجموع الجوائز',
    totalTickets: 'إجمالي التذاكر',
    noUpcomingDraws: 'لا توجد سحوبات قادمة',
    checkBackLater: 'تحقق لاحقاً للسحب القادم',
    
    // Notifications
    notificationSettings: 'إعدادات الإشعارات',
    enableNotifications: 'تفعيل الإشعارات',
    receiveUpdatesAndAlerts: 'تلقي التحديثات والتنبيهات',
    notificationTypes: 'أنواع الإشعارات',
    drawReminders: 'تذكيرات السحب',
    drawRemindersDescription: 'احصل على إشعار قبل ساعة من سحوبات اليانصيب',
    orderUpdates: 'تحديثات الطلبات',
    orderUpdatesDescription: 'تحديثات حول طلباتك وتذاكرك',
    winNotifications: 'إشعارات الفوز',
    winNotificationsDescription: 'كن أول من يعرف عندما تفوز',
    promotions: 'العروض الترويجية',
    promotionsDescription: 'تلقي العروض الخاصة والترويجية',
    sendTestNotification: 'إرسال إشعار تجريبي',
    testNotificationSent: 'تم إرسال الإشعار التجريبي بنجاح!',
    enableNotificationsFirst: 'يرجى تفعيل الإشعارات أولاً',
    notificationInfoMessage: 'يمكنك إدارة تفضيلات الإشعارات هنا. تساعدك الإشعارات على البقاء على اطلاع بالسحوبات والطلبات والفوزات.',
    notificationsDisabled: 'الإشعارات معطلة',
    enableNotificationsMessage: 'قم بتفعيل الإشعارات لتلقي التحديثات المهمة',
    enable: 'تفعيل',
    permissionDenied: 'تم رفض الإذن',
    notificationPermissionMessage: 'يرجى السماح بالإشعارات في إعدادات جهازك لتلقي التحديثات',
    openSettings: 'فتح الإعدادات',
    
    // Products
    addToCart: 'أضف إلى السلة',
    buyNow: 'اشتري الآن',
    price: 'السعر',
    category: 'الفئة',
    description: 'الوصف',
    outOfStock: 'نفدت الكمية',
    inStock: 'متوفر',
    
    // Tickets
    ticketNumber: 'رقم التذكرة',
    drawDate: 'تاريخ السحب',
    status: 'الحالة',
    active: 'نشط',
    completed: 'مكتمل',
    
    // Profile
    settings: 'الإعدادات',
    language: 'اللغة',
    theme: 'المظهر',
    notifications: 'الإشعارات',
    support: 'الدعم',
    about: 'حول',
    logout: 'تسجيل الخروج',
    account: 'الحساب',
    changePassword: 'تغيير كلمة المرور',
    paymentMethods: 'طرق الدفع',
    purchaseHistory: 'سجل المشتريات',
    helpFAQ: 'المساعدة والأسئلة الشائعة',
    termsConditions: 'الشروط والأحكام',
    privacyPolicy: 'سياسة الخصوصية',
    updatePersonalInfo: 'تحديث معلوماتك الشخصية',
    updateAccountPassword: 'تحديث كلمة مرور حسابك',
    managePaymentOptions: 'إدارة خيارات الدفع الخاصة بك',
    viewPastTransactions: 'عرض معاملاتك السابقة',
    getAnswers: 'احصل على إجابات للأسئلة الشائعة',
    readTerms: 'اقرأ شروط الخدمة',
    dataProtection: 'كيف نحمي بياناتك',
    lotteryUpdates: 'نتائج اليانصيب والتحديثات',
    memberSince: 'عضو منذ',
    wins: 'الفوزات',
    purchases: 'المشتريات',
    
    // Checkout
    checkout: 'الدفع',
    total: 'المجموع',
    subtotal: 'المجموع الفرعي',
    tax: 'الضريبة',
    shipping: 'الشحن',
    paymentMethod: 'طريقة الدفع',
    creditCard: 'بطاقة ائتمان',
    cash: 'الدفع عند التسليم',
    placeOrder: 'تأكيد الطلب',
    
    // Products Screen
    available: 'متوفر',
    noProductsFound: 'لم يتم العثور على منتجات في هذه الفئة',
    
    // Product Detail
    purchaseProduct: 'شراء المنتج',
    purchaseConfirm: 'هل أنت متأكد من أنك تريد شراء',
    forPrice: 'مقابل',
    willGenerate: 'سيؤدي هذا إلى إنشاء',
    lotteryTickets: 'تذاكر يانصيب',
    forYou: 'لك',
    purchase: 'شراء',
    purchaseSuccessful: 'تم الشراء بنجاح!',
    successfullyPurchased: 'لقد اشتريت بنجاح',
    viewInTicketsTab: 'ويمكن عرضها في تبويب التذاكر',
    ok: 'حسناً',
    purchaseFailed: 'فشل الشراء',
    productNotFound: 'المنتج غير موجود',
    goBack: 'رجوع',
    lotteryInformation: 'معلومات اليانصيب',
    added: 'تمت الإضافة',
    updated: 'تم التحديث',
    howItWorks: 'كيف يعمل',
    howItWorksPoint1: 'اشترِ هذا المنتج لتلقي تذاكر اليانصيب تلقائياً',
    howItWorksPoint2: 'سيتم إدخال تذاكرك في سحب فئة اليانصيب',
    howItWorksPoint3: 'تحقق من تبويب التذاكر لعرض تذاكر اليانصيب الخاصة بك',
    howItWorksPoint4: 'يتم سحب الفائزين بانتظام - حظ سعيد!',
    processing: 'جارٍ المعالجة...',
    purchaseFor: 'شراء مقابل',
    viewTickets: 'عرض التذاكر',
    
    // Tickets Screen
    noTicketsYet: 'لا توجد تذاكر بعد',
    purchaseToGetTickets: 'اشتري منتجات للحصول على تذاكر اليانصيب',
    generateSampleTickets: 'إنشاء تذاكر تجريبية',
    
    // Messages
    loginSuccess: 'تم تسجيل الدخول بنجاح!',
    registerSuccess: 'تم التسجيل بنجاح!',
    logoutSuccess: 'تم تسجيل الخروج بنجاح',
    orderSuccess: 'تم تأكيد الطلب بنجاح!',
    networkError: 'خطأ في الشبكة. تحقق من الاتصال.',
    genericError: 'حدث خطأ ما. حاول مرة أخرى.',
    
    // Purchase History
    quantity: 'الكمية',
    product: 'المنتج',
    orderID: 'رقم الطلب',
    viewDetails: 'عرض التفاصيل',
    noPurchasesYet: 'لا توجد مشتريات بعد',
    purchaseProductsMessage: 'ابدأ التسوق لرؤية سجل مشترياتك هنا',
    failedToLoadOrders: 'فشل تحميل سجل المشتريات. يرجى المحاولة مرة أخرى.',
    ticketsGenerated: 'تذاكر اليانصيب',
    more: 'أكثر',
    item: 'عنصر',
    items: 'عناصر',
    pending: 'قيد الانتظار',
    failed: 'فشل',
    cancelled: 'ملغى',
    dark: 'داكن',
    light: 'فاتح',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    loadLanguagePreference();
  }, []);

  const loadLanguagePreference = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE);
      if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
        setLanguageState(savedLanguage as Language);
      }
    } catch (error) {
      console.error('Error loading language preference:', error);
    }
  };

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  const isRTL = language === 'ar';

  const value: LanguageContextType = {
    language,
    isRTL,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
