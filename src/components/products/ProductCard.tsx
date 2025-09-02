import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  in_stock: boolean;
  category?: {
    id: number;
    name: string;
  };
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (productId: number) => void;
  onProductClick?: (productId: number) => void;
  inWishlist?: boolean;
}

export const ProductCard = ({ product, onAddToCart, onToggleWishlist, onProductClick, inWishlist }: ProductCardProps) => {
  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(2)}`;
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div 
        className="aspect-square bg-gray-100 relative cursor-pointer"
        onClick={() => onProductClick?.(product.id)}
      >
        <img
          src="/assets/images/default.svg"
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {!product.in_stock && (
          <Badge className="absolute top-2 left-2" variant="destructive">
            Out of Stock
          </Badge>
        )}
        <Button
          size="sm"
          variant="ghost"
          className="absolute top-2 right-2 p-2"
          onClick={() => onToggleWishlist?.(product.id)}
        >
          <Heart className={`h-4 w-4 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
        </Button>
      </div>
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 
            className="font-medium line-clamp-2 cursor-pointer hover:text-primary"
            onClick={() => onProductClick?.(product.id)}
          >
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold">{formatPrice(product.price)}</span>
              {product.category && (
                <Badge variant="secondary" className="ml-2">
                  {product.category.name}
                </Badge>
              )}
            </div>
            <Button
              size="sm"
              onClick={() => onAddToCart?.(product)}
              disabled={!product.in_stock}
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
