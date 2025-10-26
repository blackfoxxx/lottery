import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../../services/AuthContext';
import { AuthStackParamList } from '../../types';
import { COLORS, SIZES, MESSAGES, TEST_IDS } from '../../constants';
import { isValidEmail, getErrorMessage } from '../../utils/helpers';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import LoadingSpinner from '../../components/LoadingSpinner';
import Logo from '../../components/Logo';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      await login({ email: email.trim(), password });
      // Navigation will be handled automatically by the AuthContext
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      Alert.alert('Login Failed', errorMessage);
    }
  };

  const navigateToRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Logo size={80} style={styles.logo} />
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>
              Sign in to your بلخير account
            </Text>
          </View>

          <View style={styles.form}>
            <CustomInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="mail"
              error={errors.email}
              testID={TEST_IDS.LOGIN_EMAIL_INPUT}
            />

            <CustomInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              isPassword
              leftIcon="lock-closed"
              error={errors.password}
              testID={TEST_IDS.LOGIN_PASSWORD_INPUT}
            />

            <CustomButton
              title="Sign In"
              onPress={handleLogin}
              loading={isLoading}
              style={styles.loginButton}
              testID={TEST_IDS.LOGIN_BUTTON}
            />

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Don't have an account?{' '}
              </Text>
              <CustomButton
                title="Sign Up"
                onPress={navigateToRegister}
                variant="outline"
                size="small"
                testID={TEST_IDS.REGISTER_BUTTON}
              />
            </View>
          </View>

          {/* Demo Credentials Info */}
          <View style={styles.demoInfo}>
            <Text style={styles.demoTitle}>Demo Credentials:</Text>
            <Text style={styles.demoText}>Email: test@test.com</Text>
            <Text style={styles.demoText}>Password: 123456</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <LoadingSpinner 
        visible={isLoading} 
        overlay 
        text="Signing in..." 
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SIZES.paddingLarge,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: SIZES.marginXLarge,
  },
  logo: {
    marginBottom: SIZES.marginMedium,
  },
  title: {
    fontSize: SIZES.fontXXLarge,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.marginSmall,
  },
  subtitle: {
    fontSize: SIZES.fontMedium,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  form: {
    marginBottom: SIZES.marginLarge,
  },
  loginButton: {
    marginTop: SIZES.marginLarge,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SIZES.marginLarge,
  },
  footerText: {
    fontSize: SIZES.fontMedium,
    color: COLORS.textSecondary,
  },
  demoInfo: {
    backgroundColor: COLORS.surface,
    padding: SIZES.paddingMedium,
    borderRadius: SIZES.borderRadiusMedium,
    marginTop: SIZES.marginLarge,
  },
  demoTitle: {
    fontSize: SIZES.fontMedium,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.marginSmall,
  },
  demoText: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
});

export default LoginScreen;
