import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  in_stock: boolean;
}

interface SimpleProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export const SimpleProductCard = ({ product, onAddToCart }: SimpleProductCardProps) => {
  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(2)}`;
  };

  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-white">
      <h3 className="font-bold text-lg mb-2">{product.name}</h3>
      <p className="text-gray-600 mb-2">{product.description}</p>
      <p className="text-xl font-bold mb-4">{formatPrice(product.price)}</p>
      
      {/* Super simple button test */}
      <Button
        onClick={() => {
          console.log('=== SIMPLE CARD BUTTON CLICKED ===');
          console.log('Product:', product.name);
          alert(`Simple button clicked for ${product.name}`);
          if (onAddToCart) {
            onAddToCart(product);
          }
        }}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        style={{ zIndex: 9999 }}
      >
        <ShoppingCart className="h-4 w-4 mr-2" />
        SIMPLE ADD TO CART
      </Button>
    </div>
  );
};
