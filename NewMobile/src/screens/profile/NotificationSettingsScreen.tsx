import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { notificationService, NotificationSettings } from '../../services/NotificationService';
import { SIZES } from '../../constants';
import LoadingSpinner from '../../components/LoadingSpinner';

const NotificationSettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { colors, isDarkMode } = useTheme();
  const { t, isRTL } = useLanguage();
  
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: true,
    drawReminders: true,
    orderUpdates: true,
    winNotifications: true,
    promotions: false,
  });
  const [permissionStatus, setPermissionStatus] = useState({
    granted: false,
    canAskAgain: true,
    status: 'undetermined',
  });

  useEffect(() => {
    loadSettings();
    checkPermissions();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await notificationService.loadSettings();
      setSettings(savedSettings);
    } catch (error) {
      console.error('Error loading notification settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkPermissions = async () => {
    const status = await notificationService.checkPermissions();
    setPermissionStatus(status);
  };

  const handleToggleMaster = async (value: boolean) => {
    if (value && !permissionStatus.granted) {
      // Request permission first
      const token = await notificationService.registerForPushNotifications();
      if (!token) {
        Alert.alert(
          t('permissionDenied'),
          t('notificationPermissionMessage'),
          [
            { text: t('cancel'), style: 'cancel' },
            {
              text: t('openSettings'),
              onPress: () => notificationService.openSettings(),
            },
          ]
        );
        return;
      }
      await checkPermissions();
    }

    const newSettings = { ...settings, enabled: value };
    setSettings(newSettings);
    await notificationService.saveSettings(newSettings);
  };

  const handleToggleSetting = async (key: keyof NotificationSettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    await notificationService.saveSettings(newSettings);
  };

  const renderSettingItem = (
    icon: string,
    title: string,
    description: string,
    settingKey: keyof NotificationSettings,
    enabled: boolean = true
  ) => (
    <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
      <View style={[styles.settingLeft, isRTL && styles.rtlRow]}>
        <View style={[styles.iconContainer, { backgroundColor: colors.surface }]}>
          <Ionicons name={icon as any} size={24} color={colors.primary} />
        </View>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: colors.text }]}>
            {title}
          </Text>
          <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
            {description}
          </Text>
        </View>
      </View>
      <Switch
        value={settings[settingKey] as boolean}
        onValueChange={(value) => handleToggleSetting(settingKey, value)}
        trackColor={{ false: '#e3e3e0', true: colors.primary }}
        thumbColor={settings[settingKey] ? '#FFFFFF' : '#f0f0f0'}
        ios_backgroundColor="#e3e3e0"
        disabled={!enabled || !settings.enabled}
      />
    </View>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons
              name={isRTL ? 'chevron-forward' : 'chevron-back'}
              size={28}
              color={colors.primary}
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {t('notificationSettings')}
          </Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Permission Status */}
        {!permissionStatus.granted && (
          <View style={[styles.permissionBanner, { backgroundColor: colors.warning + '20' }]}>
            <Ionicons name="warning-outline" size={24} color={colors.warning} />
            <View style={styles.permissionText}>
              <Text style={[styles.permissionTitle, { color: colors.text }]}>
                {t('notificationsDisabled')}
              </Text>
              <Text style={[styles.permissionDescription, { color: colors.textSecondary }]}>
                {t('enableNotificationsMessage')}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => notificationService.openSettings()}
              style={[styles.enableButton, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.enableButtonText}>{t('enable')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Master Toggle */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={[styles.masterToggle, { borderBottomColor: colors.border }]}>
            <View style={[styles.settingLeft, isRTL && styles.rtlRow]}>
              <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
                <Ionicons
                  name={settings.enabled ? 'notifications' : 'notifications-off'}
                  size={28}
                  color={settings.enabled ? colors.primary : colors.textSecondary}
                />
              </View>
              <View style={styles.settingText}>
                <Text style={[styles.masterTitle, { color: colors.text }]}>
                  {t('enableNotifications')}
                </Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  {t('receiveUpdatesAndAlerts')}
                </Text>
              </View>
            </View>
            <Switch
              value={settings.enabled}
              onValueChange={handleToggleMaster}
              trackColor={{ false: '#e3e3e0', true: colors.primary }}
              thumbColor={settings.enabled ? '#FFFFFF' : '#f0f0f0'}
              ios_backgroundColor="#e3e3e0"
            />
          </View>
        </View>

        {/* Notification Types */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('notificationTypes')}
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          {renderSettingItem(
            'trophy-outline',
            t('drawReminders'),
            t('drawRemindersDescription'),
            'drawReminders'
          )}
          {renderSettingItem(
            'cart-outline',
            t('orderUpdates'),
            t('orderUpdatesDescription'),
            'orderUpdates'
          )}
          {renderSettingItem(
            'gift-outline',
            t('winNotifications'),
            t('winNotificationsDescription'),
            'winNotifications'
          )}
          {renderSettingItem(
            'megaphone-outline',
            t('promotions'),
            t('promotionsDescription'),
            'promotions'
          )}
        </View>

        {/* Test Notification */}
        <View style={styles.testSection}>
          <TouchableOpacity
            style={[styles.testButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={async () => {
              if (!settings.enabled) {
                Alert.alert(t('error'), t('enableNotificationsFirst'));
                return;
              }
              await notificationService.sendLocalNotification({
                title: '🎉 Test Notification',
                body: 'This is a test notification from بلخير!',
                sound: true,
              });
              Alert.alert(t('success'), t('testNotificationSent'));
            }}
          >
            <Ionicons name="paper-plane-outline" size={24} color={colors.primary} />
            <Text style={[styles.testButtonText, { color: colors.text }]}>
              {t('sendTestNotification')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Info Section */}
        <View style={[styles.infoSection, { backgroundColor: colors.surface }]}>
          <Ionicons name="information-circle-outline" size={24} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            {t('notificationInfoMessage')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.paddingLarge,
    paddingVertical: SIZES.paddingMedium,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: SIZES.fontXLarge,
    fontWeight: 'bold',
  },
  permissionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: SIZES.marginLarge,
    padding: SIZES.paddingLarge,
    borderRadius: SIZES.borderRadiusMedium,
    gap: 12,
  },
  permissionText: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: SIZES.fontMedium,
    fontWeight: '600',
    marginBottom: 4,
  },
  permissionDescription: {
    fontSize: SIZES.fontSmall,
  },
  enableButton: {
    paddingHorizontal: SIZES.paddingLarge,
    paddingVertical: SIZES.paddingSmall,
    borderRadius: SIZES.borderRadiusSmall,
  },
  enableButtonText: {
    color: '#FFFFFF',
    fontSize: SIZES.fontMedium,
    fontWeight: '600',
  },
  section: {
    marginHorizontal: SIZES.marginLarge,
    marginBottom: SIZES.marginLarge,
    borderRadius: SIZES.borderRadiusMedium,
    overflow: 'hidden',
  },
  sectionHeader: {
    paddingHorizontal: SIZES.paddingLarge,
    paddingVertical: SIZES.paddingMedium,
  },
  sectionTitle: {
    fontSize: SIZES.fontMedium,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  masterToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.paddingLarge,
    borderBottomWidth: 1,
  },
  masterTitle: {
    fontSize: SIZES.fontLarge,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.paddingLarge,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  rtlRow: {
    flexDirection: 'row-reverse',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: SIZES.fontMedium,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: SIZES.fontSmall,
    lineHeight: 18,
  },
  testSection: {
    paddingHorizontal: SIZES.paddingLarge,
    marginBottom: SIZES.marginLarge,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.paddingLarge,
    borderRadius: SIZES.borderRadiusMedium,
    borderWidth: 1,
    gap: 12,
  },
  testButtonText: {
    fontSize: SIZES.fontMedium,
    fontWeight: '600',
  },
  infoSection: {
    flexDirection: 'row',
    margin: SIZES.marginLarge,
    padding: SIZES.paddingLarge,
    borderRadius: SIZES.borderRadiusMedium,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: SIZES.fontSmall,
    lineHeight: 20,
  },
});

export default NotificationSettingsScreen;
