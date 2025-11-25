import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PRESET_AMOUNTS = [25, 50, 100, 200, 500];

export default function GiftCardsScreen() {
  const [selectedAmount, setSelectedAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const finalAmount = customAmount ? parseFloat(customAmount) : selectedAmount;

  const handlePurchase = async () => {
    if (!recipientEmail || !recipientName) {
      Alert.alert('Error', 'Please fill in recipient details');
      return;
    }

    if (finalAmount < 10 || finalAmount > 1000) {
      Alert.alert('Error', 'Gift card amount must be between $10 and $1000');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        Alert.alert('Error', 'Please login to purchase gift cards');
        return;
      }

      const response = await fetch('http://localhost:8000/api/v1/gift-cards/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: finalAmount,
          recipient_email: recipientEmail,
          recipient_name: recipientName,
          message: message || null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Gift card purchased successfully! Email sent to recipient.');
        // Reset form
        setRecipientEmail('');
        setRecipientName('');
        setMessage('');
        setCustomAmount('');
        setSelectedAmount(50);
      } else {
        Alert.alert('Error', data.message || 'Failed to purchase gift card');
      }
    } catch (error) {
      console.error('Gift card purchase error:', error);
      Alert.alert('Error', 'Failed to purchase gift card');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="gift" size={48} color="#E74C3C" />
        <Text style={styles.title}>Gift Cards</Text>
        <Text style={styles.subtitle}>Give the perfect gift - let them choose what they love</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Select Amount</Text>
        <View style={styles.amountGrid}>
          {PRESET_AMOUNTS.map((amount) => (
            <TouchableOpacity
              key={amount}
              style={[
                styles.amountButton,
                selectedAmount === amount && !customAmount && styles.amountButtonSelected,
              ]}
              onPress={() => {
                setSelectedAmount(amount);
                setCustomAmount('');
              }}
            >
              <Text
                style={[
                  styles.amountButtonText,
                  selectedAmount === amount && !customAmount && styles.amountButtonTextSelected,
                ]}
              >
                ${amount}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Or Enter Custom Amount</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter amount ($10 - $1000)"
          keyboardType="numeric"
          value={customAmount}
          onChangeText={setCustomAmount}
        />

        <Text style={styles.label}>Recipient Name</Text>
        <TextInput
          style={styles.input}
          placeholder="John Doe"
          value={recipientName}
          onChangeText={setRecipientName}
        />

        <Text style={styles.label}>Recipient Email</Text>
        <TextInput
          style={styles.input}
          placeholder="john@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={recipientEmail}
          onChangeText={setRecipientEmail}
        />

        <Text style={styles.label}>Personal Message (Optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Happy Birthday! Enjoy shopping at Belkhair..."
          multiline
          numberOfLines={3}
          value={message}
          onChangeText={setMessage}
        />

        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total Amount:</Text>
          <Text style={styles.totalAmount}>${finalAmount.toFixed(2)}</Text>
        </View>

        <TouchableOpacity
          style={[styles.purchaseButton, loading && styles.purchaseButtonDisabled]}
          onPress={handlePurchase}
          disabled={loading}
        >
          <Ionicons name="card" size={20} color="#FFF" />
          <Text style={styles.purchaseButtonText}>
            {loading ? 'Processing...' : 'Purchase Gift Card'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>How It Works</Text>
        {[
          {
            step: '1',
            title: 'Choose Amount',
            description: 'Select a preset amount or enter a custom value between $10 and $1000',
          },
          {
            step: '2',
            title: 'Add Details',
            description: "Enter recipient's name, email, and an optional personal message",
          },
          {
            step: '3',
            title: 'Instant Delivery',
            description: "Gift card code is sent instantly to recipient's email",
          },
          {
            step: '4',
            title: 'Redeem at Checkout',
            description: 'Recipient can use the code during checkout to apply the balance',
          },
        ].map((item) => (
          <View key={item.step} style={styles.infoItem}>
            <View style={styles.stepCircle}>
              <Text style={styles.stepNumber}>{item.step}</Text>
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoItemTitle}>{item.title}</Text>
              <Text style={styles.infoItemDescription}>{item.description}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  header: {
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 14,
    color: '#AAA',
    textAlign: 'center',
    marginTop: 8,
  },
  card: {
    backgroundColor: '#16213E',
    margin: 16,
    padding: 20,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 12,
  },
  amountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  amountButton: {
    flex: 1,
    minWidth: '30%',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
  },
  amountButtonSelected: {
    backgroundColor: '#E74C3C',
    borderColor: '#E74C3C',
  },
  amountButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  amountButtonTextSelected: {
    color: '#FFF',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFF',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#1A1A2E',
    borderRadius: 8,
    padding: 12,
    color: '#FFF',
    fontSize: 14,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFF',
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E74C3C',
  },
  purchaseButton: {
    flexDirection: 'row',
    backgroundColor: '#E74C3C',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 8,
  },
  purchaseButtonDisabled: {
    opacity: 0.6,
  },
  purchaseButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: '#16213E',
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumber: {
    color: '#E74C3C',
    fontWeight: 'bold',
    fontSize: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 4,
  },
  infoItemDescription: {
    fontSize: 12,
    color: '#AAA',
    lineHeight: 18,
  },
});
