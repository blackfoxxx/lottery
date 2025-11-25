import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Search,
  Filter,
  Download,
  Eye,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Package,
  DollarSign,
  ShoppingCart,
  Calendar,
} from "lucide-react";

const API_BASE_URL = "http://localhost:8000/api/v1";

interface Order {
  id: number;
  order_number: string;
  user_id: number;
  total_amount: string;
  tax_amount: string;
  shipping_amount: string;
  discount_amount: string;
  status: string;
  payment_method: string;
  payment_status: string;
  shipping_name: string;
  shipping_email: string;
  shipping_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_country: string;
  shipping_postal_code: string;
  created_at: string;
  user_name?: string;
  items_count?: number;
}

interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  product_sku: string;
  quantity: number;
  price: string;
  lottery_tickets: number;
  image_url?: string;
}

interface LotteryTicket {
  id: number;
  ticket_number: string;
  draw_name: string;
  prize_amount: string;
  draw_date: string;
  status: string;
}

interface OrderDetails {
  order: Order;
  items: OrderItem[];
  lottery_tickets: LotteryTicket[];
  user: {
    id: number;
    name: string;
    email: string;
    phone?: string;
  };
}

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/orders`);
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.data);
      } else {
        toast.error("Failed to load orders");
      }
    } catch (error) {
      console.error("Error loading orders:", error);
      toast.error("Failed to load orders from server");
    } finally {
      setLoading(false);
    }
  };

  const loadOrderDetails = async (orderId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
      const data = await response.json();
      
      if (data.success) {
        setSelectedOrder(data.data);
        setIsDetailsDialogOpen(true);
      } else {
        toast.error("Failed to load order details");
      }
    } catch (error) {
      console.error("Error loading order details:", error);
      toast.error("Failed to load order details");
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    setUpdating(true);
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Order status updated to ${newStatus}`);
        loadOrders();
        if (selectedOrder && selectedOrder.order.id === orderId) {
          loadOrderDetails(orderId);
        }
      } else {
        toast.error(data.message || "Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    } finally {
      setUpdating(false);
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ["Order Number", "Customer", "Total", "Status", "Payment Status", "Date"],
      ...filteredOrders.map(order => [
        order.order_number,
        order.shipping_name,
        `$${parseFloat(order.total_amount).toFixed(2)}`,
        order.status,
        order.payment_status,
        new Date(order.created_at).toLocaleDateString(),
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success("Orders exported to CSV");
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-500",
      pending_payment: "bg-orange-500",
      confirmed: "bg-blue-500",
      processing: "bg-cyan-500",
      shipped: "bg-purple-500",
      delivered: "bg-green-500",
      cancelled: "bg-red-500",
      refunded: "bg-gray-500",
    };
    return colors[status] || "bg-gray-500";
  };

  const getPaymentStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-500",
      completed: "bg-green-500",
      failed: "bg-red-500",
      refunded: "bg-gray-500",
    };
    return colors[status] || "bg-gray-500";
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shipping_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shipping_email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesPaymentStatus = paymentStatusFilter === "all" || order.payment_status === paymentStatusFilter;
    return matchesSearch && matchesStatus && matchesPaymentStatus;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "pending" || o.status === "pending_payment").length,
    processing: orders.filter(o => o.status === "processing" || o.status === "confirmed").length,
    shipped: orders.filter(o => o.status === "shipped").length,
    delivered: orders.filter(o => o.status === "delivered").length,
    totalRevenue: orders.reduce((sum, o) => sum + parseFloat(o.total_amount), 0),
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading orders...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Order Management</h2>
            <p className="text-muted-foreground">
              Manage and track all customer orders
            </p>
          </div>
          <Button onClick={exportToCSV} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Processing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyan-600">{stats.processing}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Shipped
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.shipped}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Delivered
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by order number, customer name, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Order Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="pending_payment">Pending Payment</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
              <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Payment Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payment Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Orders ({filteredOrders.length})</CardTitle>
            <CardDescription>View and manage all customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order Number</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Order Status</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No orders found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div className="font-medium">{order.order_number}</div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.shipping_name}</div>
                          <div className="text-sm text-muted-foreground">{order.shipping_email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">${parseFloat(order.total_amount).toFixed(2)}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPaymentStatusColor(order.payment_status)}>
                          {order.payment_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(order.created_at).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => loadOrderDetails(order.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            </div>
          </CardContent>
        </Card>

        {/* Order Details Dialog */}
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedOrder && (
              <>
                <DialogHeader>
                  <DialogTitle>Order Details - {selectedOrder.order.order_number}</DialogTitle>
                  <DialogDescription>
                    Complete order information and management
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Order Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Customer Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div><strong>Name:</strong> {selectedOrder.user.name}</div>
                        <div><strong>Email:</strong> {selectedOrder.user.email}</div>
                        <div><strong>Phone:</strong> {selectedOrder.order.shipping_phone}</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Shipping Address</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div>{selectedOrder.order.shipping_address}</div>
                        <div>{selectedOrder.order.shipping_city}, {selectedOrder.order.shipping_country}</div>
                        <div>{selectedOrder.order.shipping_postal_code}</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Order Items */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Order Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Lottery Tickets</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedOrder.items.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.product_name}</TableCell>
                              <TableCell>{item.product_sku}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>${parseFloat(item.price).toFixed(2)}</TableCell>
                              <TableCell>{item.lottery_tickets}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  {/* Lottery Tickets */}
                  {selectedOrder.lottery_tickets.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Lottery Tickets ({selectedOrder.lottery_tickets.length})</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedOrder.lottery_tickets.map((ticket) => (
                            <div key={ticket.id} className="p-3 border rounded">
                              <div className="font-medium">{ticket.ticket_number}</div>
                              <div className="text-sm text-muted-foreground">{ticket.draw_name}</div>
                              <div className="text-sm">Prize: ${parseFloat(ticket.prize_amount).toFixed(2)}</div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Order Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${parseFloat(selectedOrder.order.total_amount).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax:</span>
                        <span>${parseFloat(selectedOrder.order.tax_amount).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping:</span>
                        <span>${parseFloat(selectedOrder.order.shipping_amount).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Discount:</span>
                        <span>-${parseFloat(selectedOrder.order.discount_amount).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg pt-2 border-t">
                        <span>Total:</span>
                        <span>${parseFloat(selectedOrder.order.total_amount).toFixed(2)}</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Status Update */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Update Order Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Select
                          defaultValue={selectedOrder.order.status}
                          onValueChange={(value) => updateOrderStatus(selectedOrder.order.id, value)}
                          disabled={updating}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="pending_payment">Pending Payment</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                            <SelectItem value="refunded">Refunded</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
                    Close
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
