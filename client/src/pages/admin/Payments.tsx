import { useState, useEffect } from "react";
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
  Download,
  Eye,
  RotateCcw,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";

interface Payment {
  id: number;
  payment_id: string;
  request_id: string;
  order_id: number;
  amount: number;
  currency: string;
  status: string;
  customer_name: string;
  customer_email: string;
  order_status: string;
  created_at: string;
  updated_at: string;
  webhook_payload: string | null;
}

interface Analytics {
  total_payments: number;
  successful_payments: number;
  failed_payments: number;
  pending_payments: number;
  total_revenue: number;
  average_transaction: number;
  success_rate: number;
}

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [refundLoading, setRefundLoading] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPayments();
    fetchAnalytics();
  }, [currentPage, statusFilter]);

  async function fetchPayments() {
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
        `http://localhost:8000/api/v1/qicard/payments?${params.toString()}`
      );
      const result = await response.json();

      if (result.success) {
        setPayments(result.data);
        setTotalPages(result.pagination.last_page);
      } else {
        toast.error("Failed to load payments");
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast.error("Error loading payments");
    } finally {
      setLoading(false);
    }
  }

  async function fetchAnalytics() {
    try {
      const response = await fetch("http://localhost:8000/api/v1/qicard/analytics");
      const result = await response.json();

      if (result.success) {
        setAnalytics(result.data);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  }

  function handleSearch() {
    setCurrentPage(1);
    fetchPayments();
  }

  function viewPaymentDetails(payment: Payment) {
    setSelectedPayment(payment);
    setShowDetailsModal(true);
  }

  function openRefundModal(payment: Payment) {
    setSelectedPayment(payment);
    setRefundAmount("");
    setRefundReason("");
    setShowRefundModal(true);
  }

  async function processRefund() {
    if (!selectedPayment) return;

    setRefundLoading(true);
    try {
      const payload: any = {
        reason: refundReason || "Customer request",
      };

      if (refundAmount) {
        payload.amount = parseFloat(refundAmount);
      }

      const response = await fetch(
        `http://localhost:8000/api/v1/qicard/refund/${selectedPayment.payment_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (result.success) {
        toast.success("Refund processed successfully");
        setShowRefundModal(false);
        fetchPayments();
        fetchAnalytics();
      } else {
        toast.error(result.error?.description || "Refund failed");
      }
    } catch (error) {
      console.error("Error processing refund:", error);
      toast.error("Error processing refund");
    } finally {
      setRefundLoading(false);
    }
  }

  function exportToCSV() {
    const csvContent = [
      ["Payment ID", "Order ID", "Customer", "Amount", "Status", "Date"].join(","),
      ...payments.map((p) =>
        [
          p.payment_id,
          p.order_id,
          p.customer_name,
          `${p.amount} ${p.currency}`,
          p.status,
          new Date(p.created_at).toLocaleString(),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `payments_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported successfully");
  }

  function getStatusBadge(status: string) {
    const variants: Record<string, { variant: any; icon: any; label: string }> = {
      SUCCESS: {
        variant: "default",
        icon: CheckCircle2,
        label: "Success",
      },
      FAILED: {
        variant: "destructive",
        icon: XCircle,
        label: "Failed",
      },
      CREATED: {
        variant: "secondary",
        icon: Clock,
        label: "Pending",
      },
      REFUNDED: {
        variant: "outline",
        icon: RotateCcw,
        label: "Refunded",
      },
    };

    const config = variants[status] || variants.CREATED;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Payment Management</h1>
          <p className="text-muted-foreground">
            Monitor and manage QiCard payment transactions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={() => { fetchPayments(); fetchAnalytics(); }}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">
                  ${analytics.total_revenue.toFixed(2)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">{analytics.success_rate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Successful</p>
                <p className="text-2xl font-bold">{analytics.successful_payments}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold">{analytics.failed_payments}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </Card>
        </div>
      )}

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
              <SelectItem value="SUCCESS">Success</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
              <SelectItem value="CREATED">Pending</SelectItem>
              <SelectItem value="REFUNDED">Refunded</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Payments Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payment ID</TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                  <p className="text-muted-foreground">Loading payments...</p>
                </TableCell>
              </TableRow>
            ) : payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <p className="text-muted-foreground">No payments found</p>
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-mono text-sm">
                    {payment.payment_id.substring(0, 8)}...
                  </TableCell>
                  <TableCell>#{payment.order_id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{payment.customer_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {payment.customer_email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    ${payment.amount.toFixed(2)} {payment.currency}
                  </TableCell>
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  <TableCell>
                    {new Date(payment.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewPaymentDetails(payment)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {payment.status === "SUCCESS" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openRefundModal(payment)}
                        >
                          <RotateCcw className="h-4 w-4" />
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

      {/* Payment Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>
              Complete information about this payment transaction
            </DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Payment ID</Label>
                  <p className="font-mono text-sm">{selectedPayment.payment_id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Request ID</Label>
                  <p className="font-mono text-sm">{selectedPayment.request_id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Order ID</Label>
                  <p>#{selectedPayment.order_id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Amount</Label>
                  <p className="font-medium">
                    ${selectedPayment.amount.toFixed(2)} {selectedPayment.currency}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedPayment.status)}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Order Status</Label>
                  <p className="capitalize">{selectedPayment.order_status}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Customer Name</Label>
                  <p>{selectedPayment.customer_name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Customer Email</Label>
                  <p>{selectedPayment.customer_email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Created At</Label>
                  <p>{new Date(selectedPayment.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Updated At</Label>
                  <p>{new Date(selectedPayment.updated_at).toLocaleString()}</p>
                </div>
              </div>

              {selectedPayment.webhook_payload && (
                <div>
                  <Label className="text-muted-foreground">Webhook Payload</Label>
                  <pre className="mt-2 p-4 bg-muted rounded-lg text-xs overflow-auto max-h-40">
                    {JSON.stringify(JSON.parse(selectedPayment.webhook_payload), null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Refund Modal */}
      <Dialog open={showRefundModal} onOpenChange={setShowRefundModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Refund</DialogTitle>
            <DialogDescription>
              Refund payment to customer. Leave amount empty for full refund.
            </DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Payment ID:</span>
                  <span className="font-mono text-sm">
                    {selectedPayment.payment_id.substring(0, 16)}...
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Original Amount:</span>
                  <span className="font-medium">
                    ${selectedPayment.amount.toFixed(2)} {selectedPayment.currency}
                  </span>
                </div>
              </div>

              <div>
                <Label htmlFor="refund-amount">
                  Refund Amount (optional - leave empty for full refund)
                </Label>
                <Input
                  id="refund-amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={selectedPayment.amount}
                  placeholder={`Max: ${selectedPayment.amount}`}
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="refund-reason">Reason</Label>
                <Textarea
                  id="refund-reason"
                  placeholder="Enter reason for refund..."
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRefundModal(false)}
              disabled={refundLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={processRefund}
              disabled={refundLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {refundLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Process Refund
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
