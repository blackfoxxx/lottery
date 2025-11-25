import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Trophy,
  Plus,
  Edit,
  Trash2,
  Play,
  Eye,
  Calendar,
  DollarSign,
  Users,
  Ticket,
  Award,
  RefreshCw,
} from "lucide-react";

interface LotteryDraw {
  id: number;
  name: string;
  description: string;
  prize_amount: string;
  draw_date: string;
  status: 'active' | 'completed' | 'cancelled';
  total_tickets: number;
  category: string;
  created_at: string;
}

interface LotteryTicket {
  id: number;
  ticket_number: string;
  user_id: number;
  draw_id: number;
  status: string;
  user?: {
    name: string;
    email: string;
  };
}

interface LotteryWinner {
  id: number;
  draw_id: number;
  user_id: number;
  ticket_id: number;
  prize_amount: string;
  claimed: boolean;
  draw?: LotteryDraw;
  user?: {
    name: string;
    email: string;
  };
}

export default function CompleteLotteryManagement() {
  const [draws, setDraws] = useState<LotteryDraw[]>([]);
  const [tickets, setTickets] = useState<LotteryTicket[]>([]);
  const [winners, setWinners] = useState<LotteryWinner[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Create/Edit Draw Dialog
  const [showDrawDialog, setShowDrawDialog] = useState(false);
  const [editingDraw, setEditingDraw] = useState<LotteryDraw | null>(null);
  const [drawForm, setDrawForm] = useState({
    name: "",
    description: "",
    prize_amount: "",
    draw_date: "",
    category: "golden",
    status: "active",
  });

  // Conduct Draw Dialog
  const [showConductDialog, setShowConductDialog] = useState(false);
  const [selectedDraw, setSelectedDraw] = useState<LotteryDraw | null>(null);
  const [drawTickets, setDrawTickets] = useState<LotteryTicket[]>([]);

  // Statistics
  const [stats, setStats] = useState({
    totalDraws: 0,
    activeDraws: 0,
    completedDraws: 0,
    totalTickets: 0,
    totalWinners: 0,
    totalPrizeAmount: 0,
  });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      // Load draws
      const drawsResponse = await fetch("http://localhost:8000/api/v1/lottery/draws");
      const drawsData = await drawsResponse.json();
      
      if (drawsData.success) {
        setDraws(drawsData.data);
        
        // Calculate statistics
        const activeCount = drawsData.data.filter((d: LotteryDraw) => d.status === 'active').length;
        const completedCount = drawsData.data.filter((d: LotteryDraw) => d.status === 'completed').length;
        const totalTickets = drawsData.data.reduce((sum: number, d: LotteryDraw) => sum + d.total_tickets, 0);
        const totalPrize = drawsData.data.reduce((sum: number, d: LotteryDraw) => sum + parseFloat(d.prize_amount), 0);
        
        setStats({
          totalDraws: drawsData.data.length,
          activeDraws: activeCount,
          completedDraws: completedCount,
          totalTickets: totalTickets,
          totalWinners: 0, // Will be updated when winners are loaded
          totalPrizeAmount: totalPrize,
        });
      }

      toast.success("Data loaded successfully");
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load lottery data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDraw = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/lottery/draws", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(drawForm),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Lottery draw created successfully!");
        setShowDrawDialog(false);
        resetDrawForm();
        loadAllData();
      } else {
        toast.error(data.message || "Failed to create lottery draw");
      }
    } catch (error) {
      console.error("Error creating draw:", error);
      toast.error("Failed to create lottery draw");
    }
  };

  const handleUpdateDraw = async () => {
    if (!editingDraw) return;

    try {
      const response = await fetch(`http://localhost:8000/api/v1/lottery/draws/${editingDraw.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(drawForm),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Lottery draw updated successfully!");
        setShowDrawDialog(false);
        setEditingDraw(null);
        resetDrawForm();
        loadAllData();
      } else {
        toast.error(data.message || "Failed to update lottery draw");
      }
    } catch (error) {
      console.error("Error updating draw:", error);
      toast.error("Failed to update lottery draw");
    }
  };

  const handleDeleteDraw = async (drawId: number) => {
    if (!confirm("Are you sure you want to delete this lottery draw?")) return;

    try {
      const response = await fetch(`http://localhost:8000/api/v1/lottery/draws/${drawId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Lottery draw deleted successfully!");
        loadAllData();
      } else {
        toast.error(data.message || "Failed to delete lottery draw");
      }
    } catch (error) {
      console.error("Error deleting draw:", error);
      toast.error("Failed to delete lottery draw");
    }
  };

  const handleConductDraw = async () => {
    if (!selectedDraw) return;

    try {
      // Load tickets for this draw
      const ticketsResponse = await fetch(`http://localhost:8000/api/v1/lottery/tickets?draw_id=${selectedDraw.id}`);
      const ticketsData = await ticketsResponse.json();

      if (!ticketsData.success || ticketsData.data.length === 0) {
        toast.error("No tickets available for this draw");
        return;
      }

      const eligibleTickets = ticketsData.data;
      setDrawTickets(eligibleTickets);

      // Select random winner
      const randomIndex = Math.floor(Math.random() * eligibleTickets.length);
      const winningTicket = eligibleTickets[randomIndex];

      // Create winner record
      const winnerResponse = await fetch("http://localhost:8000/api/v1/lottery/winners", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          draw_id: selectedDraw.id,
          user_id: winningTicket.user_id,
          ticket_id: winningTicket.id,
          prize_amount: selectedDraw.prize_amount,
          claimed: false,
        }),
      });

      const winnerData = await winnerResponse.json();

      if (winnerData.success) {
        // Update draw status to completed
        await fetch(`http://localhost:8000/api/v1/lottery/draws/${selectedDraw.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...selectedDraw,
            status: "completed",
          }),
        });

        toast.success(`Winner selected! Ticket #${winningTicket.ticket_number}`);
        setShowConductDialog(false);
        setSelectedDraw(null);
        loadAllData();
      } else {
        toast.error(winnerData.message || "Failed to record winner");
      }
    } catch (error) {
      console.error("Error conducting draw:", error);
      toast.error("Failed to conduct lottery draw");
    }
  };

  const openCreateDialog = () => {
    resetDrawForm();
    setEditingDraw(null);
    setShowDrawDialog(true);
  };

  const openEditDialog = (draw: LotteryDraw) => {
    setEditingDraw(draw);
    setDrawForm({
      name: draw.name,
      description: draw.description,
      prize_amount: draw.prize_amount,
      draw_date: draw.draw_date.split('T')[0],
      category: draw.category,
      status: draw.status,
    });
    setShowDrawDialog(true);
  };

  const openConductDialog = (draw: LotteryDraw) => {
    setSelectedDraw(draw);
    setShowConductDialog(true);
  };

  const resetDrawForm = () => {
    setDrawForm({
      name: "",
      description: "",
      prize_amount: "",
      draw_date: "",
      category: "golden",
      status: "active",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Complete Lottery Management</h2>
            <p className="text-muted-foreground">
              Full control over lottery draws, tickets, and winners
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadAllData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={openCreateDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Create New Draw
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Draws
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{stats.totalDraws}</span>
                <Trophy className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Draws
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{stats.activeDraws}</span>
                <Play className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{stats.completedDraws}</span>
                <Award className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Tickets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{stats.totalTickets}</span>
                <Ticket className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Winners
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{stats.totalWinners}</span>
                <Users className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Prizes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">${stats.totalPrizeAmount.toLocaleString()}</span>
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lottery Draws Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lottery Draws</CardTitle>
            <CardDescription>Manage all lottery draws and conduct winners selection</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Prize</TableHead>
                  <TableHead>Draw Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tickets</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {draws.map((draw) => (
                  <TableRow key={draw.id}>
                    <TableCell className="font-medium">{draw.name}</TableCell>
                    <TableCell>
                      <Badge variant={
                        draw.category === 'golden' ? 'default' :
                        draw.category === 'silver' ? 'secondary' : 'outline'
                      }>
                        {draw.category}
                      </Badge>
                    </TableCell>
                    <TableCell>${parseFloat(draw.prize_amount).toLocaleString()}</TableCell>
                    <TableCell>{new Date(draw.draw_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={
                        draw.status === 'active' ? 'default' :
                        draw.status === 'completed' ? 'secondary' : 'destructive'
                      }>
                        {draw.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{draw.total_tickets.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(draw)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        {draw.status === 'active' && (
                          <Button
                            size="sm"
                            onClick={() => openConductDialog(draw)}
                          >
                            <Play className="w-4 h-4 mr-1" />
                            Conduct Draw
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteDraw(draw.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {draws.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No lottery draws found. Create your first draw to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create/Edit Draw Dialog */}
        <Dialog open={showDrawDialog} onOpenChange={setShowDrawDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingDraw ? "Edit Lottery Draw" : "Create New Lottery Draw"}
              </DialogTitle>
              <DialogDescription>
                {editingDraw ? "Update the lottery draw details" : "Fill in the details to create a new lottery draw"}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Draw Name</Label>
                <Input
                  id="name"
                  value={drawForm.name}
                  onChange={(e) => setDrawForm({ ...drawForm, name: e.target.value })}
                  placeholder="e.g., Golden Draw"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={drawForm.description}
                  onChange={(e) => setDrawForm({ ...drawForm, description: e.target.value })}
                  placeholder="Describe the lottery draw"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="prize_amount">Prize Amount ($)</Label>
                  <Input
                    id="prize_amount"
                    type="number"
                    value={drawForm.prize_amount}
                    onChange={(e) => setDrawForm({ ...drawForm, prize_amount: e.target.value })}
                    placeholder="10000"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="draw_date">Draw Date</Label>
                  <Input
                    id="draw_date"
                    type="date"
                    value={drawForm.draw_date}
                    onChange={(e) => setDrawForm({ ...drawForm, draw_date: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={drawForm.category}
                    onValueChange={(value) => setDrawForm({ ...drawForm, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="golden">Golden</SelectItem>
                      <SelectItem value="silver">Silver</SelectItem>
                      <SelectItem value="bronze">Bronze</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={drawForm.status}
                    onValueChange={(value) => setDrawForm({ ...drawForm, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDrawDialog(false)}>
                Cancel
              </Button>
              <Button onClick={editingDraw ? handleUpdateDraw : handleCreateDraw}>
                {editingDraw ? "Update Draw" : "Create Draw"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Conduct Draw Dialog */}
        <Dialog open={showConductDialog} onOpenChange={setShowConductDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Conduct Lottery Draw</DialogTitle>
              <DialogDescription>
                Select a random winner for {selectedDraw?.name}
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="font-semibold">{selectedDraw?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Prize: ${parseFloat(selectedDraw?.prize_amount || "0").toLocaleString()}
                    </p>
                  </div>
                  <Trophy className="w-12 h-12 text-yellow-500" />
                </div>

                <div className="text-center p-6 border-2 border-dashed rounded-lg">
                  <Ticket className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    A random winner will be selected from all eligible tickets
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConductDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleConductDraw}>
                <Play className="w-4 h-4 mr-2" />
                Conduct Draw
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
