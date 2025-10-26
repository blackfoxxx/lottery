import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useAuth } from '../../services/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useApp } from '../../contexts/AppContext';
import { MainTabParamList, ProductStackParamList, Category, Draw } from '../../types';
import { SIZES } from '../../constants';
import CustomButton from '../../components/CustomButton';
import LoadingSpinner from '../../components/LoadingSpinner';
import Logo from '../../components/Logo';
import CountdownBanner from '../../components/CountdownBanner';
import { apiManager } from '../../services/ApiManager';

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Home'>,
  StackNavigationProp<ProductStackParamList>
>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user, logout } = useAuth();
  const { colors, isDarkMode } = useTheme();
  const { t, language, isRTL } = useLanguage();
  const { showLoading, hideLoading, showSuccess, showError, refreshData } = useApp();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState({ products: 0, categories: 0, tickets: 0 });
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [appTitle, setAppTitle] = useState('Iraqi E-commerce Lottery');
  const [nextDraw, setNextDraw] = useState<Draw | null>(null);
  const [drawLoading, setDrawLoading] = useState(false);

  useEffect(() => {
    loadData();
    loadAppConfig();
    loadNextDraw();
  }, []);

  const loadData = async () => {
    try {
      showLoading('Loading home data...');
      
      // Load categories and products data
      const [categoriesData, productsData] = await Promise.all([
        apiManager.getCategories(),
        apiManager.getProducts()
      ]);
      
      // Try to get user stats with robust fallback handling
      let userTicketsCount = 0;
      let productsCount = productsData.length;
      
      try {
        const statsData = await apiManager.getUserStats();
        userTicketsCount = statsData?.tickets || 0;
        productsCount = statsData?.products || productsData.length;
      } catch (error) {
        console.log('getUserStats failed, using calculated fallback values');
        userTicketsCount = 0;
        productsCount = productsData.length;
      }
      
      setCategories(categoriesData || []);
      setStats({
        products: productsCount,
        categories: categoriesData?.length || 0,
        tickets: userTicketsCount
      });
      
      const welcomeMessage = userTicketsCount > 0 
        ? `You have ${userTicketsCount} active tickets`
        : `Welcome to ${t('appName')}!`;
      
      showSuccess('Welcome back!', welcomeMessage);
    } catch (error) {
      console.warn('Failed to load home data:', error);
      // Set default values to prevent rendering issues
      setCategories([]);
      setStats({ products: 0, categories: 0, tickets: 0 });
      showError('Loading Failed', 'Unable to load home data. Please try again.');
    } finally {
      hideLoading();
    }
  };

  const loadAppConfig = async () => {
    try {
      // In a real app, this would come from your backend settings API
      const config = await apiManager.getAppConfig?.() || {};
      setAppTitle(config.appTitle || 'Iraqi E-commerce Lottery');
    } catch (error) {
      console.warn('Failed to load app config:', error);
    }
  };

  const loadNextDraw = async () => {
    try {
      setDrawLoading(true);
      const draw = await apiManager.getNextDraw();
      setNextDraw(draw);
    } catch (error) {
      console.warn('Failed to load next draw:', error);
      setNextDraw(null);
    } finally {
      setDrawLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshData(); // Use the global refresh function
      await Promise.all([loadData(), loadNextDraw()]);
    } catch (error) {
      showError('Refresh Failed', 'Unable to refresh data. Please try again.');
    } finally {
      setRefreshing(false);
    }
  };

  const handleCategoryPress = (category: Category) => {
    // Navigate to products screen with category filter
    navigation.navigate('Products', {
      screen: 'ProductList',
      params: {
        categoryId: category.id,
        categoryName: category.name,
      },
    });
  };

  const handleProductsPress = () => {
    navigation.navigate('Products', {
      screen: 'ProductList',
    });
  };

  const handleTicketsPress = () => {
    navigation.navigate('Tickets');
  };

  const handleCategoriesPress = () => {
    // Navigate to products screen to show all categories
    navigation.navigate('Products', {
      screen: 'ProductList',
    });
  };

  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('gold')) return '🥇';
    if (name.includes('silver')) return '🥈';
    if (name.includes('bronze')) return '🥉';
    if (name.includes('platinum')) return '💎';
    return '🎯';
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },
    title: {
      color: colors.primary,
    },
    subtitle: {
      color: colors.text,
    },
    sectionTitle: {
      color: colors.text,
    },
    statCard: {
      backgroundColor: colors.surface,
    },
    statNumber: {
      color: colors.primary,
    },
    statLabel: {
      color: colors.textSecondary,
    },
    categoryCard: {
      borderColor: colors.border,
    },
    categoryName: {
      color: colors.text,
    },
    quickActionCard: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    quickActionText: {
      color: colors.text,
    },
    quickActionSubtext: {
      color: colors.textSecondary,
    },
  });

  if (loading && categories.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={[styles.container, dynamicStyles.container]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <ScrollView 
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.headerContent, isRTL && styles.rtlRow]}>
            <Logo size={50} style={styles.logo} />
            <View style={styles.headerText}>
              <Text style={[styles.title, dynamicStyles.title, isRTL && styles.rtlText]}>
                {t('appName')}
              </Text>
            </View>
          </View>
          <Text style={[styles.subtitle, dynamicStyles.subtitle, isRTL && styles.rtlText]}>
            {t('welcomeBack')}, {user?.name || 'User'}!
          </Text>
        </View>

        {/* Countdown Banner */}
        <View style={styles.bannerSection}>
          <CountdownBanner 
            draw={nextDraw} 
            loading={drawLoading}
            onPress={() => {
              // TODO: Navigate to draw details or tickets screen
              navigation.navigate('Tickets');
            }}
          />
        </View>

        {/* Quick Stats */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle, isRTL && styles.rtlText]}>
            📊 {t('quickStats')}
          </Text>
          <View style={[styles.statsContainer, isRTL && styles.rtlRow]}>
            <TouchableOpacity 
              style={[styles.statCard, dynamicStyles.statCard]}
              onPress={handleProductsPress}
              activeOpacity={0.7}
            >
              <Text style={[styles.statNumber, dynamicStyles.statNumber]}>
                {String(stats.products || 0)}
              </Text>
              <Text style={[styles.statLabel, dynamicStyles.statLabel]}>
                {t('products')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.statCard, dynamicStyles.statCard]}
              onPress={handleCategoriesPress}
              activeOpacity={0.7}
            >
              <Text style={[styles.statNumber, dynamicStyles.statNumber]}>
                {String(stats.categories || 0)}
              </Text>
              <Text style={[styles.statLabel, dynamicStyles.statLabel]}>
                {t('categories')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.statCard, dynamicStyles.statCard]}
              onPress={handleTicketsPress}
              activeOpacity={0.7}
            >
              <Text style={[styles.statNumber, dynamicStyles.statNumber]}>
                {String(stats.tickets || 0)}
              </Text>
              <Text style={[styles.statLabel, dynamicStyles.statLabel]}>
                {t('tickets')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle, isRTL && styles.rtlText]}>
            ⚡ {t('quickActions')}
          </Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={[styles.quickActionCard, dynamicStyles.quickActionCard]}
              onPress={handleProductsPress}
            >
              <Ionicons name="storefront" size={32} color={colors.primary} />
              <Text style={[styles.quickActionText, dynamicStyles.quickActionText]}>
                {t('browseProducts')}
              </Text>
              <Text style={[styles.quickActionSubtext, dynamicStyles.quickActionSubtext]}>
                {t('findYourLuck')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.quickActionCard, dynamicStyles.quickActionCard]}
              onPress={handleTicketsPress}
            >
              <Ionicons name="ticket" size={32} color={colors.primary} />
              <Text style={[styles.quickActionText, dynamicStyles.quickActionText]}>
                {t('myTickets')}
              </Text>
              <Text style={[styles.quickActionSubtext, dynamicStyles.quickActionSubtext]}>
                {t('checkResults')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Featured Categories */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle, isRTL && styles.rtlText]}>
            🏆 {t('featuredCategories')}
          </Text>
          <View style={[styles.categoryContainer, isRTL && styles.rtlRow]}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  dynamicStyles.categoryCard,
                  { backgroundColor: category.color || colors.primary + '20' }
                ]}
                onPress={() => handleCategoryPress(category)}
              >
                <Text style={styles.categoryEmoji}>
                  {getCategoryIcon(category.name || '')}
                </Text>
                <Text style={[styles.categoryName, dynamicStyles.categoryName]}>
                  {String(category.display_name || category.name || 'Category')}
                </Text>
                <Text style={[styles.categoryPrize, dynamicStyles.quickActionSubtext]}>
                  {category.prize_pool ? `💰 ${String(category.prize_pool)}` : ''}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.section}>
          <CustomButton
            title={t('logout')}
            onPress={() => {
              Alert.alert(
                t('logout'),
                t('confirmLogout'),
                [
                  { text: t('cancel'), style: 'cancel' },
                  { text: t('logout'), style: 'destructive', onPress: logout },
                ]
              );
            }}
            variant="outline"
            style={styles.logoutButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: SIZES.paddingLarge,
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: SIZES.marginXLarge,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    marginRight: SIZES.marginMedium,
  },
  headerText: {
    alignItems: 'center',
  },
  title: {
    fontSize: SIZES.fontXXLarge,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: SIZES.marginSmall,
  },
  subtitle: {
    fontSize: SIZES.fontLarge,
    textAlign: 'center',
  },
  bannerSection: {
    marginBottom: SIZES.marginLarge,
  },
  section: {
    marginBottom: SIZES.marginXLarge,
  },
  sectionTitle: {
    fontSize: SIZES.fontLarge,
    fontWeight: '600',
    marginBottom: SIZES.marginMedium,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCard: {
    padding: SIZES.paddingLarge,
    borderRadius: SIZES.borderRadiusLarge,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: SIZES.marginSmall,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statNumber: {
    fontSize: SIZES.fontXXLarge,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: SIZES.fontMedium,
    textAlign: 'center',
    marginTop: SIZES.marginSmall,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    flex: 1,
    padding: SIZES.paddingLarge,
    borderRadius: SIZES.borderRadiusLarge,
    alignItems: 'center',
    marginHorizontal: SIZES.marginSmall,
    borderWidth: 1,
  },
  quickActionText: {
    fontSize: SIZES.fontMedium,
    fontWeight: '600',
    marginTop: SIZES.marginSmall,
    textAlign: 'center',
  },
  quickActionSubtext: {
    fontSize: SIZES.fontSmall,
    marginTop: 4,
    textAlign: 'center',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    padding: SIZES.paddingLarge,
    borderRadius: SIZES.borderRadiusLarge,
    alignItems: 'center',
    marginBottom: SIZES.marginMedium,
    borderWidth: 1,
  },
  categoryEmoji: {
    fontSize: SIZES.fontXXLarge,
    marginBottom: SIZES.marginSmall,
  },
  categoryName: {
    fontSize: SIZES.fontMedium,
    fontWeight: '600',
    textAlign: 'center',
  },
  categoryPrize: {
    fontSize: SIZES.fontSmall,
    marginTop: 4,
    textAlign: 'center',
  },
  logoutButton: {
    marginTop: SIZES.marginLarge,
  },
  rtlText: {
    textAlign: 'right',
  },
  rtlRow: {
    flexDirection: 'row-reverse',
  },
});

export default HomeScreen;
