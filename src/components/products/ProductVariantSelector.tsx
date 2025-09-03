import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Check, Info, AlertCircle } from 'lucide-react';

interface ProductVariant {
  id: number;
  name: string;
  value: string;
  price_modifier: number;
  stock_quantity: number;
}

interface VariantGroup {
  name: string;
  variants: ProductVariant[];
}

interface ProductVariantSelectorProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant | null;
  onVariantChange: (variant: ProductVariant) => void;
  basePrice: number;
}

export const ProductVariantSelector = ({ 
  variants, 
  selectedVariant, 
  onVariantChange, 
  basePrice 
}: ProductVariantSelectorProps) => {
  // Group variants by their name (e.g., "Storage", "Color", etc.)
  const variantGroups: VariantGroup[] = variants.reduce((groups: VariantGroup[], variant) => {
    const existingGroup = groups.find(group => group.name === variant.name);
    if (existingGroup) {
      existingGroup.variants.push(variant);
    } else {
      groups.push({
        name: variant.name,
        variants: [variant]
      });
    }
    return groups;
  }, []);

  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(2)}`;
  };

  const getCurrentPrice = () => {
    const modifier = selectedVariant?.price_modifier || 0;
    return basePrice + modifier;
  };

  if (variants.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          Product Options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Variant Groups */}
        {variantGroups.map((group) => (
          <div key={group.name} className="space-y-3">
            <Label className="text-base font-medium">{group.name}</Label>
            
            {group.variants.length <= 3 ? (
              // Button style for few options
              <div className="grid grid-cols-1 gap-2">
                {group.variants.map((variant) => (
                  <Button
                    key={variant.id}
                    variant={selectedVariant?.id === variant.id ? 'default' : 'outline'}
                    onClick={() => onVariantChange(variant)}
                    disabled={variant.stock_quantity === 0}
                    className="justify-between h-auto p-4"
                  >
                    <div className="flex items-center gap-2">
                      {selectedVariant?.id === variant.id && (
                        <Check className="h-4 w-4" />
                      )}
                      <span className="font-medium">{variant.value}</span>
                      {variant.stock_quantity === 0 && (
                        <Badge variant="destructive" className="text-xs">
                          Out of Stock
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {variant.price_modifier !== 0 && (
                        <span className="text-sm">
                          {variant.price_modifier > 0 ? '+' : ''}{formatPrice(variant.price_modifier)}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {variant.stock_quantity} left
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
            ) : (
              // Dropdown style for many options
              <Select
                value={selectedVariant?.id.toString()}
                onValueChange={(value) => {
                  const variant = group.variants.find(v => v.id.toString() === value);
                  if (variant) onVariantChange(variant);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Choose ${group.name.toLowerCase()}...`} />
                </SelectTrigger>
                <SelectContent>
                  {group.variants.map((variant) => (
                    <SelectItem 
                      key={variant.id} 
                      value={variant.id.toString()}
                      disabled={variant.stock_quantity === 0}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span>{variant.value}</span>
                        <div className="flex items-center gap-2 ml-4">
                          {variant.price_modifier !== 0 && (
                            <span className="text-sm">
                              {variant.price_modifier > 0 ? '+' : ''}{formatPrice(variant.price_modifier)}
                            </span>
                          )}
                          <Badge 
                            variant={variant.stock_quantity > 0 ? "secondary" : "destructive"}
                            className="text-xs"
                          >
                            {variant.stock_quantity > 0 ? `${variant.stock_quantity} left` : 'Out of Stock'}
                          </Badge>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        ))}

        <Separator />

        {/* Price Summary */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Base Price:</span>
            <span className="text-sm">{formatPrice(basePrice)}</span>
          </div>
          
          {selectedVariant && selectedVariant.price_modifier !== 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {selectedVariant.name} ({selectedVariant.value}):
              </span>
              <span className="text-sm">
                {selectedVariant.price_modifier > 0 ? '+' : ''}{formatPrice(selectedVariant.price_modifier)}
              </span>
            </div>
          )}
          
          <Separator />
          
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total Price:</span>
            <span>{formatPrice(getCurrentPrice())}</span>
          </div>
        </div>

        {/* Stock Warning */}
        {selectedVariant && selectedVariant.stock_quantity <= 5 && selectedVariant.stock_quantity > 0 && (
          <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-yellow-700">
              Only {selectedVariant.stock_quantity} left in stock!
            </span>
          </div>
        )}

        {selectedVariant && selectedVariant.stock_quantity === 0 && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-sm text-red-700">
              This variant is currently out of stock.
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
