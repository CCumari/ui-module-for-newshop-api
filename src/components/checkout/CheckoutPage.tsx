import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, Lock, Truck, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api';

interface CheckoutPageProps {
  onBack: () => void;
  onOrderComplete: () => void;
}

export const CheckoutPage = ({ onBack, onOrderComplete }: CheckoutPageProps) => {
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Form state
  const [shippingAddress, setShippingAddress] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');

  const { items, getTotalPrice, getTotalItems } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (items.length === 0) {
      toast({
        title: 'Cart is empty',
        description: 'Please add items to your cart before checkout',
        variant: 'destructive',
      });
      onBack();
      return;
    }

    // Pre-fill form with user data
    if (user) {
      setShippingAddress(user.shipping_address || '');
      setBillingAddress(user.billing_address || '');
      setPhone(user.phone || '');
    }

    setLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!shippingAddress || !billingAddress || !phone) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setProcessing(true);
    try {
      await apiClient.createOrder({
        shipping_address: shippingAddress,
        billing_address: billingAddress,
      });

      toast({
        title: 'Order placed successfully!',
        description: 'Your order has been placed and will be processed soon.',
      });

      onOrderComplete();
    } catch (error: any) {
      toast({
        title: 'Error placing order',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(2)}`;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Preparing checkout...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="p-0">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cart
        </Button>
      </div>

      <Alert>
        <Lock className="h-4 w-4" />
        <AlertDescription>
          Your checkout is secure and encrypted.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-2">
                <div>
                  <h4 className="font-medium">{item.product?.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {formatPrice(item.product.price)} × {item.quantity}
                  </p>
                </div>
                <span className="font-medium">{formatPrice(item.total_price)}</span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total ({getTotalItems()} items)</span>
              <span>{formatPrice(getTotalPrice())}</span>
            </div>
          </CardContent>
        </Card>

        {/* Checkout Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Checkout Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Shipping Address *
                </Label>
                <Textarea
                  placeholder="Enter your complete shipping address"
                  className="resize-none"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Billing Address *</Label>
                <Textarea
                  placeholder="Enter your billing address"
                  className="resize-none"
                  value={billingAddress}
                  onChange={(e) => setBillingAddress(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Phone Number *</Label>
                <Input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Payment Method *</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={paymentMethod === 'cash_on_delivery' ? 'default' : 'outline'}
                    onClick={() => setPaymentMethod('cash_on_delivery')}
                    className="justify-start"
                  >
                    Cash on Delivery
                  </Button>
                  <Button
                    type="button"
                    variant={paymentMethod === 'card' ? 'default' : 'outline'}
                    onClick={() => setPaymentMethod('card')}
                    className="justify-start"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Card Payment
                  </Button>
                </div>
              </div>

              {paymentMethod === 'card' && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    This is a demo. Card payment is not processed in development mode.
                  </AlertDescription>
                </Alert>
              )}

              <Separator />

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={processing}
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing Order...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Place Order - {formatPrice(getTotalPrice())}
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                By placing this order, you agree to our terms of service and privacy policy.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};