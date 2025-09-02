import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

interface WishlistItem {
  id: number;
  user_id: number;
  product_id: number;
  created_at: string;
  product: {
    id: number;
    name: string;
    price: number;
    description: string;
    in_stock: boolean;
    category?: {
      id: number;
      name: string;
    };
  };
}

export const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const data = await apiClient.getWishlist(user.id);
      setWishlistItems(data || []);
    } catch (error: any) {
      toast({
        title: 'Error loading wishlist',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId: number) => {
    try {
      await apiClient.toggleWishlist(productId);
      toast({
        title: 'Removed from wishlist',
        description: 'Item has been removed from your wishlist',
      });
      loadWishlist(); // Reload wishlist
    } catch (error: any) {
      toast({
        title: 'Error updating wishlist',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleAddToCart = async (product: WishlistItem['product']) => {
    await addToCart(product.id, 1);
  };

  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium mb-2">Your wishlist is empty</h3>
          <p className="text-muted-foreground">
            Save products you're interested in by clicking the heart icon
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {wishlistItems.map((item) => (
        <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="aspect-square bg-gray-100 relative">
            <img
              src="/assets/images/default.svg"
              alt={item.product.name}
              className="w-full h-full object-cover"
            />
            {!item.product.in_stock && (
              <Badge className="absolute top-2 left-2" variant="destructive">
                Out of Stock
              </Badge>
            )}
            <Button
              size="sm"
              variant="ghost"
              className="absolute top-2 right-2 p-2"
              onClick={() => handleRemoveFromWishlist(item.product.id)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div>
                <h3 className="font-medium line-clamp-2">{item.product.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.product.description}
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">
                    {formatPrice(item.product.price)}
                  </span>
                  {item.product.category && (
                    <Badge variant="secondary">
                      {item.product.category.name}
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleAddToCart(item.product)}
                  disabled={!item.product.in_stock}
                  className="flex-1"
                >
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveFromWishlist(item.product.id)}
                  className="px-3"
                >
                  <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
