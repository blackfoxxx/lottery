import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');

  const isRTL = language === 'ar';

  const texts = {
    ar: {
      profile: 'الملف الشخصي',
      account: 'الحساب',
      myOrders: 'طلباتي',
      myTickets: 'تذاكري',
      settings: 'الإعدادات',
      language: 'اللغة',
      notifications: 'الإشعارات',
      help: 'المساعدة',
      about: 'حول التطبيق',
      logout: 'تسجيل الخروج',
      confirmLogout: 'تأكيد تسجيل الخروج',
      confirmLogoutMessage: 'هل تريد تسجيل الخروج من حسابك؟',
      cancel: 'إلغاء',
      yes: 'نعم',
      email: 'البريد الإلكتروني',
      phone: 'رقم الهاتف',
      memberSince: 'عضو منذ',
      editProfile: 'تعديل الملف الشخصي',
    },
    en: {
      profile: 'Profile',
      account: 'Account',
      myOrders: 'My Orders',
      myTickets: 'My Tickets',
      settings: 'Settings',
      language: 'Language',
      notifications: 'Notifications',
      help: 'Help',
      about: 'About',
      logout: 'Logout',
      confirmLogout: 'Confirm Logout',
      confirmLogoutMessage: 'Do you want to logout from your account?',
      cancel: 'Cancel',
      yes: 'Yes',
      email: 'Email',
      phone: 'Phone',
      memberSince: 'Member Since',
      editProfile: 'Edit Profile',
    },
  };

  const t = texts[language];

  const handleLogout = () => {
    Alert.alert(
      t.confirmLogout,
      t.confirmLogoutMessage,
      [
        { text: t.cancel, style: 'cancel' },
        {
          text: t.yes,
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const menuItems = [
    ...(user?.role === 'admin' ? [{
      id: 'admin',
      icon: 'shield-checkmark-outline',
      label: 'Admin Dashboard',
      onPress: () => navigation.navigate('AdminDashboard'),
    }] : []),
    {
      id: 'orders',
      icon: 'receipt-outline',
      label: t.myOrders,
      onPress: () => Alert.alert(t.myOrders, 'Orders screen coming soon!'),
    },
    {
      id: 'tickets',
      icon: 'ticket-outline',
      label: t.myTickets,
      onPress: () => navigation.navigate('MyTickets'),
    },
    {
      id: 'editProfile',
      icon: 'person-outline',
      label: t.editProfile,
      onPress: () => navigation.navigate('UserProfile'),
    },
    {
      id: 'settings',
      icon: 'settings-outline',
      label: t.settings,
      onPress: () => navigation.navigate('Settings'),
    },
    {
      id: 'language',
      icon: 'language-outline',
      label: t.language,
      onPress: () => setLanguage(language === 'ar' ? 'en' : 'ar'),
    },
    {
      id: 'notifications',
      icon: 'notifications-outline',
      label: t.notifications,
      onPress: () => Alert.alert(t.notifications, 'Notifications settings coming soon!'),
    },
    {
      id: 'help',
      icon: 'help-circle-outline',
      label: t.help,
      onPress: () => Alert.alert(t.help, 'Help & Support coming soon!'),
    },
    {
      id: 'about',
      icon: 'information-circle-outline',
      label: t.about,
      onPress: () => Alert.alert(t.about, 'Belkhair v1.0.0'),
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, isRTL && styles.rtlText]}>{t.profile}</Text>
        <TouchableOpacity onPress={() => setLanguage(language === 'ar' ? 'en' : 'ar')}>
          <Ionicons name="language" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={50} color="#fff" />
            </View>
          </View>
          
          <Text style={[styles.userName, isRTL && styles.rtlText]}>
            {user?.name || 'User'}
          </Text>
          
          <View style={styles.userInfo}>
            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={16} color="#bbb" />
              <Text style={styles.infoText}>{user?.email || 'N/A'}</Text>
            </View>
            
            {user?.phone && (
              <View style={styles.infoRow}>
                <Ionicons name="call-outline" size={16} color="#bbb" />
                <Text style={styles.infoText}>{user.phone}</Text>
              </View>
            )}
            
            {user?.created_at && (
              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={16} color="#bbb" />
                <Text style={styles.infoText}>
                  {t.memberSince} {formatDate(user.created_at)}
                </Text>
              </View>
            )}
          </View>
          
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => Alert.alert(t.editProfile, 'Edit profile coming soon!')}
          >
            <Ionicons name="create-outline" size={18} color="#fff" />
            <Text style={styles.editButtonText}>{t.editProfile}</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIconContainer}>
                  <Ionicons name={item.icon as any} size={22} color="#e74c3c" />
                </View>
                <Text style={[styles.menuItemText, isRTL && styles.rtlText]}>
                  {item.label}
                </Text>
              </View>
              <Ionicons 
                name={isRTL ? "chevron-back" : "chevron-forward"} 
                size={20} 
                color="#666" 
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={22} color="#fff" />
          <Text style={styles.logoutButtonText}>{t.logout}</Text>
        </TouchableOpacity>

        {/* Version Info */}
        <Text style={styles.versionText}>Belkhair v1.0.0</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#16213e',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollContainer: {
    padding: 20,
  },
  profileCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  userInfo: {
    width: '100%',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#bbb',
    marginLeft: 10,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
    borderWidth: 1,
    borderColor: '#e74c3c',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 10,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  menuContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuItemText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
    borderWidth: 1,
    borderColor: '#e74c3c',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  versionText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  // RTL Styles
  rtlText: {
    textAlign: 'right',
  },
});

export default ProfileScreen;
