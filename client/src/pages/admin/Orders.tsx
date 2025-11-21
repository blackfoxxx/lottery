import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import { Search, Eye, Download } from "lucide-react";

// Mock orders data
const mockOrders = [
  {
    id: 1,
    customer_name: "Ahmed Hassan",
    customer_email: "ahmed@example.com",
    total_amount: 1299.99,
    status: "pending",
    payment_status: "pending",
    payment_method: "credit_card",
    created_at: "2025-11-20T10:30:00Z",
    items_count: 3,
  },
  {
    id: 2,
    customer_name: "Sara Ali",
    customer_email: "sara@example.com",
    total_amount: 149.99,
    status: "processing",
    payment_status: "paid",
    payment_method: "paypal",
    created_at: "2025-11-20T09:15:00Z",
    items_count: 1,
  },
  {
    id: 3,
    customer_name: "Mohammed Ibrahim",
    customer_email: "mohammed@example.com",
    total_amount: 549.98,
    status: "shipped",
    payment_status: "paid",
    payment_method: "cash_on_delivery",
    created_at: "2025-11-19T14:20:00Z",
    items_count: 2,
  },
  {
    id: 4,
    customer_name: "Fatima Karim",
    customer_email: "fatima@example.com",
    total_amount: 1199.99,
    status: "delivered",
    payment_status: "paid",
    payment_method: "credit_card",
    created_at: "2025-11-18T11:45:00Z",
    items_count: 1,
  },
];

export default function AdminOrders() {
  const [orders] = useState(mockOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toString().includes(searchQuery);
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  function getStatusVariant(status: string) {
    switch (status) {
      case "pending": return "secondary" as const;
      case "processing": return "default" as const;
      case "shipped": return "default" as const;
      case "delivered": return "default" as const;
      case "cancelled": return "destructive" as const;
      default: return "secondary" as const;
    }
  }

  function getPaymentStatusVariant(status: string) {
    return status === "paid" ? "default" as const : "secondary" as const;
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Orders</h2>
            <p className="text-muted-foreground">
              Manage and track customer orders
            </p>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by order ID, customer name, or email..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Orders Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono font-semibold">
                      #{order.id}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customer_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.customer_email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(order.created_at)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{order.items_count} items</Badge>
                    </TableCell>
                    <TableCell className="font-semibold">
                      ${order.total_amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge variant={getPaymentStatusVariant(order.payment_status)}>
                          {order.payment_status}
                        </Badge>
                        <p className="text-xs text-muted-foreground capitalize">
                          {order.payment_method.replace(/_/g, ' ')}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Summary */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Total Orders</p>
            <p className="text-2xl font-bold">{orders.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold">
              {orders.filter(o => o.status === "pending").length}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Processing</p>
            <p className="text-2xl font-bold">
              {orders.filter(o => o.status === "processing").length}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-bold">
              ${orders.reduce((sum, o) => sum + o.total_amount, 0).toFixed(2)}
            </p>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
