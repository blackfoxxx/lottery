import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  RefreshCw,
  Eye,
  AlertTriangle,
  Shield,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

interface FraudScore {
  id: number;
  payment_id: string | null;
  order_id: number | null;
  ip_address: string | null;
  user_agent: string | null;
  fraud_score: number;
  risk_level: string;
  flags: string;
  failed_attempts: number;
  is_flagged: boolean;
  reviewed_by: string | null;
  reviewed_at: string | null;
  review_notes: string | null;
  created_at: string;
  payment_amount: number | null;
  payment_status: string | null;
  customer_name: string | null;
  customer_email: string | null;
}

export default function FraudReview() {
  const [fraudScores, setFraudScores] = useState<FraudScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFraud, setSelectedFraud] = useState<FraudScore | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewNotes, setReviewNotes] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    fetchFraudScores();
  }, []);

  async function fetchFraudScores() {
    setLoading(true);
    try {
      // Mock data for now - in production this would call the backend API
      const mockData: FraudScore[] = [
        {
          id: 1,
          payment_id: "pay_abc123def456",
          order_id: 1001,
          ip_address: "192.168.1.100",
          user_agent: "Mozilla/5.0...",
          fraud_score: 75,
          risk_level: "critical",
          flags: JSON.stringify(["multiple_failed_attempts_from_ip", "high_transaction_amount"]),
          failed_attempts: 5,
          is_flagged: true,
          reviewed_by: null,
          reviewed_at: null,
          review_notes: null,
          created_at: new Date().toISOString(),
          payment_amount: 1500.00,
          payment_status: "pending",
          customer_name: "John Doe",
          customer_email: "john@example.com",
        },
      ];

      setFraudScores(mockData);
    } catch (error) {
      console.error("Error fetching fraud scores:", error);
      toast.error("Error loading fraud scores");
    } finally {
      setLoading(false);
    }
  }

  function viewFraudDetails(fraud: FraudScore) {
    setSelectedFraud(fraud);
    setShowDetailsModal(true);
  }

  function openReviewModal(fraud: FraudScore) {
    setSelectedFraud(fraud);
    setReviewNotes(fraud.review_notes || "");
    setShowReviewModal(true);
  }

  async function markAsReviewed() {
    if (!selectedFraud) return;

    setReviewLoading(true);
    try {
      // Mock API call - in production this would call the backend
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success("Fraud score marked as reviewed");
      setShowReviewModal(false);
      fetchFraudScores();
    } catch (error) {
      console.error("Error marking as reviewed:", error);
      toast.error("Error updating review status");
    } finally {
      setReviewLoading(false);
    }
  }

  function getRiskBadge(riskLevel: string) {
    const variants: Record<string, { variant: any; icon: any; label: string }> = {
      low: {
        variant: "default",
        icon: ShieldCheck,
        label: "Low Risk",
      },
      medium: {
        variant: "secondary",
        icon: Shield,
        label: "Medium Risk",
      },
      high: {
        variant: "destructive",
        icon: ShieldAlert,
        label: "High Risk",
      },
      critical: {
        variant: "destructive",
        icon: AlertTriangle,
        label: "Critical",
      },
    };

    const config = variants[riskLevel] || variants.low;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  }

  function parseFlags(flagsJson: string): string[] {
    try {
      return JSON.parse(flagsJson);
    } catch {
      return [];
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Fraud Detection Review</h1>
            <p className="text-muted-foreground">
              Review and manage flagged high-risk transactions
            </p>
          </div>
          <Button onClick={fetchFraudScores}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <p className="text-sm text-muted-foreground">Flagged</p>
            </div>
            <p className="text-2xl font-bold">
              {fraudScores.filter(f => f.is_flagged && !f.reviewed_at).length}
            </p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert className="h-5 w-5 text-destructive" />
              <p className="text-sm text-muted-foreground">Critical Risk</p>
            </div>
            <p className="text-2xl font-bold">
              {fraudScores.filter(f => f.risk_level === "critical").length}
            </p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-orange-500" />
              <p className="text-sm text-muted-foreground">High Risk</p>
            </div>
            <p className="text-2xl font-bold">
              {fraudScores.filter(f => f.risk_level === "high").length}
            </p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="h-5 w-5 text-green-500" />
              <p className="text-sm text-muted-foreground">Reviewed</p>
            </div>
            <p className="text-2xl font-bold">
              {fraudScores.filter(f => f.reviewed_at).length}
            </p>
          </Card>
        </div>

        {/* Fraud Scores Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Payment ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Fraud Score</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                    <p className="text-muted-foreground">Loading fraud scores...</p>
                  </TableCell>
                </TableRow>
              ) : fraudScores.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <p className="text-muted-foreground">No flagged transactions found</p>
                  </TableCell>
                </TableRow>
              ) : (
                fraudScores.map((fraud) => (
                  <TableRow key={fraud.id}>
                    <TableCell className="font-medium">#{fraud.id}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {fraud.payment_id ? fraud.payment_id.substring(0, 12) + "..." : "N/A"}
                    </TableCell>
                    <TableCell>
                      {fraud.customer_name ? (
                        <div>
                          <p className="font-medium">{fraud.customer_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {fraud.customer_email}
                          </p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {fraud.payment_amount ? `$${fraud.payment_amount.toFixed(2)}` : "N/A"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={fraud.fraud_score >= 70 ? "destructive" : "secondary"}>
                        {fraud.fraud_score}
                      </Badge>
                    </TableCell>
                    <TableCell>{getRiskBadge(fraud.risk_level)}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {fraud.ip_address || "N/A"}
                    </TableCell>
                    <TableCell>
                      {fraud.reviewed_at ? (
                        <Badge variant="outline">Reviewed</Badge>
                      ) : (
                        <Badge variant="destructive">Pending Review</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => viewFraudDetails(fraud)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {!fraud.reviewed_at && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => openReviewModal(fraud)}
                          >
                            Review
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Fraud Details Modal */}
        <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Fraud Score Details</DialogTitle>
              <DialogDescription>
                Complete fraud detection information
              </DialogDescription>
            </DialogHeader>

            {selectedFraud && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Fraud Score ID</Label>
                    <p className="font-medium">#{selectedFraud.id}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Risk Level</Label>
                    <div className="mt-1">{getRiskBadge(selectedFraud.risk_level)}</div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Fraud Score</Label>
                    <p className="text-2xl font-bold">{selectedFraud.fraud_score}/100</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Failed Attempts</Label>
                    <p className="font-medium">{selectedFraud.failed_attempts}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Payment ID</Label>
                    <p className="font-mono text-sm">{selectedFraud.payment_id || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Order ID</Label>
                    <p>#{selectedFraud.order_id || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">IP Address</Label>
                    <p className="font-mono text-sm">{selectedFraud.ip_address || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Amount</Label>
                    <p className="font-medium">
                      {selectedFraud.payment_amount
                        ? `$${selectedFraud.payment_amount.toFixed(2)}`
                        : "N/A"}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Fraud Flags</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {parseFlags(selectedFraud.flags).map((flag, index) => (
                        <Badge key={index} variant="destructive">
                          {flag.replace(/_/g, " ")}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">User Agent</Label>
                    <p className="mt-2 p-4 bg-muted rounded-lg text-sm font-mono break-all">
                      {selectedFraud.user_agent || "N/A"}
                    </p>
                  </div>
                  {selectedFraud.review_notes && (
                    <div className="col-span-2">
                      <Label className="text-muted-foreground">Review Notes</Label>
                      <p className="mt-2 p-4 bg-muted rounded-lg">
                        {selectedFraud.review_notes}
                      </p>
                    </div>
                  )}
                  <div>
                    <Label className="text-muted-foreground">Created At</Label>
                    <p>{new Date(selectedFraud.created_at).toLocaleString()}</p>
                  </div>
                  {selectedFraud.reviewed_at && (
                    <div>
                      <Label className="text-muted-foreground">Reviewed At</Label>
                      <p>{new Date(selectedFraud.reviewed_at).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Review Modal */}
        <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Review Fraud Score</DialogTitle>
              <DialogDescription>
                Mark this transaction as reviewed and add notes
              </DialogDescription>
            </DialogHeader>

            {selectedFraud && (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Fraud Score:</span>
                    <span className="font-bold text-lg">{selectedFraud.fraud_score}/100</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Risk Level:</span>
                    {getRiskBadge(selectedFraud.risk_level)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Amount:</span>
                    <span className="font-medium">
                      {selectedFraud.payment_amount
                        ? `$${selectedFraud.payment_amount.toFixed(2)}`
                        : "N/A"}
                    </span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="review-notes">Review Notes</Label>
                  <Textarea
                    id="review-notes"
                    placeholder="Add notes about your review decision..."
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowReviewModal(false)}
                disabled={reviewLoading}
              >
                Cancel
              </Button>
              <Button onClick={markAsReviewed} disabled={reviewLoading}>
                {reviewLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Marking...
                  </>
                ) : (
                  "Mark as Reviewed"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
