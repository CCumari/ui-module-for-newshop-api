import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, DollarSign, Package, Tag } from 'lucide-react';

export interface ProductFilters {
  search: string;
  minPrice: number;
  maxPrice: number;
  inStock: boolean;
  categories: string[];
}

interface ProductFiltersProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  onReset: () => void;
  availableCategories?: string[];
  priceRange?: { min: number; max: number };
}

export const ProductFiltersComponent = ({
  filters,
  onFiltersChange,
  onReset,
  availableCategories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports'],
  priceRange = { min: 0, max: 50000 } // in cents
}: ProductFiltersProps) => {
  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(2)}`;
  };

  const handleSearchChange = (search: string) => {
    onFiltersChange({ ...filters, search });
  };

  const handleStockFilterChange = (inStock: boolean) => {
    onFiltersChange({ ...filters, inStock });
  };

  const handleCategoryToggle = (category: string) => {
    const updatedCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    
    onFiltersChange({ ...filters, categories: updatedCategories });
  };

  const hasActiveFilters = 
    filters.search !== '' ||
    filters.minPrice !== priceRange.min ||
    filters.maxPrice !== priceRange.max ||
    filters.inStock ||
    filters.categories.length > 0;

  return (
    <>
      <Card>
        <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Filter */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search Products
          </Label>
          <Input
            type="text"
            placeholder="Search by name or description..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full"
          />
        </div>

        <Separator />

        {/* Price Range Filter */}
        <div className="space-y-4">
          <Label className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Price Range
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Min Price</Label>
              <Input
                type="number"
                placeholder="0"
                value={filters.minPrice / 100}
                onChange={(e) => {
                  const value = Math.max(0, Number(e.target.value) * 100);
                  onFiltersChange({ ...filters, minPrice: value });
                }}
                className="w-full"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Max Price</Label>
              <Input
                type="number"
                placeholder="500"
                value={filters.maxPrice / 100}
                onChange={(e) => {
                  const value = Math.max(0, Number(e.target.value) * 100);
                  onFiltersChange({ ...filters, maxPrice: value });
                }}
                className="w-full"
              />
            </div>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatPrice(filters.minPrice)}</span>
            <span>{formatPrice(filters.maxPrice)}</span>
          </div>
        </div>

        <Separator />

        {/* Stock Filter */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Availability
          </Label>
          <Button
            variant={filters.inStock ? "default" : "outline"}
            size="sm"
            onClick={() => handleStockFilterChange(!filters.inStock)}
            className="w-full justify-start"
          >
            <Package className="h-4 w-4 mr-2" />
            {filters.inStock ? 'In Stock Only' : 'Show All Items'}
          </Button>
        </div>

        <Separator />

        {/* Categories Filter */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Categories
          </Label>
          <div className="grid grid-cols-1 gap-2">
            {availableCategories.map((category) => (
              <Button
                key={category}
                variant={filters.categories.includes(category) ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryToggle(category)}
                className="w-full justify-start"
              >
                <Tag className="h-4 w-4 mr-2" />
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <>
            <Separator />
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Active Filters:</Label>
              <div className="flex flex-wrap gap-2">
                {filters.search && (
                  <Badge variant="secondary" className="text-xs">
                    Search: {filters.search}
                  </Badge>
                )}
                {(filters.minPrice !== priceRange.min || filters.maxPrice !== priceRange.max) && (
                  <Badge variant="secondary" className="text-xs">
                    Price: {formatPrice(filters.minPrice)} - {formatPrice(filters.maxPrice)}
                  </Badge>
                )}
                {filters.inStock && (
                  <Badge variant="secondary" className="text-xs">
                    In Stock
                  </Badge>
                )}
                {filters.categories.map(category => (
                  <Badge key={category} variant="secondary" className="text-xs">
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
    </>
  );
};
