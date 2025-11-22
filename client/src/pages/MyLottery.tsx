import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Ticket, Trophy, Search, Filter, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";

interface LotteryTicket {
  ticket_number: string;
  category: string;
  product_name: string;
  order_id: string;
  purchase_date: string;
  draw_date?: string;
  status: "active" | "drawn" | "winner";
  prize?: string;
}

export default function MyLottery() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [tickets, setTickets] = useState<LotteryTicket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<LotteryTicket[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (!user) {
      setLocation("/");
      return;
    }
    loadTickets();
  }, [user]);

  useEffect(() => {
    filterTickets();
  }, [tickets, searchQuery, categoryFilter, statusFilter]);

  function loadTickets() {
    // Load all lottery tickets from localStorage
    const allTickets: LotteryTicket[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('lottery_tickets_')) {
        const orderId = key.replace('lottery_tickets_', '');
        const ticketsData = JSON.parse(localStorage.getItem(key) || '[]');
        
        ticketsData.forEach((ticket: any) => {
          allTickets.push({
            ...ticket,
            order_id: orderId,
            purchase_date: new Date().toISOString(),
            status: "active",
          });
        });
      }
    }

    // Check for winners
    const winners = JSON.parse(localStorage.getItem('lottery_winners') || '[]');
    winners.forEach((winner: any) => {
      const ticketIndex = allTickets.findIndex(t => t.ticket_number === winner.winner_ticket);
      if (ticketIndex !== -1) {
        allTickets[ticketIndex].status = "winner";
        allTickets[ticketIndex].prize = winner.prize;
      }
    });

    setTickets(allTickets);
  }

  function filterTickets() {
    let filtered = [...tickets];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (ticket) =>
          ticket.ticket_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ticket.product_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((ticket) => ticket.category === categoryFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((ticket) => ticket.status === statusFilter);
    }

    setFilteredTickets(filtered);
  }

  function getCategoryColor(category: string) {
    switch (category.toLowerCase()) {
      case "golden":
        return "bg-yellow-500";
      case "silver":
        return "bg-gray-400";
      case "bronze":
        return "bg-orange-600";
      default:
        return "bg-gray-500";
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "active":
        return "bg-blue-500";
      case "drawn":
        return "bg-gray-500";
      case "winner":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  }

  const stats = {
    total: tickets.length,
    active: tickets.filter((t) => t.status === "active").length,
    winners: tickets.filter((t) => t.status === "winner").length,
    golden: tickets.filter((t) => t.category === "golden").length,
    silver: tickets.filter((t) => t.category === "silver").length,
    bronze: tickets.filter((t) => t.category === "bronze").length,
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
              <Ticket className="h-8 w-8" />
              My Lottery Tickets
            </h1>
            <p className="text-muted-foreground">
              View all your lottery tickets and check if you're a winner!
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid gap-4 md:grid-cols-6 mb-6">
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Total Tickets</div>
              <div className="text-2xl font-bold">{stats.total}</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Active</div>
              <div className="text-2xl font-bold text-blue-500">{stats.active}</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Winners</div>
              <div className="text-2xl font-bold text-green-500 flex items-center gap-1">
                <Trophy className="h-5 w-5" />
                {stats.winners}
              </div>
            </Card>
            <Card className="p-4 bg-yellow-500/10 border-yellow-500/20">
              <div className="text-sm text-muted-foreground">Golden</div>
              <div className="text-2xl font-bold text-yellow-500">{stats.golden}</div>
            </Card>
            <Card className="p-4 bg-gray-400/10 border-gray-400/20">
              <div className="text-sm text-muted-foreground">Silver</div>
              <div className="text-2xl font-bold text-gray-400">{stats.silver}</div>
            </Card>
            <Card className="p-4 bg-orange-600/10 border-orange-600/20">
              <div className="text-sm text-muted-foreground">Bronze</div>
              <div className="text-2xl font-bold text-orange-600">{stats.bronze}</div>
            </Card>
          </div>

          {/* Filters */}
          <Card className="p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by ticket number or product..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="golden">Golden</SelectItem>
                    <SelectItem value="silver">Silver</SelectItem>
                    <SelectItem value="bronze">Bronze</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="drawn">Drawn</SelectItem>
                    <SelectItem value="winner">Winner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Tickets Table */}
          {filteredTickets.length === 0 ? (
            <Card className="p-12 text-center">
              <Ticket className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Lottery Tickets Yet</h3>
              <p className="text-muted-foreground mb-6">
                Purchase products to earn lottery tickets and win amazing prizes!
              </p>
              <Button onClick={() => setLocation("/products")}>
                Browse Products
              </Button>
            </Card>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket Number</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Purchase Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Prize</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTickets.map((ticket, index) => (
                    <TableRow key={index} className={ticket.status === "winner" ? "bg-green-500/5" : ""}>
                      <TableCell className="font-mono font-semibold">
                        {ticket.ticket_number}
                      </TableCell>
                      <TableCell>
                        <Badge className={getCategoryColor(ticket.category)}>
                          {ticket.category}
                        </Badge>
                      </TableCell>
                      <TableCell>{ticket.product_name}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {ticket.order_id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {new Date(ticket.purchase_date).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(ticket.status)}>
                          {ticket.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {ticket.status === "winner" ? (
                          <div className="flex items-center gap-1 font-bold text-green-500">
                            <Trophy className="h-4 w-4" />
                            {ticket.prize || "$1,000"}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}

          {/* Winner Banner */}
          {stats.winners > 0 && (
            <Card className="mt-6 p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-green-500/20">
                  <Trophy className="h-8 w-8 text-green-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">Congratulations! 🎉</h3>
                  <p className="text-muted-foreground">
                    You have {stats.winners} winning ticket{stats.winners > 1 ? "s" : ""}! Check your email for prize claim instructions.
                  </p>
                </div>
                <Button size="lg" className="bg-green-500 hover:bg-green-600">
                  Claim Prize
                </Button>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
