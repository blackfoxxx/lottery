import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Winner {
  id: number;
  name: string;
  prize: number;
  ticketNumber: string;
  date: string;
}

const mockWinners: Winner[] = [
  {
    id: 1,
    name: 'Ahmad K.',
    prize: 10000,
    ticketNumber: 'LT-2024-001234',
    date: '2024-02-01',
  },
  {
    id: 2,
    name: 'Sarah M.',
    prize: 5000,
    ticketNumber: 'LT-2024-001567',
    date: '2024-01-28',
  },
  {
    id: 3,
    name: 'Mohammed A.',
    prize: 2500,
    ticketNumber: 'LT-2024-001892',
    date: '2024-01-25',
  },
  {
    id: 4,
    name: 'Fatima H.',
    prize: 1000,
    ticketNumber: 'LT-2024-002134',
    date: '2024-01-22',
  },
];

const { width } = Dimensions.get('window');

export default function LotteryWinnerBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = new Animated.Value(1);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        // Change winner
        setCurrentIndex((prev) => (prev + 1) % mockWinners.length);
        // Fade in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const currentWinner = mockWinners[currentIndex];

  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.trophyContainer}>
            <Ionicons name="trophy" size={32} color="#fff" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>Recent Lottery Winners</Text>
            <Text style={styles.subtitle}>Congratulations to our winners!</Text>
          </View>
        </View>

        {/* Winner Info */}
        <Animated.View style={[styles.winnerInfo, { opacity: fadeAnim }]}>
          <View style={styles.winnerCard}>
            <View style={styles.winnerDetails}>
              <Text style={styles.winnerName}>{currentWinner.name}</Text>
              <View style={styles.ticketRow}>
                <Ionicons name="ticket" size={16} color="#fff" />
                <Text style={styles.ticketNumber}>{currentWinner.ticketNumber}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.prizeContainer}>
              <Text style={styles.wonLabel}>WON</Text>
              <Text style={styles.prizeAmount}>${currentWinner.prize.toLocaleString()}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {mockWinners.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setCurrentIndex(index)}
              style={[
                styles.dot,
                index === currentIndex && styles.dotActive,
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  banner: {
    backgroundColor: '#f59e0b',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  trophyContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 50,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
  },
  winnerInfo: {
    marginBottom: 12,
  },
  winnerCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  winnerDetails: {
    flex: 1,
  },
  winnerName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  ticketRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ticketNumber: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
    fontFamily: 'monospace',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 16,
  },
  prizeContainer: {
    alignItems: 'center',
  },
  wonLabel: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 4,
  },
  prizeAmount: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  dotActive: {
    width: 24,
    backgroundColor: '#fff',
  },
});
