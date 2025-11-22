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
import Banners from "./pages/admin/Banners";
import Payments from "./pages/admin/Payments";
import Loyalty from "./pages/Loyalty";
import Profile from "./pages/Profile";
import PaymentComplete from "./pages/PaymentComplete";
import Lottery from "./pages/Lottery";

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
      <Route path="/order-tracking/:orderId" component={OrderTracking} />
      <Route path="/my-lottery" component={MyLottery} />
      <Route path="/wishlist" component={Wishlist} />
      <Route path="/compare" component={Compare} />
      <Route path="/loyalty" component={Loyalty} />
      <Route path="/profile" component={Profile} />
      <Route path="/payment/complete" component={PaymentComplete} />
      <Route path="/lottery" component={Lottery} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/products" component={AdminProducts} />
      <Route path="/admin/orders" component={AdminOrders} />
      <Route path="/admin/lottery-tickets" component={LotteryTickets} />
        <Route path="/admin/lottery-draws" component={LotteryDraws} />
        <Route path="/admin/lottery-categories" component={LotteryCategories} />
      <Route path="/admin/banners" component={Banners} />
      <Route path="/admin/payments" component={Payments} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <LanguageProvider>
          <LoyaltyProvider>
            <ComparisonProvider>
              <AuthProvider>
                <CartProvider>
                  <WishlistProvider>
                    <TooltipProvider>
                      <Toaster />
                      <Router />
                      <CartSidebar />
                    </TooltipProvider>
                  </WishlistProvider>
                </CartProvider>
              </AuthProvider>
            </ComparisonProvider>
          </LoyaltyProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
