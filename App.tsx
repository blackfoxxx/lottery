import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import './i18n';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { LoyaltyProvider } from './contexts/LoyaltyProvider';
import { WishlistProvider } from './contexts/WishlistContext';
import { ComparisonProvider } from './contexts/ComparisonContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { PaymentMethodProvider } from './contexts/PaymentMethodContext';
import { TransactionProvider } from './contexts/TransactionContext';
import { AddressProvider } from './contexts/AddressContext';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProductsScreen from './screens/ProductsScreen';
import CartScreen from './screens/CartScreen';
import ProfileScreen from './screens/ProfileScreen';
import LoyaltyScreen from './screens/LoyaltyScreen';
import WishlistScreen from './screens/WishlistScreen';
import CompareScreen from './screens/CompareScreen';
import GiftCardsScreen from './screens/GiftCardsScreen';
import BundlesScreen from './screens/BundlesScreen';
import HomeScreen from './screens/HomeScreen';
import LotteryPurchaseScreen from './screens/LotteryPurchaseScreen';
import MyTicketsScreen from './screens/MyTicketsScreen';
import LotteryResultsScreen from './screens/LotteryResultsScreen';
import UserProfileScreen from './screens/UserProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import ChangePasswordScreen from './screens/ChangePasswordScreen';
import AboutScreen from './screens/AboutScreen';
import PaymentMethodsScreen from './screens/PaymentMethodsScreen';
import AddPaymentMethodScreen from './screens/AddPaymentMethodScreen';
import PaymentHistoryScreen from './screens/PaymentHistoryScreen';
import AddressesScreen from './screens/AddressesScreen';
import AddAddressScreen from './screens/AddAddressScreen';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Loading component
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#e74c3c" />
  </View>
);

// HomeScreen is now imported from ./screens/HomeScreen.tsx

// Auth Stack Navigator
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

// Main Tab Navigator
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap;

        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Products') {
          iconName = focused ? 'grid' : 'grid-outline';
        } else if (route.name === 'Wishlist') {
          iconName = focused ? 'heart' : 'heart-outline';
        } else if (route.name === 'Compare') {
          iconName = focused ? 'git-compare' : 'git-compare-outline';
        } else if (route.name === 'GiftCards') {
          iconName = focused ? 'gift' : 'gift-outline';
        } else if (route.name === 'Bundles') {
          iconName = focused ? 'cube' : 'cube-outline';
        } else if (route.name === 'Loyalty') {
          iconName = focused ? 'trophy' : 'trophy-outline';
        } else if (route.name === 'Cart') {
          iconName = focused ? 'cart' : 'cart-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        } else {
          iconName = 'help-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#e74c3c',
      tabBarInactiveTintColor: '#999',
      tabBarStyle: {
        backgroundColor: '#1a1a2e',
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
        borderTopWidth: 1,
        paddingBottom: 5,
        paddingTop: 5,
        height: 60,
      },
      tabBarLabelStyle: {
        fontSize: 11,
        fontWeight: '600',
      },
      headerShown: false,
    })}
  >
    <Tab.Screen 
      name="Home" 
      component={HomeScreen}
      options={{
        tabBarLabel: 'Home',
      }}
    />
    <Tab.Screen 
      name="Products" 
      component={ProductsScreen}
      options={{
        tabBarLabel: 'Shop',
      }}
    />
    <Tab.Screen 
      name="Wishlist" 
      component={WishlistScreen}
      options={{
        tabBarLabel: 'Wishlist',
      }}
    />
    <Tab.Screen 
      name="Compare" 
      component={CompareScreen}
      options={{
        tabBarLabel: 'Compare',
      }}
    />
    <Tab.Screen 
      name="GiftCards" 
      component={GiftCardsScreen}
      options={{
        tabBarLabel: 'Gift Cards',
      }}
    />
    <Tab.Screen 
      name="Bundles" 
      component={BundlesScreen}
      options={{
        tabBarLabel: 'Bundles',
      }}
    />
    <Tab.Screen 
      name="Loyalty" 
      component={LoyaltyScreen}
      options={{
        tabBarLabel: 'Rewards',
      }}
    />
    <Tab.Screen 
      name="Cart" 
      component={CartScreen}
      options={{
        tabBarLabel: 'Cart',
      }}
    />
    <Tab.Screen 
      name="Profile" 
      component={ProfileScreen}
      options={{
        tabBarLabel: 'Profile',
      }}
    />
  </Tab.Navigator>
);

// Main App Navigator
const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="LotteryPurchase" component={LotteryPurchaseScreen} />
            <Stack.Screen name="MyTickets" component={MyTicketsScreen} />
            <Stack.Screen name="LotteryResults" component={LotteryResultsScreen} />
            <Stack.Screen name="UserProfile" component={UserProfileScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
            <Stack.Screen name="About" component={AboutScreen} />
            <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
            <Stack.Screen name="AddPaymentMethod" component={AddPaymentMethodScreen} />
            <Stack.Screen name="PaymentHistory" component={PaymentHistoryScreen} />
            <Stack.Screen name="Addresses" component={AddressesScreen} />
            <Stack.Screen name="AddAddress" component={AddAddressScreen} />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Main App Component
export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <PaymentMethodProvider>
          <TransactionProvider>
            <AddressProvider>
          <CartProvider>
            <LoyaltyProvider>
              <WishlistProvider>
                <ComparisonProvider>
                <StatusBar style="light" />
                <AppNavigator />
                </ComparisonProvider>
              </WishlistProvider>
            </LoyaltyProvider>
          </CartProvider>
            </AddressProvider>
          </TransactionProvider>
        </PaymentMethodProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
});
