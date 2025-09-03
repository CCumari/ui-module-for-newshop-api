import { useState } from 'react';
import { ProductList } from './components/products/ProductList';
import { ProductDetails } from './components/products/ProductDetails';
import { WishlistPage } from './components/wishlist/WishlistPage';
import { CheckoutPage } from './components/checkout/CheckoutPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { UserProfile } from './components/user/UserProfile';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { Button } from './components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';
import { Toaster } from './components/ui/toaster';
import { ShoppingBag, Heart, User, Settings, Home } from 'lucide-react';
import './App.css';

type CurrentPage = 'home' | 'products' | 'product-details' | 'wishlist' | 'checkout' | 'admin' | 'profile';

function App() {
  const [currentPage, setCurrentPage] = useState<CurrentPage>('home');
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  const handleProductClick = (productId: number) => {
    setSelectedProductId(productId);
    setCurrentPage('product-details');
  };

  const handleBackToProducts = () => {
    setCurrentPage('products');
    setSelectedProductId(null);
  };

  const renderNavigation = () => (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold">E-Commerce Store</h1>
            <div className="flex space-x-4">
              <Button
                variant={currentPage === 'home' ? 'default' : 'ghost'}
                onClick={() => setCurrentPage('home')}
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Home
              </Button>
              <Button
                variant={currentPage === 'products' || currentPage === 'product-details' ? 'default' : 'ghost'}
                onClick={() => setCurrentPage('products')}
                className="flex items-center gap-2"
              >
                <ShoppingBag className="h-4 w-4" />
                Products
              </Button>
              <Button
                variant={currentPage === 'wishlist' ? 'default' : 'ghost'}
                onClick={() => setCurrentPage('wishlist')}
                className="flex items-center gap-2"
              >
                <Heart className="h-4 w-4" />
                Wishlist
              </Button>
              <Button
                variant={currentPage === 'checkout' ? 'default' : 'ghost'}
                onClick={() => setCurrentPage('checkout')}
                className="flex items-center gap-2"
              >
                <ShoppingBag className="h-4 w-4" />
                Checkout
              </Button>
              <Button
                variant={currentPage === 'admin' ? 'default' : 'ghost'}
                onClick={() => setCurrentPage('admin')}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Admin
              </Button>
              <Button
                variant={currentPage === 'profile' ? 'default' : 'ghost'}
                onClick={() => setCurrentPage('profile')}
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );

  const renderPage = () => {
    switch (currentPage) {
      case 'products':
        return <ProductList onProductClick={handleProductClick} />;
      
      case 'product-details':
        return selectedProductId ? (
          <ProductDetails 
            productId={selectedProductId} 
            onBack={handleBackToProducts} 
          />
        ) : (
          <div>Product not found</div>
        );
      
      case 'wishlist':
        return <WishlistPage />;
      
      case 'checkout':
        return <CheckoutPage 
          onBack={() => setCurrentPage('products')} 
          onOrderComplete={() => setCurrentPage('home')} 
        />;
      
      case 'admin':
        return <AdminDashboard />;
      
      case 'profile':
        return <UserProfile />;
      
      default:
        return (
          <div className="space-y-8">
            <div className="text-center py-12">
              <h2 className="text-3xl font-bold mb-4">Welcome to Our E-Commerce Store</h2>
              <p className="text-lg text-gray-600 mb-8">Discover amazing products and great deals</p>
              <Button onClick={() => setCurrentPage('products')} size="lg">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Browse Products
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Products
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Browse our extensive catalog of products with advanced filtering and search capabilities.</p>
                  <Button onClick={() => setCurrentPage('products')} className="w-full">
                    View Products
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Wishlist
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Save your favorite items and purchase them later at your convenience.</p>
                  <Button onClick={() => setCurrentPage('wishlist')} className="w-full">
                    View Wishlist
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Admin Panel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Manage products, orders, and users through our comprehensive admin dashboard.</p>
                  <Button onClick={() => setCurrentPage('admin')} className="w-full">
                    Admin Dashboard
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );
    }
  };

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-gray-50">
          {renderNavigation()}
          <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {renderPage()}
          </main>
          <Toaster />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
