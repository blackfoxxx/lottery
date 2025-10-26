import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../../services/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { MainTabParamList } from '../../types';
import { SIZES } from '../../constants';
import CustomButton from '../../components/CustomButton';
import apiService from '../../services/ApiService';

type HomeScreenNavigationProp = StackNavigationProp<MainTabParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Iraqi E-commerce Lottery</Text>
          <Text style={styles.subtitle}>
            Welcome back, {user?.name}!
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Quick Stats</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Products Available</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>5</Text>
              <Text style={styles.statLabel}>Categories</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏆 Featured Categories</Text>
          <View style={styles.categoryContainer}>
            <View style={[styles.categoryCard, { backgroundColor: COLORS.golden }]}>
              <Text style={styles.categoryEmoji}>🥇</Text>
              <Text style={styles.categoryName}>Golden</Text>
            </View>
            <View style={[styles.categoryCard, { backgroundColor: COLORS.silver }]}>
              <Text style={styles.categoryEmoji}>🥈</Text>
              <Text style={styles.categoryName}>Silver</Text>
            </View>
            <View style={[styles.categoryCard, { backgroundColor: COLORS.bronze }]}>
              <Text style={styles.categoryEmoji}>🥉</Text>
              <Text style={styles.categoryName}>Bronze</Text>
            </View>
            <View style={[styles.categoryCard, { backgroundColor: COLORS.platinum }]}>
              <Text style={styles.categoryEmoji}>💎</Text>
              <Text style={styles.categoryName}>Platinum</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <CustomButton
            title="Sign Out"
            onPress={logout}
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
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SIZES.paddingLarge,
  },
  header: {
    alignItems: 'center',
    marginBottom: SIZES.marginXLarge,
  },
  title: {
    fontSize: SIZES.fontXXLarge,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SIZES.marginSmall,
  },
  subtitle: {
    fontSize: SIZES.fontLarge,
    color: COLORS.text,
    textAlign: 'center',
  },
  section: {
    marginBottom: SIZES.marginXLarge,
  },
  sectionTitle: {
    fontSize: SIZES.fontLarge,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.marginMedium,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCard: {
    backgroundColor: COLORS.surface,
    padding: SIZES.paddingLarge,
    borderRadius: SIZES.borderRadiusLarge,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: SIZES.marginSmall,
  },
  statNumber: {
    fontSize: SIZES.fontXXLarge,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: SIZES.fontMedium,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SIZES.marginSmall,
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
  },
  categoryEmoji: {
    fontSize: SIZES.fontXXLarge,
    marginBottom: SIZES.marginSmall,
  },
  categoryName: {
    fontSize: SIZES.fontMedium,
    fontWeight: '600',
    color: COLORS.background,
  },
  logoutButton: {
    marginTop: SIZES.marginLarge,
  },
});

export default HomeScreen;
