import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GitCompare } from "lucide-react";
import { Product } from "@/lib/api";
import { toast } from "sonner";

interface CompareButtonProps {
  product: Product;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export default function CompareButton({ product, variant = "outline", size = "sm" }: CompareButtonProps) {
  const [isInComparison, setIsInComparison] = useState(false);

  useEffect(() => {
    checkIfInComparison();
  }, [product.id]);

  function checkIfInComparison() {
    const stored = localStorage.getItem("compareProducts");
    if (stored) {
      const compareProducts: Product[] = JSON.parse(stored);
      setIsInComparison(compareProducts.some(p => p.id === product.id));
    }
  }

  function toggleCompare(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    const stored = localStorage.getItem("compareProducts");
    let compareProducts: Product[] = stored ? JSON.parse(stored) : [];

    if (isInComparison) {
      // Remove from comparison
      compareProducts = compareProducts.filter(p => p.id !== product.id);
      localStorage.setItem("compareProducts", JSON.stringify(compareProducts));
      setIsInComparison(false);
      toast.success("Removed from comparison");
    } else {
      // Add to comparison
      if (compareProducts.length >= 4) {
        toast.error("You can compare up to 4 products at a time");
        return;
      }
      compareProducts.push(product);
      localStorage.setItem("compareProducts", JSON.stringify(compareProducts));
      setIsInComparison(true);
      toast.success("Added to comparison");
    }

    // Dispatch event to update comparison badge
    window.dispatchEvent(new Event("compareUpdated"));
  }

  return (
    <Button
      variant={isInComparison ? "default" : variant}
      size={size}
      onClick={toggleCompare}
      className={isInComparison ? "bg-blue-600 hover:bg-blue-700" : ""}
    >
      <GitCompare className="h-4 w-4 mr-2" />
      {isInComparison ? "In Comparison" : "Compare"}
    </Button>
  );
}
