import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import trpc from '../services/trpc';
import type { BundleAnalytics } from '../services/api';

export default function AdminAnalyticsScreen() {
  const navigation = useNavigation<any>();
  const [analytics, setAnalytics] = useState<BundleAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const endDate = new Date();
      let startDate = new Date();

      switch (dateRange) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(endDate.getDate() - 90);
          break;
        case 'all':
          startDate = new Date(0); // Beginning of time
          break;
      }

      const data = await trpc.bundleAnalytics.overview.query({
        start_date: dateRange === 'all' ? undefined : startDate.toISOString(),
        end_date: endDate.toISOString(),
      });

      const performance = await trpc.bundleAnalytics.performance.query({
        start_date: dateRange === 'all' ? undefined : startDate.toISOString(),
        end_date: endDate.toISOString(),
      });

      setAnalytics({
        ...data,
        bundles: performance,
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
      Alert.alert('Error', 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAnalytics();
    setRefreshing(false);
  };

  const renderDateRangeButton = (range: '7d' | '30d' | '90d' | 'all', label: string) => (
    <TouchableOpacity
      style={[
        styles.dateRangeButton,
        dateRange === range && styles.dateRangeButtonActive
      ]}
      onPress={() => setDateRange(range)}
    >
      <Text style={[
        styles.dateRangeButtonText,
        dateRange === range && styles.dateRangeButtonTextActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderBundlePerformance = (bundle: BundleAnalytics['bundles'][0]) => {
    const conversionRate = bundle.conversion_rate * 100;

    return (
      <View key={bundle.id} style={styles.bundleCard}>
        <View style={styles.bundleHeader}>
          <Text style={styles.bundleName}>{bundle.name}</Text>
          <Text style={styles.bundleRevenue}>${bundle.revenue.toFixed(2)}</Text>
        </View>

        <View style={styles.metricsGrid}>
          <View style={styles.metricItem}>
            <Ionicons name="eye" size={20} color="#3498db" />
            <Text style={styles.metricValue}>{bundle.views}</Text>
            <Text style={styles.metricLabel}>Views</Text>
          </View>

          <View style={styles.metricItem}>
            <Ionicons name="cart" size={20} color="#27ae60" />
            <Text style={styles.metricValue}>{bundle.conversions}</Text>
            <Text style={styles.metricLabel}>Conversions</Text>
          </View>

          <View style={styles.metricItem}>
            <Ionicons name="trending-up" size={20} color="#f39c12" />
            <Text style={styles.metricValue}>{conversionRate.toFixed(1)}%</Text>
            <Text style={styles.metricLabel}>Conv. Rate</Text>
          </View>

          <View style={styles.metricItem}>
            <Ionicons name="cash" size={20} color="#e74c3c" />
            <Text style={styles.metricValue}>${bundle.revenue.toFixed(0)}</Text>
            <Text style={styles.metricLabel}>Revenue</Text>
          </View>
        </View>

        {/* Progress Bar for Conversion Rate */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View 
              style={[
                styles.progressBarFill,
                { width: `${Math.min(conversionRate, 100)}%` }
              ]}
            />
          </View>
        </View>
      </View>
    );
  };

  if (loading && !analytics) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bundle Analytics</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#e74c3c" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bundle Analytics</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Date Range Selector */}
      <View style={styles.dateRangeContainer}>
        {renderDateRangeButton('7d', '7 Days')}
        {renderDateRangeButton('30d', '30 Days')}
        {renderDateRangeButton('90d', '90 Days')}
        {renderDateRangeButton('all', 'All Time')}
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Overview Cards */}
        <View style={styles.overviewGrid}>
          <View style={[styles.overviewCard, { borderLeftColor: '#3498db' }]}>
            <Ionicons name="cube" size={32} color="#3498db" />
            <Text style={styles.overviewValue}>{analytics?.total_bundles || 0}</Text>
            <Text style={styles.overviewLabel}>Total Bundles</Text>
          </View>

          <View style={[styles.overviewCard, { borderLeftColor: '#27ae60' }]}>
            <Ionicons name="checkmark-circle" size={32} color="#27ae60" />
            <Text style={styles.overviewValue}>{analytics?.active_bundles || 0}</Text>
            <Text style={styles.overviewLabel}>Active Bundles</Text>
          </View>

          <View style={[styles.overviewCard, { borderLeftColor: '#e74c3c' }]}>
            <Ionicons name="cash" size={32} color="#e74c3c" />
            <Text style={styles.overviewValue}>
              ${(analytics?.total_revenue || 0).toFixed(2)}
            </Text>
            <Text style={styles.overviewLabel}>Total Revenue</Text>
          </View>
        </View>

        {/* Bundle Performance Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Bundle Performance</Text>
            <Ionicons name="bar-chart" size={20} color="#999" />
          </View>

          {analytics?.bundles && analytics.bundles.length > 0 ? (
            analytics.bundles
              .sort((a, b) => b.revenue - a.revenue)
              .map(renderBundlePerformance)
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="analytics-outline" size={64} color="#666" />
              <Text style={styles.emptyText}>No bundle data available</Text>
              <Text style={styles.emptySubtext}>
                Bundle performance will appear here once you have active bundles
              </Text>
            </View>
          )}
        </View>

        {/* Insights Section */}
        {analytics?.bundles && analytics.bundles.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Insights</Text>
              <Ionicons name="bulb" size={20} color="#f39c12" />
            </View>

            <View style={styles.insightCard}>
              <Ionicons name="trophy" size={24} color="#f39c12" />
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Top Performing Bundle</Text>
                <Text style={styles.insightText}>
                  {analytics.bundles.sort((a, b) => b.revenue - a.revenue)[0]?.name}
                </Text>
                <Text style={styles.insightSubtext}>
                  ${analytics.bundles.sort((a, b) => b.revenue - a.revenue)[0]?.revenue.toFixed(2)} revenue
                </Text>
              </View>
            </View>

            <View style={styles.insightCard}>
              <Ionicons name="trending-up" size={24} color="#27ae60" />
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Best Conversion Rate</Text>
                <Text style={styles.insightText}>
                  {analytics.bundles.sort((a, b) => b.conversion_rate - a.conversion_rate)[0]?.name}
                </Text>
                <Text style={styles.insightSubtext}>
                  {(analytics.bundles.sort((a, b) => b.conversion_rate - a.conversion_rate)[0]?.conversion_rate * 100).toFixed(1)}% conversion rate
                </Text>
              </View>
            </View>

            <View style={styles.insightCard}>
              <Ionicons name="eye" size={24} color="#3498db" />
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Most Viewed Bundle</Text>
                <Text style={styles.insightText}>
                  {analytics.bundles.sort((a, b) => b.views - a.views)[0]?.name}
                </Text>
                <Text style={styles.insightSubtext}>
                  {analytics.bundles.sort((a, b) => b.views - a.views)[0]?.views} views
                </Text>
              </View>
            </View>
          </View>
        )}
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
  dateRangeContainer: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
    backgroundColor: '#16213e',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  dateRangeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#1a1a2e',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  dateRangeButtonActive: {
    backgroundColor: '#27ae6020',
    borderColor: '#27ae60',
  },
  dateRangeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
  },
  dateRangeButtonTextActive: {
    color: '#27ae60',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overviewGrid: {
    padding: 15,
    gap: 12,
  },
  overviewCard: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  overviewValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  overviewLabel: {
    fontSize: 13,
    color: '#999',
    marginTop: 5,
  },
  section: {
    padding: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  bundleCard: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  bundleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  bundleName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
  },
  bundleRevenue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 5,
  },
  metricLabel: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  progressBarContainer: {
    marginTop: 5,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#1a1a2e',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#27ae60',
    borderRadius: 3,
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    gap: 15,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 13,
    color: '#999',
    marginBottom: 4,
  },
  insightText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  insightSubtext: {
    fontSize: 12,
    color: '#999',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginTop: 15,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#999',
    marginTop: 5,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
});
