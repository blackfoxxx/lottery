import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import ProductFilters from "./ProductFilters";

interface MobileFiltersDrawerProps {
  filters: any;
  onFiltersChange: (filters: any) => void;
  availableBrands: string[];
  maxPrice: number;
}

export default function MobileFiltersDrawer({ filters, onFiltersChange, availableBrands, maxPrice }: MobileFiltersDrawerProps) {
  return (
    <div className="lg:hidden mb-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters & Sort
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <ProductFilters
              filters={filters}
              onFiltersChange={onFiltersChange}
              availableBrands={availableBrands}
              maxPrice={maxPrice}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
