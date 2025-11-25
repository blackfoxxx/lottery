import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Share, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

interface WinnerShareButtonsProps {
  winnerName: string;
  prize: number;
  ticketNumber: string;
  drawName: string;
}

export default function WinnerShareButtons({
  winnerName,
  prize,
  ticketNumber,
  drawName,
}: WinnerShareButtonsProps) {
  const shareText = `🎉 I just won $${prize.toLocaleString()} in the ${drawName}! Ticket: ${ticketNumber}`;

  const handleShare = async (platform?: string) => {
    try {
      if (platform === 'copy') {
        await Clipboard.setStringAsync(shareText);
        Alert.alert('Success', 'Copied to clipboard!');
        return;
      }

      const result = await Share.share({
        message: shareText,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with activity type:', result.activityType);
        } else {
          console.log('Shared successfully');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to share');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="share-social" size={16} color="#666" />
        <Text style={styles.headerText}>Share Your Win</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.shareButton}
          onPress={() => handleShare('facebook')}
        >
          <Ionicons name="logo-facebook" size={20} color="#1877F2" />
          <Text style={styles.buttonText}>Facebook</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.shareButton}
          onPress={() => handleShare('twitter')}
        >
          <Ionicons name="logo-twitter" size={20} color="#1DA1F2" />
          <Text style={styles.buttonText}>Twitter</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.shareButton}
          onPress={() => handleShare('whatsapp')}
        >
          <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
          <Text style={styles.buttonText}>WhatsApp</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.shareButton}
          onPress={() => handleShare('copy')}
        >
          <Ionicons name="copy-outline" size={20} color="#666" />
          <Text style={styles.buttonText}>Copy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  buttonText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
});
