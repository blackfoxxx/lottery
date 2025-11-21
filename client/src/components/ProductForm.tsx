import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product, Category } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
  categories: Category[];
  onSuccess: () => void;
}

export default function ProductForm({ open, onOpenChange, product, categories, onSuccess }: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    name_ar: "",
    description: "",
    description_ar: "",
    sku: "",
    price: "",
    original_price: "",
    stock_quantity: "",
    category_id: "",
    lottery_tickets: "",
    lottery_category: "bronze",
    status: "active",
    image_url: "",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        name_ar: product.name_ar || "",
        description: product.description || "",
        description_ar: product.description_ar || "",
        sku: product.sku,
        price: product.price.toString(),
        original_price: product.original_price?.toString() || "",
        stock_quantity: product.stock_quantity.toString(),
        category_id: product.category_id.toString(),
        lottery_tickets: product.lottery_tickets.toString(),
        lottery_category: product.lottery_category || "bronze",
        status: product.status,
        image_url: product.images?.[0] || "",
      });
      setImagePreview(product.images?.[0] || "");
    } else {
      // Generate SKU for new products
      const sku = `PRD-${Date.now().toString().slice(-8)}`;
      setFormData(prev => ({ ...prev, sku }));
    }
  }, [product]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const url = e.target.value;
    setFormData({ ...formData, image_url: url });
    setImagePreview(url);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.stock_quantity || !formData.category_id) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(product ? "Product updated successfully!" : "Product created successfully!");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add New Product"}</DialogTitle>
          <DialogDescription>
            {product ? "Update product information" : "Create a new product for your store"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image */}
          <div>
            <Label htmlFor="image_url">Product Image URL</Label>
            <div className="flex gap-2">
              <Input
                id="image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleImageChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            {imagePreview && (
              <div className="mt-2 relative w-32 h-32 rounded-md overflow-hidden bg-muted">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, image_url: "" });
                    setImagePreview("");
                  }}
                  className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <Label htmlFor="name">Product Name (English) *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="iPhone 15 Pro Max"
                required
              />
            </div>

            {/* Name Arabic */}
            <div>
              <Label htmlFor="name_ar">Product Name (Arabic)</Label>
              <Input
                id="name_ar"
                name="name_ar"
                value={formData.name_ar}
                onChange={handleInputChange}
                placeholder="آيفون 15 برو ماكس"
                dir="rtl"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description (English)</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Product description..."
              rows={3}
            />
          </div>

          {/* Description Arabic */}
          <div>
            <Label htmlFor="description_ar">Description (Arabic)</Label>
            <Textarea
              id="description_ar"
              name="description_ar"
              value={formData.description_ar}
              onChange={handleInputChange}
              placeholder="وصف المنتج..."
              rows={3}
              dir="rtl"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* SKU */}
            <div>
              <Label htmlFor="sku">SKU *</Label>
              <Input
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                placeholder="PRD-12345678"
                required
                disabled={!!product}
              />
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="category_id">Category *</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => setFormData({ ...formData, category_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Price */}
            <div>
              <Label htmlFor="price">Price (USD) *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="99.99"
                required
              />
            </div>

            {/* Original Price */}
            <div>
              <Label htmlFor="original_price">Original Price</Label>
              <Input
                id="original_price"
                name="original_price"
                type="number"
                step="0.01"
                value={formData.original_price}
                onChange={handleInputChange}
                placeholder="129.99"
              />
            </div>

            {/* Stock */}
            <div>
              <Label htmlFor="stock_quantity">Stock Quantity *</Label>
              <Input
                id="stock_quantity"
                name="stock_quantity"
                type="number"
                value={formData.stock_quantity}
                onChange={handleInputChange}
                placeholder="100"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Lottery Tickets */}
            <div>
              <Label htmlFor="lottery_tickets">Lottery Tickets</Label>
              <Input
                id="lottery_tickets"
                name="lottery_tickets"
                type="number"
                value={formData.lottery_tickets}
                onChange={handleInputChange}
                placeholder="0"
              />
            </div>

            {/* Lottery Category */}
            <div>
              <Label htmlFor="lottery_category">Lottery Category</Label>
              <Select
                value={formData.lottery_category}
                onValueChange={(value) => setFormData({ ...formData, lottery_category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bronze">Bronze</SelectItem>
                  <SelectItem value="silver">Silver</SelectItem>
                  <SelectItem value="golden">Golden</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status */}
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                product ? "Update Product" : "Create Product"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
