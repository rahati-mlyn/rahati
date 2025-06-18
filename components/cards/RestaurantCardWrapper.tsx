
import React from 'react';
import RestaurantCard from './RestaurantCard';
import RestaurantRating from '../restaurants/RestaurantRating';
import { Restaurant } from '@/types/restaurant';
import { MenuItem } from '@/types/restaurant';

interface RestaurantCardWrapperProps {
  restaurant: Restaurant;
  onViewDetails: () => void;
  onAddToCart: (menuItem: MenuItem, restaurantName: string) => void;
  isLoggedIn?: boolean;
}

const RestaurantCardWrapper: React.FC<RestaurantCardWrapperProps> = ({
  restaurant,
  onViewDetails,
  onAddToCart,
  isLoggedIn = false
}) => {
  return (
    <div className="flex flex-col h-full">
      <RestaurantCard 
        restaurant={restaurant} 
        onViewDetails={onViewDetails} 
        onAddToCart={onAddToCart} 
      />
      
      <div className="mt-2">
        <RestaurantRating 
          restaurantId={restaurant.id} 
          restaurantName={restaurant.name}
          isLoggedIn={isLoggedIn}
        />
      </div>
    </div>
  );
};

export default RestaurantCardWrapper;
