import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLoyalty } from "../contexts/LoyaltyContext";

export default function LoyaltyScreen() {
  const { points, tier, transactions, rewards, redeemReward } = useLoyalty();

  const nextTier = [
    { name: "Bronze", min_points: 0 },
    { name: "Silver", min_points: 500 },
    { name: "Gold", min_points: 1000 },
    { name: "Platinum", min_points: 2500 },
  ].find((t) => t.min_points > points);

  const progress = nextTier
    ? ((points - tier.min_points) / (nextTier.min_points - tier.min_points)) * 100
    : 100;

  function handleRedeem(reward: any) {
    Alert.alert(
      "Redeem Reward",
      `Redeem ${reward.name} for ${reward.points_required} points?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Redeem",
          onPress: () => {
            const success = redeemReward(reward);
            if (success) {
              Alert.alert("Success!", `You've redeemed: ${reward.name}`);
            } else {
              Alert.alert("Error", "Not enough points to redeem this reward");
            }
          },
        },
      ]
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Loyalty Rewards</Text>
        <Text style={styles.subtitle}>Earn points with every purchase</Text>
      </View>

      {/* Points Card */}
      <View style={[styles.card, { borderLeftColor: tier.color, borderLeftWidth: 4 }]}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.tierName}>{tier.name} Member</Text>
            <Text style={styles.multiplier}>{tier.multiplier}x Points Multiplier</Text>
          </View>
          <View style={styles.pointsBadge}>
            <Text style={styles.pointsText}>{points}</Text>
            <Text style={styles.pointsLabel}>Points</Text>
          </View>
        </View>

        {nextTier && (
          <View style={styles.progressSection}>
            <Text style={styles.progressText}>
              {nextTier.min_points - points} points to {nextTier.name}
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
          </View>
        )}
      </View>

      {/* Rewards Catalog */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Rewards</Text>
        {rewards.map((reward) => (
          <View key={reward.id} style={styles.rewardCard}>
            <View style={styles.rewardInfo}>
              <Text style={styles.rewardName}>{reward.name}</Text>
              <Text style={styles.rewardDescription}>{reward.description}</Text>
              <View style={styles.rewardPoints}>
                <Text style={styles.rewardPointsText}>{reward.points_required} points</Text>
              </View>
            </View>
            <TouchableOpacity
              style={[
                styles.redeemButton,
                points < reward.points_required && styles.redeemButtonDisabled,
              ]}
              onPress={() => handleRedeem(reward)}
              disabled={points < reward.points_required}
            >
              <Text
                style={[
                  styles.redeemButtonText,
                  points < reward.points_required && styles.redeemButtonTextDisabled,
                ]}
              >
                Redeem
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Transaction History */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {transactions.slice(0, 10).map((transaction) => (
          <View key={transaction.id} style={styles.transactionCard}>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionDescription}>{transaction.description}</Text>
              <Text style={styles.transactionDate}>
                {new Date(transaction.date).toLocaleDateString()}
              </Text>
            </View>
            <Text
              style={[
                styles.transactionPoints,
                transaction.type === "earn" ? styles.earnPoints : styles.redeemPoints,
              ]}
            >
              {transaction.type === "earn" ? "+" : "-"}
              {transaction.points}
            </Text>
          </View>
        ))}
        {transactions.length === 0 && (
          <Text style={styles.emptyText}>No transactions yet. Start shopping to earn points!</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 20,
    backgroundColor: "#1a1a2e",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#ccc",
  },
  card: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  tierName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a1a2e",
  },
  multiplier: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  pointsBadge: {
    alignItems: "center",
  },
  pointsText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#e74c3c",
  },
  pointsLabel: {
    fontSize: 12,
    color: "#666",
  },
  progressSection: {
    marginTop: 12,
  },
  progressText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#e74c3c",
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a1a2e",
    marginBottom: 12,
  },
  rewardCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a2e",
    marginBottom: 4,
  },
  rewardDescription: {
    fontSize: 13,
    color: "#666",
    marginBottom: 8,
  },
  rewardPoints: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  rewardPointsText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#e74c3c",
  },
  redeemButton: {
    backgroundColor: "#e74c3c",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  redeemButtonDisabled: {
    backgroundColor: "#ccc",
  },
  redeemButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  redeemButtonTextDisabled: {
    color: "#999",
  },
  transactionCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    color: "#1a1a2e",
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: "#999",
  },
  transactionPoints: {
    fontSize: 16,
    fontWeight: "bold",
  },
  earnPoints: {
    color: "#4caf50",
  },
  redeemPoints: {
    color: "#e74c3c",
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    fontSize: 14,
    marginTop: 20,
  },
});
