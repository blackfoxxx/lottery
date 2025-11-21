import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/WishlistContext";
import { Product } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  product: Product;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "outline" | "ghost" | "secondary";
  className?: string;
}

export default function WishlistButton({
  product,
  size = "icon",
  variant = "secondary",
  className,
}: WishlistButtonProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    
    if (inWishlist) {
      toast.success(`Removed from wishlist`);
    } else {
      toast.success(`Added to wishlist`);
    }
  }

  return (
    <Button
      size={size}
      variant={variant}
      className={cn(className)}
      onClick={handleClick}
      title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-all",
          inWishlist && "fill-red-500 text-red-500"
        )}
      />
    </Button>
  );
}
