import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Heart, ShoppingCart, ArrowLeft, Package } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

interface ProductVariant {
  id: number;
  name: string;
  value: string;
  price_modifier: number;
  stock_quantity: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  stock_quantity: number;
  sku: string;
  in_stock: boolean;
  category: {
    id: number;
    name: string;
  };
  product_variants: ProductVariant[];
}

interface ProductDetailsProps {
  productId: number;
  onBack: () => void;
}

export const ProductDetails = ({ productId, onBack }: ProductDetailsProps) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [inWishlist, setInWishlist] = useState(false);

  const { isAuthenticated, user } = useAuth();
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    loadProduct();
    if (isAuthenticated) {
      checkWishlistStatus();
    }
  }, [productId, isAuthenticated]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getProduct(productId);
      setProduct(data);
      if (data.product_variants && data.product_variants.length > 0) {
        setSelectedVariant(data.product_variants[0]);
      }
    } catch (error: any) {
      toast({
        title: 'Error loading product',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const checkWishlistStatus = async () => {
    if (!user?.id) return;
    try {
      const wishlist = await apiClient.getWishlist(user.id);
      const isInList = wishlist.some((item: any) => item.product_id === productId);
      setInWishlist(isInList);
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      toast({
        title: 'Please sign in',
        description: 'You need to sign in to manage wishlist',
      });
      return;
    }

    try {
      const result = await apiClient.toggleWishlist(productId);
      setInWishlist(!inWishlist);
      toast({
        description: result.message,
      });
    } catch (error: any) {
      toast({
        title: 'Error updating wishlist',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleAddToCart = async () => {
    await addToCart(productId, quantity);
  };

  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(2)}`;
  };

  const getCurrentPrice = () => {
    if (!product) return 0;
    const basePrice = product.price;
    const variantModifier = selectedVariant?.price_modifier || 0;
    return basePrice + variantModifier;
  };

  const getAvailableStock = () => {
    if (selectedVariant) {
      return selectedVariant.stock_quantity;
    }
    return product?.stock_quantity || 0;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={onBack} className="p-0">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={onBack} className="p-0">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">Product not found</h3>
            <p className="text-muted-foreground">The product you're looking for doesn't exist.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="p-0">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Products
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <Card className="overflow-hidden">
          <div className="aspect-square bg-gray-100 relative">
            <img
              src="/assets/images/default.svg"
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {!product.in_stock && (
              <Badge className="absolute top-4 left-4" variant="destructive">
                Out of Stock
              </Badge>
            )}
          </div>
        </Card>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleWishlist}
                className="p-2"
              >
                <Heart className={`h-5 w-5 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <span className="text-2xl font-bold text-primary">
                {formatPrice(getCurrentPrice())}
              </span>
              {product.category && (
                <Badge variant="secondary">{product.category.name}</Badge>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed mb-4">
              {product.description}
            </p>

            <div className="text-sm text-muted-foreground space-y-1">
              <p>SKU: {product.sku}</p>
              <p>Available: {getAvailableStock()} in stock</p>
            </div>
          </div>

          {/* Variants */}
          {product.product_variants && product.product_variants.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium">Options:</h3>
              <div className="grid grid-cols-2 gap-2">
                {product.product_variants.map((variant) => (
                  <Button
                    key={variant.id}
                    variant={selectedVariant?.id === variant.id ? 'default' : 'outline'}
                    onClick={() => setSelectedVariant(variant)}
                    className="flex flex-col items-start h-auto p-3"
                    disabled={variant.stock_quantity === 0}
                  >
                    <span className="font-medium">{variant.name}: {variant.value}</span>
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm">
                        {variant.price_modifier > 0 ? `+${formatPrice(variant.price_modifier)}` : ''}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {variant.stock_quantity} left
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="font-medium">Quantity:</label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.min(getAvailableStock(), quantity + 1))}
                  disabled={quantity >= getAvailableStock()}
                >
                  +
                </Button>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleAddToCart}
                disabled={!product.in_stock || getAvailableStock() === 0}
                className="flex-1"
                size="lg"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                onClick={handleToggleWishlist}
                size="lg"
                className="px-4"
              >
                <Heart className={`h-4 w-4 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
