import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import * as LocalAuthentication from 'expo-local-authentication';

export default function SettingsScreen({ navigation }: any) {
  const { t } = useTranslation();
  const { language, changeLanguage, isRTL } = useLanguage();
  
  // Notification Settings
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [lotteryResults, setLotteryResults] = useState(true);
  const [promotions, setPromotions] = useState(false);
  const [newsletter, setNewsletter] = useState(false);
  
  // Security Settings
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handleLanguageChange = (lang: 'en' | 'ar' | 'ku') => {
    Alert.alert(
      t('settings.language'),
      `${t('settings.selectLanguage')}?`,
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('common.confirm'),
          onPress: () => {
            changeLanguage(lang);
          },
        },
      ]
    );
  };

  const handleBiometricToggle = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware) {
        Alert.alert(t('common.error'), 'Biometric authentication is not available on this device');
        return;
      }

      if (!isEnrolled) {
        Alert.alert(
          t('common.error'),
          'No biometric data enrolled. Please set up biometric authentication in your device settings.'
        );
        return;
      }

      if (!biometricEnabled) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Authenticate to enable biometric login',
        });

        if (result.success) {
          setBiometricEnabled(true);
          Alert.alert(t('common.success'), 'Biometric login enabled successfully');
        }
      } else {
        setBiometricEnabled(false);
        Alert.alert(t('common.success'), 'Biometric login disabled');
      }
    } catch (error) {
      console.error('Biometric error:', error);
      Alert.alert(t('common.error'), 'Failed to configure biometric authentication');
    }
  };

  const handleChangePassword = () => {
    navigation.navigate('ChangePassword');
  };

  const handleTwoFactorToggle = () => {
    if (!twoFactorEnabled) {
      Alert.alert(
        'Enable 2-Factor Authentication',
        'You will receive a verification code via SMS or email when logging in.',
        [
          { text: t('common.cancel'), style: 'cancel' },
          {
            text: 'Enable',
            onPress: () => {
              setTwoFactorEnabled(true);
              Alert.alert(t('common.success'), '2-Factor authentication enabled');
            },
          },
        ]
      );
    } else {
      setTwoFactorEnabled(false);
      Alert.alert(t('common.success'), '2-Factor authentication disabled');
    }
  };

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@belkhair.com?subject=Support Request');
  };

  const handlePrivacyPolicy = () => {
    navigation.navigate('PrivacyPolicy');
  };

  const handleTermsOfService = () => {
    navigation.navigate('TermsOfService');
  };

  const handleAbout = () => {
    navigation.navigate('About');
  };

  const renderSection = (title: string, children: React.ReactNode) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );

  const renderSettingItem = (
    icon: string,
    label: string,
    value?: string,
    onPress?: () => void,
    showArrow = true
  ) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress} disabled={!onPress}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon as any} size={22} color="#3b82f6" />
        <Text style={styles.settingLabel}>{label}</Text>
      </View>
      <View style={styles.settingRight}>
        {value && <Text style={styles.settingValue}>{value}</Text>}
        {showArrow && onPress && <Ionicons name="chevron-forward" size={20} color="#666" />}
      </View>
    </TouchableOpacity>
  );

  const renderSwitchItem = (
    icon: string,
    label: string,
    value: boolean,
    onValueChange: (value: boolean) => void
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon as any} size={22} color="#3b82f6" />
        <Text style={styles.settingLabel}>{label}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#333', true: '#3b82f660' }}
        thumbColor={value ? '#3b82f6' : '#666'}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('settings.title')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Language & Region */}
        {renderSection(
          t('settings.languageRegion'),
          <>
            <TouchableOpacity
              style={styles.languageOption}
              onPress={() => handleLanguageChange('en')}
            >
              <Text style={styles.languageText}>🇬🇧 {t('settings.english')}</Text>
              {language === 'en' && <Ionicons name="checkmark-circle" size={24} color="#10b981" />}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.languageOption}
              onPress={() => handleLanguageChange('ar')}
            >
              <Text style={styles.languageText}>🇸🇦 {t('settings.arabic')}</Text>
              {language === 'ar' && <Ionicons name="checkmark-circle" size={24} color="#10b981" />}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.languageOption}
              onPress={() => handleLanguageChange('ku')}
            >
              <Text style={styles.languageText}>🇮🇶 {t('settings.kurdish')}</Text>
              {language === 'ku' && <Ionicons name="checkmark-circle" size={24} color="#10b981" />}
            </TouchableOpacity>
          </>
        )}

        {/* Notifications */}
        {renderSection(
          t('settings.notifications'),
          <>
            {renderSwitchItem(
              'notifications',
              t('settings.pushNotifications'),
              pushNotifications,
              setPushNotifications
            )}
            {renderSwitchItem(
              'mail',
              t('settings.emailNotifications'),
              emailNotifications,
              setEmailNotifications
            )}
            {renderSwitchItem(
              'cart',
              t('settings.orderUpdates'),
              orderUpdates,
              setOrderUpdates
            )}
            {renderSwitchItem(
              'trophy',
              t('settings.lotteryResults'),
              lotteryResults,
              setLotteryResults
            )}
            {renderSwitchItem(
              'pricetag',
              t('settings.promotions'),
              promotions,
              setPromotions
            )}
            {renderSwitchItem(
              'newspaper',
              t('settings.newsletter'),
              newsletter,
              setNewsletter
            )}
          </>
        )}

        {/* Security & Privacy */}
        {renderSection(
          t('profile.security'),
          <>
            {renderSettingItem(
              'key',
              t('settings.changePassword'),
              undefined,
              handleChangePassword
            )}
            {renderSwitchItem(
              'shield-checkmark',
              t('settings.twoFactorAuth'),
              twoFactorEnabled,
              handleTwoFactorToggle
            )}
            {renderSwitchItem(
              Platform.OS === 'ios' ? 'finger-print' : 'finger-print',
              Platform.OS === 'ios' ? t('settings.enableFaceId') : t('settings.enableFingerprint'),
              biometricEnabled,
              handleBiometricToggle
            )}
          </>
        )}

        {/* Account */}
        {renderSection(
          t('profile.accountSettings'),
          <>
            {renderSettingItem(
              'person',
              'Edit Profile',
              undefined,
              () => navigation.navigate('UserProfile')
            )}
            {renderSettingItem(
              'card',
              t('profile.paymentMethods'),
              undefined,
              () => navigation.navigate('PaymentMethods')
            )}
            {renderSettingItem(
              'receipt',
              'Payment History',
              undefined,
              () => navigation.navigate('PaymentHistory')
            )}
            {renderSettingItem(
              'location',
              'Saved Addresses',
              undefined,
              () => navigation.navigate('Addresses')
            )}
          </>
        )}

        {/* Support & Legal */}
        {renderSection(
          t('profile.helpSupport'),
          <>
            {renderSettingItem(
              'help-circle',
              'Help Center',
              undefined,
              () => navigation.navigate('HelpCenter')
            )}
            {renderSettingItem(
              'mail',
              'Contact Support',
              undefined,
              handleContactSupport
            )}
            {renderSettingItem(
              'document-text',
              t('profile.privacyPolicy'),
              undefined,
              handlePrivacyPolicy
            )}
            {renderSettingItem(
              'document-text',
              t('profile.termsOfService'),
              undefined,
              handleTermsOfService
            )}
            {renderSettingItem(
              'information-circle',
              t('profile.about'),
              undefined,
              handleAbout
            )}
          </>
        )}

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>Belkhair E-Commerce</Text>
          <Text style={styles.appInfoText}>{t('profile.version')} 1.0.0</Text>
          <Text style={styles.appInfoSubtext}>© 2024 Belkhair. All rights reserved.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    paddingBottom: 16,
    backgroundColor: '#2d2d2d',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: '#fff',
    flex: 1,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingValue: {
    fontSize: 14,
    color: '#999',
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  languageText: {
    fontSize: 16,
    color: '#fff',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  appInfoText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  appInfoSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
});
