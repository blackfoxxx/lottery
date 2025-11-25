import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { ComparisonProvider } from "./contexts/ComparisonContext";
import { LoyaltyProvider } from "./contexts/LoyaltyContext";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { PaymentMethodProvider } from "./contexts/PaymentMethodContext";
import CartSidebar from "./components/CartSidebar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderHistory from "./pages/OrderHistory";
import OrderTracking from "./pages/OrderTracking";
import MyLottery from "./pages/MyLottery";
import Wishlist from "./pages/Wishlist";
import Compare from "./pages/Compare";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminOrders from "./pages/admin/Orders";
import LotteryTickets from "./pages/admin/LotteryTickets";
import LotteryDraws from "@/pages/admin/LotteryDraws";
import LotteryCategories from "@/pages/admin/LotteryCategories";
import LotteryManagement from "@/pages/admin/LotteryManagement";
import Banners from "./pages/admin/Banners";
import Payments from "./pages/admin/Payments";
import Disputes from "./pages/admin/Disputes";
import OrdersManagement from "./pages/admin/OrdersManagement";
import Inventory from "./pages/admin/Inventory";
import Customers from "./pages/admin/Customers";
import FraudReview from "./pages/admin/FraudReview";
import Reviews from "./pages/admin/Reviews";
import Promotions from "./pages/admin/Promotions";
import Analytics from "./pages/admin/Analytics";
import UISettings from "./pages/admin/UISettings";
import MyDisputes from "./pages/MyDisputes";
import Loyalty from "./pages/Loyalty";
import Profile from "./pages/Profile";
import PaymentComplete from "./pages/PaymentComplete";
import Lottery from "./pages/Lottery";
import LotteryHistory from "./pages/LotteryHistory";
import LotteryStats from "./pages/LotteryStats";
import PaymentMethods from "./pages/PaymentMethods";
import ProductComparison from "@/pages/ProductComparison";
import TierComparison from "@/pages/TierComparison";
import SharedWishlist from "./pages/SharedWishlist";
import Notifications from "./pages/admin/Notifications";
import GiftCards from "./pages/GiftCards";
import GiftCardBalance from "./pages/GiftCardBalance";
import Bundles from "./pages/Bundles";
import AdminGiftCards from "./pages/admin/GiftCards";
import AdminBundles from "./pages/admin/Bundles";
import EnvironmentSettings from "./pages/admin/EnvironmentSettings";
import System from "./pages/admin/System";
import SystemSettings from "./pages/admin/SystemSettings";
import CompleteLotteryManagement from "./pages/admin/CompleteLotteryManagement";
import ProductManagement from "./pages/admin/ProductManagement";
import ProductCategories from "./pages/admin/ProductCategories";
import OrderManagement from "./pages/admin/OrderManagement";
import UserProfile from "./pages/UserProfile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import QiCardSettings from "./pages/admin/QiCardSettings";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/products" component={Products} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route path="/cart" component={Cart} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/order-confirmation" component={OrderConfirmation} />
      <Route path="/orders" component={OrderHistory} />
      <Route path="/track/:orderId" component={OrderTracking} />
      <Route path="/orders/:orderId" component={OrderTracking} />
      <Route path="/my-lottery" component={MyLottery} />
      <Route path="/wishlist" component={Wishlist} />
      <Route path="/compare" component={Compare} />
      <Route path="/loyalty" component={Loyalty} />
      <Route path="/profile" component={Profile} />
      <Route path="/payment-methods" component={PaymentMethods} />
      <Route path="/payment/complete" component={PaymentComplete} />
      <Route path="/lottery" component={Lottery} />
      <Route path="/lottery/history" component={LotteryHistory} />
      <Route path="/lottery/stats" component={LotteryStats} />
      <Route path="/compare" component={ProductComparison} />
      <Route path="/loyalty-tiers" component={TierComparison} />
      <Route path={"/shared-wishlist/:id"} component={SharedWishlist} />
      <Route path="/my-disputes" component={MyDisputes} />
      <Route path="/gift-cards" component={GiftCards} />
      <Route path="/gift-card-balance" component={GiftCardBalance} />
      <Route path="/bundles" component={Bundles} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/products" component={AdminProducts} />
      <Route path="/admin/orders" component={AdminOrders} />
      <Route path="/admin/lottery-tickets" component={LotteryTickets} />
        <Route path="/admin/lottery-draws" component={LotteryDraws} />
        <Route path="/admin/lottery-categories" component={LotteryCategories} />
        <Route path="/admin/lottery-management" component={LotteryManagement} />
      <Route path="/admin/banners" component={Banners} />
      <Route path="/admin/payments" component={Payments} />
      <Route path="/admin/disputes" component={Disputes} />
      <Route path="/admin/orders-management" component={OrdersManagement} />
      <Route path="/admin/inventory" component={Inventory} />
      <Route path="/admin/customers" component={Customers} />
      <Route path="/admin/fraud-review" component={FraudReview} />
      <Route path="/admin/reviews" component={Reviews} />
      <Route path="/admin/promotions" component={Promotions} />
      <Route path="/admin/analytics" component={Analytics} />
      <Route path="/admin/ui-settings" component={UISettings} />
      <Route path="/admin/notifications" component={Notifications} />
      <Route path="/admin/gift-cards" component={AdminGiftCards} />
      <Route path="/admin/bundles" component={AdminBundles} />
      <Route path="/admin/environment" component={EnvironmentSettings} />
      <Route path="/admin/system" component={System} />
      <Route path="/admin/system-settings" component={SystemSettings} />
      <Route path="/admin/qicard-settings" component={QiCardSettings} />
      <Route path="/admin/complete-lottery" component={CompleteLotteryManagement} />
      <Route path="/admin/product-management" component={ProductManagement} />
      <Route path="/admin/product-categories" component={ProductCategories} />
      <Route path="/admin/order-management" component={OrderManagement} />
      <Route path="/profile" component={UserProfile} />
      <Route path="/signin" component={SignIn} />
      <Route path="/signup" component={SignUp} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <NotificationProvider>
          <LanguageProvider>
          <LoyaltyProvider>
            <ComparisonProvider>
              <AuthProvider>
                <PaymentMethodProvider>
                  <CartProvider>
                    <WishlistProvider>
                      <TooltipProvider>
                      <Toaster />
                      <Router />
                      <CartSidebar />
                      </TooltipProvider>
                    </WishlistProvider>
                  </CartProvider>
                </PaymentMethodProvider>
              </AuthProvider>
            </ComparisonProvider>
          </LoyaltyProvider>
        </LanguageProvider>
        </NotificationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
