import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Users,
  UserPlus,
  TrendingUp,
  DollarSign,
  Search,
  RefreshCw,
  Eye,
  ChevronLeft,
  ChevronRight,
  Award,
  ShoppingBag,
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";

interface Customer {
  id: number;
  name: string;
  email: string;
  created_at: string;
  total_orders: number;
  total_spent: number;
  last_order_date: string | null;
  segment: string;
}

interface CustomerDetails {
  customer: {
    id: number;
    name: string;
    email: string;
    created_at: string;
  };
  orders: Array<{
    id: number;
    order_number: string;
    total: number;
    status: string;
    created_at: string;
  }>;
  stats: {
    total_orders: number;
    total_spent: number;
    average_order_value: number;
    last_order_date: string;
    first_order_date: string;
    lottery_tickets: number;
    disputes_count: number;
    segment: string;
  };
  disputes: Array<{
    id: number;
    amount: number;
    reason: string;
    status: string;
    created_at: string;
  }>;
}

interface CustomerAnalytics {
  total_customers: number;
  new_customers: number;
  customers_with_orders: number;
  vip_customers: number;
  regular_customers: number;
  new_customers_no_orders: number;
  top_customers: Array<{
    id: number;
    name: string;
    email: string;
    total_orders: number;
    total_spent: number;
  }>;
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [analytics, setAnalytics] = useState<CustomerAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [segmentFilter, setSegmentFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    fetchCustomers();
    fetchAnalytics();
  }, [currentPage, segmentFilter]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        per_page: "20",
        segment: segmentFilter,
      });
      
      if (searchTerm) {
        params.append("search", searchTerm);
      }

      const response = await fetch(`http://localhost:8000/api/v1/customers?${params}`);
      const data = await response.json();

      if (data.success) {
        setCustomers(data.data);
        setTotalPages(data.pagination.total_pages);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast.error("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/customers/analytics");
      const data = await response.json();

      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  const fetchCustomerDetails = async (customerId: number) => {
    try {
      setLoadingDetails(true);
      const response = await fetch(`http://localhost:8000/api/v1/customers/${customerId}`);
      const data = await response.json();

      if (data.success) {
        setSelectedCustomer(data.data);
        setDetailsModalOpen(true);
      }
    } catch (error) {
      console.error("Error fetching customer details:", error);
      toast.error("Failed to load customer details");
    } finally {
      setLoadingDetails(false);
    }
  };

  const getSegmentBadge = (segment: string) => {
    const colors: Record<string, string> = {
      vip: "bg-purple-500/10 text-purple-600 border-purple-500/20",
      regular: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      new: "bg-green-500/10 text-green-600 border-green-500/20",
    };

    const icons: Record<string, any> = {
      vip: Award,
      regular: ShoppingBag,
      new: UserPlus,
    };

    const Icon = icons[segment] || Users;

    return (
      <Badge variant="outline" className={colors[segment] || ""}>
        <Icon className="h-3 w-3 mr-1" />
        {segment.toUpperCase()}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-500/10 text-yellow-600",
      confirmed: "bg-blue-500/10 text-blue-600",
      processing: "bg-purple-500/10 text-purple-600",
      shipped: "bg-indigo-500/10 text-indigo-600",
      delivered: "bg-green-500/10 text-green-600",
      cancelled: "bg-red-500/10 text-red-600",
    };

    return (
      <Badge variant="secondary" className={colors[status] || ""}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Customer Management</h1>
          <Button onClick={() => fetchCustomers()} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Analytics Cards */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Customers</p>
                  <p className="text-2xl font-bold">{analytics.total_customers}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">New (30 days)</p>
                  <p className="text-2xl font-bold text-green-600">{analytics.new_customers}</p>
                </div>
                <UserPlus className="h-8 w-8 text-green-600" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">VIP Customers</p>
                  <p className="text-2xl font-bold text-purple-600">{analytics.vip_customers}</p>
                </div>
                <Award className="h-8 w-8 text-purple-600" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">With Orders</p>
                  <p className="text-2xl font-bold">{analytics.customers_with_orders}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </Card>
          </div>
        )}

        {/* Top Customers */}
        {analytics && analytics.top_customers.length > 0 && (
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Top 10 Customers by Spending
            </h3>
            <div className="space-y-3">
              {analytics.top_customers.map((customer, index) => (
                <div key={customer.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-muted-foreground">{customer.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${customer.total_spent.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">{customer.total_orders} orders</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchCustomers()}
                className="pl-10"
              />
            </div>
            <Select value={segmentFilter} onValueChange={setSegmentFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by segment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Customers</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
                <SelectItem value="regular">Regular</SelectItem>
                <SelectItem value="new">New</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchCustomers}>Search</Button>
          </div>
        </Card>

        {/* Customers Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="p-4 font-semibold">Customer</th>
                  <th className="p-4 font-semibold">Segment</th>
                  <th className="p-4 font-semibold">Orders</th>
                  <th className="p-4 font-semibold">Total Spent</th>
                  <th className="p-4 font-semibold">Last Order</th>
                  <th className="p-4 font-semibold">Joined</th>
                  <th className="p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      Loading customers...
                    </td>
                  </tr>
                ) : customers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      No customers found
                    </td>
                  </tr>
                ) : (
                  customers.map((customer) => (
                    <tr key={customer.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-muted-foreground">{customer.email}</div>
                        </div>
                      </td>
                      <td className="p-4">{getSegmentBadge(customer.segment)}</td>
                      <td className="p-4">{customer.total_orders}</td>
                      <td className="p-4 font-semibold">${customer.total_spent.toFixed(2)}</td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {customer.last_order_date
                          ? new Date(customer.last_order_date).toLocaleDateString()
                          : "Never"}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {new Date(customer.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fetchCustomerDetails(customer.id)}
                          disabled={loadingDetails}
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

        {/* Customer Details Modal */}
        <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Customer Details</DialogTitle>
            </DialogHeader>
            {selectedCustomer && (
              <div className="space-y-6 py-4">
                {/* Customer Info */}
                <Card className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{selectedCustomer.customer.name}</h3>
                      <p className="text-muted-foreground">{selectedCustomer.customer.email}</p>
                    </div>
                    {getSegmentBadge(selectedCustomer.stats.segment)}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Orders</p>
                      <p className="text-2xl font-bold">{selectedCustomer.stats.total_orders}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Spent</p>
                      <p className="text-2xl font-bold">${selectedCustomer.stats.total_spent.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Order Value</p>
                      <p className="text-2xl font-bold">${selectedCustomer.stats.average_order_value.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Lottery Tickets</p>
                      <p className="text-2xl font-bold">{selectedCustomer.stats.lottery_tickets}</p>
                    </div>
                  </div>
                </Card>

                {/* Recent Orders */}
                <div>
                  <h4 className="font-semibold mb-3">Recent Orders</h4>
                  {selectedCustomer.orders.length === 0 ? (
                    <Card className="p-6 text-center text-muted-foreground">
                      No orders yet
                    </Card>
                  ) : (
                    <div className="space-y-2">
                      {selectedCustomer.orders.map((order) => (
                        <Card key={order.id} className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Order #{order.order_number}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(order.created_at).toLocaleString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">${order.total.toFixed(2)}</p>
                              {getStatusBadge(order.status)}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                {/* Disputes */}
                {selectedCustomer.disputes.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Disputes</h4>
                    <div className="space-y-2">
                      {selectedCustomer.disputes.map((dispute) => (
                        <Card key={dispute.id} className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">${dispute.amount.toFixed(2)}</p>
                              <p className="text-sm text-muted-foreground">{dispute.reason}</p>
                            </div>
                            <Badge variant="secondary">{dispute.status}</Badge>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
