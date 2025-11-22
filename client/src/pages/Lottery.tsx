import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Ticket, Clock, Users, Gift, Info, CheckCircle2, Star } from 'lucide-react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';

interface LotteryDraw {
  id: number;
  name: string;
  category: 'golden' | 'silver' | 'bronze';
  prize_amount: number;
  prize_description: string;
  draw_date: string;
  status: 'upcoming' | 'in_progress' | 'completed';
  total_tickets: number;
  winner_ticket?: string;
  winner_user_id?: number;
}

export default function Lottery() {
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();
  const [activeDraws, setActiveDraws] = useState<LotteryDraw[]>([]);
  const [pastWinners, setPastWinners] = useState<LotteryDraw[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLotteryData();
  }, []);

  async function loadLotteryData() {
    try {
      // Fetch active draws
      const activeResponse = await fetch('http://localhost:8000/api/v1/lottery/draws?status=upcoming');
      const activeData = await activeResponse.json();
      
      if (activeData.success) {
        setActiveDraws(activeData.data);
      }

      // Fetch past winners
      const winnersResponse = await fetch('http://localhost:8000/api/v1/lottery/winners');
      const winnersData = await winnersResponse.json();
      
      if (winnersData.success) {
        setPastWinners(winnersData.data);
      }
    } catch (error) {
      console.error('Failed to load lottery data:', error);
    } finally {
      setLoading(false);
    }
  }

  function getCategoryColor(category: string) {
    switch (category) {
      case 'golden':
        return 'bg-yellow-500';
      case 'silver':
        return 'bg-gray-400';
      case 'bronze':
        return 'bg-orange-500';
      default:
        return 'bg-primary';
    }
  }

  function getCategoryGradient(category: string) {
    switch (category) {
      case 'golden':
        return 'from-yellow-500/20 to-yellow-500/5';
      case 'silver':
        return 'from-gray-400/20 to-gray-400/5';
      case 'bronze':
        return 'from-orange-500/20 to-orange-500/5';
      default:
        return 'from-primary/20 to-primary/5';
    }
  }

  function getTimeRemaining(drawDate: string) {
    const now = new Date().getTime();
    const draw = new Date(drawDate).getTime();
    const diff = draw - now;

    if (diff <= 0) return 'Draw in progress';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-background p-8 md:p-12 mb-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="w-12 h-12 text-yellow-500" />
              <h1 className="text-4xl md:text-5xl font-bold">Lottery Draws</h1>
            </div>
            <p className="text-xl text-muted-foreground mb-6 max-w-2xl">
              Purchase products to earn lottery tickets and win amazing prizes! Every purchase gives you a chance to win.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" onClick={() => navigate('/products')}>
                <Gift className="mr-2 h-5 w-5" />
                Shop & Earn Tickets
              </Button>
              {isAuthenticated && (
                <Button size="lg" variant="outline" onClick={() => navigate('/profile')}>
                  <Ticket className="mr-2 h-5 w-5" />
                  My Tickets
                </Button>
              )}
            </div>
          </div>
        </div>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="active">Active Draws</TabsTrigger>
            <TabsTrigger value="winners">Past Winners</TabsTrigger>
            <TabsTrigger value="rules">How It Works</TabsTrigger>
          </TabsList>

          {/* Active Draws Tab */}
          <TabsContent value="active" className="space-y-6">
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="h-48 bg-muted animate-pulse" />
                    <CardContent className="p-6 space-y-3">
                      <div className="h-6 bg-muted rounded animate-pulse" />
                      <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : activeDraws.length === 0 ? (
              <Card className="p-12 text-center">
                <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Active Draws</h3>
                <p className="text-muted-foreground">Check back soon for new lottery draws!</p>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeDraws.map((draw) => (
                  <Card key={draw.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                    <div className={`h-2 ${getCategoryColor(draw.category)}`} />
                    <div className={`bg-gradient-to-br ${getCategoryGradient(draw.category)} p-6`}>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <Badge className={`${getCategoryColor(draw.category)} text-white mb-2`}>
                            {draw.category.toUpperCase()}
                          </Badge>
                          <h3 className="text-2xl font-bold">{draw.name}</h3>
                        </div>
                        <Trophy className={`w-12 h-12 ${draw.category === 'golden' ? 'text-yellow-500' : draw.category === 'silver' ? 'text-gray-400' : 'text-orange-500'}`} />
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-3xl font-bold text-primary">
                          <Gift className="w-8 h-8" />
                          ${draw.prize_amount.toLocaleString()}
                        </div>
                        <p className="text-muted-foreground">{draw.prize_description}</p>
                        
                        <div className="pt-4 border-t border-border space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">Draw in: {getTimeRemaining(draw.draw_date)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span>{draw.total_tickets} tickets issued</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Draw Date: {new Date(draw.draw_date).toLocaleDateString('en-US', { 
                              month: 'long', 
                              day: 'numeric', 
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Past Winners Tab */}
          <TabsContent value="winners" className="space-y-6">
            {pastWinners.length === 0 ? (
              <Card className="p-12 text-center">
                <Star className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Winners Yet</h3>
                <p className="text-muted-foreground">Be the first to win! Purchase products to earn lottery tickets.</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {pastWinners.map((winner) => (
                  <Card key={winner.id} className="overflow-hidden">
                    <div className={`h-1 ${getCategoryColor(winner.category)}`} />
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Trophy className={`w-8 h-8 ${winner.category === 'golden' ? 'text-yellow-500' : winner.category === 'silver' ? 'text-gray-400' : 'text-orange-500'}`} />
                            <div>
                              <h3 className="text-xl font-bold">{winner.name}</h3>
                              <Badge className={`${getCategoryColor(winner.category)} text-white`}>
                                {winner.category.toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4 mt-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Prize</p>
                              <p className="text-2xl font-bold text-primary">${winner.prize_amount.toLocaleString()}</p>
                              <p className="text-sm text-muted-foreground">{winner.prize_description}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Winning Ticket</p>
                              <p className="text-lg font-mono font-bold">{winner.winner_ticket}</p>
                              <p className="text-sm text-muted-foreground">
                                Drawn on {new Date(winner.draw_date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* How It Works Tab */}
          <TabsContent value="rules" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-6 h-6" />
                  How the Lottery Works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">1</span>
                    </div>
                    <h3 className="text-lg font-semibold">Shop & Earn</h3>
                    <p className="text-muted-foreground">
                      Purchase any product from our store and automatically earn lottery tickets based on the product category.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">2</span>
                    </div>
                    <h3 className="text-lg font-semibold">Get Your Tickets</h3>
                    <p className="text-muted-foreground">
                      Each ticket has a unique number and is automatically entered into the corresponding lottery draw (Golden, Silver, or Bronze).
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">3</span>
                    </div>
                    <h3 className="text-lg font-semibold">Win Prizes</h3>
                    <p className="text-muted-foreground">
                      On the draw date, one lucky ticket is randomly selected as the winner. We'll notify you immediately if you win!
                    </p>
                  </div>
                </div>

                <div className="border-t border-border pt-6 space-y-4">
                  <h3 className="text-xl font-semibold">Ticket Categories</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                      <Trophy className="w-6 h-6 text-yellow-500 mt-1" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-yellow-500 mb-1">Golden Tickets</h4>
                        <p className="text-sm text-muted-foreground">
                          Highest prize tier with rewards up to $10,000. Earned from premium products.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-400/10 border border-gray-400/20">
                      <Trophy className="w-6 h-6 text-gray-400 mt-1" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-400 mb-1">Silver Tickets</h4>
                        <p className="text-sm text-muted-foreground">
                          Mid-tier prizes up to $5,000. Earned from mid-range products.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                      <Trophy className="w-6 h-6 text-orange-500 mt-1" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-orange-500 mb-1">Bronze Tickets</h4>
                        <p className="text-sm text-muted-foreground">
                          Entry-level prizes up to $1,000. Earned from all products.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-6 space-y-3">
                  <h3 className="text-xl font-semibold">Important Rules</h3>
                  <ul className="space-y-2">
                    {[
                      'Tickets are automatically generated upon successful order completion',
                      'Each ticket is valid only for its designated draw category',
                      'Winners are selected using a cryptographically secure random number generator',
                      'Winners will be notified via email and phone within 24 hours of the draw',
                      'Prizes must be claimed within 30 days of the draw date',
                      'You can view all your tickets in your profile dashboard',
                      'Ticket numbers are unique and cannot be transferred',
                    ].map((rule, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-primary/10 rounded-lg p-6 text-center">
                  <h3 className="text-xl font-semibold mb-2">Ready to Try Your Luck?</h3>
                  <p className="text-muted-foreground mb-4">
                    Start shopping now and earn your lottery tickets automatically!
                  </p>
                  <Button size="lg" onClick={() => navigate('/products')}>
                    Browse Products
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
