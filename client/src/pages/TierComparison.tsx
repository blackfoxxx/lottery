import { Check, X, Crown, Award, Gift, Clock, Star, Truck, Headphones, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLoyalty } from "@/contexts/LoyaltyContext";
import { Link } from "wouter";

const tiers = [
  {
    name: "Bronze",
    color: "from-amber-700 to-amber-900",
    icon: Award,
    pointsRequired: 0,
    benefits: [
      { icon: Award, text: "Earn 1x points on every purchase", included: true },
      { icon: Gift, text: "100 bonus points on your birthday", included: true },
      { icon: Clock, text: "Early access to flash sales", included: false },
      { icon: Star, text: "Access to exclusive products", included: false },
      { icon: Truck, text: "Free shipping on all orders", included: false },
      { icon: Headphones, text: "Priority customer support", included: false },
      { icon: Users, text: "Referral bonus program", included: false },
    ],
  },
  {
    name: "Silver",
    color: "from-gray-400 to-gray-600",
    icon: Award,
    pointsRequired: 1000,
    benefits: [
      { icon: Award, text: "Earn 1.5x points on every purchase", included: true },
      { icon: Gift, text: "250 bonus points on your birthday", included: true },
      { icon: Clock, text: "24-hour early access to flash sales", included: true },
      { icon: Star, text: "Access to exclusive products", included: false },
      { icon: Truck, text: "Free shipping on all orders", included: false },
      { icon: Headphones, text: "Priority customer support", included: false },
      { icon: Users, text: "Referral bonus program", included: false },
    ],
  },
  {
    name: "Gold",
    color: "from-yellow-400 to-yellow-600",
    icon: Crown,
    pointsRequired: 5000,
    benefits: [
      { icon: Award, text: "Earn 2x points on every purchase", included: true },
      { icon: Gift, text: "500 bonus points on your birthday", included: true },
      { icon: Clock, text: "48-hour early access to flash sales", included: true },
      { icon: Star, text: "Access to VIP-only exclusive products", included: true },
      { icon: Truck, text: "Free shipping on all orders", included: true },
      { icon: Headphones, text: "Priority customer support", included: false },
      { icon: Users, text: "Referral bonus program", included: false },
    ],
  },
  {
    name: "Platinum",
    color: "from-purple-400 to-purple-600",
    icon: Crown,
    pointsRequired: 15000,
    benefits: [
      { icon: Award, text: "Earn 3x points on every purchase", included: true },
      { icon: Gift, text: "1000 bonus points on your birthday", included: true },
      { icon: Clock, text: "72-hour early access to flash sales", included: true },
      { icon: Star, text: "Access to VIP-only exclusive products", included: true },
      { icon: Truck, text: "Free shipping on all orders", included: true },
      { icon: Headphones, text: "Priority customer support", included: true },
      { icon: Users, text: "500 points for each successful referral", included: true },
    ],
  },
];

export default function TierComparison() {
  const { tier, points } = useLoyalty();

  const getCurrentTierIndex = () => {
    return tiers.findIndex((t) => t.name === tier.name);
  };

  const getNextTier = () => {
    const currentIndex = getCurrentTierIndex();
    return currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : null;
  };

  const nextTier = getNextTier();
  const pointsToNext = nextTier ? nextTier.pointsRequired - points : 0;

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Loyalty Tier Benefits</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Unlock exclusive rewards and benefits as you shop
          </p>
          
          {nextTier && (
            <Card className="max-w-2xl mx-auto bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Your Current Tier</p>
                    <p className="text-2xl font-bold text-primary">{tier.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Next Tier</p>
                    <p className="text-2xl font-bold">{nextTier.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {pointsToNext} points to go
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-500"
                      style={{
                        width: `${(points / nextTier.pointsRequired) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Tier Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tierData, index) => {
            const TierIcon = tierData.icon;
            const isCurrentTier = tierData.name === tier.name;

            return (
              <Card
                key={tierData.name}
                className={`relative overflow-hidden ${
                  isCurrentTier ? "ring-2 ring-primary shadow-lg" : ""
                }`}
              >
                {isCurrentTier && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold rounded-bl-lg">
                    Your Tier
                  </div>
                )}

                <CardHeader>
                  <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${tierData.color} flex items-center justify-center mb-4`}
                  >
                    <TierIcon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">{tierData.name}</CardTitle>
                  <CardDescription>
                    {tierData.pointsRequired === 0
                      ? "Starting tier"
                      : `${tierData.pointsRequired.toLocaleString()} points required`}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3">
                  {tierData.benefits.map((benefit, idx) => {
                    const BenefitIcon = benefit.icon;
                    return (
                      <div
                        key={idx}
                        className={`flex items-start gap-2 ${
                          !benefit.included ? "opacity-40" : ""
                        }`}
                      >
                        {benefit.included ? (
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex items-start gap-2 flex-1">
                          <BenefitIcon className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{benefit.text}</span>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* How It Works */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>How to Earn Points & Upgrade Your Tier</CardTitle>
            <CardDescription>
              Shop more, earn more, and unlock exclusive benefits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Shop & Earn</h3>
                <p className="text-sm text-muted-foreground">
                  Earn points with every purchase. Higher tiers earn more points per dollar spent.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Gift className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Birthday Rewards</h3>
                <p className="text-sm text-muted-foreground">
                  Receive bonus points on your birthday. The amount increases with your tier level.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Refer Friends</h3>
                <p className="text-sm text-muted-foreground">
                  Platinum members earn 500 points for each friend they refer who makes a purchase.
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link href="/products">
                <Button size="lg">
                  Start Shopping
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
