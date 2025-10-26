import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../../services/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { MainTabParamList, Category } from '../../types';
import { SIZES } from '../../constants';
import CustomButton from '../../components/CustomButton';
import LoadingSpinner from '../../components/LoadingSpinner';
import apiService from '../../services/ApiService';

type HomeScreenNavigationProp = StackNavigationProp<MainTabParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user, logout } = useAuth();
  const { colors, isDarkMode } = useTheme();
  const { t, language, isRTL } = useLanguage();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState({ products: 0, categories: 0, tickets: 0 });
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [appTitle, setAppTitle] = useState('Iraqi E-commerce Lottery');

  useEffect(() => {
    loadData();
    loadAppConfig();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [categoriesData, statsData] = await Promise.all([
        apiService.getCategories(),
        apiService.getUserStats()
      ]);
      
      setCategories(categoriesData);
      setStats({
        products: statsData.products || 0,
        categories: categoriesData.length,
        tickets: statsData.tickets || 0
      });
    } catch (error) {
      console.warn('Failed to load home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAppConfig = async () => {
    try {
      // In a real app, this would come from your backend settings API
      const config = await apiService.getAppConfig?.() || {};
      setAppTitle(config.appTitle || 'Iraqi E-commerce Lottery');
    } catch (error) {
      console.warn('Failed to load app config:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleCategoryPress = (category: Category) => {
    // Navigate to products screen with category filter
    navigation.navigate('Products', { 
      screen: 'ProductList', 
      params: { categoryId: category.id } 
    });
  };

  const handleProductsPress = () => {
    navigation.navigate('Products');
  };

  const handleTicketsPress = () => {
    navigation.navigate('Tickets');
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
          <Text style={[styles.title, dynamicStyles.title, isRTL && styles.rtlText]}>
            {appTitle}
          </Text>
          <Text style={[styles.subtitle, dynamicStyles.subtitle, isRTL && styles.rtlText]}>
            {t('welcomeBack')}, {user?.name}!
          </Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle, isRTL && styles.rtlText]}>
            📊 {t('quickStats')}
          </Text>
          <View style={[styles.statsContainer, isRTL && styles.rtlRow]}>
            <View style={[styles.statCard, dynamicStyles.statCard]}>
              <Text style={[styles.statNumber, dynamicStyles.statNumber]}>
                {stats.products}
              </Text>
              <Text style={[styles.statLabel, dynamicStyles.statLabel]}>
                {t('products')}
              </Text>
            </View>
            <View style={[styles.statCard, dynamicStyles.statCard]}>
              <Text style={[styles.statNumber, dynamicStyles.statNumber]}>
                {stats.categories}
              </Text>
              <Text style={[styles.statLabel, dynamicStyles.statLabel]}>
                {t('categories')}
              </Text>
            </View>
            <View style={[styles.statCard, dynamicStyles.statCard]}>
              <Text style={[styles.statNumber, dynamicStyles.statNumber]}>
                {stats.tickets}
              </Text>
              <Text style={[styles.statLabel, dynamicStyles.statLabel]}>
                {t('tickets')}
              </Text>
            </View>
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
                  {getCategoryIcon(category.name)}
                </Text>
                <Text style={[styles.categoryName, dynamicStyles.categoryName]}>
                  {category.display_name || category.name}
                </Text>
                <Text style={[styles.categoryPrize, dynamicStyles.quickActionSubtext]}>
                  {category.prize_pool && `💰 ${category.prize_pool}`}
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
