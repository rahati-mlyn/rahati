import React, { useState } from 'react';
import { ShoppingCart, Trash2, X } from 'lucide-react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetFooter 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CartItem } from '@/types/cart';
import { formatPrice } from '@/lib/utils';
import { createOrder, isAuthenticated } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuthContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onSendOrder: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onUpdateQuantity,
  onSendOrder
}) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { isLoggedIn, user } = useAuth();

  const handleSendOrder = async () => {
    if (!isLoggedIn) {
      onSendOrder();
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const orderData = {
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          categoryId: item.categoryId,
          storeId: item.storeId
        })),
        total,
        orderDate: new Date().toISOString(),
        userId: user?.id || '',
      };
      
      await createOrder(orderData);
      
      toast({
        title: "تم إرسال الطلب",
        description: "سيتم التواصل معك قريباً",
      });
      
      // Clear cart after successful order
      items.forEach(item => onRemoveItem(item.id));
      onClose();
    } catch (error) {
      console.error("Error sending order:", error);
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "حدث خطأ أثناء إرسال الطلب. سيتم تحويلك إلى واتساب."
      });
      // Fallback to WhatsApp if API fails
      onSendOrder();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="left" className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-rahati-purple" />
            <span>سلة المشتريات ({totalItems})</span>
            <div className="ml-auto">
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 flex flex-col gap-4">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">سلة المشتريات فارغة</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 py-2 border-b">
                  <div className="h-16 w-16 rounded-md overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">{formatPrice(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    >
                      -
                    </Button>
                    <span className="w-6 text-center">{item.quantity}</span>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive hover:text-destructive/90"
                    onClick={() => onRemoveItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <SheetFooter className="sm:justify-start mt-auto">
          <div className="w-full">
            <Separator className="my-4" />
            <div className="flex justify-between text-lg font-medium mb-4">
              <span>الإجمالي:</span>
              <span>{formatPrice(total)}</span>
            </div>
            <Button 
              className="w-full bg-rahati-purple hover:bg-rahati-purple/90"
              disabled={items.length === 0 || isSubmitting}
              onClick={handleSendOrder}
            >
              {isSubmitting ? 'جاري إرسال الطلب...' : isAuthenticated() 
                ? 'إرسال الطلب' 
                : 'إرسال الطلب عبر واتساب'}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
