import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SocialProofBadgeProps {
  productId: number;
  showViewers?: boolean;
  showPurchases?: boolean;
  compact?: boolean;
}

interface ActivityData {
  viewing_now: number;
  purchased_last_24h: number;
}

export default function SocialProofBadge({
  productId,
  showViewers = true,
  showPurchases = true,
  compact = false,
}: SocialProofBadgeProps) {
  const [activity, setActivity] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivity();
    // Refresh every 30 seconds
    const interval = setInterval(fetchActivity, 30000);
    return () => clearInterval(interval);
  }, [productId]);

  const fetchActivity = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/social-proof/product/${productId}`
      );
      const data = await response.json();
      setActivity(data);
    } catch (error) {
      console.error('Failed to fetch social proof data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !activity) return null;

  const showViewersBadge = showViewers && activity.viewing_now > 0;
  const showPurchasesBadge = showPurchases && activity.purchased_last_24h > 0;

  if (!showViewersBadge && !showPurchasesBadge) return null;

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        {showViewersBadge && (
          <View style={styles.compactBadge}>
            <Ionicons name="eye" size={12} color="#3B82F6" />
            <Text style={styles.compactText}>{activity.viewing_now}</Text>
          </View>
        )}
        {showPurchasesBadge && (
          <View style={styles.compactBadge}>
            <Ionicons name="bag" size={12} color="#10B981" />
            <Text style={styles.compactText}>{activity.purchased_last_24h}</Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {showViewersBadge && (
        <View style={[styles.badge, styles.viewersBadge]}>
          <Ionicons name="eye" size={14} color="#3B82F6" />
          <Text style={styles.badgeText}>
            {activity.viewing_now} {activity.viewing_now === 1 ? 'person' : 'people'} viewing
          </Text>
        </View>
      )}
      {showPurchasesBadge && (
        <View style={[styles.badge, styles.purchasesBadge]}>
          <Ionicons name="trending-up" size={14} color="#10B981" />
          <Text style={styles.badgeText}>{activity.purchased_last_24h} sold in 24h</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  compactContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    gap: 6,
  },
  viewersBadge: {
    backgroundColor: '#EFF6FF',
  },
  purchasesBadge: {
    backgroundColor: '#ECFDF5',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '500',
  },
  compactBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  compactText: {
    fontSize: 11,
    fontWeight: '500',
  },
});
