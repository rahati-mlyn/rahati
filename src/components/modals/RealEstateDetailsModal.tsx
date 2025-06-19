
import React, { useState } from 'react';
import { X, MapPin, Phone, ExternalLink, Share2, Home, ArrowLeft, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogClose, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RealEstate } from '@/types/realEstate';
import { formatPrice } from '@/lib/utils';

interface RealEstateDetailsModalProps {
  property: RealEstate | null;
  isOpen: boolean;
  onClose: () => void;
}

const RealEstateDetailsModal: React.FC<RealEstateDetailsModalProps> = ({
  property,
  isOpen,
  onClose
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!property) return null;

  // Generate additional images for demo purposes
  const propertyImages = [
    property.image,
    // For demo, we'll use the same image but in practice these would be different angles
    property.image,
    property.image
  ];

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % propertyImages.length);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? propertyImages.length - 1 : prev - 1));
  };

  const handleThumbnailClick = (index: number) => {
    setActiveImageIndex(index);
  };

  const handleContact = () => {
    window.open(`tel:${property.contactPhone}`, '_blank');
  };

  // Format default amenities since it's not in the type
  const defaultAmenities = ['حديقة', 'موقف سيارات', 'مصعد', 'أمن'];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-5xl p-0 max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 dark:text-white">
        <DialogTitle className="sr-only">{property.title}</DialogTitle>
        <DialogDescription className="sr-only">تفاصيل العقار</DialogDescription>
        
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 p-4 flex justify-between items-center border-b dark:border-gray-800">
          <h2 className="text-xl font-bold text-rahati-dark dark:text-white truncate flex-1 text-right">
            {property.title}
          </h2>
          <DialogClose>
            <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </div>
          
        <div className="grid md:grid-cols-7 gap-8 p-6">
          {/* Property Images Section - 4 columns on md screens */}
          <div className="md:col-span-4">
            <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl overflow-hidden aspect-video relative group shadow-sm">
              {/* Main Image */}
              <img 
                src={propertyImages[activeImageIndex]} 
                alt={`${property.title} - صورة ${activeImageIndex + 1}`} 
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
              />
              
              {/* Image Navigation Controls */}
              {propertyImages.length > 1 && (
                <>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/70 dark:bg-black/40 hover:bg-white dark:hover:bg-black/60 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={handlePrevImage}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/70 dark:bg-black/40 hover:bg-white dark:hover:bg-black/60 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={handleNextImage}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </>
              )}

              {/* Property Badges */}
              <div className="absolute top-2 left-2">
                <Badge className={property.type === 'rent' ? 'bg-rahati-purple' : 'bg-rahati-yellow text-rahati-dark'}>
                  {property.type === 'rent' ? 'للإيجار' : 'للبيع'}
                </Badge>
              </div>
              
              {/* Location badge */}
              <div className="absolute bottom-2 right-2">
                <Badge variant="outline" className="bg-white/80 dark:bg-black/50 text-gray-700 dark:text-white backdrop-blur-sm">
                  <MapPin className="h-3 w-3 mr-1" />
                  {property.location}
                </Badge>
              </div>
            </div>

            {/* Thumbnails with active indicator */}
            {propertyImages.length > 1 && (
              <div className="flex gap-2 mt-4 justify-center">
                {propertyImages.map((img, index) => (
                  <div 
                    key={`thumb-${index}`}
                    className={`border-2 rounded-lg overflow-hidden cursor-pointer transition-all w-16 h-16 hover:scale-105 ${activeImageIndex === index ? 'border-rahati-purple ring-2 ring-purple-200' : 'border-transparent'}`}
                    onClick={() => handleThumbnailClick(index)}
                  >
                    <img 
                      src={img} 
                      alt={`${property.title} thumbnail ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Property Info - 3 columns on md screens */}
          <div className="md:col-span-3 text-right flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-rahati-purple bg-purple-50 dark:bg-purple-900/30 dark:text-purple-300 px-3 py-1 rounded-full">
                {property.city}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{property.propertyType || 'شقة'}</p>
            </div>

            <div className="mb-6 bg-gradient-to-r from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 p-4 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-2xl text-rahati-purple dark:text-purple-300">
                  {formatPrice(property.price)}
                  {property.type === 'rent' && '/شهريًا'}
                </span>
                <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-gray-600 dark:text-gray-300 text-sm">
                  {property.area} م²
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mt-3">
                <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">غرف</p>
                  <p className="font-medium">{property.bedrooms}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">حمامات</p>
                  <p className="font-medium">{property.bathrooms}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">الطابق</p>
                  <p className="font-medium">1</p>
                </div>
              </div>
            </div>
              
            <div className="flex-grow mb-6">
              <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">الوصف:</h3>
              <ScrollArea className="h-[100px] rounded-md border p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {property.description}
                </p>
              </ScrollArea>
            </div>
            
            {/* Amenities section */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">المميزات:</h3>
              <div className="flex flex-wrap gap-2">
                {defaultAmenities.map((amenity, index) => (
                  <Badge key={index} variant="outline" className="bg-gray-50 dark:bg-gray-800">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>
              
            <div className="bg-gradient-to-l from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 p-4 rounded-xl mb-6 flex justify-between items-center shadow-sm">
              <Phone className="h-5 w-5 text-green-600 dark:text-green-400" />
              <p className="font-semibold text-rahati-dark dark:text-gray-200 flex items-center gap-1">
                <span>رقم الهاتف:</span>
                <span dir="ltr">{property.contactPhone}</span>
              </p>
            </div>
              
            <div className="flex gap-2 mt-3">
              <Button 
                className="flex-1 bg-green-600 hover:bg-green-700 transition-colors shadow-md"
                onClick={handleContact}
              >
                <Phone className="mr-2 h-4 w-4" />
                <span>اتصال</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 transition-all duration-300 hover:border-blue-500 hover:text-blue-500 dark:hover:text-blue-400"
              >
                <Share2 className="mr-2 h-4 w-4" />
                <span>مشاركة</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RealEstateDetailsModal;
