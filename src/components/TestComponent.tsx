import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

export const TestComponent = () => {
  const { user, isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const handleClick = () => {
    console.log('Test button clicked!');
    console.log('User:', user);
    console.log('Is authenticated:', isAuthenticated);
    alert('Basic button works!');
  };

  const handleAddToCartTest = async () => {
    console.log('=== Test add to cart clicked! ===');
    console.log('User ID:', user?.id);
    console.log('Is authenticated:', isAuthenticated);
    
    if (!isAuthenticated) {
      alert('Not authenticated - cannot add to cart');
      return;
    }

    try {
      console.log('Calling addToCart with productId: 1, quantity: 1');
      await addToCart(1, 1); // Test with product ID 1
      console.log('Add to cart completed without error');
      alert('Add to cart test completed - check console for details');
    } catch (error) {
      console.error('Test add to cart failed:', error);
      alert('Add to cart test failed - check console for details');
    }
  };

  const handleMockLogin = () => {
    console.log('Mock login clicked');
    localStorage.setItem('auth_token', 'mock-token');
    window.location.reload();
  };

  return (
    <div className="p-8 bg-blue-100 border border-blue-300 rounded mb-4">
      <h2 className="text-2xl font-bold mb-4">Debug Panel</h2>
      <div className="space-y-4">
        <div className="bg-white p-4 rounded border">
          <h3 className="font-bold mb-2">Authentication Status</h3>
          <p>Is Authenticated: <span className={isAuthenticated ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>{isAuthenticated ? 'YES' : 'NO'}</span></p>
          <p>User ID: {user?.id || 'None'}</p>
          <p>User Name: {user?.full_name || 'None'}</p>
          <p>User Email: {user?.email || 'None'}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleClick} className="bg-green-600 hover:bg-green-700">
            Basic Button Test
          </Button>
          <Button 
            onClick={handleAddToCartTest} 
            className="bg-blue-600 hover:bg-blue-700"
            disabled={!isAuthenticated}
          >
            {isAuthenticated ? 'Test Add to Cart' : 'Login First'}
          </Button>
          {!isAuthenticated && (
            <Button onClick={handleMockLogin} variant="outline" className="border-orange-500 text-orange-600">
              Mock Login (Testing)
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
