import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Gift, DollarSign, Users, CheckCircle2, XCircle, Clock, Search, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface GiftCard {
  id: number;
  code: string;
  initial_balance: number;
  current_balance: number;
  status: "active" | "used" | "expired";
  purchaser_id: number;
  recipient_email: string;
  recipient_name: string;
  message: string | null;
  expires_at: string | null;
  created_at: string;
  used_at: string | null;
}

interface Stats {
  total_cards: number;
  active_cards: number;
  total_value: number;
  redeemed_value: number;
}

export default function AdminGiftCards() {
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedCard, setSelectedCard] = useState<GiftCard | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      const [cardsRes, statsRes] = await Promise.all([
        fetch("http://localhost:8000/api/v1/gift-cards", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:8000/api/v1/gift-cards", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (cardsRes.ok) {
        const cardsData = await cardsRes.json();
        setGiftCards(cardsData);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error("Failed to load gift cards:", error);
      toast.error("Failed to load gift cards");
    } finally {
      setLoading(false);
    }
  };

  const filteredCards = giftCards.filter((card) => {
    const matchesSearch =
      card.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.recipient_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.recipient_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || card.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-500">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Active
          </Badge>
        );
      case "used":
        return (
          <Badge variant="secondary">
            <XCircle className="w-3 h-3 mr-1" />
            Used
          </Badge>
        );
      case "expired":
        return (
          <Badge variant="destructive">
            <Clock className="w-3 h-3 mr-1" />
            Expired
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const viewDetails = (card: GiftCard) => {
    setSelectedCard(card);
    setDetailsOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Gift Cards Management</h1>
            <p className="text-muted-foreground">
              Monitor and manage gift card purchases and redemptions
            </p>
          </div>
          <Button onClick={loadData} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Gift Cards</CardTitle>
                <Gift className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total_cards}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Cards</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.active_cards}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.total_value.toFixed(2)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Redeemed Value</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.redeemed_value.toFixed(2)}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search by code, email, or recipient name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === "all" ? "default" : "outline"}
                  onClick={() => setStatusFilter("all")}
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === "active" ? "default" : "outline"}
                  onClick={() => setStatusFilter("active")}
                >
                  Active
                </Button>
                <Button
                  variant={statusFilter === "used" ? "default" : "outline"}
                  onClick={() => setStatusFilter("used")}
                >
                  Used
                </Button>
                <Button
                  variant={statusFilter === "expired" ? "default" : "outline"}
                  onClick={() => setStatusFilter("expired")}
                >
                  Expired
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gift Cards Table */}
        <Card>
          <CardHeader>
            <CardTitle>Gift Cards ({filteredCards.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : filteredCards.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No gift cards found
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Initial Balance</TableHead>
                    <TableHead>Current Balance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCards.map((card) => (
                    <TableRow key={card.id}>
                      <TableCell className="font-mono font-medium">
                        {card.code}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{card.recipient_name}</div>
                          <div className="text-sm text-muted-foreground">
                            {card.recipient_email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>${card.initial_balance.toFixed(2)}</TableCell>
                      <TableCell>
                        <span
                          className={
                            card.current_balance > 0
                              ? "text-green-600 font-medium"
                              : "text-muted-foreground"
                          }
                        >
                          ${card.current_balance.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell>{getStatusBadge(card.status)}</TableCell>
                      <TableCell>
                        {new Date(card.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => viewDetails(card)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Details Modal */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Gift Card Details</DialogTitle>
              <DialogDescription>
                Complete information about this gift card
              </DialogDescription>
            </DialogHeader>

            {selectedCard && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Gift Card Code
                    </label>
                    <p className="text-lg font-mono font-bold">{selectedCard.code}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Status
                    </label>
                    <div className="mt-1">{getStatusBadge(selectedCard.status)}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Initial Balance
                    </label>
                    <p className="text-lg font-bold">
                      ${selectedCard.initial_balance.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Current Balance
                    </label>
                    <p className="text-lg font-bold text-green-600">
                      ${selectedCard.current_balance.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Recipient Name
                  </label>
                  <p className="text-lg">{selectedCard.recipient_name}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Recipient Email
                  </label>
                  <p className="text-lg">{selectedCard.recipient_email}</p>
                </div>

                {selectedCard.message && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Personal Message
                    </label>
                    <p className="text-sm bg-muted p-3 rounded-md">
                      {selectedCard.message}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Created At
                    </label>
                    <p>{new Date(selectedCard.created_at).toLocaleString()}</p>
                  </div>
                  {selectedCard.used_at && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Used At
                      </label>
                      <p>{new Date(selectedCard.used_at).toLocaleString()}</p>
                    </div>
                  )}
                </div>

                {selectedCard.expires_at && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Expires At
                    </label>
                    <p>{new Date(selectedCard.expires_at).toLocaleString()}</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
