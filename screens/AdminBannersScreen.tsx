import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Modal,
  Image,
  Alert,
  ActivityIndicator,
  Switch,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import trpc from '../services/trpc';
import type { Banner } from '../services/api';

export default function AdminBannersScreen() {
  const navigation = useNavigation<any>();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [displayOrder, setDisplayOrder] = useState('0');

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      setLoading(true);
      const data = await trpc.banners.list.query();
      setBanners(data);
    } catch (error) {
      console.error('Error loading banners:', error);
      Alert.alert('Error', 'Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBanners();
    setRefreshing(false);
  };

  const openCreateModal = () => {
    setEditingBanner(null);
    setTitle('');
    setDescription('');
    setImageUrl('');
    setLinkUrl('');
    setIsActive(true);
    setDisplayOrder('0');
    setModalVisible(true);
  };

  const openEditModal = (banner: Banner) => {
    setEditingBanner(banner);
    setTitle(banner.title);
    setDescription(banner.description || '');
    setImageUrl(banner.image_url);
    setLinkUrl(banner.link_url || '');
    setIsActive(banner.is_active);
    setDisplayOrder(banner.display_order.toString());
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!title || !imageUrl) {
      Alert.alert('Error', 'Title and Image URL are required');
      return;
    }

    try {
      if (editingBanner) {
        await trpc.banners.update.mutate({
          id: editingBanner.id,
          title,
          description,
          image_url: imageUrl,
          link_url: linkUrl,
          is_active: isActive,
          display_order: parseInt(displayOrder) || 0,
        });
        Alert.alert('Success', 'Banner updated successfully');
      } else {
        await trpc.banners.create.mutate({
          title,
          description,
          image_url: imageUrl,
          link_url: linkUrl,
          is_active: isActive,
          display_order: parseInt(displayOrder) || 0,
        });
        Alert.alert('Success', 'Banner created successfully');
      }
      setModalVisible(false);
      loadBanners();
    } catch (error) {
      console.error('Error saving banner:', error);
      Alert.alert('Error', 'Failed to save banner');
    }
  };

  const handleDelete = (banner: Banner) => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete "${banner.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await trpc.banners.delete.mutate({ id: banner.id });
              Alert.alert('Success', 'Banner deleted successfully');
              loadBanners();
            } catch (error) {
              console.error('Error deleting banner:', error);
              Alert.alert('Error', 'Failed to delete banner');
            }
          },
        },
      ]
    );
  };

  const handleToggleActive = async (banner: Banner) => {
    try {
      await trpc.banners.toggleActive.mutate({ id: banner.id });
      loadBanners();
    } catch (error) {
      console.error('Error toggling banner:', error);
      Alert.alert('Error', 'Failed to toggle banner status');
    }
  };

  const renderBanner = (banner: Banner) => (
    <View key={banner.id} style={styles.bannerCard}>
      <Image
        source={{ uri: banner.image_url }}
        style={styles.bannerImage}
        resizeMode="cover"
      />
      <View style={styles.bannerContent}>
        <View style={styles.bannerHeader}>
          <Text style={styles.bannerTitle}>{banner.title}</Text>
          <View style={styles.bannerActions}>
            <TouchableOpacity
              onPress={() => handleToggleActive(banner)}
              style={styles.actionButton}
            >
              <Ionicons
                name={banner.is_active ? 'eye' : 'eye-off'}
                size={20}
                color={banner.is_active ? '#27ae60' : '#95a5a6'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => openEditModal(banner)}
              style={styles.actionButton}
            >
              <Ionicons name="create" size={20} color="#3498db" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDelete(banner)}
              style={styles.actionButton}
            >
              <Ionicons name="trash" size={20} color="#e74c3c" />
            </TouchableOpacity>
          </View>
        </View>
        {banner.description && (
          <Text style={styles.bannerDescription}>{banner.description}</Text>
        )}
        <View style={styles.bannerMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="layers" size={14} color="#999" />
            <Text style={styles.metaText}>Order: {banner.display_order}</Text>
          </View>
          <View style={[
            styles.statusBadge,
            { backgroundColor: banner.is_active ? '#27ae6020' : '#95a5a620' }
          ]}>
            <Text style={[
              styles.statusText,
              { color: banner.is_active ? '#27ae60' : '#95a5a6' }
            ]}>
              {banner.is_active ? 'Active' : 'Inactive'}
            </Text>
          </View>
        </View>
      </View>
    </View>
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
        <Text style={styles.headerTitle}>Banners Management</Text>
        <TouchableOpacity onPress={openCreateModal} style={styles.addButton}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

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
          {banners.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="image-outline" size={64} color="#666" />
              <Text style={styles.emptyText}>No banners yet</Text>
              <Text style={styles.emptySubtext}>
                Tap the + button to create your first banner
              </Text>
            </View>
          ) : (
            banners.map(renderBanner)
          )}
        </ScrollView>
      )}

      {/* Create/Edit Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingBanner ? 'Edit Banner' : 'Create Banner'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.label}>Title *</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Enter banner title"
                placeholderTextColor="#666"
              />

              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Enter description"
                placeholderTextColor="#666"
                multiline
                numberOfLines={3}
              />

              <Text style={styles.label}>Image URL *</Text>
              <TextInput
                style={styles.input}
                value={imageUrl}
                onChangeText={setImageUrl}
                placeholder="https://example.com/image.jpg"
                placeholderTextColor="#666"
                autoCapitalize="none"
              />

              <Text style={styles.label}>Link URL</Text>
              <TextInput
                style={styles.input}
                value={linkUrl}
                onChangeText={setLinkUrl}
                placeholder="https://example.com/page"
                placeholderTextColor="#666"
                autoCapitalize="none"
              />

              <Text style={styles.label}>Display Order</Text>
              <TextInput
                style={styles.input}
                value={displayOrder}
                onChangeText={setDisplayOrder}
                placeholder="0"
                placeholderTextColor="#666"
                keyboardType="number-pad"
              />

              <View style={styles.switchRow}>
                <Text style={styles.label}>Active</Text>
                <Switch
                  value={isActive}
                  onValueChange={setIsActive}
                  trackColor={{ false: '#767577', true: '#e74c3c' }}
                  thumbColor={isActive ? '#fff' : '#f4f3f4'}
                />
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>
                  {editingBanner ? 'Update Banner' : 'Create Banner'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  addButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    padding: 20,
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
    textAlign: 'center',
  },
  bannerCard: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  bannerImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#0f1419',
  },
  bannerContent: {
    padding: 15,
  },
  bannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
  },
  bannerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    padding: 5,
  },
  bannerDescription: {
    fontSize: 14,
    color: '#999',
    marginBottom: 10,
  },
  bannerMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#16213e',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalBody: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#1a1a2e',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 14,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  saveButton: {
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
