import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trophy, Plus, Play, Eye } from "lucide-react";
import { toast } from "sonner";

interface LotteryDraw {
  id: number;
  name: string;
  category: "bronze" | "silver" | "golden";
  draw_date: string;
  prize_amount: number;
  status: "upcoming" | "in_progress" | "completed";
  total_tickets: number;
  winner_ticket?: string;
  winner_name?: string;
  created_at: string;
}

export default function LotteryDraws() {
  const [draws, setDraws] = useState<LotteryDraw[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDrawDialog, setShowDrawDialog] = useState(false);
  const [selectedDraw, setSelectedDraw] = useState<LotteryDraw | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [winnerTicket, setWinnerTicket] = useState("");

  const [newDraw, setNewDraw] = useState({
    name: "",
    category: "bronze" as "bronze" | "silver" | "golden",
    draw_date: "",
    prize_amount: 0,
  });

  useEffect(() => {
    loadDraws();
  }, []);

  function loadDraws() {
    // Mock data - replace with actual API call
    const mockDraws: LotteryDraw[] = [
      {
        id: 1,
        name: "Golden Draw - January 2025",
        category: "golden",
        draw_date: "2025-01-31",
        prize_amount: 10000,
        status: "upcoming",
        total_tickets: 500,
        created_at: new Date().toISOString(),
      },
      {
        id: 2,
        name: "Silver Draw - December 2024",
        category: "silver",
        draw_date: "2024-12-31",
        prize_amount: 5000,
        status: "completed",
        total_tickets: 350,
        winner_ticket: "BLK-123456",
        winner_name: "Ahmed Ali",
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 3,
        name: "Bronze Draw - November 2024",
        category: "bronze",
        draw_date: "2024-11-30",
        prize_amount: 1000,
        status: "completed",
        total_tickets: 200,
        winner_ticket: "BLK-789012",
        winner_name: "Sara Mohammed",
        created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
    setDraws(mockDraws);
  }

  function handleCreateDraw() {
    if (!newDraw.name || !newDraw.draw_date || newDraw.prize_amount <= 0) {
      toast.error("Please fill all fields");
      return;
    }

    const draw: LotteryDraw = {
      id: draws.length + 1,
      ...newDraw,
      status: "upcoming",
      total_tickets: 0,
      created_at: new Date().toISOString(),
    };

    setDraws([...draws, draw]);
    toast.success("Lottery draw created successfully");
    setShowCreateDialog(false);
    setNewDraw({
      name: "",
      category: "bronze",
      draw_date: "",
      prize_amount: 0,
    });
  }

  function handlePerformDraw(draw: LotteryDraw) {
    setSelectedDraw(draw);
    setShowDrawDialog(true);
  }

  function performRandomDraw() {
    setIsDrawing(true);
    
    // Simulate drawing animation
    let count = 0;
    const interval = setInterval(() => {
      setWinnerTicket(`BLK-${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`);
      count++;
      
      if (count >= 20) {
        clearInterval(interval);
        const finalWinner = `BLK-${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`;
        setWinnerTicket(finalWinner);
        setIsDrawing(false);
        
        // Update draw status
        setDraws(draws.map(d => 
          d.id === selectedDraw?.id 
            ? { ...d, status: "completed" as const, winner_ticket: finalWinner, winner_name: "Winner User" }
            : d
        ));
        
        toast.success("Winner selected successfully!");
      }
    }, 100);
  }

  function getCategoryColor(category: string) {
    switch (category) {
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
      case "upcoming":
        return "bg-blue-500";
      case "in_progress":
        return "bg-yellow-500";
      case "completed":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Trophy className="h-8 w-8" />
              Lottery Draws
            </h1>
            <p className="text-muted-foreground mt-1">
              Create and manage lottery draws and select winners
            </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Draw
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total Draws</div>
            <div className="text-2xl font-bold">{draws.length}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Upcoming</div>
            <div className="text-2xl font-bold text-blue-500">
              {draws.filter(d => d.status === "upcoming").length}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Completed</div>
            <div className="text-2xl font-bold text-green-500">
              {draws.filter(d => d.status === "completed").length}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total Prizes</div>
            <div className="text-2xl font-bold text-primary">
              ${draws.reduce((sum, d) => sum + d.prize_amount, 0).toLocaleString()}
            </div>
          </Card>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Draw Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Draw Date</TableHead>
                <TableHead>Prize Amount</TableHead>
                <TableHead>Tickets</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Winner</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {draws.map((draw) => (
                <TableRow key={draw.id}>
                  <TableCell className="font-semibold">{draw.name}</TableCell>
                  <TableCell>
                    <Badge className={getCategoryColor(draw.category)}>
                      {draw.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(draw.draw_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-bold text-primary">
                    ${draw.prize_amount.toLocaleString()}
                  </TableCell>
                  <TableCell>{draw.total_tickets}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(draw.status)}>
                      {draw.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {draw.winner_ticket ? (
                      <div>
                        <div className="font-mono font-semibold">{draw.winner_ticket}</div>
                        <div className="text-sm text-muted-foreground">{draw.winner_name}</div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {draw.status === "upcoming" && (
                      <Button
                        size="sm"
                        onClick={() => handlePerformDraw(draw)}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Draw
                      </Button>
                    )}
                    {draw.status === "completed" && (
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Create Draw Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Lottery Draw</DialogTitle>
            <DialogDescription>
              Set up a new lottery draw with prize details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Draw Name</Label>
              <Input
                id="name"
                placeholder="e.g., Golden Draw - January 2025"
                value={newDraw.name}
                onChange={(e) => setNewDraw({ ...newDraw, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={newDraw.category}
                onValueChange={(value: any) => setNewDraw({ ...newDraw, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bronze">Bronze</SelectItem>
                  <SelectItem value="silver">Silver</SelectItem>
                  <SelectItem value="golden">Golden</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="draw_date">Draw Date</Label>
              <Input
                id="draw_date"
                type="date"
                value={newDraw.draw_date}
                onChange={(e) => setNewDraw({ ...newDraw, draw_date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="prize_amount">Prize Amount ($)</Label>
              <Input
                id="prize_amount"
                type="number"
                min="0"
                step="100"
                value={newDraw.prize_amount || ""}
                onChange={(e) => setNewDraw({ ...newDraw, prize_amount: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateDraw}>Create Draw</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Perform Draw Dialog */}
      <Dialog open={showDrawDialog} onOpenChange={setShowDrawDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Perform Lottery Draw</DialogTitle>
            <DialogDescription>
              {selectedDraw?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-8 text-center">
            {!winnerTicket ? (
              <div>
                <Trophy className="h-16 w-16 mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground mb-6">
                  Ready to select a winner from {selectedDraw?.total_tickets} tickets
                </p>
                <Button size="lg" onClick={performRandomDraw}>
                  <Play className="h-5 w-5 mr-2" />
                  Start Draw
                </Button>
              </div>
            ) : (
              <div>
                <div className={`text-6xl font-mono font-bold mb-4 ${isDrawing ? 'animate-pulse' : 'text-primary'}`}>
                  {winnerTicket}
                </div>
                {!isDrawing && (
                  <>
                    <div className="text-2xl font-semibold mb-2">Congratulations!</div>
                    <p className="text-muted-foreground">
                      Winner has been selected and notified
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
          {!isDrawing && winnerTicket && (
            <DialogFooter>
              <Button onClick={() => {
                setShowDrawDialog(false);
                setWinnerTicket("");
                setSelectedDraw(null);
              }}>
                Close
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
