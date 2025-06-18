
import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, Share2, Heart, MessagesSquare, ArrowLeft, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogClose, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/product';
import { formatPrice } from '@/lib/utils';
import ProductCard from '../cards/ProductCard';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Slider } from '@/components/ui/slider';

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  similarProducts: Product[];
  onViewDetails: (product: Product) => void;
}

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  similarProducts,
  onViewDetails
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  
  // Adjust items per view based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (!product) return null;

  // Generate additional images for demo purposes
  const productImages = [
    product.image,
    // For demo, we'll use the same image but in practice these would be different angles
    product.image,
    product.image
  ];

  const handleContactStore = () => {
    window.open('https://wa.me/22231465497', '_blank');
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));
  };

  const handleThumbnailClick = (index: number) => {
    setActiveImageIndex(index);
  };

  // Group similar products by subcategory
  const groupedSimilarProducts = similarProducts.reduce((acc, product) => {
    const key = product.subCategory;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  const categoryLabels = {
    'electronics': 'الإلكترونيات',
    'clothes': 'الملابس',
    'home-goods': 'منتجات المنزل',
    'car-parts': 'غيار السيارات',
    'other': 'أخرى'
  };

  const isNew = Date.now() - new Date(product.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-5xl p-0 max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 dark:text-white">
        <DialogTitle className="sr-only">{product.name}</DialogTitle>
        <DialogDescription className="sr-only">تفاصيل المنتج</DialogDescription>
        
        {/* Header - Sticky for better mobile experience */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 p-4 flex justify-between items-center border-b dark:border-gray-800 shadow-sm">
          <h2 className="text-xl font-bold text-rahati-dark dark:text-white truncate flex-1 text-right">{product.name}</h2>
          <DialogClose>
            <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </div>
          
        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 lg:gap-8 p-4 lg:p-6">
          {/* Product Images Section - Stacked on mobile, 4 columns on md screens */}
          <div className="md:col-span-4">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden aspect-square relative group shadow-sm">
              {/* Main Image */}
              <img 
                src={productImages[activeImageIndex]} 
                alt={`${product.name} - صورة ${activeImageIndex + 1}`} 
                className="w-full h-full object-contain p-4"
                loading="lazy"
              />
              
              {/* Image Navigation Controls */}
              {productImages.length > 1 && (
                <>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/90 dark:bg-black/60 hover:bg-white dark:hover:bg-black/80 rounded-full shadow-lg opacity-80 hover:opacity-100 transition-opacity"
                    onClick={handlePrevImage}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/90 dark:bg-black/60 hover:bg-white dark:hover:bg-black/80 rounded-full shadow-lg opacity-80 hover:opacity-100 transition-opacity"
                    onClick={handleNextImage}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </>
              )}

              {/* Product Badges - Only showing "New" badge, removed discount badge */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {isNew && (
                  <Badge className="bg-rahati-purple text-white dark:bg-purple-600 animate-fade-in shadow-md text-sm">
                    جديد
                  </Badge>
                )}
              </div>
            </div>

            {/* Thumbnails with active indicator */}
            {productImages.length > 1 && (
              <div className="flex gap-2 mt-4 justify-center">
                {productImages.map((img, index) => (
                  <div 
                    key={`thumb-${index}`}
                    className={`border-2 rounded-lg overflow-hidden cursor-pointer transition-all w-16 h-16 hover:scale-105 ${activeImageIndex === index ? 'border-rahati-purple ring-2 ring-purple-200 dark:ring-purple-800' : 'border-transparent'}`}
                    onClick={() => handleThumbnailClick(index)}
                  >
                    <img 
                      src={img} 
                      alt={`${product.name} thumbnail ${index + 1}`} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Info - Stacked on mobile, 3 columns on md screens */}
          <div className="md:col-span-3 text-right flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-rahati-purple bg-purple-50 dark:bg-purple-900/30 dark:text-purple-300 px-3 py-1 rounded-full">
                {product.city}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(product.createdAt).toLocaleDateString('ar-EG')}</p>
            </div>

            <div className="mb-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {product.originalPrice > 0 && product.originalPrice > product.price && (
                    <span className="text-muted-foreground line-through text-sm">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                  <span className="font-bold text-2xl text-rahati-purple dark:text-purple-300">
                    {formatPrice(product.price)}
                  </span>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 hover:bg-green-100 hover:text-green-800 dark:hover:bg-green-900 dark:hover:text-green-300 cursor-help shadow-sm">
                        {product.category}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="bg-black text-white">
                      <p>فئة المنتج</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Badge variant="outline" className="text-gray-600 dark:text-gray-300 dark:border-gray-600 mt-2">
                {categoryLabels[product.subCategory as keyof typeof categoryLabels] || product.subCategory}
              </Badge>
            </div>
              
            <div className="flex-grow mb-6">
              <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">الوصف:</h3>
              <ScrollArea className="h-[120px] rounded-md border p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {product.description}
                </p>
              </ScrollArea>
            </div>
              
            {product.storeId && (
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl mb-6 flex justify-between items-center shadow-sm">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-rahati-purple dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30"
                >
                  عرض المتجر
                </Button>
                <p className="font-semibold text-rahati-dark dark:text-gray-200 flex items-center gap-1">
                  <span>المتجر:</span>
                  <span>{product.storeName || 'متجر'}</span>
                </p>
              </div>
            )}
              
            {/* Action Buttons - Better mobile layout */}
            <div className="flex flex-col sm:flex-row gap-2 mt-3">
              <Button 
                className="flex-1 bg-rahati-purple hover:bg-purple-700 transition-colors shadow-md text-white"
                onClick={() => onAddToCart(product)}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                <span>أضف للسلة</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 border-green-500 text-green-600 dark:text-green-400 dark:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors shadow-sm"
                onClick={handleContactStore}
              >
                <MessagesSquare className="mr-2 h-4 w-4" />
                <span>تواصل مع المتجر</span>
              </Button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 mt-2">
              <Button 
                variant="outline" 
                className="flex-1 transition-all duration-300 hover:border-rahati-purple hover:text-rahati-purple dark:hover:text-purple-300 dark:hover:border-purple-600"
              >
                <Heart className="mr-2 h-4 w-4" />
                <span>أضف للمفضلة</span>
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
        
        {/* Similar Products - Enhanced Carousel with better mobile support */}
        {similarProducts.length > 0 && (
          <div className="mt-2 p-4 sm:p-6 pt-0 border-t dark:border-gray-800">
            <Tabs defaultValue="similar" className="w-full">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                <div className="flex items-center gap-2">
                  <label htmlFor="items-slider" className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">عدد العناصر:</label>
                  <Slider
                    id="items-slider"
                    defaultValue={[itemsPerView]}
                    max={4}
                    min={1}
                    step={1}
                    className="w-24"
                    onValueChange={(values) => setItemsPerView(values[0])}
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400">{itemsPerView}</span>
                </div>
                <TabsList className="bg-gray-100 dark:bg-gray-800 self-center sm:self-auto">
                  <TabsTrigger value="similar" className="text-sm">منتجات مشابهة</TabsTrigger>
                  <TabsTrigger value="subcategory" className="text-sm">حسب الفئة</TabsTrigger>
                </TabsList>
              </div>
              
              {/* Similar Products Tab */}
              <TabsContent value="similar" className="mt-4">
                <div className="relative">
                  <Carousel
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                    className="w-full"
                  >
                    <CarouselContent>
                      {similarProducts.map((similarProduct) => (
                        <CarouselItem key={similarProduct.id} className={`md:basis-1/${itemsPerView}`}>
                          <div className="p-1 h-full">
                            <ProductCard
                              product={similarProduct}
                              onAddToCart={onAddToCart}
                              onViewDetails={onViewDetails}
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="-left-2 sm:-left-4 bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700" />
                    <CarouselNext className="-right-2 sm:-right-4 bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700" />
                  </Carousel>
                </div>
              </TabsContent>
              
              {/* By Category Tab */}
              <TabsContent value="subcategory" className="mt-4">
                {Object.entries(groupedSimilarProducts).length > 0 ? (
                  <div className="space-y-6">
                    {Object.entries(groupedSimilarProducts).map(([category, products]) => (
                      <div key={category} className="space-y-3">
                        <h4 className="text-right font-medium text-rahati-dark dark:text-white">
                          {categoryLabels[category as keyof typeof categoryLabels] || category}
                        </h4>
                        <Carousel
                          opts={{
                            align: "start",
                            loop: true,
                          }}
                          className="w-full"
                        >
                          <CarouselContent>
                            {products.map((similarProduct) => (
                              <CarouselItem key={similarProduct.id} className={`md:basis-1/${itemsPerView}`}>
                                <div className="p-1 h-full">
                                  <ProductCard
                                    product={similarProduct}
                                    onAddToCart={onAddToCart}
                                    onViewDetails={onViewDetails}
                                  />
                                </div>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                          <CarouselPrevious className="-left-2 sm:-left-4 bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700" />
                          <CarouselNext className="-right-2 sm:-right-4 bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700" />
                        </Carousel>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-4">لا توجد منتجات متاحة في هذه الفئة</p>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsModal;
