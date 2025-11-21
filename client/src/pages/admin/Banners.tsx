import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface Banner {
  id: number;
  title: string;
  description: string;
  image_url: string;
  link_url: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  position: number;
}

export default function Banners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    link_url: "",
    start_date: "",
    end_date: "",
    position: 1,
  });

  useEffect(() => {
    loadBanners();
  }, []);

  function loadBanners() {
    // Mock data - replace with API call
    const mockBanners: Banner[] = [
      {
        id: 1,
        title: "Summer Sale 2025",
        description: "Up to 50% off on selected items",
        image_url: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=400&fit=crop",
        link_url: "/products?category=sale",
        start_date: "2025-06-01",
        end_date: "2025-08-31",
        is_active: true,
        position: 1,
      },
      {
        id: 2,
        title: "New Arrivals",
        description: "Check out our latest products",
        image_url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop",
        link_url: "/products?sort=newest",
        start_date: "2025-01-01",
        end_date: "2025-12-31",
        is_active: true,
        position: 2,
      },
    ];
    setBanners(mockBanners);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (editingBanner) {
      // Update existing banner
      setBanners(
        banners.map((banner) =>
          banner.id === editingBanner.id
            ? { ...banner, ...formData, is_active: banner.is_active }
            : banner
        )
      );
      toast.success("Banner updated successfully");
    } else {
      // Create new banner
      const newBanner: Banner = {
        id: Date.now(),
        ...formData,
        is_active: true,
      };
      setBanners([...banners, newBanner]);
      toast.success("Banner created successfully");
    }

    resetForm();
    setIsDialogOpen(false);
  }

  function handleEdit(banner: Banner) {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      description: banner.description,
      image_url: banner.image_url,
      link_url: banner.link_url,
      start_date: banner.start_date,
      end_date: banner.end_date,
      position: banner.position,
    });
    setIsDialogOpen(true);
  }

  function handleDelete(id: number) {
    if (confirm("Are you sure you want to delete this banner?")) {
      setBanners(banners.filter((banner) => banner.id !== id));
      toast.success("Banner deleted successfully");
    }
  }

  function toggleActive(id: number) {
    setBanners(
      banners.map((banner) =>
        banner.id === id ? { ...banner, is_active: !banner.is_active } : banner
      )
    );
    toast.success("Banner status updated");
  }

  function resetForm() {
    setFormData({
      title: "",
      description: "",
      image_url: "",
      link_url: "",
      start_date: "",
      end_date: "",
      position: 1,
    });
    setEditingBanner(null);
  }

  function handleDialogClose() {
    setIsDialogOpen(false);
    resetForm();
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Promotional Banners</h1>
            <p className="text-muted-foreground">
              Manage homepage banners and promotional content
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Banner
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingBanner ? "Edit Banner" : "Create New Banner"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    type="url"
                    value={formData.image_url}
                    onChange={(e) =>
                      setFormData({ ...formData, image_url: e.target.value })
                    }
                    placeholder="https://example.com/banner.jpg"
                    required
                  />
                  {formData.image_url && (
                    <div className="mt-2 rounded-lg overflow-hidden">
                      <img
                        src={formData.image_url}
                        alt="Banner preview"
                        className="w-full h-32 object-cover"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="link_url">Link URL</Label>
                  <Input
                    id="link_url"
                    type="url"
                    value={formData.link_url}
                    onChange={(e) =>
                      setFormData({ ...formData, link_url: e.target.value })
                    }
                    placeholder="/products"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) =>
                        setFormData({ ...formData, start_date: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="end_date">End Date</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) =>
                        setFormData({ ...formData, end_date: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="position">Position (Order)</Label>
                  <Input
                    id="position"
                    type="number"
                    min="1"
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        position: parseInt(e.target.value),
                      })
                    }
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editingBanner ? "Update Banner" : "Create Banner"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDialogClose}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Banners</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Preview</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {banners.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No banners found. Create your first banner to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  banners
                    .sort((a, b) => a.position - b.position)
                    .map((banner) => (
                      <TableRow key={banner.id}>
                        <TableCell>
                          <img
                            src={banner.image_url}
                            alt={banner.title}
                            className="w-24 h-12 object-cover rounded"
                          />
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{banner.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {banner.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{new Date(banner.start_date).toLocaleDateString()}</div>
                            <div className="text-muted-foreground">
                              to {new Date(banner.end_date).toLocaleDateString()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{banner.position}</TableCell>
                        <TableCell>
                          <Badge variant={banner.is_active ? "default" : "secondary"}>
                            {banner.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleActive(banner.id)}
                              title={banner.is_active ? "Deactivate" : "Activate"}
                            >
                              {banner.is_active ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(banner)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(banner.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
