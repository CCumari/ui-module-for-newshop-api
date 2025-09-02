import React, { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadProducts();
    loadCategories();
    if (isAuthenticated) {
      loadWishlist();
    }
  }, [selectedCategory, isAuthenticated]);

  const loadProducts = async () => {
    try {
      const params = selectedCategory ? { category_id: selectedCategory } : {};
      const data = await apiClient.getProducts(params);
      setProducts(data || []);
    } catch (error) {
      toast({
        title: 'Error loading products',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await apiClient.getCategories();
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadWishlist = async () => {
    if (!user?.id) return;
    try {
      const data = await apiClient.getWishlist(user.id);
      setWishlist(data || []);
    } catch (error) {
      console.error('Error loading wishlist:', error);
    }
  };

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      toast({
        title: 'Please sign in',
        description: 'You need to sign in to add items to cart',
      });
      return;
    }

    try {
      // Assuming user's cart ID is 1 or user.id
      await apiClient.addToCart(user.id, {
        product_id: product.id,
        quantity: 1,
      });
      toast({
        title: 'Added to cart',
        description: `${product.name} has been added to your cart`,
      });
    } catch (error) {
      toast({
        title: 'Error adding to cart',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleToggleWishlist = async (productId) => {
    if (!isAuthenticated) {
      toast({
        title: 'Please sign in',
        description: 'You need to sign in to manage wishlist',
      });
      return;
    }

    try {
      const result = await apiClient.toggleWishlist(productId);
      toast({
        description: result.message,
      });
      loadWishlist(); // Reload wishlist
    } catch (error) {
      toast({
        title: 'Error updating wishlist',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.product_id === productId);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 rounded-lg text-sm ${
              !selectedCategory
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            All Products
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm ${
                selectedCategory === category.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            inWishlist={isInWishlist(product.id)}
          />
        ))}
      </div>
    </div>
  );
};
