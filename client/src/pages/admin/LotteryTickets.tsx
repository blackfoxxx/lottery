import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Ticket, Download, Upload, Search, Filter } from "lucide-react";
import { toast } from "sonner";

interface LotteryTicket {
  id: number;
  ticket_number: string;
  user_id: number | null;
  user_name?: string;
  order_id: number | null;
  draw_id: number | null;
  status: "active" | "used" | "expired";
  created_at: string;
}

export default function LotteryTickets() {
  const [tickets, setTickets] = useState<LotteryTicket[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [generateCount, setGenerateCount] = useState(100);

  useEffect(() => {
    loadTickets();
  }, []);

  function loadTickets() {
    // Mock data - replace with actual API call
    const mockTickets: LotteryTicket[] = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      ticket_number: `BLK-${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`,
      user_id: Math.random() > 0.3 ? Math.floor(Math.random() * 100) + 1 : null,
      user_name: Math.random() > 0.3 ? `User ${Math.floor(Math.random() * 100)}` : undefined,
      order_id: Math.random() > 0.3 ? Math.floor(Math.random() * 200) + 1 : null,
      draw_id: Math.random() > 0.7 ? Math.floor(Math.random() * 10) + 1 : null,
      status: ["active", "used", "expired"][Math.floor(Math.random() * 3)] as any,
      created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    }));
    setTickets(mockTickets);
  }

  function handleGenerateTickets() {
    toast.success(`Generated ${generateCount} lottery tickets`);
    setShowGenerateDialog(false);
    loadTickets();
  }

  function handleExportCSV() {
    const csv = [
      ["Ticket Number", "User", "Order ID", "Draw ID", "Status", "Created At"].join(","),
      ...filteredTickets.map(t => [
        t.ticket_number,
        t.user_name || "Unassigned",
        t.order_id || "",
        t.draw_id || "",
        t.status,
        new Date(t.created_at).toLocaleDateString()
      ].join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lottery-tickets-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success("Tickets exported to CSV");
  }

  function handleImportCSV() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        toast.success(`Imported tickets from ${file.name}`);
        loadTickets();
      }
    };
    input.click();
  }

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.ticket_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.user_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  function getStatusColor(status: string) {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "used":
        return "bg-blue-500";
      case "expired":
        return "bg-gray-500";
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
              <Ticket className="h-8 w-8" />
              Lottery Tickets
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage lottery tickets and generate new ones
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleImportCSV}>
              <Upload className="h-4 w-4 mr-2" />
              Import CSV
            </Button>
            <Button variant="outline" onClick={handleExportCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={() => setShowGenerateDialog(true)}>
              <Ticket className="h-4 w-4 mr-2" />
              Generate Tickets
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total Tickets</div>
            <div className="text-2xl font-bold">{tickets.length}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Active</div>
            <div className="text-2xl font-bold text-green-500">
              {tickets.filter(t => t.status === "active").length}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Used</div>
            <div className="text-2xl font-bold text-blue-500">
              {tickets.filter(t => t.status === "used").length}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Expired</div>
            <div className="text-2xl font-bold text-gray-500">
              {tickets.filter(t => t.status === "expired").length}
            </div>
          </Card>
        </div>

        <Card>
          <div className="p-4 border-b border-border">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by ticket number or user..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-md border border-input bg-background"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="used">Used</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket Number</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Draw ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-mono font-semibold">
                    {ticket.ticket_number}
                  </TableCell>
                  <TableCell>
                    {ticket.user_name || <span className="text-muted-foreground">Unassigned</span>}
                  </TableCell>
                  <TableCell>
                    {ticket.order_id || <span className="text-muted-foreground">-</span>}
                  </TableCell>
                  <TableCell>
                    {ticket.draw_id || <span className="text-muted-foreground">-</span>}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(ticket.status)}>
                      {ticket.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(ticket.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Lottery Tickets</DialogTitle>
            <DialogDescription>
              Specify how many lottery tickets you want to generate
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">
              Number of Tickets
            </label>
            <Input
              type="number"
              min="1"
              max="10000"
              value={generateCount}
              onChange={(e) => setGenerateCount(parseInt(e.target.value) || 1)}
            />
            <p className="text-sm text-muted-foreground mt-2">
              Tickets will be generated with unique numbers in format: BLK-XXXXXX
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGenerateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleGenerateTickets}>
              Generate {generateCount} Tickets
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
