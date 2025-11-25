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
import type { Review } from '../services/api';

type FilterStatus = 'all' | 'pending' | 'approved' | 'rejected';

export default function AdminReviewsScreen() {
  const navigation = useNavigation<any>();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [selectedReviews, setSelectedReviews] = useState<number[]>([]);

  useEffect(() => {
    loadReviews();
  }, []);

  useEffect(() => {
    filterReviewsByStatus();
  }, [reviews, filterStatus]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await trpc.reviews.list.query();
      setReviews(data);
    } catch (error) {
      console.error('Error loading reviews:', error);
      Alert.alert('Error', 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReviews();
    setRefreshing(false);
  };

  const filterReviewsByStatus = () => {
    if (filterStatus === 'all') {
      setFilteredReviews(reviews);
    } else {
      setFilteredReviews(reviews.filter(r => r.status === filterStatus));
    }
  };

  const handleApprove = async (reviewId: number) => {
    try {
      await trpc.reviews.approve.mutate({ id: reviewId });
      Alert.alert('Success', 'Review approved');
      loadReviews();
    } catch (error) {
      console.error('Error approving review:', error);
      Alert.alert('Error', 'Failed to approve review');
    }
  };

  const handleReject = async (reviewId: number) => {
    try {
      await trpc.reviews.reject.mutate({ id: reviewId });
      Alert.alert('Success', 'Review rejected');
      loadReviews();
    } catch (error) {
      console.error('Error rejecting review:', error);
      Alert.alert('Error', 'Failed to reject review');
    }
  };

  const handleDelete = (review: Review) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this review?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await trpc.reviews.delete.mutate({ id: review.id });
              Alert.alert('Success', 'Review deleted');
              loadReviews();
            } catch (error) {
              console.error('Error deleting review:', error);
              Alert.alert('Error', 'Failed to delete review');
            }
          },
        },
      ]
    );
  };

  const toggleReviewSelection = (reviewId: number) => {
    setSelectedReviews(prev =>
      prev.includes(reviewId)
        ? prev.filter(id => id !== reviewId)
        : [...prev, reviewId]
    );
  };

  const handleBulkApprove = async () => {
    if (selectedReviews.length === 0) {
      Alert.alert('Error', 'No reviews selected');
      return;
    }

    try {
      await trpc.reviews.bulkApprove.mutate({ ids: selectedReviews });
      Alert.alert('Success', `${selectedReviews.length} reviews approved`);
      setSelectedReviews([]);
      loadReviews();
    } catch (error) {
      console.error('Error bulk approving:', error);
      Alert.alert('Error', 'Failed to approve reviews');
    }
  };

  const handleBulkReject = async () => {
    if (selectedReviews.length === 0) {
      Alert.alert('Error', 'No reviews selected');
      return;
    }

    try {
      await trpc.reviews.bulkReject.mutate({ ids: selectedReviews });
      Alert.alert('Success', `${selectedReviews.length} reviews rejected`);
      setSelectedReviews([]);
      loadReviews();
    } catch (error) {
      console.error('Error bulk rejecting:', error);
      Alert.alert('Error', 'Failed to reject reviews');
    }
  };

  const renderStars = (rating: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? 'star' : 'star-outline'}
            size={16}
            color="#f39c12"
          />
        ))}
      </View>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return '#27ae60';
      case 'rejected':
        return '#e74c3c';
      case 'pending':
        return '#f39c12';
      default:
        return '#95a5a6';
    }
  };

  const renderReview = (review: Review) => {
    const isSelected = selectedReviews.includes(review.id);
    const statusColor = getStatusColor(review.status);

    return (
      <View key={review.id} style={[
        styles.reviewCard,
        isSelected && styles.reviewCardSelected
      ]}>
        <TouchableOpacity
          style={styles.selectCheckbox}
          onPress={() => toggleReviewSelection(review.id)}
        >
          <Ionicons
            name={isSelected ? 'checkbox' : 'square-outline'}
            size={24}
            color={isSelected ? '#e74c3c' : '#666'}
          />
        </TouchableOpacity>

        <View style={styles.reviewContent}>
          <View style={styles.reviewHeader}>
            <View style={styles.reviewInfo}>
              <Text style={styles.reviewUser}>
                {review.user?.name || 'Anonymous'}
              </Text>
              {renderStars(review.rating)}
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
              <Text style={[styles.statusText, { color: statusColor }]}>
                {review.status}
              </Text>
            </View>
          </View>

          {review.title && (
            <Text style={styles.reviewTitle}>{review.title}</Text>
          )}

          {review.comment && (
            <Text style={styles.reviewComment}>{review.comment}</Text>
          )}

          <View style={styles.reviewMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="cube" size={14} color="#999" />
              <Text style={styles.metaText}>
                Product ID: {review.product_id}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="thumbs-up" size={14} color="#999" />
              <Text style={styles.metaText}>{review.helpful_count} helpful</Text>
            </View>
          </View>

          {review.status === 'pending' && (
            <View style={styles.reviewActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.approveButton]}
                onPress={() => handleApprove(review.id)}
              >
                <Ionicons name="checkmark-circle" size={18} color="#fff" />
                <Text style={styles.actionButtonText}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.rejectButton]}
                onPress={() => handleReject(review.id)}
              >
                <Ionicons name="close-circle" size={18} color="#fff" />
                <Text style={styles.actionButtonText}>Reject</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDelete(review)}
          >
            <Ionicons name="trash" size={16} color="#e74c3c" />
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderFilterButton = (status: FilterStatus, label: string) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filterStatus === status && styles.filterButtonActive
      ]}
      onPress={() => setFilterStatus(status)}
    >
      <Text style={[
        styles.filterButtonText,
        filterStatus === status && styles.filterButtonTextActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const pendingCount = reviews.filter(r => r.status === 'pending').length;
  const approvedCount = reviews.filter(r => r.status === 'approved').length;
  const rejectedCount = reviews.filter(r => r.status === 'rejected').length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reviews Management</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{pendingCount}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{approvedCount}</Text>
          <Text style={styles.statLabel}>Approved</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{rejectedCount}</Text>
          <Text style={styles.statLabel}>Rejected</Text>
        </View>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {renderFilterButton('all', 'All')}
        {renderFilterButton('pending', 'Pending')}
        {renderFilterButton('approved', 'Approved')}
        {renderFilterButton('rejected', 'Rejected')}
      </View>

      {/* Bulk Actions */}
      {selectedReviews.length > 0 && (
        <View style={styles.bulkActionsBar}>
          <Text style={styles.bulkActionsText}>
            {selectedReviews.length} selected
          </Text>
          <View style={styles.bulkActionsButtons}>
            <TouchableOpacity
              style={[styles.bulkActionButton, styles.bulkApproveButton]}
              onPress={handleBulkApprove}
            >
              <Ionicons name="checkmark" size={18} color="#fff" />
              <Text style={styles.bulkActionButtonText}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.bulkActionButton, styles.bulkRejectButton]}
              onPress={handleBulkReject}
            >
              <Ionicons name="close" size={18} color="#fff" />
              <Text style={styles.bulkActionButtonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#e74c3c" />
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {filteredReviews.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="star-outline" size={64} color="#666" />
              <Text style={styles.emptyText}>No reviews found</Text>
              <Text style={styles.emptySubtext}>
                {filterStatus !== 'all' 
                  ? `No ${filterStatus} reviews`
                  : 'No reviews yet'}
              </Text>
            </View>
          ) : (
            filteredReviews.map(renderReview)
          )}
        </ScrollView>
      )}
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
  statsBar: {
    flexDirection: 'row',
    backgroundColor: '#16213e',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
    backgroundColor: '#16213e',
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#1a1a2e',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#e74c3c20',
    borderColor: '#e74c3c',
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#999',
  },
  filterButtonTextActive: {
    color: '#e74c3c',
  },
  bulkActionsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#9b59b6',
  },
  bulkActionsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  bulkActionsButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  bulkActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 5,
  },
  bulkApproveButton: {
    backgroundColor: '#27ae60',
  },
  bulkRejectButton: {
    backgroundColor: '#e74c3c',
  },
  bulkActionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginTop: 15,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
  reviewCard: {
    flexDirection: 'row',
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  reviewCardSelected: {
    backgroundColor: '#e74c3c10',
    borderColor: '#e74c3c',
  },
  selectCheckbox: {
    marginRight: 12,
  },
  reviewContent: {
    flex: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  reviewInfo: {
    flex: 1,
  },
  reviewUser: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  reviewTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 6,
  },
  reviewComment: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 20,
    marginBottom: 10,
  },
  reviewMeta: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontSize: 12,
    color: '#999',
  },
  reviewActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 6,
    gap: 6,
  },
  approveButton: {
    backgroundColor: '#27ae60',
  },
  rejectButton: {
    backgroundColor: '#e74c3c',
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 5,
    marginTop: 8,
  },
  deleteButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#e74c3c',
  },
});
