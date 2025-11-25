import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

interface AdminMenuItem {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  screen: string;
  color: string;
}

export default function AdminDashboardScreen() {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();

  const adminMenuItems: AdminMenuItem[] = [
    {
      id: 'banners',
      title: 'Banners Management',
      description: 'Manage promotional banners',
      icon: 'image',
      screen: 'AdminBanners',
      color: '#3498db',
    },
    {
      id: 'bundles',
      title: 'Bundles Management',
      description: 'Create and manage product bundles',
      icon: 'cube',
      screen: 'AdminBundles',
      color: '#9b59b6',
    },
    {
      id: 'reviews',
      title: 'Reviews Management',
      description: 'Moderate customer reviews',
      icon: 'star',
      screen: 'AdminReviews',
      color: '#f39c12',
    },
    {
      id: 'analytics',
      title: 'Bundle Analytics',
      description: 'View bundle performance metrics',
      icon: 'analytics',
      screen: 'AdminAnalytics',
      color: '#27ae60',
    },
  ];

  const renderMenuItem = (item: AdminMenuItem) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.menuItem, { borderLeftColor: item.color }]}
      onPress={() => navigation.navigate(item.screen)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
        <Ionicons name={item.icon} size={32} color={item.color} />
      </View>
      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{item.title}</Text>
        <Text style={styles.menuDescription}>{item.description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#999" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeCard}>
          <Ionicons name="shield-checkmark" size={48} color="#e74c3c" />
          <Text style={styles.welcomeTitle}>Admin Panel</Text>
          <Text style={styles.welcomeText}>
            Manage your e-commerce platform
          </Text>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Management Tools</Text>
          {adminMenuItems.map(renderMenuItem)}
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Quick Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Ionicons name="image" size={24} color="#3498db" />
              <Text style={styles.statValue}>-</Text>
              <Text style={styles.statLabel}>Banners</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="cube" size={24} color="#9b59b6" />
              <Text style={styles.statValue}>-</Text>
              <Text style={styles.statLabel}>Bundles</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="star" size={24} color="#f39c12" />
              <Text style={styles.statValue}>-</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="trending-up" size={24} color="#27ae60" />
              <Text style={styles.statValue}>-</Text>
              <Text style={styles.statLabel}>Revenue</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#16213e',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 34,
  },
  content: {
    flex: 1,
  },
  welcomeCard: {
    backgroundColor: '#16213e',
    margin: 20,
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(231, 76, 60, 0.3)',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 15,
  },
  welcomeText: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
  menuSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213e',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 13,
    color: '#999',
  },
  statsCard: {
    backgroundColor: '#16213e',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: '#1a1a2e',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
});
