import { createContext, useContext, useState, useEffect, ReactNode } from "react";

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
  image_url: string;
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
    image_url: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    name: "$10 Off Coupon",
    description: "Get $10 off your next purchase",
    points_required: 500,
    discount_amount: 10,
    discount_type: "fixed",
    image_url: "https://images.unsplash.com/photo-1607083206325-caf1edba7a0f?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    name: "15% Off Coupon",
    description: "Get 15% off your entire order",
    points_required: 750,
    discount_amount: 15,
    discount_type: "percentage",
    image_url: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400&h=300&fit=crop",
  },
  {
    id: 4,
    name: "$25 Off Coupon",
    description: "Get $25 off your next purchase",
    points_required: 1000,
    discount_amount: 25,
    discount_type: "fixed",
    image_url: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=300&fit=crop",
  },
  {
    id: 5,
    name: "25% Off Coupon",
    description: "Get 25% off your entire order",
    points_required: 1500,
    discount_amount: 25,
    discount_type: "percentage",
    image_url: "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=400&h=300&fit=crop",
  },
  {
    id: 6,
    name: "Free Shipping",
    description: "Free shipping on your next order",
    points_required: 300,
    discount_amount: 0,
    discount_type: "fixed",
    image_url: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=400&h=300&fit=crop",
  },
];

export function LoyaltyProvider({ children }: { children: ReactNode }) {
  const [points, setPoints] = useState(0);
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);

  // Load from localStorage
  useEffect(() => {
    const savedPoints = localStorage.getItem("loyalty_points");
    const savedTransactions = localStorage.getItem("loyalty_transactions");

    if (savedPoints) setPoints(parseInt(savedPoints));
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("loyalty_points", points.toString());
    localStorage.setItem("loyalty_transactions", JSON.stringify(transactions));
  }, [points, transactions]);

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
