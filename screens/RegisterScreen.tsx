import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

interface RegisterScreenProps {
  navigation: any;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');

  const { register } = useAuth();

  const isRTL = language === 'ar';

  const texts = {
    ar: {
      createAccount: 'إنشاء حساب جديد',
      subtitle: 'انضم إلى بلخير واحصل على تذاكر السحب',
      name: 'الاسم الكامل',
      email: 'البريد الإلكتروني',
      phone: 'رقم الهاتف',
      password: 'كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      register: 'إنشاء الحساب',
      haveAccount: 'لديك حساب بالفعل؟',
      login: 'تسجيل الدخول',
      namePlaceholder: 'أدخل اسمك الكامل',
      emailPlaceholder: 'أدخل بريدك الإلكتروني',
      phonePlaceholder: '+964 7XX XXX XXXX',
      passwordPlaceholder: 'أدخل كلمة المرور',
      confirmPasswordPlaceholder: 'أعد إدخال كلمة المرور',
      error: 'خطأ',
      fillAllFields: 'يرجى ملء جميع الحقول',
      passwordMismatch: 'كلمات المرور غير متطابقة',
      passwordLength: 'يجب أن تكون كلمة المرور 8 أحرف على الأقل',
      invalidEmail: 'البريد الإلكتروني غير صحيح',
      registerSuccess: 'تم إنشاء الحساب بنجاح!',
      registerError: 'فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.',
    },
    en: {
      createAccount: 'Create New Account',
      subtitle: 'Join Belkhair and get lottery tickets',
      name: 'Full Name',
      email: 'Email',
      phone: 'Phone Number',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      register: 'Create Account',
      haveAccount: 'Already have an account?',
      login: 'Login',
      namePlaceholder: 'Enter your full name',
      emailPlaceholder: 'Enter your email',
      phonePlaceholder: '+964 7XX XXX XXXX',
      passwordPlaceholder: 'Enter password',
      confirmPasswordPlaceholder: 'Re-enter password',
      error: 'Error',
      fillAllFields: 'Please fill in all fields',
      passwordMismatch: 'Passwords do not match',
      passwordLength: 'Password must be at least 8 characters',
      invalidEmail: 'Invalid email address',
      registerSuccess: 'Account created successfully!',
      registerError: 'Failed to create account. Please try again.',
    },
  };

  const t = texts[language];

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    // Validation
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert(t.error, t.fillAllFields);
      return;
    }

    if (!validateEmail(email.trim())) {
      Alert.alert(t.error, t.invalidEmail);
      return;
    }

    if (password.length < 8) {
      Alert.alert(t.error, t.passwordLength);
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(t.error, t.passwordMismatch);
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await register({
        name: name.trim(),
        email: email.trim(),
        password: password,
        password_confirmation: confirmPassword,
        phone: phone.trim() || undefined,
        preferred_language: language,
      });
      
      if (result.success) {
        Alert.alert('Success', t.registerSuccess);
      } else {
        Alert.alert(t.error, result.message || t.registerError);
      }
    } catch (error) {
      console.error('Register error:', error);
      Alert.alert(t.error, t.registerError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo and Title */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Ionicons name="bag-handle" size={50} color="#fff" />
          </View>
          <Text style={[styles.title, isRTL && styles.rtlText]}>{t.createAccount}</Text>
          <Text style={[styles.subtitle, isRTL && styles.rtlText]}>{t.subtitle}</Text>
        </View>

        {/* Register Form */}
        <View style={styles.formContainer}>
          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, isRTL && styles.rtlText]}>{t.name}</Text>
            <View style={[styles.inputWrapper, isRTL && styles.rtlInput]}>
              <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={[styles.textInput, isRTL && styles.rtlTextInput]}
                placeholder={t.namePlaceholder}
                placeholderTextColor="#999"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                textAlign={isRTL ? 'right' : 'left'}
              />
            </View>
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, isRTL && styles.rtlText]}>{t.email}</Text>
            <View style={[styles.inputWrapper, isRTL && styles.rtlInput]}>
              <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={[styles.textInput, isRTL && styles.rtlTextInput]}
                placeholder={t.emailPlaceholder}
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                textAlign={isRTL ? 'right' : 'left'}
              />
            </View>
          </View>

          {/* Phone Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, isRTL && styles.rtlText]}>{t.phone}</Text>
            <View style={[styles.inputWrapper, isRTL && styles.rtlInput]}>
              <Ionicons name="call-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={[styles.textInput, isRTL && styles.rtlTextInput]}
                placeholder={t.phonePlaceholder}
                placeholderTextColor="#999"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                textAlign={isRTL ? 'right' : 'left'}
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, isRTL && styles.rtlText]}>{t.password}</Text>
            <View style={[styles.inputWrapper, isRTL && styles.rtlInput]}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={[styles.textInput, isRTL && styles.rtlTextInput]}
                placeholder={t.passwordPlaceholder}
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                textAlign={isRTL ? 'right' : 'left'}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, isRTL && styles.rtlText]}>{t.confirmPassword}</Text>
            <View style={[styles.inputWrapper, isRTL && styles.rtlInput]}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={[styles.textInput, isRTL && styles.rtlTextInput]}
                placeholder={t.confirmPasswordPlaceholder}
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                textAlign={isRTL ? 'right' : 'left'}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Ionicons name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Register Button */}
          <TouchableOpacity 
            style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.registerButtonText}>{t.register}</Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={[styles.haveAccountText, isRTL && styles.rtlText]}>{t.haveAccount}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={[styles.loginText, isRTL && styles.rtlText]}>{t.login}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
    backgroundColor: '#e74c3c',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#bbb',
    textAlign: 'center',
    lineHeight: 20,
  },
  formContainer: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 6,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 48,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
  },
  registerButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  registerButtonDisabled: {
    opacity: 0.7,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 30,
  },
  haveAccountText: {
    color: '#bbb',
    fontSize: 14,
  },
  loginText: {
    color: '#e74c3c',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  // RTL Styles
  rtlText: {
    textAlign: 'right',
  },
  rtlInput: {
    flexDirection: 'row-reverse',
  },
  rtlTextInput: {
    textAlign: 'right',
  },
});

export default RegisterScreen;
