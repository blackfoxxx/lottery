import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Plus,
  RefreshCw,
  Eye,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

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

interface UserOrder {
  id: number;
  order_number: string;
  total: number;
  payment_status: string;
  created_at: string;
}

export default function MyDisputes() {
  const { user } = useAuth();
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [userOrders, setUserOrders] = useState<UserOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Form state
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [disputeReason, setDisputeReason] = useState("");
  const [disputeAmount, setDisputeAmount] = useState("");

  useEffect(() => {
    if (user) {
      fetchDisputes();
      fetchUserOrders();
    }
  }, [user]);

  async function fetchDisputes() {
    if (!user) return;

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/v1/disputes/user-disputes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_email: user.email,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setDisputes(result.data);
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

  async function fetchUserOrders() {
    if (!user) return;

    try {
      // Get orders from localStorage for now
      const ordersJson = localStorage.getItem("orderHistory");
      if (ordersJson) {
        const orders = JSON.parse(ordersJson);
        setUserOrders(orders.filter((o: UserOrder) => o.payment_status === "paid"));
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }

  async function submitDispute() {
    if (!user || !selectedOrderId || !disputeReason || !disputeAmount) {
      toast.error("Please fill in all fields");
      return;
    }

    const selectedOrder = userOrders.find(o => o.id.toString() === selectedOrderId);
    if (!selectedOrder) {
      toast.error("Invalid order selected");
      return;
    }

    const amount = parseFloat(disputeAmount);
    if (isNaN(amount) || amount <= 0 || amount > selectedOrder.total) {
      toast.error(`Dispute amount must be between $0.01 and $${selectedOrder.total.toFixed(2)}`);
      return;
    }

    setSubmitLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/v1/disputes/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payment_id: `pay_${selectedOrder.order_number}`,
          order_id: selectedOrder.id,
          customer_email: user.email,
          customer_name: user.name || user.email,
          dispute_reason: disputeReason,
          dispute_amount: amount,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Dispute submitted successfully. We will review and respond within 3-5 business days.");
        setShowSubmitModal(false);
        setSelectedOrderId("");
        setDisputeReason("");
        setDisputeAmount("");
        fetchDisputes();
      } else {
        toast.error(result.error?.description || "Failed to submit dispute");
      }
    } catch (error) {
      console.error("Error submitting dispute:", error);
      toast.error("Error submitting dispute");
    } finally {
      setSubmitLoading(false);
    }
  }

  function viewDisputeDetails(dispute: Dispute) {
    setSelectedDispute(dispute);
    setShowDetailsModal(true);
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

  if (!user) {
    return (
      <div className="container mx-auto py-12">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Please sign in to view your disputes</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Disputes</h1>
          <p className="text-muted-foreground">
            Submit and track payment disputes
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchDisputes}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setShowSubmitModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Submit Dispute
          </Button>
        </div>
      </div>

      {/* Disputes List */}
      {loading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading disputes...</p>
          </CardContent>
        </Card>
      ) : disputes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Disputes Found</h3>
            <p className="text-muted-foreground mb-4">
              You haven't submitted any payment disputes yet
            </p>
            <Button onClick={() => setShowSubmitModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Submit Your First Dispute
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {disputes.map((dispute) => (
            <Card key={dispute.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Dispute #{dispute.id}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Order #{dispute.order_id} • Submitted {new Date(dispute.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {getStatusBadge(dispute.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <Label className="text-muted-foreground">Dispute Amount</Label>
                    <p className="font-medium text-lg">${dispute.dispute_amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Reason</Label>
                    <p className="text-sm">{dispute.dispute_reason}</p>
                  </div>
                  {dispute.resolution_notes && (
                    <div className="p-4 bg-muted rounded-lg">
                      <Label className="text-muted-foreground">Resolution</Label>
                      <p className="text-sm mt-1">{dispute.resolution_notes}</p>
                      {dispute.resolved_at && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Resolved on {new Date(dispute.resolved_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => viewDisputeDetails(dispute)}
                    className="w-full"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Submit Dispute Modal */}
      <Dialog open={showSubmitModal} onOpenChange={setShowSubmitModal}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Submit Payment Dispute</DialogTitle>
            <DialogDescription>
              Submit a dispute for a payment issue. We'll review and respond within 3-5 business days.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="order-select">Select Order</Label>
              <Select value={selectedOrderId} onValueChange={setSelectedOrderId}>
                <SelectTrigger id="order-select">
                  <SelectValue placeholder="Choose an order..." />
                </SelectTrigger>
                <SelectContent>
                  {userOrders.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No paid orders found
                    </SelectItem>
                  ) : (
                    userOrders.map((order) => (
                      <SelectItem key={order.id} value={order.id.toString()}>
                        Order #{order.order_number} - ${order.total.toFixed(2)} ({new Date(order.created_at).toLocaleDateString()})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="dispute-amount">Dispute Amount</Label>
              <Input
                id="dispute-amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={disputeAmount}
                onChange={(e) => setDisputeAmount(e.target.value)}
              />
              {selectedOrderId && (
                <p className="text-xs text-muted-foreground mt-1">
                  Maximum: ${userOrders.find(o => o.id.toString() === selectedOrderId)?.total.toFixed(2) || "0.00"}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="dispute-reason">Dispute Reason</Label>
              <Textarea
                id="dispute-reason"
                placeholder="Please describe the issue with your payment..."
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                rows={5}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Be as detailed as possible to help us resolve your dispute quickly
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSubmitModal(false)}
              disabled={submitLoading}
            >
              Cancel
            </Button>
            <Button onClick={submitDispute} disabled={submitLoading || !selectedOrderId || !disputeReason || !disputeAmount}>
              {submitLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Dispute"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dispute Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Dispute Details</DialogTitle>
            <DialogDescription>
              Complete information about your payment dispute
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
                  <Label className="text-muted-foreground">Order ID</Label>
                  <p>#{selectedDispute.order_id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Payment ID</Label>
                  <p className="font-mono text-sm">{selectedDispute.payment_id}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-muted-foreground">Dispute Amount</Label>
                  <p className="font-medium text-lg">
                    ${selectedDispute.dispute_amount.toFixed(2)}
                  </p>
                </div>
                <div className="col-span-2">
                  <Label className="text-muted-foreground">Your Reason</Label>
                  <p className="mt-2 p-4 bg-muted rounded-lg">
                    {selectedDispute.dispute_reason}
                  </p>
                </div>
                {selectedDispute.resolution_notes && (
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Resolution</Label>
                    <p className="mt-2 p-4 bg-primary/10 rounded-lg">
                      {selectedDispute.resolution_notes}
                    </p>
                  </div>
                )}
                <div>
                  <Label className="text-muted-foreground">Submitted On</Label>
                  <p>{new Date(selectedDispute.created_at).toLocaleString()}</p>
                </div>
                {selectedDispute.resolved_at && (
                  <div>
                    <Label className="text-muted-foreground">Resolved On</Label>
                    <p>{new Date(selectedDispute.resolved_at).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
