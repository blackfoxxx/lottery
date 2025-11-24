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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Package,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Search,
  RefreshCw,
  Edit,
  History,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";

interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock_quantity: number;
  min_stock_level: number;
  status: string;
  images?: string;
}

interface InventoryStats {
  total_products: number;
  in_stock: number;
  low_stock: number;
  out_of_stock: number;
  total_stock_value: number;
  total_units: number;
  low_stock_alerts: Array<{
    id: number;
    name: string;
    sku: string;
    stock_quantity: number;
    min_stock_level: number;
  }>;
}

interface InventoryLog {
  id: number;
  product_id: number;
  product_name: string;
  product_sku: string;
  change_type: string;
  quantity_change: number;
  quantity_before: number;
  quantity_after: number;
  notes: string;
  created_by: string;
  created_at: string;
}

export default function Inventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [logsModalOpen, setLogsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productLogs, setProductLogs] = useState<InventoryLog[]>([]);
  
  const [updateForm, setUpdateForm] = useState({
    change_type: "restock",
    quantity_change: "",
    notes: "",
  });

  useEffect(() => {
    fetchInventory();
    fetchStats();
  }, [currentPage, statusFilter]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        per_page: "20",
        status: statusFilter,
      });
      
      if (searchTerm) {
        params.append("search", searchTerm);
      }

      const response = await fetch(`http://localhost:8000/api/v1/inventory?${params}`);
      const data = await response.json();

      if (data.success) {
        setProducts(data.data);
        setTotalPages(data.pagination.total_pages);
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/inventory/stats");
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchProductLogs = async (productId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/inventory/products/${productId}/logs`);
      const data = await response.json();

      if (data.success) {
        setProductLogs(data.data);
        setLogsModalOpen(true);
      }
    } catch (error) {
      console.error("Error fetching product logs:", error);
      toast.error("Failed to load product logs");
    }
  };

  const handleUpdateStock = async () => {
    if (!selectedProduct || !updateForm.quantity_change) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/inventory/products/${selectedProduct.id}/stock`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...updateForm,
            quantity_change: parseInt(updateForm.quantity_change),
            updated_by: "Admin",
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Stock updated successfully");
        setUpdateModalOpen(false);
        setUpdateForm({ change_type: "restock", quantity_change: "", notes: "" });
        fetchInventory();
        fetchStats();
      } else {
        toast.error(data.error?.description || "Failed to update stock");
      }
    } catch (error) {
      console.error("Error updating stock:", error);
      toast.error("Failed to update stock");
    }
  };

  const getStockStatusBadge = (product: Product) => {
    if (product.stock_quantity <= 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (product.stock_quantity <= product.min_stock_level) {
      return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600">Low Stock</Badge>;
    } else {
      return <Badge variant="secondary" className="bg-green-500/10 text-green-600">In Stock</Badge>;
    }
  };

  const getChangeTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      restock: "bg-green-500/10 text-green-600",
      sale: "bg-blue-500/10 text-blue-600",
      adjustment: "bg-yellow-500/10 text-yellow-600",
      return: "bg-purple-500/10 text-purple-600",
    };

    return (
      <Badge variant="secondary" className={colors[type] || ""}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <Button onClick={() => fetchInventory()} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Products</p>
                  <p className="text-2xl font-bold">{stats.total_products}</p>
                </div>
                <Package className="h-8 w-8 text-primary" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">In Stock</p>
                  <p className="text-2xl font-bold text-green-600">{stats.in_stock}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Low Stock</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.low_stock}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Stock Value</p>
                  <p className="text-2xl font-bold">${stats.total_stock_value.toFixed(2)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
            </Card>
          </div>
        )}

        {/* Low Stock Alerts */}
        {stats && stats.low_stock_alerts.length > 0 && (
          <Card className="p-6 border-yellow-500/50 bg-yellow-500/5">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                  Low Stock Alerts
                </h3>
                <div className="space-y-1">
                  {stats.low_stock_alerts.map((product) => (
                    <p key={product.id} className="text-sm text-yellow-800 dark:text-yellow-200">
                      <span className="font-medium">{product.name}</span> (SKU: {product.sku}) - Only {product.stock_quantity} units left
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by product name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchInventory()}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="in_stock">In Stock</SelectItem>
                <SelectItem value="low_stock">Low Stock</SelectItem>
                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchInventory}>Search</Button>
          </div>
        </Card>

        {/* Products Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="p-4 font-semibold">Product</th>
                  <th className="p-4 font-semibold">SKU</th>
                  <th className="p-4 font-semibold">Price</th>
                  <th className="p-4 font-semibold">Stock</th>
                  <th className="p-4 font-semibold">Min Level</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      Loading inventory...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      No products found
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <div className="font-medium">{product.name}</div>
                      </td>
                      <td className="p-4 text-muted-foreground">{product.sku}</td>
                      <td className="p-4">${product.price.toFixed(2)}</td>
                      <td className="p-4">
                        <span className={product.stock_quantity <= product.min_stock_level ? "text-yellow-600 font-semibold" : ""}>
                          {product.stock_quantity}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground">{product.min_stock_level}</td>
                      <td className="p-4">{getStockStatusBadge(product)}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedProduct(product);
                              setUpdateModalOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedProduct(product);
                              fetchProductLogs(product.id);
                            }}
                          >
                            <History className="h-4 w-4" />
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

        {/* Update Stock Modal */}
        <Dialog open={updateModalOpen} onOpenChange={setUpdateModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Stock - {selectedProduct?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Change Type</label>
                <Select
                  value={updateForm.change_type}
                  onValueChange={(value) => setUpdateForm({ ...updateForm, change_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="restock">Restock</SelectItem>
                    <SelectItem value="sale">Sale</SelectItem>
                    <SelectItem value="adjustment">Adjustment</SelectItem>
                    <SelectItem value="return">Return</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Quantity</label>
                <Input
                  type="number"
                  placeholder="Enter quantity"
                  value={updateForm.quantity_change}
                  onChange={(e) => setUpdateForm({ ...updateForm, quantity_change: e.target.value })}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Current stock: {selectedProduct?.stock_quantity}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Notes (Optional)</label>
                <Textarea
                  placeholder="Add notes about this stock change..."
                  value={updateForm.notes}
                  onChange={(e) => setUpdateForm({ ...updateForm, notes: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setUpdateModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateStock}>Update Stock</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Logs Modal */}
        <Dialog open={logsModalOpen} onOpenChange={setLogsModalOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Stock History - {selectedProduct?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {productLogs.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No stock history available</p>
              ) : (
                <div className="space-y-3">
                  {productLogs.map((log) => (
                    <Card key={log.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getChangeTypeBadge(log.change_type)}
                            <span className={`font-semibold ${log.quantity_change > 0 ? "text-green-600" : "text-red-600"}`}>
                              {log.quantity_change > 0 ? "+" : ""}{log.quantity_change}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {log.quantity_before} → {log.quantity_after} units
                          </p>
                          {log.notes && (
                            <p className="text-sm mt-2">{log.notes}</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-2">
                            By {log.created_by} • {new Date(log.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
