import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { ProductList } from '@/components/products/ProductList';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toaster } from '@/components/ui/toaster';
import { ShoppingCart, Heart, User, Package } from 'lucide-react';

const AppContent = () => {
  const { user, logout, loading, isAuthenticated } = useAuth();
  const [authMode, setAuthMode] = useState('login');
  const [currentView, setCurrentView] = useState('products');

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
        {currentView === 'products' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Products</h2>
              <p className="text-muted-foreground">Discover our amazing products</p>
            </div>
            <ProductList />
          </div>
        )}
        
        {currentView === 'cart' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">Cart component coming soon...</p>
              </CardContent>
            </Card>
          </div>
        )}
        
        {currentView === 'wishlist' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Wishlist</h2>
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">Wishlist component coming soon...</p>
              </CardContent>
            </Card>
          </div>
        )}
        
        {currentView === 'orders' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Order History</h2>
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">Orders component coming soon...</p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster />
    </AuthProvider>
  );
}

export default App;