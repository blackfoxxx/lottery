import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, DollarSign, Users, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Winner {
  id: number;
  name: string;
  prize: number;
  ticketNumber: string;
  drawName: string;
  date: string;
}

interface DrawHistory {
  id: number;
  name: string;
  prize: number;
  date: string;
  ticketsSold: number;
  winner: string;
}

export default function LotteryStats() {
  const { t } = useLanguage();

  const [topWinners] = useState<Winner[]>([
    {
      id: 1,
      name: "Ahmad K.",
      prize: 10000,
      ticketNumber: "LT-2024-001234",
      drawName: "Golden Draw",
      date: "2024-02-15",
    },
    {
      id: 2,
      name: "Sarah M.",
      prize: 8500,
      ticketNumber: "LT-2024-002156",
      drawName: "Diamond Prize",
      date: "2024-02-10",
    },
    {
      id: 3,
      name: "Mohammed A.",
      prize: 7000,
      ticketNumber: "LT-2024-003421",
      drawName: "Platinum Draw",
      date: "2024-02-05",
    },
  ]);

  const [drawHistory] = useState<DrawHistory[]>([
    {
      id: 1,
      name: "Golden Draw",
      prize: 10000,
      date: "2024-02-15",
      ticketsSold: 15420,
      winner: "Ahmad K.",
    },
    {
      id: 2,
      name: "Diamond Prize",
      prize: 8500,
      date: "2024-02-10",
      ticketsSold: 12340,
      winner: "Sarah M.",
    },
    {
      id: 3,
      name: "Platinum Draw",
      prize: 7000,
      date: "2024-02-05",
      ticketsSold: 9876,
      winner: "Mohammed A.",
    },
  ]);

  const totalPrizesAwarded = topWinners.reduce((sum, w) => sum + w.prize, 0);
  const totalTicketsSold = drawHistory.reduce((sum, d) => sum + d.ticketsSold, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Lottery Statistics</h1>
          <p className="text-muted-foreground mt-2">
            Transparency and trust through complete lottery history
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Prizes Awarded</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalPrizesAwarded.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Across all draws
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Biggest Win</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${Math.max(...topWinners.map(w => w.prize)).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {topWinners[0].name}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tickets Sold</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTicketsSold.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                All-time
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Draws</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{drawHistory.length}</div>
              <p className="text-xs text-muted-foreground">
                Completed
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Top Winners */}
        <Card>
          <CardHeader>
            <CardTitle>Top Winners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topWinners.map((winner, index) => (
                <div
                  key={winner.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      <span className="text-lg font-bold text-primary">#{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-semibold">{winner.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {winner.drawName} • {new Date(winner.date).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Ticket: {winner.ticketNumber}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      ${winner.prize.toLocaleString()}
                    </div>
                    <Badge variant="outline" className="mt-1">
                      Winner
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Draw History */}
        <Card>
          <CardHeader>
            <CardTitle>Draw History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {drawHistory.map((draw) => (
                <div
                  key={draw.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <div className="font-semibold">{draw.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(draw.date).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {draw.ticketsSold.toLocaleString()} tickets sold
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold">
                      ${draw.prize.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Winner: {draw.winner}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
