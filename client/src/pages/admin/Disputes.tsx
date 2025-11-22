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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Search,
  RefreshCw,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";

interface Dispute {
  id: number;
  payment_id: string;
  order_id: number;
  customer_name: string;
  customer_email: string;
  dispute_reason: string;
  dispute_amount: number;
  status: string;
  admin_notes: string | null;
  resolution_notes: string | null;
  resolved_by: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

export default function Disputes() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolveStatus, setResolveStatus] = useState("resolved");
  const [adminNotes, setAdminNotes] = useState("");
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [resolveLoading, setResolveLoading] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchDisputes();
  }, [currentPage, statusFilter]);

  async function fetchDisputes() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        per_page: "20",
      });

      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      if (searchQuery) {
        params.append("search", searchQuery);
      }

      const response = await fetch(
        `http://localhost:8000/api/v1/disputes/all?${params.toString()}`
      );
      const result = await response.json();

      if (result.success) {
        setDisputes(result.data);
        setTotalPages(result.pagination.last_page);
      } else {
        toast.error("Failed to load disputes");
      }
    } catch (error) {
      console.error("Error fetching disputes:", error);
      toast.error("Error loading disputes");
    } finally {
      setLoading(false);
    }
  }

  function handleSearch() {
    setCurrentPage(1);
    fetchDisputes();
  }

  function viewDisputeDetails(dispute: Dispute) {
    setSelectedDispute(dispute);
    setShowDetailsModal(true);
  }

  function openResolveModal(dispute: Dispute) {
    setSelectedDispute(dispute);
    setResolveStatus(dispute.status === "open" ? "investigating" : "resolved");
    setAdminNotes(dispute.admin_notes || "");
    setResolutionNotes(dispute.resolution_notes || "");
    setShowResolveModal(true);
  }

  async function updateDisputeStatus() {
    if (!selectedDispute) return;

    setResolveLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/disputes/${selectedDispute.id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: resolveStatus,
            admin_notes: adminNotes,
            resolution_notes: resolutionNotes,
            resolved_by: "admin",
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        toast.success("Dispute status updated successfully");
        setShowResolveModal(false);
        fetchDisputes();
      } else {
        toast.error("Failed to update dispute status");
      }
    } catch (error) {
      console.error("Error updating dispute:", error);
      toast.error("Error updating dispute status");
    } finally {
      setResolveLoading(false);
    }
  }

  function getStatusBadge(status: string) {
    const variants: Record<string, { variant: any; icon: any; label: string }> = {
      open: {
        variant: "destructive",
        icon: AlertTriangle,
        label: "Open",
      },
      investigating: {
        variant: "secondary",
        icon: Clock,
        label: "Investigating",
      },
      resolved: {
        variant: "default",
        icon: CheckCircle2,
        label: "Resolved",
      },
      rejected: {
        variant: "outline",
        icon: XCircle,
        label: "Rejected",
      },
    };

    const config = variants[status] || variants.open;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Payment Disputes</h1>
          <p className="text-muted-foreground">
            Manage and resolve customer payment disputes
          </p>
        </div>
        <Button onClick={fetchDisputes}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="flex gap-2">
              <Input
                placeholder="Search by payment ID, email, or customer name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={handleSearch}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="investigating">Investigating</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Disputes Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dispute ID</TableHead>
              <TableHead>Payment ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                  <p className="text-muted-foreground">Loading disputes...</p>
                </TableCell>
              </TableRow>
            ) : disputes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <p className="text-muted-foreground">No disputes found</p>
                </TableCell>
              </TableRow>
            ) : (
              disputes.map((dispute) => (
                <TableRow key={dispute.id}>
                  <TableCell className="font-medium">#{dispute.id}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {dispute.payment_id.substring(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{dispute.customer_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {dispute.customer_email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    ${dispute.dispute_amount.toFixed(2)}
                  </TableCell>
                  <TableCell>{getStatusBadge(dispute.status)}</TableCell>
                  <TableCell>
                    {new Date(dispute.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewDisputeDetails(dispute)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {dispute.status !== "resolved" && dispute.status !== "rejected" && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => openResolveModal(dispute)}
                        >
                          Update
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            <span className="flex items-center px-4">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </Card>

      {/* Dispute Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Dispute Details</DialogTitle>
            <DialogDescription>
              Complete information about this payment dispute
            </DialogDescription>
          </DialogHeader>

          {selectedDispute && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Dispute ID</Label>
                  <p className="font-medium">#{selectedDispute.id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedDispute.status)}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Payment ID</Label>
                  <p className="font-mono text-sm">{selectedDispute.payment_id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Order ID</Label>
                  <p>#{selectedDispute.order_id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Customer Name</Label>
                  <p>{selectedDispute.customer_name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Customer Email</Label>
                  <p>{selectedDispute.customer_email}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-muted-foreground">Dispute Amount</Label>
                  <p className="font-medium text-lg">
                    ${selectedDispute.dispute_amount.toFixed(2)}
                  </p>
                </div>
                <div className="col-span-2">
                  <Label className="text-muted-foreground">Dispute Reason</Label>
                  <p className="mt-2 p-4 bg-muted rounded-lg">
                    {selectedDispute.dispute_reason}
                  </p>
                </div>
                {selectedDispute.admin_notes && (
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Admin Notes</Label>
                    <p className="mt-2 p-4 bg-muted rounded-lg">
                      {selectedDispute.admin_notes}
                    </p>
                  </div>
                )}
                {selectedDispute.resolution_notes && (
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Resolution Notes</Label>
                    <p className="mt-2 p-4 bg-muted rounded-lg">
                      {selectedDispute.resolution_notes}
                    </p>
                  </div>
                )}
                <div>
                  <Label className="text-muted-foreground">Created At</Label>
                  <p>{new Date(selectedDispute.created_at).toLocaleString()}</p>
                </div>
                {selectedDispute.resolved_at && (
                  <div>
                    <Label className="text-muted-foreground">Resolved At</Label>
                    <p>{new Date(selectedDispute.resolved_at).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Resolve Modal */}
      <Dialog open={showResolveModal} onOpenChange={setShowResolveModal}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Update Dispute Status</DialogTitle>
            <DialogDescription>
              Update the status and add notes for this dispute
            </DialogDescription>
          </DialogHeader>

          {selectedDispute && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Dispute ID:</span>
                  <span className="font-medium">#{selectedDispute.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-medium">
                    ${selectedDispute.dispute_amount.toFixed(2)}
                  </span>
                </div>
              </div>

              <div>
                <Label htmlFor="resolve-status">Status</Label>
                <Select value={resolveStatus} onValueChange={setResolveStatus}>
                  <SelectTrigger id="resolve-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="investigating">Investigating</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="admin-notes">Admin Notes (Internal)</Label>
                <Textarea
                  id="admin-notes"
                  placeholder="Internal notes for tracking..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="resolution-notes">
                  Resolution Notes (Sent to Customer)
                </Label>
                <Textarea
                  id="resolution-notes"
                  placeholder="Explanation of resolution for customer..."
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowResolveModal(false)}
              disabled={resolveLoading}
            >
              Cancel
            </Button>
            <Button onClick={updateDisputeStatus} disabled={resolveLoading}>
              {resolveLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Status"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </AdminLayout>
  );
}
