import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../services/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { SIZES } from '../../constants';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import LoadingSpinner from '../../components/LoadingSpinner';
import { apiManager } from '../../services/ApiManager';
import { ErrorHandler } from '../../services/ErrorHandler';

interface UserProfileData {
  name: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
}

const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, updateUser } = useAuth();
  const { colors } = useTheme();
  const { t, isRTL } = useLanguage();
  
  const [formData, setFormData] = useState<UserProfileData>({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    dateOfBirth: '',
    address: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      // In a real app, you would fetch additional user profile data from the API
      // For now, we'll use the basic user data from auth context
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        dateOfBirth: '',
        address: '',
      });
    } catch (error) {
      ErrorHandler.handleError(error, true);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email format is invalid';
    }

    if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Phone number format is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      // In a real app, you would call an API to update the user profile
      const updatedUser = await apiManager.updateProfile(formData);
      
      // Update the user in auth context
      if (updateUser) {
        updateUser(updatedUser);
      }

      Alert.alert(
        'Success',
        'Profile updated successfully!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      ErrorHandler.handleError(error, true);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof UserProfileData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.surface,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      color: colors.text,
    },
    content: {
      backgroundColor: colors.background,
    },
    formContainer: {
      backgroundColor: colors.surface,
    },
    sectionTitle: {
      color: colors.text,
    },
    avatarContainer: {
      backgroundColor: colors.primary,
    },
    changePhotoText: {
      color: colors.primary,
    },
  });

  if (loading && !formData.name) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={[styles.container, dynamicStyles.container]}>
      {/* Header */}
      <View style={[styles.header, dynamicStyles.header]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons 
            name={isRTL ? "chevron-forward" : "chevron-back"} 
            size={28} 
            color={colors.text} 
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, dynamicStyles.headerTitle]}>
          {t('edit')} {t('profile')}
        </Text>
        <View style={styles.headerRight} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={[styles.content, dynamicStyles.content]}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Picture Section */}
          <View style={styles.profileSection}>
            <View style={[styles.avatarContainer, dynamicStyles.avatarContainer]}>
              <Ionicons name="person" size={48} color={colors.background} />
            </View>
            <TouchableOpacity
              onPress={() => Alert.alert('Coming Soon', 'Photo upload will be available soon!')}
            >
              <Text style={[styles.changePhotoText, dynamicStyles.changePhotoText]}>
                Change Photo
              </Text>
            </TouchableOpacity>
          </View>

          {/* Personal Information */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
              Personal Information
            </Text>
            <View style={[styles.formContainer, dynamicStyles.formContainer]}>
              <CustomInput
                label="Full Name"
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                placeholder="Enter your full name"
                error={errors.name}
                isRTL={isRTL}
              />
              
              <CustomInput
                label="Email Address"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                placeholder="Enter your email address"
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
                isRTL={isRTL}
              />
              
              <CustomInput
                label="Phone Number"
                value={formData.phone}
                onChangeText={(value) => handleInputChange('phone', value)}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                error={errors.phone}
                isRTL={isRTL}
              />
              
              <CustomInput
                label="Date of Birth"
                value={formData.dateOfBirth}
                onChangeText={(value) => handleInputChange('dateOfBirth', value)}
                placeholder="DD/MM/YYYY"
                isRTL={isRTL}
              />
              
              <CustomInput
                label="Address"
                value={formData.address}
                onChangeText={(value) => handleInputChange('address', value)}
                placeholder="Enter your address"
                multiline
                numberOfLines={3}
                isRTL={isRTL}
              />
            </View>
          </View>

          {/* Save Button */}
          <View style={styles.buttonSection}>
            <CustomButton
              title="Save Changes"
              onPress={handleSave}
              loading={loading}
              style={styles.saveButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.paddingLarge,
    paddingVertical: SIZES.paddingMedium,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: SIZES.fontLarge,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: SIZES.paddingXLarge,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: SIZES.paddingXLarge,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.marginMedium,
  },
  changePhotoText: {
    fontSize: SIZES.fontMedium,
    fontWeight: '500',
  },
  section: {
    marginBottom: SIZES.marginXLarge,
    paddingHorizontal: SIZES.paddingLarge,
  },
  sectionTitle: {
    fontSize: SIZES.fontLarge,
    fontWeight: '600',
    marginBottom: SIZES.marginMedium,
  },
  formContainer: {
    borderRadius: SIZES.borderRadiusLarge,
    padding: SIZES.paddingLarge,
  },
  buttonSection: {
    paddingHorizontal: SIZES.paddingLarge,
    marginTop: SIZES.marginLarge,
  },
  saveButton: {
    marginHorizontal: 0,
  },
});

export default EditProfileScreen;