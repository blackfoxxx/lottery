import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Play, Trophy, Ticket } from "lucide-react";
import { toast } from "sonner";

interface LotteryDraw {
  id: number;
  name: string;
  prize: number;
  drawDate: string;
  ticketPrice: number;
  status: "upcoming" | "active" | "completed";
  ticketsSold: number;
  winner?: {
    name: string;
    ticketNumber: string;
  };
}

export default function LotteryManagement() {
  const [draws, setDraws] = useState<LotteryDraw[]>([
    {
      id: 1,
      name: "Golden Draw",
      prize: 10000,
      drawDate: "2024-03-01",
      ticketPrice: 50,
      status: "active",
      ticketsSold: 15420,
    },
    {
      id: 2,
      name: "Silver Prize",
      prize: 5000,
      drawDate: "2024-02-15",
      ticketPrice: 25,
      status: "completed",
      ticketsSold: 8932,
      winner: {
        name: "Ahmad K.",
        ticketNumber: "LT-2024-001234",
      },
    },
  ]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingDraw, setEditingDraw] = useState<LotteryDraw | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    prize: "",
    drawDate: "",
    ticketPrice: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingDraw) {
      // Update existing draw
      setDraws(draws.map(d => 
        d.id === editingDraw.id 
          ? {
              ...d,
              name: formData.name,
              prize: parseFloat(formData.prize),
              drawDate: formData.drawDate,
              ticketPrice: parseFloat(formData.ticketPrice),
            }
          : d
      ));
      toast.success("Lottery draw updated successfully");
    } else {
      // Create new draw
      const newDraw: LotteryDraw = {
        id: Date.now(),
        name: formData.name,
        prize: parseFloat(formData.prize),
        drawDate: formData.drawDate,
        ticketPrice: parseFloat(formData.ticketPrice),
        status: "upcoming",
        ticketsSold: 0,
      };
      setDraws([...draws, newDraw]);
      toast.success("Lottery draw created successfully");
    }

    setShowDialog(false);
    setEditingDraw(null);
    setFormData({ name: "", prize: "", drawDate: "", ticketPrice: "" });
  };

  const handleEdit = (draw: LotteryDraw) => {
    setEditingDraw(draw);
    setFormData({
      name: draw.name,
      prize: draw.prize.toString(),
      drawDate: draw.drawDate,
      ticketPrice: draw.ticketPrice.toString(),
    });
    setShowDialog(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this lottery draw?")) {
      setDraws(draws.filter(d => d.id !== id));
      toast.success("Lottery draw deleted successfully");
    }
  };

  const handleConductDraw = (id: number) => {
    if (confirm("Are you sure you want to conduct this draw? This will select a random winner.")) {
      // Simulate conducting draw
      const mockWinner = {
        name: "Winner " + Math.floor(Math.random() * 1000),
        ticketNumber: `LT-2024-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`,
      };

      setDraws(draws.map(d =>
        d.id === id
          ? { ...d, status: "completed" as const, winner: mockWinner }
          : d
      ));

      toast.success(`Draw conducted! Winner: ${mockWinner.name}`);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      upcoming: "secondary",
      active: "default",
      completed: "outline",
    };
    return (
      <Badge variant={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Lottery Management</h1>
            <p className="text-muted-foreground">
              Manage lottery draws, conduct draws, and view winners
            </p>
          </div>
          <Button onClick={() => setShowDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Draw
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Draws</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{draws.length}</div>
              <p className="text-xs text-muted-foreground">
                {draws.filter(d => d.status === "active").length} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Prizes</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${draws.reduce((sum, d) => sum + d.prize, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all draws
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tickets Sold</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {draws.reduce((sum, d) => sum + d.ticketsSold, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Total tickets
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Draws Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lottery Draws</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Prize</TableHead>
                  <TableHead>Draw Date</TableHead>
                  <TableHead>Ticket Price</TableHead>
                  <TableHead>Tickets Sold</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Winner</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {draws.map((draw) => (
                  <TableRow key={draw.id}>
                    <TableCell className="font-medium">{draw.name}</TableCell>
                    <TableCell>${draw.prize.toLocaleString()}</TableCell>
                    <TableCell>{new Date(draw.drawDate).toLocaleDateString()}</TableCell>
                    <TableCell>${draw.ticketPrice}</TableCell>
                    <TableCell>{draw.ticketsSold.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(draw.status)}</TableCell>
                    <TableCell>
                      {draw.winner ? (
                        <div className="text-sm">
                          <div className="font-medium">{draw.winner.name}</div>
                          <div className="text-muted-foreground">{draw.winner.ticketNumber}</div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {draw.status === "active" && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleConductDraw(draw.id)}
                          >
                            <Play className="w-4 h-4 mr-1" />
                            Conduct
                          </Button>
                        )}
                        {draw.status !== "completed" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(draw)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(draw.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create/Edit Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingDraw ? "Edit Lottery Draw" : "Create Lottery Draw"}
              </DialogTitle>
              <DialogDescription>
                {editingDraw
                  ? "Update the lottery draw details"
                  : "Create a new lottery draw with prize and ticket information"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Draw Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Golden Draw"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prize">Prize Amount ($)</Label>
                  <Input
                    id="prize"
                    type="number"
                    value={formData.prize}
                    onChange={(e) => setFormData({ ...formData, prize: e.target.value })}
                    placeholder="10000"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="drawDate">Draw Date</Label>
                  <Input
                    id="drawDate"
                    type="date"
                    value={formData.drawDate}
                    onChange={(e) => setFormData({ ...formData, drawDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ticketPrice">Ticket Price ($)</Label>
                  <Input
                    id="ticketPrice"
                    type="number"
                    value={formData.ticketPrice}
                    onChange={(e) => setFormData({ ...formData, ticketPrice: e.target.value })}
                    placeholder="50"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowDialog(false);
                    setEditingDraw(null);
                    setFormData({ name: "", prize: "", drawDate: "", ticketPrice: "" });
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingDraw ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
