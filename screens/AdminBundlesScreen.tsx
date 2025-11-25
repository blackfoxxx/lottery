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
  Alert,
  ActivityIndicator,
  Switch,
  RefreshControl,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import trpc from '../services/trpc';
import type { Bundle, Product } from '../services/api';
import { productsAPI } from '../services/api';

export default function AdminBundlesScreen() {
  const navigation = useNavigation<any>();
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [productSelectorVisible, setProductSelectorVisible] = useState(false);
  const [editingBundle, setEditingBundle] = useState<Bundle | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [bundlesData, productsData] = await Promise.all([
        trpc.bundles.list.query(),
        productsAPI.getProducts({ per_page: 100 }),
      ]);
      setBundles(bundlesData);
      setProducts(productsData.data.data);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const openCreateModal = () => {
    setEditingBundle(null);
    setName('');
    setDescription('');
    setDiscountType('percentage');
    setDiscountValue('');
    setIsActive(true);
    setSelectedProductIds([]);
    setModalVisible(true);
  };

  const openEditModal = (bundle: Bundle) => {
    setEditingBundle(bundle);
    setName(bundle.name);
    setDescription(bundle.description || '');
    setDiscountType(bundle.discount_type);
    setDiscountValue(bundle.discount_value.toString());
    setIsActive(bundle.is_active);
    setSelectedProductIds(bundle.product_ids);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!name || !discountValue || selectedProductIds.length === 0) {
      Alert.alert('Error', 'Name, discount value, and at least one product are required');
      return;
    }

    const discountNum = parseFloat(discountValue);
    if (isNaN(discountNum) || discountNum <= 0) {
      Alert.alert('Error', 'Discount value must be a positive number');
      return;
    }

    if (discountType === 'percentage' && discountNum > 100) {
      Alert.alert('Error', 'Percentage discount cannot exceed 100%');
      return;
    }

    try {
      if (editingBundle) {
        await trpc.bundles.update.mutate({
          id: editingBundle.id,
          name,
          description,
          discount_type: discountType,
          discount_value: discountNum,
          is_active: isActive,
          product_ids: selectedProductIds,
        });
        Alert.alert('Success', 'Bundle updated successfully');
      } else {
        await trpc.bundles.create.mutate({
          name,
          description,
          discount_type: discountType,
          discount_value: discountNum,
          is_active: isActive,
          product_ids: selectedProductIds,
        });
        Alert.alert('Success', 'Bundle created successfully');
      }
      setModalVisible(false);
      loadData();
    } catch (error) {
      console.error('Error saving bundle:', error);
      Alert.alert('Error', 'Failed to save bundle');
    }
  };

  const handleDelete = (bundle: Bundle) => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete "${bundle.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await trpc.bundles.delete.mutate({ id: bundle.id });
              Alert.alert('Success', 'Bundle deleted successfully');
              loadData();
            } catch (error) {
              console.error('Error deleting bundle:', error);
              Alert.alert('Error', 'Failed to delete bundle');
            }
          },
        },
      ]
    );
  };

  const handleToggleActive = async (bundle: Bundle) => {
    try {
      await trpc.bundles.toggleActive.mutate({ id: bundle.id });
      loadData();
    } catch (error) {
      console.error('Error toggling bundle:', error);
      Alert.alert('Error', 'Failed to toggle bundle status');
    }
  };

  const toggleProductSelection = (productId: number) => {
    setSelectedProductIds(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const renderBundle = (bundle: Bundle) => {
    const discountDisplay = bundle.discount_type === 'percentage'
      ? `${bundle.discount_value}%`
      : `$${bundle.discount_value}`;

    return (
      <View key={bundle.id} style={styles.bundleCard}>
        <View style={styles.bundleHeader}>
          <View style={styles.bundleInfo}>
            <Text style={styles.bundleName}>{bundle.name}</Text>
            <Text style={styles.bundleDiscount}>{discountDisplay} OFF</Text>
          </View>
          <View style={styles.bundleActions}>
            <TouchableOpacity
              onPress={() => handleToggleActive(bundle)}
              style={styles.actionButton}
            >
              <Ionicons
                name={bundle.is_active ? 'eye' : 'eye-off'}
                size={20}
                color={bundle.is_active ? '#27ae60' : '#95a5a6'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => openEditModal(bundle)}
              style={styles.actionButton}
            >
              <Ionicons name="create" size={20} color="#3498db" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDelete(bundle)}
              style={styles.actionButton}
            >
              <Ionicons name="trash" size={20} color="#e74c3c" />
            </TouchableOpacity>
          </View>
        </View>

        {bundle.description && (
          <Text style={styles.bundleDescription}>{bundle.description}</Text>
        )}

        <View style={styles.bundleMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="cube" size={14} color="#999" />
            <Text style={styles.metaText}>
              {bundle.product_ids.length} products
            </Text>
          </View>
          <View style={[
            styles.statusBadge,
            { backgroundColor: bundle.is_active ? '#27ae6020' : '#95a5a620' }
          ]}>
            <Text style={[
              styles.statusText,
              { color: bundle.is_active ? '#27ae60' : '#95a5a6' }
            ]}>
              {bundle.is_active ? 'Active' : 'Inactive'}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderProductItem = ({ item }: { item: Product }) => {
    const isSelected = selectedProductIds.includes(item.id);
    return (
      <TouchableOpacity
        style={[styles.productItem, isSelected && styles.productItemSelected]}
        onPress={() => toggleProductSelection(item.id)}
      >
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>${item.price}</Text>
        </View>
        <Ionicons
          name={isSelected ? 'checkbox' : 'square-outline'}
          size={24}
          color={isSelected ? '#e74c3c' : '#666'}
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bundles Management</Text>
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
          {bundles.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="cube-outline" size={64} color="#666" />
              <Text style={styles.emptyText}>No bundles yet</Text>
              <Text style={styles.emptySubtext}>
                Tap the + button to create your first bundle
              </Text>
            </View>
          ) : (
            bundles.map(renderBundle)
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
                {editingBundle ? 'Edit Bundle' : 'Create Bundle'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.label}>Name *</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter bundle name"
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

              <Text style={styles.label}>Discount Type *</Text>
              <View style={styles.discountTypeContainer}>
                <TouchableOpacity
                  style={[
                    styles.discountTypeButton,
                    discountType === 'percentage' && styles.discountTypeButtonActive
                  ]}
                  onPress={() => setDiscountType('percentage')}
                >
                  <Text style={[
                    styles.discountTypeText,
                    discountType === 'percentage' && styles.discountTypeTextActive
                  ]}>
                    Percentage (%)
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.discountTypeButton,
                    discountType === 'fixed' && styles.discountTypeButtonActive
                  ]}
                  onPress={() => setDiscountType('fixed')}
                >
                  <Text style={[
                    styles.discountTypeText,
                    discountType === 'fixed' && styles.discountTypeTextActive
                  ]}>
                    Fixed ($)
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Discount Value *</Text>
              <TextInput
                style={styles.input}
                value={discountValue}
                onChangeText={setDiscountValue}
                placeholder={discountType === 'percentage' ? '10' : '50'}
                placeholderTextColor="#666"
                keyboardType="decimal-pad"
              />

              <Text style={styles.label}>Products * ({selectedProductIds.length} selected)</Text>
              <TouchableOpacity
                style={styles.selectProductsButton}
                onPress={() => setProductSelectorVisible(true)}
              >
                <Ionicons name="cube" size={20} color="#fff" />
                <Text style={styles.selectProductsText}>Select Products</Text>
              </TouchableOpacity>

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
                  {editingBundle ? 'Update Bundle' : 'Create Bundle'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Product Selector Modal */}
      <Modal
        visible={productSelectorVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setProductSelectorVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Products</Text>
              <TouchableOpacity onPress={() => setProductSelectorVisible(false)}>
                <Ionicons name="checkmark" size={24} color="#27ae60" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={products}
              renderItem={renderProductItem}
              keyExtractor={(item) => item.id.toString()}
              style={styles.productList}
            />
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
  bundleCard: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  bundleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bundleInfo: {
    flex: 1,
  },
  bundleName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  bundleDiscount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e74c3c',
  },
  bundleActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    padding: 5,
  },
  bundleDescription: {
    fontSize: 14,
    color: '#999',
    marginBottom: 10,
  },
  bundleMeta: {
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
  discountTypeContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  discountTypeButton: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  discountTypeButtonActive: {
    backgroundColor: '#e74c3c20',
    borderColor: '#e74c3c',
  },
  discountTypeText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '600',
  },
  discountTypeTextActive: {
    color: '#e74c3c',
  },
  selectProductsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9b59b6',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  selectProductsText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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
  productList: {
    padding: 20,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  productItemSelected: {
    backgroundColor: '#e74c3c20',
    borderColor: '#e74c3c',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 12,
    color: '#999',
  },
});
