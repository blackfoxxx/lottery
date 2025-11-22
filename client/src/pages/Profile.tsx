import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useLoyalty } from '@/contexts/LoyaltyContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
// import Footer from '@/components/Footer';
import { Package, Ticket, Heart, Award, User, LogOut, ShoppingBag } from 'lucide-react';
import { useLocation } from 'wouter';

export default function Profile() {
  const { user, logout } = useAuth();
  const { wishlist } = useWishlist();
  const { points, tier } = useLoyalty();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    // Load orders from localStorage
    const savedOrders = localStorage.getItem('belkhair_orders');
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (error) {
        console.error('Failed to load orders:', error);
      }
    }
  }, []);
  const { t } = useLanguage();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<'orders' | 'tickets' | 'wishlist' | 'loyalty' | 'settings'>('orders');

  if (!user) {
    navigate('/');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const tabs = [
    { id: 'orders' as const, label: t('myOrders'), icon: Package },
    { id: 'tickets' as const, label: t('myTickets'), icon: Ticket },
    { id: 'wishlist' as const, label: t('wishlist'), icon: Heart },
    { id: 'loyalty' as const, label: t('loyaltyRewards'), icon: Award },
    { id: 'settings' as const, label: t('accountSettings'), icon: User },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-8">
        {/* Profile Header */}
        <div className="bg-card rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-card-foreground">{user.name}</h1>
                <p className="text-muted-foreground">{user.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Award className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium text-yellow-500">{tier.name} Member</span>
                  <span className="text-sm text-muted-foreground">• {points} Points</span>
                  {/* <span className="text-sm text-muted-foreground">• {tier.name} Tier</span> */}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              {t('logout')}
            </button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-card rounded-lg mb-6">
          <div className="flex border-b border-border overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-muted-foreground hover:text-card-foreground'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-card rounded-lg p-6">
          {activeTab === 'orders' && <OrdersTab />}
          {activeTab === 'tickets' && <TicketsTab />}
          {activeTab === 'wishlist' && <WishlistTab />}
          {activeTab === 'loyalty' && <LoyaltyTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </div>
      </div>

      {/* <Footer /> */}
    </div>
  );
}

function OrdersTab() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const savedOrders = localStorage.getItem('belkhair_orders');
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (error) {
        console.error('Failed to load orders:', error);
      }
    }
  }, []);
  const { t } = useLanguage();
  const [, navigate] = useLocation();

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-card-foreground mb-2">{t('noOrders')}</h3>
        <p className="text-muted-foreground mb-4">{t('noOrdersDescription')}</p>
        <button
          onClick={() => navigate('/products')}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          {t('startShopping')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-card-foreground mb-4">{t('orderHistory')}</h2>
      {orders.map((order) => (
        <div key={order.id} className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-semibold text-card-foreground">Order #{order.id}</p>
              <p className="text-sm text-muted-foreground">{new Date(order.date).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-primary">${order.total.toFixed(2)}</p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                order.status === 'delivered' ? 'bg-green-500/10 text-green-500' :
                order.status === 'shipped' ? 'bg-blue-500/10 text-blue-500' :
                'bg-yellow-500/10 text-yellow-500'
              }`}>
                {order.status}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            {order.items.map((item: any, idx: number) => (
              <div key={idx} className="flex items-center gap-3 text-sm">
                <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                <div className="flex-1">
                  <p className="text-card-foreground">{item.name}</p>
                  <p className="text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium text-card-foreground">${item.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
          {order.lotteryTickets && order.lotteryTickets.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-sm font-medium text-card-foreground mb-2">
                <Ticket className="w-4 h-4 inline mr-1" />
                Lottery Tickets ({order.lotteryTickets.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {order.lotteryTickets.map((ticket: any, idx: number) => (
                  <span
                    key={idx}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      ticket.category === 'golden' ? 'bg-yellow-500/20 text-yellow-500' :
                      ticket.category === 'silver' ? 'bg-gray-400/20 text-gray-400' :
                      'bg-orange-500/20 text-orange-500'
                    }`}
                  >
                    {ticket.ticketNumber} ({ticket.category})
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function TicketsTab() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const savedOrders = localStorage.getItem('belkhair_orders');
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (error) {
        console.error('Failed to load orders:', error);
      }
    }
  }, []);
  const { t } = useLanguage();
  const [, navigate] = useLocation();
  const [filterCategory, setFilterCategory] = useState<'all' | 'golden' | 'silver' | 'bronze'>('all');

  // Collect all lottery tickets from orders
  const allTickets = orders.flatMap((order: any) => 
    (order.lotteryTickets || []).map((ticket: any) => ({
      ...ticket,
      orderId: order.id,
      orderDate: order.date,
      orderTotal: order.total
    }))
  );

  const filteredTickets = filterCategory === 'all' 
    ? allTickets 
    : allTickets.filter((t: any) => t.category === filterCategory);

  const stats = {
    total: allTickets.length,
    golden: allTickets.filter((t: any) => t.category === 'golden').length,
    silver: allTickets.filter((t: any) => t.category === 'silver').length,
    bronze: allTickets.filter((t: any) => t.category === 'bronze').length,
  };

  if (allTickets.length === 0) {
    return (
      <div className="text-center py-12">
        <Ticket className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-card-foreground mb-2">{t('noTickets')}</h3>
        <p className="text-muted-foreground mb-4">{t('noTicketsDescription')}</p>
        <button
          onClick={() => navigate('/products')}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          {t('startShopping')}
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-card-foreground mb-4">{t('myLotteryTickets')}</h2>
      
      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-background rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-card-foreground">{stats.total}</p>
          <p className="text-sm text-muted-foreground">{t('totalTickets')}</p>
        </div>
        <div className="bg-yellow-500/10 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-yellow-500">{stats.golden}</p>
          <p className="text-sm text-yellow-500">{t('goldenTickets')}</p>
        </div>
        <div className="bg-gray-400/10 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-gray-400">{stats.silver}</p>
          <p className="text-sm text-gray-400">{t('silverTickets')}</p>
        </div>
        <div className="bg-orange-500/10 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-orange-500">{stats.bronze}</p>
          <p className="text-sm text-orange-500">{t('bronzeTickets')}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4">
        {(['all', 'golden', 'silver', 'bronze'] as const).map((category) => (
          <button
            key={category}
            onClick={() => setFilterCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterCategory === category
                ? 'bg-primary text-primary-foreground'
                : 'bg-background text-muted-foreground hover:text-card-foreground'
            }`}
          >
            {category === 'all' ? t('allCategories') : category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        {filteredTickets.map((ticket: any, idx: number) => (
          <div
            key={idx}
            className={`border-2 rounded-lg p-4 ${
              ticket.category === 'golden' ? 'border-yellow-500/30 bg-yellow-500/5' :
              ticket.category === 'silver' ? 'border-gray-400/30 bg-gray-400/5' :
              'border-orange-500/30 bg-orange-500/5'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Ticket className={`w-8 h-8 ${
                  ticket.category === 'golden' ? 'text-yellow-500' :
                  ticket.category === 'silver' ? 'text-gray-400' :
                  'text-orange-500'
                }`} />
                <div>
                  <p className="font-mono font-bold text-lg text-card-foreground">{ticket.ticketNumber}</p>
                  <p className="text-sm text-muted-foreground">
                    {t('purchasedOn')} {new Date(ticket.orderDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span className={`px-4 py-2 rounded-full font-medium ${
                ticket.category === 'golden' ? 'bg-yellow-500 text-white' :
                ticket.category === 'silver' ? 'bg-gray-400 text-white' :
                'bg-orange-500 text-white'
              }`}>
                {ticket.category.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <p className="text-muted-foreground">
                {t('fromOrder')} #{ticket.orderId} • ${ticket.orderTotal.toFixed(2)}
              </p>
              <p className="text-muted-foreground">
                {t('drawDate')}: {new Date(ticket.drawDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WishlistTab() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const [, navigate] = useLocation();

  if (wishlist.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-card-foreground mb-2">{t('emptyWishlist')}</h3>
        <p className="text-muted-foreground mb-4">{t('emptyWishlistDescription')}</p>
        <button
          onClick={() => navigate('/products')}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          {t('browsProducts')}
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-card-foreground mb-4">{t('myWishlist')} ({wishlist.length})</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {wishlist.map((product) => (
          <div key={product.id} className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
            <img
              src={product.images?.[0] || '/placeholder.png'}
              alt={product.name}
              className="w-full h-48 object-cover rounded-lg mb-3 cursor-pointer"
              onClick={() => navigate(`/product/${product.id}`)}
            />
            <h3 className="font-semibold text-card-foreground mb-2">{product.name}</h3>
            <p className="text-2xl font-bold text-primary mb-3">${product.price.toFixed(2)}</p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  addToCart(product);
                  removeFromWishlist(product.id);
                }}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                {t('addToCart')}
              </button>
              <button
                onClick={() => removeFromWishlist(product.id)}
                className="px-4 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors"
              >
                {t('remove')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LoyaltyTab() {
  const { points, tier, transactions } = useLoyalty();
  const { t } = useLanguage();

  const tierInfo = {
    Bronze: { min: 0, max: 499, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    Silver: { min: 500, max: 1999, color: 'text-gray-400', bg: 'bg-gray-400/10' },
    Gold: { min: 1000, max: 2499, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    Platinum: { min: 2500, max: Infinity, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  };

  const tierName = tier.name;
  const currentTier = tierInfo[tierName as keyof typeof tierInfo];
  const nextTier = tierName === 'Platinum' ? null : Object.entries(tierInfo).find(([, info]) => info.min > points);
  const pointsToNext = nextTier ? nextTier[1].min - points : 0;

  return (
    <div>
      <h2 className="text-xl font-bold text-card-foreground mb-4">{t('loyaltyProgram')}</h2>
      
      {/* Current Tier */}
      <div className={`${currentTier.bg} rounded-lg p-6 mb-6`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{t('currentTier')}</p>
            <h3 className={`text-3xl font-bold ${currentTier.color}`}>{tierName}</h3>
          </div>
          <Award className={`w-16 h-16 ${currentTier.color}`} />
        </div>
        <div className="mb-2">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">{t('totalPoints')}</span>
            <span className="font-bold text-card-foreground">{points}</span>
          </div>
          {nextTier && (
            <>
              <div className="w-full bg-background rounded-full h-2 mb-1">
                <div
                  className={`h-2 rounded-full ${currentTier.color.replace('text-', 'bg-')}`}
                  style={{ width: `${((points - currentTier.min) / (nextTier[1].min - currentTier.min)) * 100}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {pointsToNext} {t('pointsToNextTier')} ({nextTier[0]})
              </p>
            </>
          )}
        </div>
      </div>

      {/* Points History */}
      <h3 className="text-lg font-semibold text-card-foreground mb-3">{t('pointsHistory') || 'Points History'}</h3>
      <div className="space-y-2">
        {transactions.slice(0, 10).map((entry: any, idx: number) => (
          <div key={idx} className="flex items-center justify-between p-3 bg-background rounded-lg">
            <div>
              <p className="font-medium text-card-foreground">{entry.description}</p>
              <p className="text-sm text-muted-foreground">{new Date(entry.date).toLocaleDateString()}</p>
            </div>
            <span className={`font-bold ${entry.type === 'earn' ? 'text-green-500' : 'text-red-500'}`}>
              {entry.type === 'earn' ? '+' : '-'}{Math.abs(entry.points)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsTab() {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <div>
      <h2 className="text-xl font-bold text-card-foreground mb-4">{t('accountSettings')}</h2>
      
      <div className="space-y-6">
        {/* Personal Information */}
        <div>
          <h3 className="text-lg font-semibold text-card-foreground mb-3">{t('personalInformation')}</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">{t('fullName')}</label>
              <input
                type="text"
                value={user?.name || ''}
                disabled
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-card-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">{t('email')}</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-card-foreground"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div>
          <h3 className="text-lg font-semibold text-card-foreground mb-3">{t('notifications')}</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span className="text-card-foreground">{t('emailNotifications')}</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span className="text-card-foreground">{t('orderUpdates')}</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span className="text-card-foreground">{t('lotteryNotifications')}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
