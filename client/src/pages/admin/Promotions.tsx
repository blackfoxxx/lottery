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
  Tag,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  DollarSign,
  Percent,
  Gift,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Users,
} from "lucide-react";

interface Promotion {
  id: number;
  code: string;
  name: string;
  description: string;
  type: string;
  discount_value: number;
  min_purchase_amount: number;
  max_discount_amount: number | null;
  usage_limit: number | null;
  usage_count: number;
  per_user_limit: number;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
}

interface PromotionStats {
  total_promotions: number;
  active_promotions: number;
  expired_promotions: number;
  total_usage: number;
  most_used: Array<{
    code: string;
    name: string;
    usage_count: number;
    type: string;
  }>;
}

export default function Promotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [stats, setStats] = useState<PromotionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    type: "percentage",
    discount_value: "",
    min_purchase_amount: "0",
    max_discount_amount: "",
    usage_limit: "",
    per_user_limit: "1",
    start_date: "",
    end_date: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPromotions();
    fetchStats();
  }, [currentPage, statusFilter]);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        per_page: "20",
        status: statusFilter,
      });

      const response = await fetch(`http://localhost:8000/api/v1/promotions?${params}`);
      const data = await response.json();

      if (data.success) {
        setPromotions(data.data);
        setTotalPages(data.pagination.total_pages);
      }
    } catch (error) {
      console.error("Error fetching promotions:", error);
      toast.error("Failed to load promotions");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/promotions/stats");
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleCreatePromotion = async () => {
    try {
      setSubmitting(true);
      const response = await fetch("http://localhost:8000/api/v1/promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          discount_value: parseFloat(formData.discount_value) || 0,
          min_purchase_amount: parseFloat(formData.min_purchase_amount) || 0,
          max_discount_amount: formData.max_discount_amount ? parseFloat(formData.max_discount_amount) : null,
          usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
          per_user_limit: parseInt(formData.per_user_limit) || 1,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Promotion created successfully");
        fetchPromotions();
        fetchStats();
        setCreateModalOpen(false);
        resetForm();
      } else {
        toast.error(data.error?.description || "Failed to create promotion");
      }
    } catch (error) {
      console.error("Error creating promotion:", error);
      toast.error("Failed to create promotion");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePromotion = async (id: number) => {
    if (!confirm("Are you sure you want to delete this promotion?")) return;

    try {
      const response = await fetch(`http://localhost:8000/api/v1/promotions/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Promotion deleted successfully");
        fetchPromotions();
        fetchStats();
      } else {
        toast.error(data.error?.description || "Failed to delete promotion");
      }
    } catch (error) {
      console.error("Error deleting promotion:", error);
      toast.error("Failed to delete promotion");
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    try {
      const response = await fetch(`http://localhost:8000/api/v1/promotions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Promotion ${newStatus === "active" ? "activated" : "deactivated"}`);
        fetchPromotions();
      } else {
        toast.error(data.error?.description || "Failed to update promotion");
      }
    } catch (error) {
      console.error("Error updating promotion:", error);
      toast.error("Failed to update promotion");
    }
  };

  const resetForm = () => {
    setFormData({
      code: "",
      name: "",
      description: "",
      type: "percentage",
      discount_value: "",
      min_purchase_amount: "0",
      max_discount_amount: "",
      usage_limit: "",
      per_user_limit: "1",
      start_date: "",
      end_date: "",
    });
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      active: "bg-green-500/10 text-green-600 border-green-500/20",
      inactive: "bg-gray-500/10 text-gray-600 border-gray-500/20",
      expired: "bg-red-500/10 text-red-600 border-red-500/20",
    };

    return (
      <Badge variant="outline" className={colors[status] || ""}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const icons: Record<string, any> = {
      percentage: Percent,
      fixed_amount: DollarSign,
      free_shipping: Gift,
      bogo: Tag,
    };

    const Icon = icons[type] || Tag;

    return (
      <Badge variant="secondary">
        <Icon className="h-3 w-3 mr-1" />
        {type.replace("_", " ").toUpperCase()}
      </Badge>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Promotional Campaigns</h1>
          <div className="flex gap-2">
            <Button onClick={() => { fetchPromotions(); fetchStats(); }} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => setCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Promotion
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Promotions</p>
                  <p className="text-2xl font-bold">{stats.total_promotions}</p>
                </div>
                <Tag className="h-8 w-8 text-primary" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-green-600">{stats.active_promotions}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Usage</p>
                  <p className="text-2xl font-bold">{stats.total_usage}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Expired</p>
                  <p className="text-2xl font-bold text-red-600">{stats.expired_promotions}</p>
                </div>
                <Calendar className="h-8 w-8 text-red-600" />
              </div>
            </Card>
          </div>
        )}

        {/* Most Used Promotions */}
        {stats && stats.most_used.length > 0 && (
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Most Used Promotions</h3>
            <div className="space-y-2">
              {stats.most_used.map((promo, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{promo.code}</p>
                      <p className="text-sm text-muted-foreground">{promo.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{promo.usage_count} uses</p>
                    {getTypeBadge(promo.type)}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Filters */}
        <Card className="p-4">
          <div className="flex gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Promotions</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Promotions Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="p-4 font-semibold">Code</th>
                  <th className="p-4 font-semibold">Name</th>
                  <th className="p-4 font-semibold">Type</th>
                  <th className="p-4 font-semibold">Discount</th>
                  <th className="p-4 font-semibold">Usage</th>
                  <th className="p-4 font-semibold">Valid Period</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-muted-foreground">
                      Loading promotions...
                    </td>
                  </tr>
                ) : promotions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-muted-foreground">
                      No promotions found
                    </td>
                  </tr>
                ) : (
                  promotions.map((promo) => (
                    <tr key={promo.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <span className="font-mono font-semibold">{promo.code}</span>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{promo.name}</div>
                          {promo.description && (
                            <div className="text-sm text-muted-foreground truncate max-w-xs">
                              {promo.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">{getTypeBadge(promo.type)}</td>
                      <td className="p-4">
                        {promo.type === "percentage" ? (
                          <span>{promo.discount_value}%</span>
                        ) : promo.type === "fixed_amount" ? (
                          <span>${promo.discount_value}</span>
                        ) : (
                          <span>-</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div>
                          <span className="font-semibold">{promo.usage_count}</span>
                          {promo.usage_limit && (
                            <span className="text-muted-foreground"> / {promo.usage_limit}</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-sm">
                        <div>{new Date(promo.start_date).toLocaleDateString()}</div>
                        <div className="text-muted-foreground">
                          to {new Date(promo.end_date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4">{getStatusBadge(promo.status)}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleStatus(promo.id, promo.status)}
                          >
                            {promo.status === "active" ? "Deactivate" : "Activate"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeletePromotion(promo.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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

        {/* Create Promotion Modal */}
        <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Promotion</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Promotion Code *</label>
                  <Input
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="SUMMER2024"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Summer Sale 2024"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description of the promotion..."
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Type *</label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage Discount</SelectItem>
                      <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
                      <SelectItem value="free_shipping">Free Shipping</SelectItem>
                      <SelectItem value="bogo">Buy One Get One</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formData.type !== "free_shipping" && (
                  <div>
                    <label className="text-sm font-medium">Discount Value *</label>
                    <Input
                      type="number"
                      value={formData.discount_value}
                      onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                      placeholder={formData.type === "percentage" ? "20" : "10.00"}
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Min Purchase Amount</label>
                  <Input
                    type="number"
                    value={formData.min_purchase_amount}
                    onChange={(e) => setFormData({ ...formData, min_purchase_amount: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Max Discount Amount</label>
                  <Input
                    type="number"
                    value={formData.max_discount_amount}
                    onChange={(e) => setFormData({ ...formData, max_discount_amount: e.target.value })}
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Total Usage Limit</label>
                  <Input
                    type="number"
                    value={formData.usage_limit}
                    onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                    placeholder="Unlimited"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Per User Limit</label>
                  <Input
                    type="number"
                    value={formData.per_user_limit}
                    onChange={(e) => setFormData({ ...formData, per_user_limit: e.target.value })}
                    placeholder="1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Start Date *</label>
                  <Input
                    type="datetime-local"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">End Date *</label>
                  <Input
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleCreatePromotion} disabled={submitting} className="flex-1">
                  {submitting ? "Creating..." : "Create Promotion"}
                </Button>
                <Button onClick={() => { setCreateModalOpen(false); resetForm(); }} variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
