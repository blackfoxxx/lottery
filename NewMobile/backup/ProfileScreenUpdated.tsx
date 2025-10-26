import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../services/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { SIZES } from '../../constants';
import { formatDate } from '../../utils/helpers';
import CustomButton from '../../components/CustomButton';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import apiService from '../../services/ApiService';
import { ErrorHandler } from '../../services/ErrorHandler';

const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const { language, isRTL, setLanguage: setAppLanguage, t } = useLanguage();
  const [notifications, setNotifications] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [userStats, setUserStats] = useState({
    tickets: 0,
    wins: 0,
    purchases: 0,
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const stats = await apiService.getUserStats();
      setUserStats(stats);
    } catch (error) {
      // Handle error silently for stats
      console.warn('Failed to load user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadUserData();
    setRefreshing(false);
  };

  const handleLanguageChange = () => {
    Alert.alert(
      t('language'),
      'Choose your preferred language',
      [
        { 
          text: 'English', 
          onPress: () => setAppLanguage('en') 
        },
        { 
          text: 'العربية', 
          onPress: () => setAppLanguage('ar') 
        },
        { text: t('cancel'), style: 'cancel' },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      t('logout'),
      'Are you sure you want to sign out?',
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('logout'), style: 'destructive', onPress: logout },
      ]
    );
  };

  const handleNotificationToggle = async (value: boolean) => {
    setNotifications(value);
    // Here you would typically save this preference to storage or server
  };

  const renderSettingItem = (
    icon: keyof typeof Ionicons.glyphMap,
    title: string,
    subtitle?: string,
    onPress?: () => void,
    rightComponent?: React.ReactNode
  ) => (
    <TouchableOpacity 
      style={[styles.settingItem, { borderBottomColor: colors.border }]} 
      onPress={onPress}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, { backgroundColor: colors.surface }]}>
          <Ionicons name={icon} size={24} color={colors.primary} />
        </View>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
          {subtitle && <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>}
        </View>
      </View>
      {rightComponent || (
        <Ionicons name={isRTL ? "chevron-back" : "chevron-forward"} size={20} color={colors.textSecondary} />
      )}
    </TouchableOpacity>
  );

  const dynamicStyles = StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },
    profileHeader: {
      backgroundColor: colors.surface,
    },
    avatarContainer: {
      backgroundColor: colors.primary,
    },
    userName: {
      color: colors.text,
    },
    userEmail: {
      color: colors.textSecondary,
    },
    joinDate: {
      color: colors.textSecondary,
    },
    sectionTitle: {
      color: colors.text,
    },
    statsContainer: {
      backgroundColor: colors.surface,
    },
    statNumber: {
      color: colors.primary,
    },
    statLabel: {
      color: colors.textSecondary,
    },
    settingsContainer: {
      backgroundColor: colors.surface,
    },
  });

  if (loading && !userStats.tickets && !userStats.wins && !userStats.purchases) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={[styles.container, dynamicStyles.container]}>
      <ScrollView 
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Profile Header */}
        <View style={[styles.profileHeader, dynamicStyles.profileHeader]}>
          <View style={[styles.avatarContainer, dynamicStyles.avatarContainer]}>
            <Ionicons name="person" size={48} color={colors.background} />
          </View>
          <Text style={[styles.userName, dynamicStyles.userName]}>
            {user?.name || 'User'}
          </Text>
          <Text style={[styles.userEmail, dynamicStyles.userEmail]}>
            {user?.email || 'user@example.com'}
          </Text>
          {user?.created_at && (
            <Text style={[styles.joinDate, dynamicStyles.joinDate]}>
              Member since {formatDate(user.created_at)}
            </Text>
          )}
        </View>

        {/* Stats Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
            🏆 {t('profile')} Stats
          </Text>
          <View style={[styles.statsContainer, dynamicStyles.statsContainer]}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, dynamicStyles.statNumber]}>
                {userStats.tickets}
              </Text>
              <Text style={[styles.statLabel, dynamicStyles.statLabel]}>
                {t('tickets')}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, dynamicStyles.statNumber]}>
                {userStats.wins}
              </Text>
              <Text style={[styles.statLabel, dynamicStyles.statLabel]}>
                Wins
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, dynamicStyles.statNumber]}>
                {userStats.purchases}
              </Text>
              <Text style={[styles.statLabel, dynamicStyles.statLabel]}>
                Purchases
              </Text>
            </View>
          </View>
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
            👤 Account
          </Text>
          <View style={[styles.settingsContainer, dynamicStyles.settingsContainer]}>
            {renderSettingItem(
              'person-outline',
              t('edit') + ' ' + t('profile'),
              'Update your personal information',
              () => Alert.alert('Coming Soon', 'Profile editing will be available soon!')
            )}
            {renderSettingItem(
              'card-outline',
              'Payment Methods',
              'Manage your payment options',
              () => Alert.alert('Coming Soon', 'Payment management will be available soon!')
            )}
            {renderSettingItem(
              'receipt-outline',
              'Purchase History',
              'View your past transactions',
              () => Alert.alert('Coming Soon', 'Purchase history will be available soon!')
            )}
          </View>
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
            ⚙️ {t('settings')}
          </Text>
          <View style={[styles.settingsContainer, dynamicStyles.settingsContainer]}>
            {renderSettingItem(
              'language-outline',
              t('language'),
              language === 'en' ? 'English' : 'العربية',
              handleLanguageChange
            )}
            {renderSettingItem(
              'moon-outline',
              t('theme'),
              isDarkMode ? 'Dark' : 'Light',
              undefined,
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={isDarkMode ? colors.background : colors.textSecondary}
              />
            )}
            {renderSettingItem(
              'notifications-outline',
              t('notifications'),
              'Lottery results and updates',
              undefined,
              <Switch
                value={notifications}
                onValueChange={handleNotificationToggle}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={notifications ? colors.background : colors.textSecondary}
              />
            )}
          </View>
        </View>

        {/* Support & Info */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
            ℹ️ {t('support')} & Info
          </Text>
          <View style={[styles.settingsContainer, dynamicStyles.settingsContainer]}>
            {renderSettingItem(
              'help-circle-outline',
              'Help & FAQ',
              'Get answers to common questions',
              () => Alert.alert('Help', 'Help section will be available soon!')
            )}
            {renderSettingItem(
              'document-text-outline',
              'Terms & Conditions',
              'Read our terms of service',
              () => Alert.alert('Terms', 'Terms & Conditions will be available soon!')
            )}
            {renderSettingItem(
              'shield-checkmark-outline',
              'Privacy Policy',
              'How we protect your data',
              () => Alert.alert('Privacy', 'Privacy Policy will be available soon!')
            )}
            {renderSettingItem(
              'information-circle-outline',
              t('about') + ' App',
              'Version 1.0.0',
              () => Alert.alert(t('about'), 'Iraqi E-commerce Lottery App\nVersion 1.0.0\nBuilt with React Native & Expo')
            )}
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.section}>
          <CustomButton
            title={t('logout')}
            onPress={handleLogout}
            variant="danger"
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
    flexGrow: 1,
  },
  profileHeader: {
    alignItems: 'center',
    padding: SIZES.paddingXLarge,
    marginBottom: SIZES.marginLarge,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.marginMedium,
  },
  userName: {
    fontSize: SIZES.fontXLarge,
    fontWeight: 'bold',
    marginBottom: SIZES.marginSmall,
  },
  userEmail: {
    fontSize: SIZES.fontMedium,
    marginBottom: SIZES.marginSmall,
  },
  joinDate: {
    fontSize: SIZES.fontSmall,
  },
  section: {
    marginBottom: SIZES.marginXLarge,
    paddingHorizontal: SIZES.paddingLarge,
  },
  sectionTitle: {
    fontSize: SIZES.fontLarge,
    fontWeight: '600',
    marginBottom: SIZES.marginMedium,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: SIZES.borderRadiusLarge,
    padding: SIZES.paddingLarge,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: SIZES.fontXXLarge,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: SIZES.fontMedium,
    marginTop: SIZES.marginSmall,
  },
  settingsContainer: {
    borderRadius: SIZES.borderRadiusLarge,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SIZES.paddingLarge,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.marginMedium,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: SIZES.fontMedium,
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: SIZES.fontSmall,
    marginTop: 2,
  },
  logoutButton: {
    marginHorizontal: 0,
  },
});

export default ProfileScreen;
