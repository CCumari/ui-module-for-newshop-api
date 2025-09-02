import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface CartItem {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  total_price: number;
  product: {
    id: number;
    name: string;
    price: number;
    description?: string;
  };
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  refreshCart: () => Promise<void>;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated && user) {
      refreshCart();
    } else {
      setItems([]);
    }
  }, [isAuthenticated, user]);

  const refreshCart = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const data = await apiClient.getCartItems(user.id);
      setItems(data || []);
    } catch (error: any) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: number, quantity: number = 1) => {
    if (!user?.id) {
      toast({
        title: 'Please sign in',
        description: 'You need to sign in to add items to cart',
      });
      return;
    }

    try {
      await apiClient.addToCart(user.id, {
        product_id: productId,
        quantity,
      });
      await refreshCart();
      toast({
        title: 'Added to cart',
        description: 'Item has been added to your cart',
      });
    } catch (error: any) {
      toast({
        title: 'Error adding to cart',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    if (!user?.id || quantity < 1) return;

    try {
      await apiClient.updateCartItem(user.id, itemId, { quantity });
      await refreshCart();
    } catch (error: any) {
      toast({
        title: 'Error updating cart',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const removeFromCart = async (itemId: number) => {
    if (!user?.id) return;

    try {
      await apiClient.removeFromCart(user.id, itemId);
      await refreshCart();
      toast({
        title: 'Removed from cart',
        description: 'Item has been removed from your cart',
      });
    } catch (error: any) {
      toast({
        title: 'Error removing item',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.total_price, 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const value: CartContextType = {
    items,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    refreshCart,
    getTotalPrice,
    getTotalItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
