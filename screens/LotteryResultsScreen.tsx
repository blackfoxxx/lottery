import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface DrawResult {
  id: string;
  drawName: string;
  drawDate: string;
  winningNumbers: string[];
  prizeAmount: number;
  winner: string;
  totalTickets: number;
}

export default function LotteryResultsScreen({ navigation }: any) {
  const [showCheckModal, setShowCheckModal] = useState(false);
  const [checkResult, setCheckResult] = useState<{
    matched: boolean;
    prize?: number;
    matchedNumbers?: string[];
  } | null>(null);

  const results: DrawResult[] = [
    {
      id: '1',
      drawName: 'Bronze Draw',
      drawDate: '2024-12-15',
      winningNumbers: ['#98765', '#98766', '#98767'],
      prizeAmount: 500,
      winner: 'John D.',
      totalTickets: 5000,
    },
    {
      id: '2',
      drawName: 'Silver Draw',
      drawDate: '2024-12-20',
      winningNumbers: ['#12340', '#12341'],
      prizeAmount: 5000,
      winner: 'Sarah M.',
      totalTickets: 8900,
    },
    {
      id: '3',
      drawName: 'Gold Draw',
      drawDate: '2024-12-25',
      winningNumbers: ['#45678'],
      prizeAmount: 10000,
      winner: 'Michael K.',
      totalTickets: 12000,
    },
  ];

  const myTickets = [
    { drawId: '1', numbers: ['#98765', '#98766'] },
    { drawId: '2', numbers: ['#12345'] },
  ];

  const checkMyTickets = () => {
    // Check if any of my tickets match winning numbers
    let hasWon = false;
    let totalPrize = 0;
    let matchedNums: string[] = [];

    results.forEach((result) => {
      const myTicketsForDraw = myTickets.find((t) => t.drawId === result.id);
      if (myTicketsForDraw) {
        const matches = myTicketsForDraw.numbers.filter((num) =>
          result.winningNumbers.includes(num)
        );
        if (matches.length > 0) {
          hasWon = true;
          totalPrize += result.prizeAmount;
          matchedNums = [...matchedNums, ...matches];
        }
      }
    });

    setCheckResult({
      matched: hasWon,
      prize: totalPrize,
      matchedNumbers: matchedNums,
    });
    setShowCheckModal(true);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#1e3a8a', '#3b82f6']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lottery Results</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      {/* Check My Tickets Button */}
      <View style={styles.checkSection}>
        <TouchableOpacity style={styles.checkButton} onPress={checkMyTickets}>
          <Ionicons name="search" size={20} color="#fff" />
          <Text style={styles.checkButtonText}>Check My Tickets</Text>
        </TouchableOpacity>
      </View>

      {/* Results List */}
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Past Draw Results</Text>
        {results.map((result) => (
          <View key={result.id} style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <View style={styles.resultInfo}>
                <Text style={styles.drawName}>{result.drawName}</Text>
                <Text style={styles.drawDate}>{result.drawDate}</Text>
              </View>
              <View style={styles.prizeBadge}>
                <Ionicons name="trophy" size={20} color="#fbbf24" />
                <Text style={styles.prizeAmount}>${result.prizeAmount}</Text>
              </View>
            </View>

            <View style={styles.winningSection}>
              <Text style={styles.winningLabel}>Winning Numbers:</Text>
              <View style={styles.winningNumbers}>
                {result.winningNumbers.map((num, idx) => (
                  <View key={idx} style={styles.winningNumber}>
                    <Text style={styles.winningNumberText}>{num}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.resultFooter}>
              <View style={styles.winnerInfo}>
                <Ionicons name="person" size={16} color="#64748b" />
                <Text style={styles.winnerText}>Winner: {result.winner}</Text>
              </View>
              <View style={styles.ticketsInfo}>
                <Ionicons name="ticket" size={16} color="#64748b" />
                <Text style={styles.ticketsText}>
                  {result.totalTickets.toLocaleString()} tickets sold
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Check Result Modal */}
      <Modal
        visible={showCheckModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCheckModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {checkResult?.matched ? (
              <>
                <View style={styles.successIcon}>
                  <Ionicons name="trophy" size={80} color="#fbbf24" />
                </View>
                <Text style={styles.modalTitle}>Congratulations!</Text>
                <Text style={styles.modalMessage}>
                  You have winning tickets!
                </Text>
                <View style={styles.prizeDisplay}>
                  <Text style={styles.prizeLabel}>Total Prize</Text>
                  <Text style={styles.prizeValue}>${checkResult.prize}</Text>
                </View>
                <View style={styles.matchedNumbers}>
                  <Text style={styles.matchedLabel}>Winning Tickets:</Text>
                  <View style={styles.matchedList}>
                    {checkResult.matchedNumbers?.map((num, idx) => (
                      <View key={idx} style={styles.matchedNumber}>
                        <Text style={styles.matchedNumberText}>{num}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => {
                    setShowCheckModal(false);
                    navigation.navigate('MyTickets');
                  }}
                >
                  <Text style={styles.modalButtonText}>View My Tickets</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.infoIcon}>
                  <Ionicons name="information-circle" size={80} color="#3b82f6" />
                </View>
                <Text style={styles.modalTitle}>No Wins Yet</Text>
                <Text style={styles.modalMessage}>
                  Your tickets didn't match any winning numbers this time.
                </Text>
                <Text style={styles.modalSubtext}>
                  Keep trying! The next draw could be your lucky one.
                </Text>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => {
                    setShowCheckModal(false);
                    navigation.navigate('LotteryPurchase');
                  }}
                >
                  <Text style={styles.modalButtonText}>Buy More Tickets</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setShowCheckModal(false)}
            >
              <Text style={styles.closeModalText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  checkSection: {
    padding: 16,
  },
  checkButton: {
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    elevation: 4,
  },
  checkButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultInfo: {
    flex: 1,
  },
  drawName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  drawDate: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  prizeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  prizeAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400e',
  },
  winningSection: {
    marginBottom: 16,
  },
  winningLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
  },
  winningNumbers: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  winningNumber: {
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  winningNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  resultFooter: {
    gap: 8,
  },
  winnerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  winnerText: {
    fontSize: 12,
    color: '#64748b',
  },
  ticketsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ticketsText: {
    fontSize: 12,
    color: '#64748b',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    width: '85%',
  },
  successIcon: {
    marginBottom: 20,
  },
  infoIcon: {
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalSubtext: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 24,
  },
  prizeDisplay: {
    backgroundColor: '#fef3c7',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  prizeLabel: {
    fontSize: 14,
    color: '#92400e',
    marginBottom: 8,
  },
  prizeValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#92400e',
  },
  matchedNumbers: {
    width: '100%',
    marginBottom: 24,
  },
  matchedLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
  },
  matchedList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  matchedNumber: {
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  matchedNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 12,
    width: '100%',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  closeModalButton: {
    paddingVertical: 12,
  },
  closeModalText: {
    fontSize: 14,
    color: '#64748b',
  },
});
