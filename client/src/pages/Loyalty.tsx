import { useState } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLoyalty } from "@/contexts/LoyaltyContext";
import { Trophy, Gift, TrendingUp, Clock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function Loyalty() {
  const { points, tier, transactions, rewards, redeemReward, getPointsForPurchase } = useLoyalty();
  const [selectedTab, setSelectedTab] = useState<"rewards" | "history">("rewards");

  const nextTier = [
    { name: "Silver", min_points: 500 },
    { name: "Gold", min_points: 1000 },
    { name: "Platinum", min_points: 2500 },
  ].find((t) => t.min_points > points);

  const progressToNextTier = nextTier
    ? ((points - tier.min_points) / (nextTier.min_points - tier.min_points)) * 100
    : 100;

  function handleRedeem(reward: any) {
    const success = redeemReward(reward);
    if (success) {
      toast.success(`Successfully redeemed ${reward.name}!`);
    } else {
      toast.error(`Not enough points. You need ${reward.points_required - points} more points.`);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container py-8">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Loyalty Rewards</h1>
            <p className="text-muted-foreground">
              Earn points with every purchase and redeem them for exclusive rewards
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Points Balance */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Points</CardTitle>
                <Trophy className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{points.toLocaleString()}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  Earn {tier.multiplier}x points as {tier.name} member
                </p>
              </CardContent>
            </Card>

            {/* Current Tier */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Current Tier</CardTitle>
                <TrendingUp className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: tier.color }}
                  />
                  <div className="text-2xl font-bold">{tier.name}</div>
                </div>
                {nextTier && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress to {nextTier.name}</span>
                      <span className="font-medium">
                        {points}/{nextTier.min_points}
                      </span>
                    </div>
                    <Progress value={progressToNextTier} />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Points Multiplier */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Points Multiplier</CardTitle>
                <Gift className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{tier.multiplier}x</div>
                <p className="text-sm text-muted-foreground mt-1">
                  Earn ${getPointsForPurchase(100)} points per $100 spent
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b border-border">
            <button
              onClick={() => setSelectedTab("rewards")}
              className={`px-4 py-2 font-medium transition-colors ${
                selectedTab === "rewards"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Available Rewards
            </button>
            <button
              onClick={() => setSelectedTab("history")}
              className={`px-4 py-2 font-medium transition-colors ${
                selectedTab === "history"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Points History
            </button>
          </div>

          {/* Rewards Tab */}
          {selectedTab === "rewards" && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewards.map((reward) => {
                const canRedeem = points >= reward.points_required;
                return (
                  <Card key={reward.id} className={!canRedeem ? "opacity-60" : ""}>
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      <img
                        src={reward.image_url}
                        alt={reward.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{reward.name}</span>
                        <Badge variant={canRedeem ? "default" : "secondary"}>
                          {reward.points_required} pts
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{reward.description}</p>
                      <Button
                        className="w-full"
                        onClick={() => handleRedeem(reward)}
                        disabled={!canRedeem}
                      >
                        {canRedeem ? "Redeem Now" : `Need ${reward.points_required - points} more points`}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* History Tab */}
          {selectedTab === "history" && (
            <Card>
              <CardHeader>
                <CardTitle>Points History</CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No transactions yet</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Start shopping to earn points!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-border"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-2 rounded-full ${
                              transaction.type === "earn"
                                ? "bg-green-500/10 text-green-500"
                                : "bg-red-500/10 text-red-500"
                            }`}
                          >
                            {transaction.type === "earn" ? (
                              <TrendingUp className="h-5 w-5" />
                            ) : (
                              <Gift className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{transaction.description}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(transaction.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div
                          className={`text-lg font-bold ${
                            transaction.type === "earn" ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {transaction.type === "earn" ? "+" : "-"}
                          {transaction.points}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* How to Earn Points */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>How to Earn Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-primary/10 text-primary">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Make Purchases</div>
                    <p className="text-sm text-muted-foreground">
                      Earn {tier.multiplier} point{tier.multiplier > 1 ? "s" : ""} for every $1 spent
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-primary/10 text-primary">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Write Reviews</div>
                    <p className="text-sm text-muted-foreground">
                      Earn 50 points for each product review
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-primary/10 text-primary">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Refer Friends</div>
                    <p className="text-sm text-muted-foreground">
                      Earn 100 points for each successful referral
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
