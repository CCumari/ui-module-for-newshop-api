import { useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { ProductList } from '@/components/products/ProductList';
import { CartSidebar } from '@/components/cart/CartSidebar';
import { WishlistPage } from '@/components/wishlist/WishlistPage';
import { OrdersPage } from '@/components/orders/OrdersPage';
import { UserProfile } from '@/components/user/UserProfile';
import { ProductDetails } from '@/components/products/ProductDetails';
import { CheckoutPage } from '@/components/checkout/CheckoutPage';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toaster } from '@/components/ui/toaster';
import { ShoppingCart, Heart, Package, User, Settings } from 'lucide-react';

const AppContent = () => {
  const { user, logout, loading, isAuthenticated } = useAuth();
  const [authMode, setAuthMode] = useState('login');
  const [currentView, setCurrentView] = useState('products');
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md">
          <Tabs value={authMode} onValueChange={setAuthMode}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm onSuccess={() => setCurrentView('products')} />
            </TabsContent>
            <TabsContent value="signup">
              <SignupForm onSuccess={() => setCurrentView('products')} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">E-Shop</h1>
            </div>
            
            <nav className="flex items-center space-x-4">
              <Button
                variant={currentView === 'products' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentView('products')}
              >
                <Package className="h-4 w-4 mr-2" />
                Products
              </Button>
              <Button
                variant={currentView === 'cart' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentView('cart')}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart
              </Button>
              <Button
                variant={currentView === 'wishlist' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentView('wishlist')}
              >
                <Heart className="h-4 w-4 mr-2" />
                Wishlist
              </Button>
              <Button
                variant={currentView === 'orders' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentView('orders')}
              >
                <Package className="h-4 w-4 mr-2" />
                Orders
              </Button>
              <Button
                variant={currentView === 'profile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentView('profile')}
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
              
              {/* Admin Dashboard - For demo purposes, available to all users */}
              <Button
                variant={currentView === 'admin' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentView('admin')}
              >
                <Settings className="h-4 w-4 mr-2" />
                Admin
              </Button>
            </nav>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {user?.full_name || user?.email}
              </span>
              <Button variant="outline" size="sm" onClick={logout}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'products' && !selectedProductId && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Products</h2>
              <p className="text-muted-foreground">Discover our amazing products</p>
            </div>
            <ProductList onProductClick={(id: number) => setSelectedProductId(id)} />
          </div>
        )}
        
        {currentView === 'products' && selectedProductId && (
          <ProductDetails 
            productId={selectedProductId} 
            onBack={() => setSelectedProductId(null)} 
          />
        )}
        
        {currentView === 'cart' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
            <CartSidebar onNavigateToCheckout={() => setCurrentView('checkout')} />
          </div>
        )}
        
        {currentView === 'wishlist' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Wishlist</h2>
            <WishlistPage />
          </div>
        )}
        
        {currentView === 'orders' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Order History</h2>
            <OrdersPage />
          </div>
        )}
        
        {currentView === 'profile' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">My Profile</h2>
            <UserProfile />
          </div>
        )}

        {/* Admin Dashboard */}
        {currentView === 'admin' && (
          <AdminDashboard />
        )}

        {/* Checkout View */}
        {currentView === 'checkout' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Checkout</h2>
            <CheckoutPage 
              onBack={() => setCurrentView('cart')}
              onOrderComplete={() => {
                setCurrentView('orders');
                setSelectedProductId(null);
              }}
            />
          </div>
        )}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
        <Toaster />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
