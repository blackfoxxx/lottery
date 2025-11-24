import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  TrendingDown,
} from "lucide-react";

interface Analytics {
  revenue: {
    total: number;
    growth_percentage: number;
    daily_trend: Array<{ date: string; revenue: number }>;
    average_daily: number;
  };
  orders: {
    total: number;
    status_breakdown: Array<{ status: string; count: number }>;
    average_order_value: number;
  };
  products: {
    best_selling: Array<{
      id: number;
      name: string;
      category: string;
      units_sold: number;
      revenue: number;
    }>;
    category_performance: Array<{
      category: string;
      products_count: number;
      units_sold: number;
      revenue: number;
    }>;
  };
  customers: {
    new_customers: number;
    returning_customers: number;
    customer_lifetime_value: number;
    customer_acquisition_cost: number;
  };
  conversion: {
    total_orders: number;
    completed_orders: number;
    conversion_rate: number;
  };
}

export default function Analytics() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30");

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/api/v1/analytics/sales?period=${period}`);
      const data = await response.json();

      if (data.success) {
        setAnalytics(data.data);
      } else {
        toast.error("Failed to load analytics");
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/analytics/export?period=${period}`);
      const data = await response.json();

      if (data.success) {
        // Convert to CSV and download
        const csvContent = JSON.stringify(data.data, null, 2);
        const blob = new Blob([csvContent], { type: "application/json" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `analytics-report-${new Date().toISOString().split("T")[0]}.json`;
        a.click();
        toast.success("Report exported successfully");
      } else {
        toast.error("Failed to export report");
      }
    } catch (error) {
      console.error("Error exporting report:", error);
      toast.error("Failed to export report");
    }
  };

  if (loading || !analytics) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Sales Analytics</h1>
          <div className="flex gap-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchAnalytics} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={handleExport} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Revenue Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${analytics.revenue.total.toFixed(2)}</p>
                <div className="flex items-center gap-1 mt-1">
                  {analytics.revenue.growth_percentage >= 0 ? (
                    <>
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600">
                        +{analytics.revenue.growth_percentage.toFixed(1)}%
                      </span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-4 w-4 text-red-600" />
                      <span className="text-sm text-red-600">
                        {analytics.revenue.growth_percentage.toFixed(1)}%
                      </span>
                    </>
                  )}
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{analytics.orders.total}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Avg: ${analytics.orders.average_order_value.toFixed(2)}
                </p>
              </div>
              <ShoppingCart className="h-8 w-8 text-primary" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">New Customers</p>
                <p className="text-2xl font-bold">{analytics.customers.new_customers}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Returning: {analytics.customers.returning_customers}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">{analytics.conversion.conversion_rate.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {analytics.conversion.completed_orders} / {analytics.conversion.total_orders}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </Card>
        </div>

        {/* Customer Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Customer Metrics
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Customer Lifetime Value</span>
                <span className="font-semibold">${analytics.customers.customer_lifetime_value.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Customer Acquisition Cost</span>
                <span className="font-semibold">${analytics.customers.customer_acquisition_cost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Average Daily Revenue</span>
                <span className="font-semibold">${analytics.revenue.average_daily.toFixed(2)}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Order Status Breakdown
            </h3>
            <div className="space-y-3">
              {analytics.orders.status_breakdown.map((status) => (
                <div key={status.status} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{status.status}</span>
                    <span className="font-semibold">{status.count}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{
                        width: `${(status.count / analytics.orders.total) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Best Selling Products */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Package className="h-5 w-5" />
            Best Selling Products
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="p-3 font-semibold">Rank</th>
                  <th className="p-3 font-semibold">Product</th>
                  <th className="p-3 font-semibold">Category</th>
                  <th className="p-3 font-semibold">Units Sold</th>
                  <th className="p-3 font-semibold">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {analytics.products.best_selling.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      No product data available
                    </td>
                  </tr>
                ) : (
                  analytics.products.best_selling.map((product, index) => (
                    <tr key={product.id} className="border-b hover:bg-muted/50">
                      <td className="p-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                          {index + 1}
                        </div>
                      </td>
                      <td className="p-3 font-medium">{product.name}</td>
                      <td className="p-3 text-muted-foreground">{product.category}</td>
                      <td className="p-3 font-semibold">{product.units_sold}</td>
                      <td className="p-3 font-semibold text-green-600">
                        ${parseFloat(product.revenue.toString()).toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Category Performance */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Category Performance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.products.category_performance.length === 0 ? (
              <div className="col-span-3 p-8 text-center text-muted-foreground">
                No category data available
              </div>
            ) : (
              analytics.products.category_performance.map((category) => (
                <Card key={category.category} className="p-4 bg-muted/30">
                  <h4 className="font-semibold mb-3">{category.category}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Products</span>
                      <span className="font-semibold">{category.products_count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Units Sold</span>
                      <span className="font-semibold">{category.units_sold}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Revenue</span>
                      <span className="font-semibold text-green-600">
                        ${parseFloat(category.revenue.toString()).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </Card>

        {/* Revenue Trend Chart */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Revenue Trend
          </h3>
          <div className="h-64 flex items-end gap-2">
            {analytics.revenue.daily_trend.slice(-14).map((day, index) => {
              const maxRevenue = Math.max(...analytics.revenue.daily_trend.map((d) => parseFloat(d.revenue.toString())));
              const height = maxRevenue > 0 ? (parseFloat(day.revenue.toString()) / maxRevenue) * 100 : 0;

              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-primary/20 rounded-t-lg relative group cursor-pointer hover:bg-primary/30 transition-colors"
                    style={{ height: `${height}%`, minHeight: "4px" }}
                  >
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      ${parseFloat(day.revenue.toString()).toFixed(2)}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(day.date).getDate()}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
