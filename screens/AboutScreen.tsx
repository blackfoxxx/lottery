import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Linking,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export default function AboutScreen({ navigation }: any) {
  const { t } = useTranslation();

  const openWebsite = () => {
    Linking.openURL('https://belkhair.com');
  };

  const openEmail = () => {
    Linking.openURL('mailto:info@belkhair.com');
  };

  const openSocialMedia = (platform: string) => {
    const urls: Record<string, string> = {
      facebook: 'https://facebook.com/belkhair',
      twitter: 'https://twitter.com/belkhair',
      instagram: 'https://instagram.com/belkhair',
      linkedin: 'https://linkedin.com/company/belkhair',
    };
    Linking.openURL(urls[platform]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('profile.about')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Ionicons name="storefront" size={60} color="#3b82f6" />
          </View>
          <Text style={styles.appName}>Belkhair</Text>
          <Text style={styles.appTagline}>E-Commerce & Lottery Platform</Text>
          <Text style={styles.version}>{t('profile.version')} 1.0.0 (Build 100)</Text>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Belkhair</Text>
          <Text style={styles.description}>
            Belkhair is a revolutionary e-commerce platform that combines online shopping with exciting lottery opportunities. Shop for premium products and earn lottery tickets with every purchase for a chance to win amazing prizes.
          </Text>
          <Text style={styles.description}>
            Our mission is to provide customers with high-quality products, exceptional service, and the thrill of winning big prizes through our innovative lottery system.
          </Text>
        </View>

        {/* Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Features</Text>
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Ionicons name="cart" size={20} color="#3b82f6" />
              <Text style={styles.featureText}>Wide selection of premium products</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="ticket" size={20} color="#fbbf24" />
              <Text style={styles.featureText}>Earn lottery tickets with purchases</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="trophy" size={20} color="#10b981" />
              <Text style={styles.featureText}>Win amazing prizes regularly</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="shield-checkmark" size={20} color="#3b82f6" />
              <Text style={styles.featureText}>Secure payment & data protection</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="flash" size={20} color="#fbbf24" />
              <Text style={styles.featureText}>Fast delivery & tracking</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="headset" size={20} color="#10b981" />
              <Text style={styles.featureText}>24/7 customer support</Text>
            </View>
          </View>
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <TouchableOpacity style={styles.contactItem} onPress={openWebsite}>
            <Ionicons name="globe" size={20} color="#3b82f6" />
            <Text style={styles.contactText}>www.belkhair.com</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactItem} onPress={openEmail}>
            <Ionicons name="mail" size={20} color="#3b82f6" />
            <Text style={styles.contactText}>info@belkhair.com</Text>
          </TouchableOpacity>
          <View style={styles.contactItem}>
            <Ionicons name="call" size={20} color="#3b82f6" />
            <Text style={styles.contactText}>+964 750 123 4567</Text>
          </View>
          <View style={styles.contactItem}>
            <Ionicons name="location" size={20} color="#3b82f6" />
            <Text style={styles.contactText}>Erbil, Kurdistan Region, Iraq</Text>
          </View>
        </View>

        {/* Social Media */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Follow Us</Text>
          <View style={styles.socialButtons}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => openSocialMedia('facebook')}
            >
              <Ionicons name="logo-facebook" size={24} color="#1877f2" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => openSocialMedia('twitter')}
            >
              <Ionicons name="logo-twitter" size={24} color="#1da1f2" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => openSocialMedia('instagram')}
            >
              <Ionicons name="logo-instagram" size={24} color="#e4405f" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => openSocialMedia('linkedin')}
            >
              <Ionicons name="logo-linkedin" size={24} color="#0077b5" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Legal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <TouchableOpacity
            style={styles.legalItem}
            onPress={() => navigation.navigate('TermsOfService')}
          >
            <Text style={styles.legalText}>{t('profile.termsOfService')}</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.legalItem}
            onPress={() => navigation.navigate('PrivacyPolicy')}
          >
            <Text style={styles.legalText}>{t('profile.privacyPolicy')}</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Copyright */}
        <View style={styles.copyright}>
          <Text style={styles.copyrightText}>© 2024 Belkhair. All rights reserved.</Text>
          <Text style={styles.copyrightSubtext}>Made with ❤️ in Kurdistan</Text>
        </View>
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
  content: {
    flex: 1,
  },
  logoSection: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#2d2d2d',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#3b82f620',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  appTagline: {
    fontSize: 14,
    color: '#999',
    marginBottom: 12,
  },
  version: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 22,
    marginBottom: 12,
  },
  featureList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#ccc',
    flex: 1,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    color: '#ccc',
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2d2d2d',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  legalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  legalText: {
    fontSize: 14,
    color: '#ccc',
  },
  copyright: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  copyrightText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  copyrightSubtext: {
    fontSize: 12,
    color: '#666',
  },
});
