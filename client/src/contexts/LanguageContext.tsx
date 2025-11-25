import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "en" | "ar" | "ku";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionaries
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    "header.search": "Search products...",
    "header.products": "Products",
    "header.lottery": "Lottery",
    "header.signIn": "Sign In",
    "header.signUp": "Sign Up",
    "header.logout": "Logout",
    "header.adminDashboard": "Admin Dashboard",
    
    // Home
    "home.welcome": "Welcome to Belkhair E-Commerce Platform",
    "home.shopPremium": "Shop Premium Products",
    "home.winPrizes": "Win Amazing Prizes",
    "home.description": "Discover exclusive products and earn lottery tickets with every purchase. Your next big win is just a click away!",
    "home.browseProducts": "Browse Products",
    "home.viewFeatured": "View Featured",
    "home.premiumProducts": "Premium Products",
    "home.premiumDesc": "Curated selection of high-quality products from trusted brands",
    "home.lotteryTickets": "Lottery Tickets",
    "home.lotteryDesc": "Earn lottery tickets with every purchase and win amazing prizes",
    "home.bestDeals": "Best Deals",
    "home.bestDealsDesc": "Exclusive discounts and special offers on selected items",
    "home.featuredProducts": "Featured Products",
    "home.featuredDesc": "Check out our handpicked selection of premium products",
    "home.viewAll": "View All",
    
    // Products
    "products.title": "Products",
    "products.allCategories": "All Categories",
    "products.sortBy": "Sort By",
    "products.priceAsc": "Price: Low to High",
    "products.priceDesc": "Price: High to Low",
    "products.nameAsc": "Name: A-Z",
    "products.nameDesc": "Name: Z-A",
    "products.addToCart": "Add to Cart",
    "products.inStock": "In Stock",
    "products.outOfStock": "Out of Stock",
    "products.tickets": "Tickets",
    
    // Cart
    "cart.title": "Shopping Cart",
    "cart.empty": "Your cart is empty",
    "cart.emptyDesc": "Start shopping to add items to your cart",
    "cart.subtotal": "Subtotal",
    "cart.tax": "Tax",
    "cart.shipping": "Shipping",
    "cart.total": "Total",
    "cart.checkout": "Proceed to Checkout",
    "cart.continueShopping": "Continue Shopping",
    "cart.remove": "Remove",
    "cart.quantity": "Quantity",
    
    // Checkout
    "checkout.title": "Checkout",
    "checkout.shippingInfo": "Shipping Information",
    "checkout.paymentMethod": "Payment Method",
    "checkout.orderSummary": "Order Summary",
    "checkout.placeOrder": "Place Order",
    "checkout.fullName": "Full Name",
    "checkout.email": "Email",
    "checkout.phone": "Phone Number",
    "checkout.address": "Address",
    "checkout.city": "City",
    "checkout.country": "Country",
    "checkout.zipCode": "Zip Code",
    
    // Auth
    "auth.welcomeBack": "Welcome Back",
    "auth.signInDesc": "Sign in to your account to continue",
    "auth.createAccount": "Create Account",
    "auth.signUpDesc": "Sign up to start shopping and earning lottery tickets",
    "auth.password": "Password",
    "auth.confirmPassword": "Confirm Password",
    "auth.dontHaveAccount": "Don't have an account?",
    "auth.alreadyHaveAccount": "Already have an account?",
    
    // Common
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.cancel": "Cancel",
    "common.save": "Save",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.sort": "Sort",
    "common.price": "Price",
    "common.name": "Name",
    "common.description": "Description",
    "common.category": "Category",
    "common.brand": "Brand",
    "common.sku": "SKU",
    "common.stock": "Stock",
    "common.status": "Status",
    "common.active": "Active",
    "common.inactive": "Inactive",
    
    // Lottery History
    "lottery.history": "Lottery Ticket History",
    "lottery.myTickets": "My Lottery Tickets",
    "lottery.ticketNumber": "Ticket Number",
    "lottery.purchaseDate": "Purchase Date",
    "lottery.drawDate": "Draw Date",
    "lottery.amount": "Amount",
    "lottery.status": "Status",
    "lottery.active": "Active",
    "lottery.won": "Won",
    "lottery.lost": "Lost",
    "lottery.pending": "Pending",
    "lottery.prize": "Prize",
    "lottery.exportPDF": "Export to PDF",
    "lottery.noTickets": "No lottery tickets found",
    "lottery.noTicketsDesc": "Purchase products to earn lottery tickets",
    "lottery.filterByDate": "Filter by Date",
    "lottery.fromDate": "From Date",
    "lottery.toDate": "To Date",
    "lottery.allStatuses": "All Statuses",
    "lottery.totalSpent": "Total Spent",
    "lottery.totalTickets": "Total Tickets",
    "lottery.totalWinnings": "Total Winnings",
    "lottery.recentWinners": "Recent Lottery Winners",
    "lottery.congratulations": "Congratulations to our winners!",
    "lottery.wonPrize": "won",
    "lottery.withTicket": "with ticket",
  },
  ar: {
    // Header
    "header.search": "البحث عن المنتجات...",
    "header.products": "المنتجات",
    "header.lottery": "اليانصيب",
    "header.signIn": "تسجيل الدخول",
    "header.signUp": "إنشاء حساب",
    "header.logout": "تسجيل الخروج",
    "header.adminDashboard": "لوحة الإدارة",
    
    // Home
    "home.welcome": "مرحباً بك في منصة بلخير للتجارة الإلكترونية",
    "home.shopPremium": "تسوق منتجات مميزة",
    "home.winPrizes": "اربح جوائز مذهلة",
    "home.description": "اكتشف منتجات حصرية واكسب تذاكر يانصيب مع كل عملية شراء. فوزك الكبير القادم على بعد نقرة واحدة!",
    "home.browseProducts": "تصفح المنتجات",
    "home.viewFeatured": "عرض المميزة",
    "home.premiumProducts": "منتجات مميزة",
    "home.premiumDesc": "مجموعة مختارة من المنتجات عالية الجودة من علامات تجارية موثوقة",
    "home.lotteryTickets": "تذاكر اليانصيب",
    "home.lotteryDesc": "اكسب تذاكر يانصيب مع كل عملية شراء واربح جوائز مذهلة",
    "home.bestDeals": "أفضل العروض",
    "home.bestDealsDesc": "خصومات حصرية وعروض خاصة على منتجات مختارة",
    "home.featuredProducts": "المنتجات المميزة",
    "home.featuredDesc": "تحقق من مجموعتنا المختارة من المنتجات المميزة",
    "home.viewAll": "عرض الكل",
    
    // Products
    "products.title": "المنتجات",
    "products.allCategories": "جميع الفئات",
    "products.sortBy": "ترتيب حسب",
    "products.priceAsc": "السعر: من الأقل إلى الأعلى",
    "products.priceDesc": "السعر: من الأعلى إلى الأقل",
    "products.nameAsc": "الاسم: أ-ي",
    "products.nameDesc": "الاسم: ي-أ",
    "products.addToCart": "أضف إلى السلة",
    "products.inStock": "متوفر",
    "products.outOfStock": "غير متوفر",
    "products.tickets": "تذاكر",
    
    // Cart
    "cart.title": "سلة التسوق",
    "cart.empty": "سلتك فارغة",
    "cart.emptyDesc": "ابدأ التسوق لإضافة عناصر إلى سلتك",
    "cart.subtotal": "المجموع الفرعي",
    "cart.tax": "الضريبة",
    "cart.shipping": "الشحن",
    "cart.total": "المجموع",
    "cart.checkout": "إتمام الطلب",
    "cart.continueShopping": "متابعة التسوق",
    "cart.remove": "إزالة",
    "cart.quantity": "الكمية",
    
    // Checkout
    "checkout.title": "إتمام الطلب",
    "checkout.shippingInfo": "معلومات الشحن",
    "checkout.paymentMethod": "طريقة الدفع",
    "checkout.orderSummary": "ملخص الطلب",
    "checkout.placeOrder": "تأكيد الطلب",
    "checkout.fullName": "الاسم الكامل",
    "checkout.email": "البريد الإلكتروني",
    "checkout.phone": "رقم الهاتف",
    "checkout.address": "العنوان",
    "checkout.city": "المدينة",
    "checkout.country": "الدولة",
    "checkout.zipCode": "الرمز البريدي",
    
    // Auth
    "auth.welcomeBack": "مرحباً بعودتك",
    "auth.signInDesc": "قم بتسجيل الدخول إلى حسابك للمتابعة",
    "auth.createAccount": "إنشاء حساب",
    "auth.signUpDesc": "سجل للبدء في التسوق وكسب تذاكر اليانصيب",
    "auth.password": "كلمة المرور",
    "auth.confirmPassword": "تأكيد كلمة المرور",
    "auth.dontHaveAccount": "ليس لديك حساب؟",
    "auth.alreadyHaveAccount": "لديك حساب بالفعل؟",
    
    // Common
    "common.loading": "جاري التحميل...",
    "common.error": "خطأ",
    "common.success": "نجح",
    "common.cancel": "إلغاء",
    "common.save": "حفظ",
    "common.edit": "تعديل",
    "common.delete": "حذف",
    "common.search": "بحث",
    "common.filter": "تصفية",
    "common.sort": "ترتيب",
    "common.price": "السعر",
    "common.name": "الاسم",
    "common.description": "الوصف",
    "common.category": "الفئة",
    "common.brand": "العلامة التجارية",
    "common.sku": "رمز المنتج",
    "common.stock": "المخزون",
    "common.status": "الحالة",
    "common.active": "نشط",
    "common.inactive": "غير نشط",
    
    // Lottery History
    "lottery.history": "سجل تذاكر اليانصيب",
    "lottery.myTickets": "تذاكر اليانصيب الخاصة بي",
    "lottery.ticketNumber": "رقم التذكرة",
    "lottery.purchaseDate": "تاريخ الشراء",
    "lottery.drawDate": "تاريخ السحب",
    "lottery.amount": "المبلغ",
    "lottery.status": "الحالة",
    "lottery.active": "نشط",
    "lottery.won": "فائز",
    "lottery.lost": "خاسر",
    "lottery.pending": "قيد الانتظار",
    "lottery.prize": "الجائزة",
    "lottery.exportPDF": "تصدير إلى PDF",
    "lottery.noTickets": "لم يتم العثور على تذاكر يانصيب",
    "lottery.noTicketsDesc": "قم بشراء المنتجات للحصول على تذاكر اليانصيب",
    "lottery.filterByDate": "تصفية حسب التاريخ",
    "lottery.fromDate": "من تاريخ",
    "lottery.toDate": "إلى تاريخ",
    "lottery.allStatuses": "جميع الحالات",
    "lottery.totalSpent": "إجمالي المصروفات",
    "lottery.totalTickets": "إجمالي التذاكر",
    "lottery.totalWinnings": "إجمالي الأرباح",
    "lottery.recentWinners": "الفائزون الأخيرون في اليانصيب",
    "lottery.congratulations": "تهانينا للفائزين!",
    "lottery.wonPrize": "فاز بـ",
    "lottery.withTicket": "بالتذكرة",
  },
  ku: {
    // Header
    "header.search": "گەڕان بۆ بەرهەمەکان...",
    "header.products": "بەرهەمەکان",
    "header.lottery": "یانەسیب",
    "header.signIn": "چوونەژوورەوە",
    "header.signUp": "دروستکردنی هەژمار",
    "header.logout": "چوونەدەرەوە",
    "header.adminDashboard": "پانێڵی بەڕێوەبردن",
    
    // Home
    "home.welcome": "بەخێربێیت بۆ پلاتفۆرمی ئەلیکترۆنی بەلخەیر",
    "home.shopPremium": "کڕینی بەرهەمی تایبەت",
    "home.winPrizes": "بردنەوەی خەڵاتی سەرسوڕهێنەر",
    "home.description": "دۆزینەوەی بەرهەمی تایبەت و بەدەستهێنانی تکێتی یانەسیب لەگەڵ هەر کڕینێک. بردنەوەی گەورەی داهاتوو تەنها یەک کرتە دوورە!",
    "home.browseProducts": "گەڕان لە بەرهەمەکان",
    "home.viewFeatured": "بینینی تایبەتەکان",
    "home.premiumProducts": "بەرهەمی تایبەت",
    "home.premiumDesc": "هەڵبژاردنی بەرهەمی کوالیتی بەرز لە براندە متمانەپێکراوەکان",
    "home.lotteryTickets": "تکێتی یانەسیب",
    "home.lotteryDesc": "بەدەستهێنانی تکێتی یانەسیب لەگەڵ هەر کڕینێک و بردنەوەی خەڵاتی سەرسوڕهێنەر",
    "home.bestDeals": "باشترین دیلەکان",
    "home.bestDealsDesc": "داشکاندنی تایبەت و پێشکەشکراوی تایبەت لەسەر بەرهەمی هەڵبژێردراو",
    "home.featuredProducts": "بەرهەمە تایبەتەکان",
    "home.featuredDesc": "سەیری هەڵبژاردنی ئێمە لە بەرهەمە تایبەتەکان بکە",
    "home.viewAll": "بینینی هەموو",
    
    // Products
    "products.title": "بەرهەمەکان",
    "products.allCategories": "هەموو جۆرەکان",
    "products.sortBy": "ڕیزکردن بەپێی",
    "products.priceAsc": "نرخ: لە کەم بۆ زۆر",
    "products.priceDesc": "نرخ: لە زۆر بۆ کەم",
    "products.nameAsc": "ناو: أ-ی",
    "products.nameDesc": "ناو: ی-أ",
    "products.addToCart": "زیادکردن بۆ سەبەتە",
    "products.inStock": "بەردەستە",
    "products.outOfStock": "بەردەست نییە",
    "products.tickets": "تکێتەکان",
    
    // Cart
    "cart.title": "سەبەتەی کڕین",
    "cart.empty": "سەبەتەکەت بەتاڵە",
    "cart.emptyDesc": "دەستپێکردنی کڕین بۆ زیادکردنی بەرهەم بۆ سەبەتەکەت",
    "cart.subtotal": "کۆی لاوەکی",
    "cart.tax": "باج",
    "cart.shipping": "گەیاندن",
    "cart.total": "کۆی گشتی",
    "cart.checkout": "تەواوکردنی داواکاری",
    "cart.continueShopping": "بەردەوامبوون لە کڕین",
    "cart.remove": "لابردن",
    "cart.quantity": "بڕ",
    
    // Checkout
    "checkout.title": "تەواوکردنی داواکاری",
    "checkout.shippingInfo": "زانیاری گەیاندن",
    "checkout.paymentMethod": "شێوازی پارەدان",
    "checkout.orderSummary": "پوختەی داواکاری",
    "checkout.placeOrder": "دڵنیاکردنەوەی داواکاری",
    "checkout.fullName": "ناوی تەواو",
    "checkout.email": "ئیمەیڵ",
    "checkout.phone": "ژمارەی تەلەفۆن",
    "checkout.address": "ناونیشان",
    "checkout.city": "شار",
    "checkout.country": "وڵات",
    "checkout.zipCode": "کۆدی پۆستە",
    
    // Auth
    "auth.welcomeBack": "بەخێربێیتەوە",
    "auth.signInDesc": "چوونەژوورەوە بۆ هەژمارەکەت بۆ بەردەوامبوون",
    "auth.createAccount": "دروستکردنی هەژمار",
    "auth.signUpDesc": "تۆمارکردن بۆ دەستپێکردنی کڕین و بەدەستهێنانی تکێتی یانەسیب",
    "auth.password": "وشەی نهێنی",
    "auth.confirmPassword": "دڵنیاکردنەوەی وشەی نهێنی",
    "auth.dontHaveAccount": "هەژمارت نییە؟",
    "auth.alreadyHaveAccount": "پێشتر هەژمارت هەیە؟",
    
    // Common
    "common.loading": "بارکردن...",
    "common.error": "هەڵە",
    "common.success": "سەرکەوتوو",
    "common.cancel": "هەڵوەشاندنەوە",
    "common.save": "پاشەکەوتکردن",
    "common.edit": "دەستکاریکردن",
    "common.delete": "سڕینەوە",
    "common.search": "گەڕان",
    "common.filter": "پاڵاوتن",
    "common.sort": "ڕیزکردن",
    "common.price": "نرخ",
    "common.name": "ناو",
    "common.description": "وەسف",
    "common.category": "جۆر",
    "common.brand": "براند",
    "common.sku": "کۆدی بەرهەم",
    "common.stock": "کۆگا",
    "common.status": "دۆخ",
    "common.active": "چالاک",
    "common.inactive": "ناچالاک",
    
    // Lottery History
    "lottery.history": "مێژووی تکێتەکانی یانەسیب",
    "lottery.myTickets": "تکێتەکانی یانەسیبی من",
    "lottery.ticketNumber": "ژمارەی تکێت",
    "lottery.purchaseDate": "بەرواری کڕین",
    "lottery.drawDate": "بەرواری کێشان",
    "lottery.amount": "بڕ",
    "lottery.status": "دۆخ",
    "lottery.active": "چالاک",
    "lottery.won": "بردەوە",
    "lottery.lost": "دۆڕاوە",
    "lottery.pending": "چاوەڕوان",
    "lottery.prize": "خەڵات",
    "lottery.exportPDF": "هەناردەکردن بۆ PDF",
    "lottery.noTickets": "هیچ تکێتێکی یانەسیب نەدۆزرایەوە",
    "lottery.noTicketsDesc": "بەرهەم بکڕە بۆ بەدەستهێنانی تکێتی یانەسیب",
    "lottery.filterByDate": "پاڵاوتن بەپێی بەروار",
    "lottery.fromDate": "لە بەروار",
    "lottery.toDate": "بۆ بەروار",
    "lottery.allStatuses": "هەموو دۆخەکان",
    "lottery.totalSpent": "کۆی خەرجکراو",
    "lottery.totalTickets": "کۆی تکێتەکان",
    "lottery.totalWinnings": "کۆی بردنەوەکان",
    "lottery.recentWinners": "بردەوەکانی دواتری یانەسیب",
    "lottery.congratulations": "پیرۆزە بۆ بردەوەکان!",
    "lottery.wonPrize": "بردییەوە",
    "lottery.withTicket": "بە تکێتی",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    // Load language from localStorage
    const savedLang = localStorage.getItem("language") as Language;
    if (savedLang && ["en", "ar", "ku"].includes(savedLang)) {
      setLanguageState(savedLang);
      updateDocumentDirection(savedLang);
    }
  }, []);

  function setLanguage(lang: Language) {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    updateDocumentDirection(lang);
  }

  function updateDocumentDirection(lang: Language) {
    const isRTL = lang === "ar" || lang === "ku";
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }

  function t(key: string): string {
    return translations[language][key] || key;
  }

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    isRTL: language === "ar" || language === "ku",
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
