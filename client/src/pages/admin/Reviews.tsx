import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
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
import { toast } from "sonner";
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  TrendingUp,
  RefreshCw,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Review {
  id: number;
  product_id: number;
  product_name: string;
  user_name: string;
  user_email: string;
  rating: number;
  title: string;
  comment: string;
  verified_purchase: boolean;
  helpful_count: number;
  not_helpful_count: number;
  status: string;
  admin_response: string | null;
  created_at: string;
}

interface ReviewStats {
  total_reviews: number;
  pending_reviews: number;
  approved_reviews: number;
  rejected_reviews: number;
  average_rating: number;
  verified_purchases: number;
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [adminResponse, setAdminResponse] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchReviews();
    fetchStats();
  }, [currentPage, statusFilter]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        per_page: "20",
        status: statusFilter,
      });

      const response = await fetch(`http://localhost:8000/api/v1/reviews/all?${params}`);
      const data = await response.json();

      if (data.success) {
        setReviews(data.data);
        setTotalPages(data.pagination.total_pages);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/reviews/stats");
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleUpdateStatus = async (reviewId: number, status: string) => {
    try {
      setActionLoading(true);
      const response = await fetch(`http://localhost:8000/api/v1/reviews/${reviewId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          admin_response: adminResponse || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Review ${status} successfully`);
        fetchReviews();
        fetchStats();
        setDetailsModalOpen(false);
        setAdminResponse("");
      } else {
        toast.error(data.error?.description || "Failed to update review");
      }
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error("Failed to update review");
    } finally {
      setActionLoading(false);
    }
  };

  const viewReviewDetails = (review: Review) => {
    setSelectedReview(review);
    setAdminResponse(review.admin_response || "");
    setDetailsModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
      approved: "bg-green-500/10 text-green-600 border-green-500/20",
      rejected: "bg-red-500/10 text-red-600 border-red-500/20",
    };

    const icons: Record<string, any> = {
      pending: Clock,
      approved: CheckCircle,
      rejected: XCircle,
    };

    const Icon = icons[status] || Clock;

    return (
      <Badge variant="outline" className={colors[status] || ""}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Product Reviews</h1>
          <Button onClick={() => { fetchReviews(); fetchStats(); }} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Reviews</p>
                  <p className="text-2xl font-bold">{stats.total_reviews}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Approval</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending_reviews}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Average Rating</p>
                  <p className="text-2xl font-bold">{stats.average_rating?.toFixed(1) || "0.0"}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-400 fill-yellow-400" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{stats.approved_reviews}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">{stats.rejected_reviews}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Verified Purchases</p>
                  <p className="text-2xl font-bold">{stats.verified_purchases}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="p-4">
          <div className="flex gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reviews</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Reviews Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="p-4 font-semibold">Product</th>
                  <th className="p-4 font-semibold">Customer</th>
                  <th className="p-4 font-semibold">Rating</th>
                  <th className="p-4 font-semibold">Review</th>
                  <th className="p-4 font-semibold">Helpful</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-muted-foreground">
                      Loading reviews...
                    </td>
                  </tr>
                ) : reviews.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-muted-foreground">
                      No reviews found
                    </td>
                  </tr>
                ) : (
                  reviews.map((review) => (
                    <tr key={review.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <div className="font-medium">{review.product_name}</div>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{review.user_name}</div>
                          <div className="text-sm text-muted-foreground">{review.user_email}</div>
                          {review.verified_purchase && (
                            <Badge variant="outline" className="mt-1 text-xs">
                              Verified Purchase
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-4">{renderStars(review.rating)}</td>
                      <td className="p-4 max-w-xs">
                        <div className="font-medium">{review.title}</div>
                        <div className="text-sm text-muted-foreground truncate">
                          {review.comment}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1 text-sm">
                            <ThumbsUp className="h-3 w-3" />
                            {review.helpful_count}
                          </span>
                          <span className="flex items-center gap-1 text-sm text-muted-foreground">
                            <ThumbsDown className="h-3 w-3" />
                            {review.not_helpful_count}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">{getStatusBadge(review.status)}</td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => viewReviewDetails(review)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t">
              <p className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Review Details Modal */}
        <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Review Details</DialogTitle>
            </DialogHeader>
            {selectedReview && (
              <div className="space-y-6 py-4">
                <Card className="p-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Product</p>
                      <p className="font-semibold">{selectedReview.product_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Customer</p>
                      <p className="font-medium">{selectedReview.user_name}</p>
                      <p className="text-sm text-muted-foreground">{selectedReview.user_email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Rating</p>
                      {renderStars(selectedReview.rating)}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Title</p>
                      <p className="font-medium">{selectedReview.title}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Review</p>
                      <p className="mt-1">{selectedReview.comment}</p>
                    </div>
                    <div className="flex gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Helpful</p>
                        <p className="font-semibold">{selectedReview.helpful_count}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Not Helpful</p>
                        <p className="font-semibold">{selectedReview.not_helpful_count}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        {getStatusBadge(selectedReview.status)}
                      </div>
                    </div>
                  </div>
                </Card>

                <div className="space-y-3">
                  <label className="text-sm font-medium">Admin Response (Optional)</label>
                  <Textarea
                    value={adminResponse}
                    onChange={(e) => setAdminResponse(e.target.value)}
                    placeholder="Add a response to this review..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-3">
                  {selectedReview.status !== "approved" && (
                    <Button
                      onClick={() => handleUpdateStatus(selectedReview.id, "approved")}
                      disabled={actionLoading}
                      className="flex-1"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve Review
                    </Button>
                  )}
                  {selectedReview.status !== "rejected" && (
                    <Button
                      onClick={() => handleUpdateStatus(selectedReview.id, "rejected")}
                      disabled={actionLoading}
                      variant="destructive"
                      className="flex-1"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject Review
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
