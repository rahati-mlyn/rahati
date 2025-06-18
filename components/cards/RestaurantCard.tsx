
import React, { useState } from 'react';
import { Star, MapPin, ExternalLink, Plus, X } from 'lucide-react';
import { Restaurant, MenuItem } from '@/types/restaurant';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { formatPrice } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onViewDetails: (restaurant: Restaurant) => void;
  onAddToCart?: (item: MenuItem, restaurantName: string) => void;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onViewDetails,
  onAddToCart
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toast } = useToast();

  const handleAddToCart = (item: MenuItem) => {
    if (onAddToCart) {
      onAddToCart(item, restaurant.name);
      toast({
        title: "تمت الإضافة",
        description: `تمت إضافة ${item.name} إلى السلة`,
        duration: 2000,
      });
    }
  };

  return (
    <>
      <Card className="overflow-hidden card-hover border border-gray-200">
        <div className="aspect-video relative overflow-hidden bg-gray-100">
          <img 
            src={restaurant.image} 
            alt={restaurant.name} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            onClick={() => onViewDetails(restaurant)}
          />
        </div>
        <CardContent className="p-4 text-right">
          <h3 
            className="font-semibold text-lg truncate cursor-pointer hover:text-rahati-purple transition-colors"
            onClick={() => onViewDetails(restaurant)}
          >
            {restaurant.name}
          </h3>
          
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium">{restaurant.rating.toFixed(1)}</span>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < Math.floor(restaurant.rating) ? 'text-rahati-yellow fill-rahati-yellow' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                ({restaurant.reviewCount})
              </span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{restaurant.city}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1 mt-2">
            {restaurant.cuisine.map((item, index) => (
              <span 
                key={index} 
                className="text-xs px-2 py-1 bg-rahati-purple/10 text-rahati-purple rounded-full"
              >
                {item}
              </span>
            ))}
          </div>
          
          <p className="text-muted-foreground text-sm mt-2 line-clamp-2">{restaurant.description}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button 
            className="w-full bg-rahati-purple hover:bg-rahati-purple/90"
            onClick={() => setIsMenuOpen(true)}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            <span>عرض القائمة</span>
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-right">{restaurant.name}</DialogTitle>
            <DialogDescription className="text-right">
              {restaurant.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-3 text-right">قائمة الطعام</h3>
            
            <div className="space-y-4">
              {restaurant.menu.map((item) => (
                <div 
                  key={item.id} 
                  className="flex justify-between gap-4 border p-3 rounded-md hover:bg-gray-50"
                >
                  <Button 
                    size="icon" 
                    className="h-8 w-8 bg-rahati-purple hover:bg-rahati-purple/90 rounded-full"
                    onClick={() => handleAddToCart(item)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex-grow text-right">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                    <p className="text-rahati-purple font-medium mt-1">{formatPrice(item.price)}</p>
                  </div>
                  
                  <div className="flex-shrink-0 h-20 w-20 rounded-md overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <DialogClose className="absolute top-2 left-2">
            <Button variant="ghost" size="icon">
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RestaurantCard;
