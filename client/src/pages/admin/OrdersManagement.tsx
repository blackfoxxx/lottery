import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import {
  Package,
  Search,
  RefreshCw,
  Eye,
  Edit,
  Download,
  ChevronLeft,
  ChevronRight,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";

interface Order {
  id: number;
  order_number: string;
  user_id: number;
  total: number;
  status: string;
  payment_status: string;
  tracking_number: string | null;
  shipping_carrier: string | null;
  tracking_url: string | null;
  estimated_delivery: string | null;
  shipping_address: any;
  created_at: string;
  updated_at: string;
}

interface OrderStats {
  total_orders: number;
  pending: number;
  confirmed: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  total_revenue: number;
}

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  // Filters and pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage] = useState(20);

  // Update form state
  const [updateStatus, setUpdateStatus] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shippingCarrier, setShippingCarrier] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [estimatedDelivery, setEstimatedDelivery] = useState("");
  const [statusNotes, setStatusNotes] = useState("");

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, [currentPage, statusFilter, searchQuery]);

  async function fetchOrders() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        per_page: perPage.toString(),
      });

      if (statusFilter && statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      if (searchQuery) {
        params.append("search", searchQuery);
      }

      const response = await fetch(
        `http://localhost:8000/api/v1/orders-management/all?${params}`
      );
      const result = await response.json();

      if (result.success) {
        setOrders(result.data);
        setTotalPages(result.pagination.total_pages);
      } else {
        toast.error("Failed to load orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Error loading orders");
    } finally {
      setLoading(false);
    }
  }

  async function fetchStats() {
    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/orders-management/stats/summary"
      );
      const result = await response.json();

      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }

  function openUpdateModal(order: Order) {
    setSelectedOrder(order);
    setUpdateStatus(order.status);
    setTrackingNumber(order.tracking_number || "");
    setShippingCarrier(order.shipping_carrier || "");
    setTrackingUrl(order.tracking_url || "");
    setEstimatedDelivery(order.estimated_delivery || "");
    setStatusNotes("");
    setShowUpdateModal(true);
  }

  function openDetailsModal(order: Order) {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  }

  async function handleUpdateOrder() {
    if (!selectedOrder) return;

    setUpdateLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/orders-management/${selectedOrder.id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: updateStatus,
            tracking_number: trackingNumber || null,
            shipping_carrier: shippingCarrier || null,
            tracking_url: trackingUrl || null,
            estimated_delivery: estimatedDelivery || null,
            notes: statusNotes || null,
            updated_by: "Admin",
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        toast.success("Order updated successfully");
        setShowUpdateModal(false);
        fetchOrders();
        fetchStats();
      } else {
        toast.error(result.error?.description || "Failed to update order");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Error updating order");
    } finally {
      setUpdateLoading(false);
    }
  }

  function toggleOrderSelection(orderId: number) {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  }

  function toggleSelectAll() {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map((o) => o.id));
    }
  }

  function exportToCSV() {
    const headers = [
      "Order Number",
      "Customer",
      "Total",
      "Status",
      "Payment Status",
      "Tracking Number",
      "Created At",
    ];

    const rows = orders.map((order) => [
      order.order_number,
      order.shipping_address?.fullName || "N/A",
      `$${order.total.toFixed(2)}`,
      order.status,
      order.payment_status,
      order.tracking_number || "N/A",
      new Date(order.created_at).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success("Orders exported to CSV");
  }

  function getStatusBadge(status: string) {
    const variants: Record<string, { variant: any; icon: any; label: string }> = {
      pending: {
        variant: "secondary",
        icon: Clock,
        label: "Pending",
      },
      confirmed: {
        variant: "default",
        icon: CheckCircle2,
        label: "Confirmed",
      },
      processing: {
        variant: "secondary",
        icon: Package,
        label: "Processing",
      },
      shipped: {
        variant: "default",
        icon: Truck,
        label: "Shipped",
      },
      delivered: {
        variant: "default",
        icon: CheckCircle2,
        label: "Delivered",
      },
      cancelled: {
        variant: "destructive",
        icon: XCircle,
        label: "Cancelled",
      },
    };

    const config = variants[status] || variants.pending;
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
        <div>
          <h1 className="text-3xl font-bold">Order Management</h1>
          <p className="text-muted-foreground">
            Manage and track all customer orders
          </p>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">{stats.total_orders}</p>
                  <p className="text-xs text-muted-foreground">Total Orders</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-500">{stats.pending}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-500">{stats.confirmed}</p>
                  <p className="text-xs text-muted-foreground">Confirmed</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-500">{stats.processing}</p>
                  <p className="text-xs text-muted-foreground">Processing</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-indigo-500">{stats.shipped}</p>
                  <p className="text-xs text-muted-foreground">Shipped</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-500">{stats.delivered}</p>
                  <p className="text-xs text-muted-foreground">Delivered</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-500">{stats.cancelled}</p>
                  <p className="text-xs text-muted-foreground">Cancelled</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    ${stats.total_revenue.toFixed(0)}
                  </p>
                  <p className="text-xs text-muted-foreground">Revenue</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters and Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by order number or customer name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={fetchOrders}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" onClick={exportToCSV}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>

            {selectedOrders.length > 0 && (
              <div className="mt-4 p-4 bg-primary/10 rounded-lg flex items-center justify-between">
                <p className="font-medium">
                  {selectedOrders.length} order(s) selected
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedOrders([])}
                  >
                    Clear Selection
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Orders ({orders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-12 text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="py-12 text-center">
                <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Orders Found</h3>
                <p className="text-muted-foreground">
                  No orders match your current filters
                </p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedOrders.length === orders.length}
                          onCheckedChange={toggleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Order #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Tracking</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedOrders.includes(order.id)}
                            onCheckedChange={() => toggleOrderSelection(order.id)}
                          />
                        </TableCell>
                        <TableCell className="font-mono font-medium">
                          {order.order_number}
                        </TableCell>
                        <TableCell>
                          {order.shipping_address?.fullName || "N/A"}
                        </TableCell>
                        <TableCell className="font-semibold">
                          ${order.total.toFixed(2)}
                        </TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              order.payment_status === "paid"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {order.payment_status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {order.tracking_number ? (
                            <span className="font-mono text-sm">
                              {order.tracking_number}
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              No tracking
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openDetailsModal(order)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openUpdateModal(order)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Update Order Modal */}
      <Dialog open={showUpdateModal} onOpenChange={setShowUpdateModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Update order status and tracking information for order #
              {selectedOrder?.order_number}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="update-status">Order Status</Label>
              <Select value={updateStatus} onValueChange={setUpdateStatus}>
                <SelectTrigger id="update-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tracking-number">Tracking Number</Label>
                <Input
                  id="tracking-number"
                  placeholder="Enter tracking number"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="shipping-carrier">Shipping Carrier</Label>
                <Input
                  id="shipping-carrier"
                  placeholder="e.g., DHL, FedEx, UPS"
                  value={shippingCarrier}
                  onChange={(e) => setShippingCarrier(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="tracking-url">Tracking URL</Label>
              <Input
                id="tracking-url"
                type="url"
                placeholder="https://tracking.example.com/..."
                value={trackingUrl}
                onChange={(e) => setTrackingUrl(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="estimated-delivery">Estimated Delivery Date</Label>
              <Input
                id="estimated-delivery"
                type="date"
                value={estimatedDelivery}
                onChange={(e) => setEstimatedDelivery(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="status-notes">Status Update Notes</Label>
              <Input
                id="status-notes"
                placeholder="Optional notes about this status update..."
                value={statusNotes}
                onChange={(e) => setStatusNotes(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowUpdateModal(false)}
              disabled={updateLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateOrder} disabled={updateLoading}>
              {updateLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Order"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Order Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Complete information for order #{selectedOrder?.order_number}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Order Number</Label>
                  <p className="font-mono font-medium">
                    {selectedOrder.order_number}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Order Date</Label>
                  <p>{new Date(selectedOrder.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Payment Status</Label>
                  <div className="mt-1">
                    <Badge
                      variant={
                        selectedOrder.payment_status === "paid"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {selectedOrder.payment_status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Total Amount</Label>
                  <p className="font-semibold text-lg">
                    ${selectedOrder.total.toFixed(2)}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Customer</Label>
                  <p>{selectedOrder.shipping_address?.fullName || "N/A"}</p>
                </div>
              </div>

              {selectedOrder.tracking_number && (
                <div className="p-4 bg-muted rounded-lg">
                  <Label className="text-muted-foreground">Tracking Information</Label>
                  <div className="mt-2 space-y-1">
                    <p className="font-mono font-semibold">
                      {selectedOrder.tracking_number}
                    </p>
                    {selectedOrder.shipping_carrier && (
                      <p className="text-sm">
                        Carrier: {selectedOrder.shipping_carrier}
                      </p>
                    )}
                    {selectedOrder.tracking_url && (
                      <a
                        href={selectedOrder.tracking_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        Track Package →
                      </a>
                    )}
                  </div>
                </div>
              )}

              {selectedOrder.shipping_address && (
                <div>
                  <Label className="text-muted-foreground">Shipping Address</Label>
                  <div className="mt-2 p-4 bg-muted rounded-lg">
                    <p className="font-medium">
                      {selectedOrder.shipping_address.fullName}
                    </p>
                    <p className="text-sm">{selectedOrder.shipping_address.address}</p>
                    <p className="text-sm">
                      {selectedOrder.shipping_address.city},{" "}
                      {selectedOrder.shipping_address.state}{" "}
                      {selectedOrder.shipping_address.zipCode}
                    </p>
                    <p className="text-sm">{selectedOrder.shipping_address.country}</p>
                    {selectedOrder.shipping_address.phone && (
                      <p className="text-sm mt-2">
                        Phone: {selectedOrder.shipping_address.phone}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
