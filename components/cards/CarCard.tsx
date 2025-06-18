
import React from 'react';
import { MapPin, Phone, ExternalLink, Calendar } from 'lucide-react';
import { Car } from '@/types/car';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';

interface CarCardProps {
  car: Car;
  onViewDetails: (car: Car) => void;
}

const CarCard: React.FC<CarCardProps> = ({
  car,
  onViewDetails
}) => {
  return (
    <Card className="overflow-hidden card-hover border border-gray-200 dark:border-gray-800 dark:bg-gray-900 dark:text-white transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
      <div className="aspect-video relative overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer" onClick={() => onViewDetails(car)}>
        <img 
          src={car.image} 
          alt={car.make + ' ' + car.model} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <Badge 
          className={`absolute top-2 left-2 ${
            car.type === 'rent' ? 'bg-rahati-purple' : 'bg-rahati-yellow text-rahati-dark'
          }`}
        >
          {car.type === 'rent' ? 'للإيجار' : 'للبيع'}
        </Badge>

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
          <span className="text-white text-sm font-medium">اضغط للتفاصيل</span>
        </div>
      </div>
      <CardContent className="p-4 text-right">
        <h3 
          className="font-semibold text-lg truncate cursor-pointer hover:text-rahati-purple dark:hover:text-purple-300 transition-colors"
          onClick={() => onViewDetails(car)}
        >
          {car.make} {car.model}
        </h3>
        <div className="flex items-center justify-between mt-1">
          <span className="font-medium text-rahati-purple dark:text-purple-300">
            {formatPrice(car.price)}
            {car.type === 'rent' && '/يوميًا'}
          </span>
          <div className="flex items-center gap-1 text-muted-foreground dark:text-gray-300">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{car.city}</span>
          </div>
        </div>
        
        <div className="flex gap-2 mt-2 text-sm text-muted-foreground dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {car.year}
          </span>
          <span>•</span>
          <span>{car.mileage} كم</span>
          <span>•</span>
          <span>{car.transmission}</span>
        </div>
        
        <p className="text-muted-foreground dark:text-gray-300 text-sm mt-2 line-clamp-2">{car.description}</p>
        
        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground dark:text-gray-300">
          <Phone className="h-4 w-4" />
          <span dir="ltr" className="font-medium">{car.contactPhone}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full bg-rahati-purple hover:bg-rahati-purple/90 transition-all duration-300 transform hover:scale-105"
          onClick={() => onViewDetails(car)}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          <span>عرض التفاصيل</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CarCard;
