import { Package, Smartphone, Shirt, Home, Utensils, BookOpen, Dumbbell, Gamepad2 } from "lucide-react";

interface ProductImagePlaceholderProps {
  category?: string;
  alt?: string;
  className?: string;
}

const categoryIcons: Record<string, React.ComponentType<any>> = {
  electronics: Smartphone,
  clothing: Shirt,
  home: Home,
  food: Utensils,
  books: BookOpen,
  sports: Dumbbell,
  gaming: Gamepad2,
  default: Package,
};

export default function ProductImagePlaceholder({ 
  category = "default", 
  alt = "Product", 
  className = "" 
}: ProductImagePlaceholderProps) {
  const IconComponent = categoryIcons[category.toLowerCase()] || categoryIcons.default;
  
  return (
    <div className={`flex items-center justify-center bg-muted ${className}`}>
      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
        <IconComponent className="w-16 h-16" />
        <span className="text-sm font-medium">{alt}</span>
      </div>
    </div>
  );
}
