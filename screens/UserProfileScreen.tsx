import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  bio: string;
  avatar: string | null;
}

export default function UserProfileScreen({ navigation }: any) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Ahmad Khalil',
    email: 'ahmad@example.com',
    phone: '+964 750 123 4567',
    bio: 'Passionate shopper and lottery enthusiast',
    avatar: null,
  });
  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      setProfile(editedProfile);
      Alert.alert(t('common.success'), t('profile.profileUpdated'));
    } else {
      // Start editing
      setEditedProfile(profile);
    }
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleAvatarChange = async () => {
    Alert.alert(
      t('profile.changeAvatar'),
      '',
      [
        {
          text: t('profile.takePhoto'),
          onPress: async () => {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status === 'granted') {
              const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
              });
              if (!result.canceled) {
                setEditedProfile({ ...editedProfile, avatar: result.assets[0].uri });
              }
            }
          },
        },
        {
          text: t('profile.chooseFromLibrary'),
          onPress: async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status === 'granted') {
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
              });
              if (!result.canceled) {
                setEditedProfile({ ...editedProfile, avatar: result.assets[0].uri });
              }
            }
          },
        },
        { text: t('common.cancel'), style: 'cancel' },
      ]
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('profile.title')}</Text>
        <TouchableOpacity onPress={handleEditToggle} style={styles.editButton}>
          <Ionicons name={isEditing ? 'checkmark' : 'create-outline'} size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <TouchableOpacity
            onPress={isEditing ? handleAvatarChange : undefined}
            style={styles.avatarContainer}
          >
            {(isEditing ? editedProfile.avatar : profile.avatar) ? (
              <Image
                source={{ uri: isEditing ? editedProfile.avatar! : profile.avatar! }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>{getInitials(profile.name)}</Text>
              </View>
            )}
            {isEditing && (
              <View style={styles.avatarEditBadge}>
                <Ionicons name="camera" size={16} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Profile Form */}
        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>{t('profile.name')}</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={editedProfile.name}
                onChangeText={(text) => setEditedProfile({ ...editedProfile, name: text })}
                placeholder={t('profile.name')}
                placeholderTextColor="#666"
              />
            ) : (
              <Text style={styles.value}>{profile.name}</Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>{t('profile.email')}</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={editedProfile.email}
                onChangeText={(text) => setEditedProfile({ ...editedProfile, email: text })}
                placeholder={t('profile.email')}
                placeholderTextColor="#666"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            ) : (
              <Text style={styles.value}>{profile.email}</Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>{t('profile.phone')}</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={editedProfile.phone}
                onChangeText={(text) => setEditedProfile({ ...editedProfile, phone: text })}
                placeholder={t('profile.phone')}
                placeholderTextColor="#666"
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={styles.value}>{profile.phone}</Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>{t('profile.bio')}</Text>
            {isEditing ? (
              <TextInput
                style={[styles.input, styles.textArea]}
                value={editedProfile.bio}
                onChangeText={(text) => setEditedProfile({ ...editedProfile, bio: text })}
                placeholder={t('profile.bio')}
                placeholderTextColor="#666"
                multiline
                numberOfLines={4}
              />
            ) : (
              <Text style={styles.value}>{profile.bio}</Text>
            )}
          </View>
        </View>

        {/* Cancel Button (only shown when editing) */}
        {isEditing && (
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
          </TouchableOpacity>
        )}

        {/* Account Statistics */}
        {!isEditing && (
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Account Statistics</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Ionicons name="cart" size={24} color="#3b82f6" />
                <Text style={styles.statValue}>24</Text>
                <Text style={styles.statLabel}>Total Orders</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="ticket" size={24} color="#fbbf24" />
                <Text style={styles.statValue}>156</Text>
                <Text style={styles.statLabel}>Lottery Tickets</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="trophy" size={24} color="#10b981" />
                <Text style={styles.statValue}>3</Text>
                <Text style={styles.statLabel}>Prizes Won</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="heart" size={24} color="#ef4444" />
                <Text style={styles.statValue}>42</Text>
                <Text style={styles.statLabel}>Wishlist Items</Text>
              </View>
            </View>
          </View>
        )}

        {/* Account Info */}
        {!isEditing && (
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Account Information</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Member Since</Text>
                <Text style={styles.infoValue}>January 2024</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Account Status</Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>Active</Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Loyalty Tier</Text>
                <View style={styles.tierBadge}>
                  <Ionicons name="star" size={14} color="#fbbf24" />
                  <Text style={styles.tierText}>Gold Member</Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Total Spent</Text>
                <Text style={styles.infoValue}>$2,450.00</Text>
              </View>
            </View>
          </View>
        )}
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
  editButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#2d2d2d',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#3b82f6',
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#3b82f6',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#2d2d2d',
  },
  form: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    marginBottom: 8,
  },
  value: {
    fontSize: 16,
    color: '#fff',
    padding: 12,
    backgroundColor: '#2d2d2d',
    borderRadius: 8,
  },
  input: {
    fontSize: 16,
    color: '#fff',
    padding: 12,
    backgroundColor: '#2d2d2d',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  cancelButton: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#2d2d2d',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ef4444',
  },
  statsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: '#2d2d2d',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    textAlign: 'center',
  },
  infoSection: {
    padding: 16,
  },
  infoCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  infoLabel: {
    fontSize: 14,
    color: '#999',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  statusBadge: {
    backgroundColor: '#10b98120',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10b981',
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fbbf2420',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  tierText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fbbf24',
  },
});
