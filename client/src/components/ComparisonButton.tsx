import { GitCompare } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useComparison } from "@/contexts/ComparisonContext";
import { Product } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ComparisonButtonProps {
  product: Product;
  className?: string;
}

export default function ComparisonButton({
  product,
  className,
}: ComparisonButtonProps) {
  const { isInComparison, toggleComparison, comparison } = useComparison();
  const inComparison = isInComparison(product.id);

  function handleChange() {
    if (!inComparison && comparison.length >= 4) {
      toast.error("You can only compare up to 4 products");
      return;
    }
    
    toggleComparison(product);
    
    if (inComparison) {
      toast.success("Removed from comparison");
    } else {
      toast.success("Added to comparison");
    }
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Checkbox
        id={`compare-${product.id}`}
        checked={inComparison}
        onCheckedChange={handleChange}
      />
      <Label
        htmlFor={`compare-${product.id}`}
        className="text-sm cursor-pointer flex items-center gap-1"
      >
        <GitCompare className="h-3 w-3" />
        Compare
      </Label>
    </div>
  );
}
