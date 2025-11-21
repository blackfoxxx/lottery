import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, SlidersHorizontal } from "lucide-react";

export interface FilterState {
  priceRange: [number, number];
  brands: string[];
  minRating: number;
  inStockOnly: boolean;
  sortBy: string;
}

interface ProductFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  availableBrands: string[];
  maxPrice: number;
}

export default function ProductFilters({
  filters,
  onFiltersChange,
  availableBrands,
  maxPrice,
}: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(true);

  function updateFilter(key: keyof FilterState, value: any) {
    onFiltersChange({ ...filters, [key]: value });
  }

  function toggleBrand(brand: string) {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    updateFilter("brands", newBrands);
  }

  function clearFilters() {
    onFiltersChange({
      priceRange: [0, maxPrice],
      brands: [],
      minRating: 0,
      inStockOnly: false,
      sortBy: "featured",
    });
  }

  const hasActiveFilters =
    filters.brands.length > 0 ||
    filters.minRating > 0 ||
    filters.inStockOnly ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < maxPrice;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5" />
          Filters
        </h2>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden"
          >
            {isOpen ? "Hide" : "Show"}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className={`space-y-4 ${!isOpen && "hidden md:block"}`}>
        {/* Sort By */}
        <Card className="p-4">
          <Label className="text-sm font-semibold mb-3 block">Sort By</Label>
          <Select
            value={filters.sortBy}
            onValueChange={(value) => updateFilter("sortBy", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>
        </Card>

        {/* Price Range */}
        <Card className="p-4">
          <Label className="text-sm font-semibold mb-3 block">
            Price Range
          </Label>
          <div className="space-y-4">
            <Slider
              min={0}
              max={maxPrice}
              step={10}
              value={filters.priceRange}
              onValueChange={(value) => updateFilter("priceRange", value as [number, number])}
              className="w-full"
            />
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">${filters.priceRange[0]}</span>
              <span className="text-muted-foreground">to</span>
              <span className="font-medium">${filters.priceRange[1]}</span>
            </div>
          </div>
        </Card>

        {/* Brands */}
        {availableBrands.length > 0 && (
          <Card className="p-4">
            <Label className="text-sm font-semibold mb-3 block">Brands</Label>
            <div className="space-y-3">
              {availableBrands.map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand}`}
                    checked={filters.brands.includes(brand)}
                    onCheckedChange={() => toggleBrand(brand)}
                  />
                  <Label
                    htmlFor={`brand-${brand}`}
                    className="text-sm cursor-pointer flex-1"
                  >
                    {brand}
                  </Label>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Rating */}
        <Card className="p-4">
          <Label className="text-sm font-semibold mb-3 block">
            Minimum Rating
          </Label>
          <div className="space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <Checkbox
                  id={`rating-${rating}`}
                  checked={filters.minRating === rating}
                  onCheckedChange={(checked) =>
                    updateFilter("minRating", checked ? rating : 0)
                  }
                />
                <Label
                  htmlFor={`rating-${rating}`}
                  className="text-sm cursor-pointer flex items-center gap-1"
                >
                  {rating}+ ⭐
                </Label>
              </div>
            ))}
          </div>
        </Card>

        {/* Availability */}
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="in-stock"
              checked={filters.inStockOnly}
              onCheckedChange={(checked) =>
                updateFilter("inStockOnly", checked as boolean)
              }
            />
            <Label htmlFor="in-stock" className="text-sm cursor-pointer">
              In Stock Only
            </Label>
          </div>
        </Card>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <Card className="p-4 bg-primary/5">
            <div className="flex flex-wrap gap-2">
              {filters.brands.map((brand) => (
                <Badge key={brand} variant="secondary" className="gap-1">
                  {brand}
                  <button
                    onClick={() => toggleBrand(brand)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {filters.minRating > 0 && (
                <Badge variant="secondary" className="gap-1">
                  {filters.minRating}+ Stars
                  <button
                    onClick={() => updateFilter("minRating", 0)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.inStockOnly && (
                <Badge variant="secondary" className="gap-1">
                  In Stock
                  <button
                    onClick={() => updateFilter("inStockOnly", false)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
