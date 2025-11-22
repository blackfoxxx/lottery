import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Plus, Edit2, Trash2, Trophy } from "lucide-react";
import { toast } from "sonner";

interface LotteryCategory {
  id: number;
  name: string;
  prize: string;
  color: string;
  icon: string;
  draw_date: string;
  status: "active" | "completed" | "scheduled";
  total_tickets: number;
}

export default function LotteryCategories() {
  const [categories, setCategories] = useState<LotteryCategory[]>([
    {
      id: 1,
      name: "Golden Draw",
      prize: "$10,000 Grand Prize",
      color: "#FFD700",
      icon: "🏆",
      draw_date: "2025-12-31T23:59:59",
      status: "active",
      total_tickets: 15420,
    },
    {
      id: 2,
      name: "Silver Draw",
      prize: "$5,000 Cash Prize",
      color: "#C0C0C0",
      icon: "🥈",
      draw_date: "2025-12-25T20:00:00",
      status: "active",
      total_tickets: 8930,
    },
    {
      id: 3,
      name: "Bronze Draw",
      prize: "$1,000 Shopping Voucher",
      color: "#CD7F32",
      icon: "🥉",
      draw_date: "2025-12-20T18:00:00",
      status: "active",
      total_tickets: 5240,
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<LotteryCategory | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    prize: "",
    color: "#FFD700",
    icon: "🏆",
    draw_date: "",
  });

  function handleCreate() {
    setEditingCategory(null);
    setFormData({
      name: "",
      prize: "",
      color: "#FFD700",
      icon: "🏆",
      draw_date: "",
    });
    setIsDialogOpen(true);
  }

  function handleEdit(category: LotteryCategory) {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      prize: category.prize,
      color: category.color,
      icon: category.icon,
      draw_date: category.draw_date,
    });
    setIsDialogOpen(true);
  }

  function handleDelete(id: number) {
    if (confirm("Are you sure you want to delete this lottery category?")) {
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      toast.success("Lottery category deleted successfully");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (editingCategory) {
      // Update existing category
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === editingCategory.id
            ? { ...cat, ...formData }
            : cat
        )
      );
      toast.success("Lottery category updated successfully");
    } else {
      // Create new category
      const newCategory: LotteryCategory = {
        id: Date.now(),
        ...formData,
        status: "scheduled",
        total_tickets: 0,
      };
      setCategories((prev) => [...prev, newCategory]);
      toast.success("Lottery category created successfully");
    }

    setIsDialogOpen(false);
  }

  function getStatusBadge(status: string) {
    const styles = {
      active: "bg-green-500/20 text-green-400 border-green-500/30",
      completed: "bg-gray-500/20 text-gray-400 border-gray-500/30",
      scheduled: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    };
    return styles[status as keyof typeof styles] || styles.scheduled;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Lottery Categories</h1>
            <p className="text-muted-foreground">
              Manage lottery draws and prize categories
            </p>
          </div>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        </div>

        {/* Categories Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card key={category.id} className="border-border">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{category.icon}</span>
                    <div>
                      <CardTitle className="text-lg" style={{ color: category.color }}>
                        {category.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{category.prize}</p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full border px-2 py-1 text-xs font-semibold uppercase ${getStatusBadge(
                      category.status
                    )}`}
                  >
                    {category.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Draw Date</p>
                  <p className="text-sm font-medium">
                    {new Date(category.draw_date).toLocaleString()}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Total Tickets Issued</p>
                  <p className="text-sm font-medium">
                    {category.total_tickets.toLocaleString()}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Color Code</p>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-6 w-6 rounded border border-border"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-xs font-mono">{category.color}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2"
                    onClick={() => handleEdit(category)}
                  >
                    <Edit2 className="h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(category.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Edit Lottery Category" : "Create Lottery Category"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category Name</label>
                <input
                  type="text"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="e.g., Golden Draw"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Prize Description</label>
                <input
                  type="text"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="e.g., $10,000 Grand Prize"
                  value={formData.prize}
                  onChange={(e) => setFormData({ ...formData, prize: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Color</label>
                  <input
                    type="color"
                    className="h-10 w-full rounded-md border border-input"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Icon (Emoji)</label>
                  <input
                    type="text"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="🏆"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    maxLength={2}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Draw Date & Time</label>
                <input
                  type="datetime-local"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.draw_date}
                  onChange={(e) => setFormData({ ...formData, draw_date: e.target.value })}
                  required
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingCategory ? "Update Category" : "Create Category"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
