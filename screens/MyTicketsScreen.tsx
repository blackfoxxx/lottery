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

interface Ticket {
  id: string;
  ticketNumbers: string[];
  drawName: string;
  drawDate: string;
  purchaseDate: string;
  status: 'active' | 'won' | 'lost';
  prize?: number;
  quantity: number;
}

export default function MyTicketsScreen({ navigation }: any) {
  const [filter, setFilter] = useState<'all' | 'active' | 'past'>('all');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  
  const tickets: Ticket[] = [
    {
      id: '1',
      ticketNumbers: ['#15420', '#15421', '#15422'],
      drawName: 'Golden Draw',
      drawDate: '2025-02-01',
      purchaseDate: '2024-12-25',
      status: 'active',
      quantity: 3,
    },
    {
      id: '2',
      ticketNumbers: ['#12345'],
      drawName: 'Silver Draw',
      drawDate: '2024-12-20',
      purchaseDate: '2024-12-10',
      status: 'lost',
      quantity: 1,
    },
    {
      id: '3',
      ticketNumbers: ['#98765', '#98766'],
      drawName: 'Bronze Draw',
      drawDate: '2024-12-15',
      purchaseDate: '2024-12-05',
      status: 'won',
      prize: 500,
      quantity: 2,
    },
  ];

  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'all') return true;
    if (filter === 'active') return ticket.status === 'active';
    if (filter === 'past') return ticket.status === 'won' || ticket.status === 'lost';
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#3b82f6';
      case 'won': return '#10b981';
      case 'lost': return '#94a3b8';
      default: return '#64748b';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return 'time';
      case 'won': return 'trophy';
      case 'lost': return 'close-circle';
      default: return 'ticket';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#1e3a8a', '#3b82f6']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Tickets</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'active' && styles.filterTabActive]}
          onPress={() => setFilter('active')}
        >
          <Text style={[styles.filterText, filter === 'active' && styles.filterTextActive]}>
            Active
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'past' && styles.filterTabActive]}
          onPress={() => setFilter('past')}
        >
          <Text style={[styles.filterText, filter === 'past' && styles.filterTextActive]}>
            Past
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tickets List */}
      <ScrollView style={styles.content}>
        {filteredTickets.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="ticket-outline" size={80} color="#cbd5e1" />
            <Text style={styles.emptyText}>No tickets found</Text>
            <Text style={styles.emptySubtext}>
              Purchase lottery tickets to see them here
            </Text>
          </View>
        ) : (
          filteredTickets.map((ticket) => (
            <TouchableOpacity
              key={ticket.id}
              style={styles.ticketCard}
              onPress={() => setSelectedTicket(ticket)}
            >
              <View style={styles.ticketHeader}>
                <View style={styles.ticketInfo}>
                  <Text style={styles.drawName}>{ticket.drawName}</Text>
                  <Text style={styles.ticketCount}>{ticket.quantity} ticket(s)</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(ticket.status) }]}>
                  <Ionicons name={getStatusIcon(ticket.status)} size={16} color="#fff" />
                  <Text style={styles.statusText}>
                    {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                  </Text>
                </View>
              </View>

              <View style={styles.ticketNumbers}>
                {ticket.ticketNumbers.map((num, idx) => (
                  <View key={idx} style={styles.ticketNumber}>
                    <Text style={styles.ticketNumberText}>{num}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.ticketFooter}>
                <View style={styles.dateInfo}>
                  <Ionicons name="calendar" size={14} color="#64748b" />
                  <Text style={styles.dateText}>Draw: {ticket.drawDate}</Text>
                </View>
                <View style={styles.dateInfo}>
                  <Ionicons name="cart" size={14} color="#64748b" />
                  <Text style={styles.dateText}>Purchased: {ticket.purchaseDate}</Text>
                </View>
              </View>

              {ticket.status === 'won' && ticket.prize && (
                <View style={styles.prizeContainer}>
                  <Ionicons name="trophy" size={20} color="#fbbf24" />
                  <Text style={styles.prizeText}>You won ${ticket.prize}!</Text>
                </View>
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Ticket Detail Modal */}
      <Modal
        visible={selectedTicket !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedTicket(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ticket Details</Text>
              <TouchableOpacity onPress={() => setSelectedTicket(null)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            {selectedTicket && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Draw Name</Text>
                  <Text style={styles.detailValue}>{selectedTicket.drawName}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedTicket.status) }]}>
                    <Text style={styles.statusText}>
                      {selectedTicket.status.charAt(0).toUpperCase() + selectedTicket.status.slice(1)}
                    </Text>
                  </View>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Quantity</Text>
                  <Text style={styles.detailValue}>{selectedTicket.quantity} ticket(s)</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Draw Date</Text>
                  <Text style={styles.detailValue}>{selectedTicket.drawDate}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Purchase Date</Text>
                  <Text style={styles.detailValue}>{selectedTicket.purchaseDate}</Text>
                </View>

                <Text style={styles.numbersTitle}>Ticket Numbers</Text>
                <View style={styles.numbersList}>
                  {selectedTicket.ticketNumbers.map((num, idx) => (
                    <View key={idx} style={styles.numberItem}>
                      <Text style={styles.numberItemText}>{num}</Text>
                    </View>
                  ))}
                </View>

                {selectedTicket.status === 'won' && selectedTicket.prize && (
                  <View style={styles.winBanner}>
                    <Ionicons name="trophy" size={40} color="#fbbf24" />
                    <Text style={styles.winText}>Congratulations!</Text>
                    <Text style={styles.winAmount}>You won ${selectedTicket.prize}</Text>
                  </View>
                )}
              </ScrollView>
            )}
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
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterTabActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  filterTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 8,
  },
  ticketCard: {
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
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ticketInfo: {
    flex: 1,
  },
  drawName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  ticketCount: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  ticketNumbers: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  ticketNumber: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  ticketNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
  },
  ticketFooter: {
    gap: 8,
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 12,
    color: '#64748b',
  },
  prizeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
  },
  prizeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#92400e',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  modalBody: {
    padding: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  numbersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 16,
    marginBottom: 12,
  },
  numbersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  numberItem: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  numberItemText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  winBanner: {
    backgroundColor: '#fef3c7',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  winText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#92400e',
    marginTop: 12,
  },
  winAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#92400e',
    marginTop: 8,
  },
});
