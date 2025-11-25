import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface LoyaltyTransaction {
  id: number;
  type: "earn" | "redeem";
  points: number;
  description: string;
  date: string;
}

interface Reward {
  id: number;
  name: string;
  description: string;
  points_required: number;
  discount_amount: number;
  discount_type: "percentage" | "fixed";
}

interface LoyaltyTier {
  name: string;
  min_points: number;
  multiplier: number;
  color: string;
}

interface LoyaltyContextType {
  points: number;
  tier: LoyaltyTier;
  transactions: LoyaltyTransaction[];
  rewards: Reward[];
  addPoints: (points: number, description: string) => void;
  redeemReward: (reward: Reward) => boolean;
  getPointsForPurchase: (amount: number) => number;
}

const LoyaltyContext = createContext<LoyaltyContextType | undefined>(undefined);

const LOYALTY_TIERS: LoyaltyTier[] = [
  { name: "Bronze", min_points: 0, multiplier: 1, color: "#CD7F32" },
  { name: "Silver", min_points: 500, multiplier: 1.25, color: "#C0C0C0" },
  { name: "Gold", min_points: 1000, multiplier: 1.5, color: "#FFD700" },
  { name: "Platinum", min_points: 2500, multiplier: 2, color: "#E5E4E2" },
];

const REWARDS: Reward[] = [
  {
    id: 1,
    name: "$5 Off Coupon",
    description: "Get $5 off your next purchase",
    points_required: 250,
    discount_amount: 5,
    discount_type: "fixed",
  },
  {
    id: 2,
    name: "$10 Off Coupon",
    description: "Get $10 off your next purchase",
    points_required: 500,
    discount_amount: 10,
    discount_type: "fixed",
  },
  {
    id: 3,
    name: "15% Off Coupon",
    description: "Get 15% off your entire order",
    points_required: 750,
    discount_amount: 15,
    discount_type: "percentage",
  },
  {
    id: 4,
    name: "$25 Off Coupon",
    description: "Get $25 off your next purchase",
    points_required: 1000,
    discount_amount: 25,
    discount_type: "fixed",
  },
  {
    id: 5,
    name: "25% Off Coupon",
    description: "Get 25% off your entire order",
    points_required: 1500,
    discount_amount: 25,
    discount_type: "percentage",
  },
  {
    id: 6,
    name: "Free Shipping",
    description: "Free shipping on your next order",
    points_required: 300,
    discount_amount: 0,
    discount_type: "fixed",
  },
];

export function LoyaltyProvider({ children }: { children: ReactNode }) {
  const [points, setPoints] = useState(0);
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);

  // Load from AsyncStorage
  useEffect(() => {
    loadData();
  }, []);

  // Save to AsyncStorage
  useEffect(() => {
    saveData();
  }, [points, transactions]);

  async function loadData() {
    try {
      const savedPoints = await AsyncStorage.getItem("loyalty_points");
      const savedTransactions = await AsyncStorage.getItem("loyalty_transactions");

      if (savedPoints) setPoints(parseInt(savedPoints));
      if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
    } catch (error) {
      console.error("Error loading loyalty data:", error);
    }
  }

  async function saveData() {
    try {
      await AsyncStorage.setItem("loyalty_points", points.toString());
      await AsyncStorage.setItem("loyalty_transactions", JSON.stringify(transactions));
    } catch (error) {
      console.error("Error saving loyalty data:", error);
    }
  }

  function getCurrentTier(): LoyaltyTier {
    return [...LOYALTY_TIERS]
      .reverse()
      .find((tier) => points >= tier.min_points) || LOYALTY_TIERS[0];
  }

  function addPoints(earnedPoints: number, description: string) {
    const tier = getCurrentTier();
    const actualPoints = Math.floor(earnedPoints * tier.multiplier);

    setPoints((prev) => prev + actualPoints);
    setTransactions((prev) => [
      {
        id: Date.now(),
        type: "earn",
        points: actualPoints,
        description,
        date: new Date().toISOString(),
      },
      ...prev,
    ]);
  }

  function redeemReward(reward: Reward): boolean {
    if (points < reward.points_required) {
      return false;
    }

    setPoints((prev) => prev - reward.points_required);
    setTransactions((prev) => [
      {
        id: Date.now(),
        type: "redeem",
        points: reward.points_required,
        description: `Redeemed: ${reward.name}`,
        date: new Date().toISOString(),
      },
      ...prev,
    ]);

    return true;
  }

  function getPointsForPurchase(amount: number): number {
    const tier = getCurrentTier();
    return Math.floor(amount * tier.multiplier);
  }

  return (
    <LoyaltyContext.Provider
      value={{
        points,
        tier: getCurrentTier(),
        transactions,
        rewards: REWARDS,
        addPoints,
        redeemReward,
        getPointsForPurchase,
      }}
    >
      {children}
    </LoyaltyContext.Provider>
  );
}

export function useLoyalty() {
  const context = useContext(LoyaltyContext);
  if (!context) {
    throw new Error("useLoyalty must be used within LoyaltyProvider");
  }
  return context;
}
