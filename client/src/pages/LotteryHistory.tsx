import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Ticket, Download, Calendar, DollarSign, Trophy } from "lucide-react";

interface LotteryTicket {
  id: number;
  ticketNumber: string;
  purchaseDate: string;
  drawDate: string;
  amount: number;
  status: "active" | "won" | "lost" | "pending";
  prize?: number;
}

// Mock data
const mockTickets: LotteryTicket[] = [
  {
    id: 1,
    ticketNumber: "LT-2024-001234",
    purchaseDate: "2024-01-15",
    drawDate: "2024-02-01",
    amount: 50,
    status: "won",
    prize: 500,
  },
  {
    id: 2,
    ticketNumber: "LT-2024-001235",
    purchaseDate: "2024-01-20",
    drawDate: "2024-02-01",
    amount: 25,
    status: "lost",
  },
  {
    id: 3,
    ticketNumber: "LT-2024-001236",
    purchaseDate: "2024-02-05",
    drawDate: "2024-03-01",
    amount: 100,
    status: "active",
  },
  {
    id: 4,
    ticketNumber: "LT-2024-001237",
    purchaseDate: "2024-02-10",
    drawDate: "2024-03-01",
    amount: 75,
    status: "pending",
  },
];

export default function LotteryHistory() {
  const { t } = useLanguage();
  const [tickets] = useState<LotteryTicket[]>(mockTickets);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const filteredTickets = tickets.filter((ticket) => {
    if (statusFilter !== "all" && ticket.status !== statusFilter) return false;
    if (fromDate && ticket.purchaseDate < fromDate) return false;
    if (toDate && ticket.purchaseDate > toDate) return false;
    return true;
  });

  const totalSpent = tickets.reduce((sum, ticket) => sum + ticket.amount, 0);
  const totalWinnings = tickets
    .filter((t) => t.status === "won")
    .reduce((sum, ticket) => sum + (ticket.prize || 0), 0);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      active: "default",
      won: "default",
      lost: "secondary",
      pending: "outline",
    };
    const colors: Record<string, string> = {
      active: "bg-blue-500",
      won: "bg-green-500",
      lost: "bg-gray-500",
      pending: "bg-yellow-500",
    };
    return (
      <Badge variant={variants[status]} className={colors[status]}>
        {t(`lottery.${status}`)}
      </Badge>
    );
  };

  const handleExportPDF = () => {
    // TODO: Implement PDF export
    alert("PDF export functionality will be implemented with the backend");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{t("lottery.history")}</h1>
          <p className="text-muted-foreground">{t("lottery.myTickets")}</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("lottery.totalTickets")}</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tickets.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("lottery.totalSpent")}</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("lottery.totalWinnings")}</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${totalWinnings.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t("lottery.filterByDate")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">{t("lottery.fromDate")}</label>
                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">{t("lottery.toDate")}</label>
                <Input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">{t("lottery.status")}</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("lottery.allStatuses")}</SelectItem>
                    <SelectItem value="active">{t("lottery.active")}</SelectItem>
                    <SelectItem value="won">{t("lottery.won")}</SelectItem>
                    <SelectItem value="lost">{t("lottery.lost")}</SelectItem>
                    <SelectItem value="pending">{t("lottery.pending")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={handleExportPDF} className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  {t("lottery.exportPDF")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tickets List */}
        {filteredTickets.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Ticket className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t("lottery.noTickets")}</h3>
              <p className="text-muted-foreground">{t("lottery.noTicketsDesc")}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <Card key={ticket.id}>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-2 mb-1">
                        <Ticket className="h-5 w-5 text-primary" />
                        <span className="font-mono font-semibold">{ticket.ticketNumber}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {t("lottery.ticketNumber")}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {new Date(ticket.purchaseDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {t("lottery.purchaseDate")}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {new Date(ticket.drawDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">{t("lottery.drawDate")}</div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">${ticket.amount.toFixed(2)}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">{t("lottery.amount")}</div>
                    </div>

                    <div className="flex flex-col items-start md:items-end gap-2">
                      {getStatusBadge(ticket.status)}
                      {ticket.status === "won" && ticket.prize && (
                        <div className="flex items-center gap-1 text-green-600 font-semibold">
                          <Trophy className="h-4 w-4" />
                          <span>${ticket.prize.toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
