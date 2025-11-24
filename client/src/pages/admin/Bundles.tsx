import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Package, Plus, Edit, Trash2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Product } from "@/lib/api";

interface Bundle {
  id: number;
  name: string;
  description: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  is_active: boolean;
  products: any[];
  total_price: number;
  discounted_price: number;
}

export default function AdminBundles() {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingBundle, setEditingBundle] = useState<Bundle | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      const [bundlesRes, productsRes] = await Promise.all([
        fetch("http://localhost:8000/api/v1/bundles", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:8000/api/v1/products"),
      ]);

      if (bundlesRes.ok) {
        const bundlesData = await bundlesRes.json();
        setBundles(bundlesData);
      }

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        if (productsData.data?.data) {
          setProducts(productsData.data.data);
        }
      }
    } catch (error) {
      console.error("Failed to load data:", error);
      toast.error("Failed to load bundles");
    } finally {
      setLoading(false);
    }
  };

  const openCreateForm = () => {
    resetForm();
    setEditingBundle(null);
    setFormOpen(true);
  };

  const openEditForm = (bundle: Bundle) => {
    setName(bundle.name);
    setDescription(bundle.description);
    setDiscountType(bundle.discount_type);
    setDiscountValue(bundle.discount_value.toString());
    setSelectedProductIds(bundle.products.map((p) => p.id));
    setIsActive(bundle.is_active);
    setEditingBundle(bundle);
    setFormOpen(true);
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setDiscountType("percentage");
    setDiscountValue("");
    setSelectedProductIds([]);
    setIsActive(true);
  };

  const handleSubmit = async () => {
    if (!name || !description || !discountValue || selectedProductIds.length < 2) {
      toast.error("Please fill all fields and select at least 2 products");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("auth_token");
      const url = editingBundle
        ? `http://localhost:8000/api/v1/bundles/${editingBundle.id}`
        : "http://localhost:8000/api/v1/bundles";

      const response = await fetch(url, {
        method: editingBundle ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          description,
          discount_type: discountType,
          discount_value: parseFloat(discountValue),
          product_ids: selectedProductIds,
          is_active: isActive,
        }),
      });

      if (response.ok) {
        toast.success(
          editingBundle ? "Bundle updated successfully" : "Bundle created successfully"
        );
        setFormOpen(false);
        loadData();
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to save bundle");
      }
    } catch (error) {
      console.error("Failed to save bundle:", error);
      toast.error("Failed to save bundle");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (bundleId: number) => {
    if (!confirm("Are you sure you want to delete this bundle?")) return;

    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`http://localhost:8000/api/v1/bundles/${bundleId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast.success("Bundle deleted successfully");
        loadData();
      } else {
        toast.error("Failed to delete bundle");
      }
    } catch (error) {
      console.error("Failed to delete bundle:", error);
      toast.error("Failed to delete bundle");
    }
  };

  const toggleProductSelection = (productId: number) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Product Bundles</h1>
            <p className="text-muted-foreground">
              Create and manage product bundles with automatic discounts
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={loadData} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={openCreateForm}>
              <Plus className="w-4 h-4 mr-2" />
              Create Bundle
            </Button>
          </div>
        </div>

        {/* Bundles Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Bundles ({bundles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : bundles.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No bundles created yet</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Total Price</TableHead>
                    <TableHead>Discounted Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bundles.map((bundle) => (
                    <TableRow key={bundle.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{bundle.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {bundle.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{bundle.products.length} products</TableCell>
                      <TableCell>
                        {bundle.discount_type === "percentage"
                          ? `${bundle.discount_value}%`
                          : `$${bundle.discount_value}`}
                      </TableCell>
                      <TableCell>${bundle.total_price.toFixed(2)}</TableCell>
                      <TableCell className="font-semibold text-green-600">
                        ${bundle.discounted_price.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {bundle.is_active ? (
                          <Badge className="bg-green-500">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditForm(bundle)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(bundle.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Create/Edit Bundle Dialog */}
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingBundle ? "Edit Bundle" : "Create New Bundle"}
              </DialogTitle>
              <DialogDescription>
                Bundle multiple products together with automatic discounts
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Bundle Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Bundle Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Summer Essentials Pack"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what's included in this bundle..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Discount Configuration */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discount-type">Discount Type</Label>
                  <Select value={discountType} onValueChange={(value: any) => setDiscountType(value)}>
                    <SelectTrigger id="discount-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discount-value">Discount Value</Label>
                  <Input
                    id="discount-value"
                    type="number"
                    placeholder={discountType === "percentage" ? "e.g., 15" : "e.g., 25"}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                  />
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is-active"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4"
                />
                <Label htmlFor="is-active" className="cursor-pointer">
                  Active (visible to customers)
                </Label>
              </div>

              {/* Product Selection */}
              <div className="space-y-2">
                <Label>Select Products (minimum 2)</Label>
                <div className="border rounded-lg p-4 max-h-64 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-2">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                          selectedProductIds.includes(product.id)
                            ? "bg-primary/10 border-primary"
                            : "hover:bg-muted"
                        }`}
                        onClick={() => toggleProductSelection(product.id)}
                      >
                        <input
                          type="checkbox"
                          checked={selectedProductIds.includes(product.id)}
                          onChange={() => {}}
                          className="w-4 h-4"
                        />
                        {product.images && product.images.length > 0 && (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{product.name}</p>
                          <p className="text-xs text-muted-foreground">${product.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Selected: {selectedProductIds.length} products
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setFormOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={submitting}>
                  {submitting
                    ? "Saving..."
                    : editingBundle
                    ? "Update Bundle"
                    : "Create Bundle"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
