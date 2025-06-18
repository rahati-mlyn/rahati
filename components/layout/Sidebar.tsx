
import React from 'react';
import { 
  ShoppingBag, Building, Utensils, Car, 
  Percent, Store, Globe, Mail, Info, 
  Phone, X, AlignRight, Facebook, 
  Instagram, Youtube, MessagesSquare,
  Shirt, Tv, Sofa, Package, Home,
  ChevronRight, LogOut, User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle 
} from '@/components/ui/drawer';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
  onSignupClick: () => void;
  onLanguageClick: () => void;
  isLoggedIn?: boolean;
  onLogoutClick?: () => void;
}

// Create custom icons for those not available in Lucide
const TikTok = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className="lucide lucide-tiktok"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const Snapchat = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className="lucide lucide-snapchat"
  >
    <path d="M12 2c-3.3 0-6 2.7-6 6v4c0 1.1-.9 2-2 2 0 0 0 2 2 2 0 0 0 4 6 4s6-4 6-4c2 0 2-2 2-2-1.1 0-2-.9-2-2V8c0-3.3-2.7-6-6-6Z" />
    <path d="M8 14h8" />
  </svg>
);

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  onLoginClick,
  onSignupClick,
  onLanguageClick,
  isLoggedIn = false,
  onLogoutClick = () => {}
}) => {
  const handleWhatsAppSupport = () => {
    window.open('https://wa.me/22231465497', '_blank');
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="bg-gradient-to-b from-white to-gray-50 text-rahati-dark h-full max-w-xs w-full border-0">
        <div className="flex flex-col h-full">
          {/* User Section */}
          <div className="flex flex-col items-center text-center p-6 bg-gradient-to-r from-gray-100 to-gray-50 rounded-b-lg shadow-sm">
            <Avatar className="h-24 w-24 mb-3 ring-2 ring-rahati-purple/20 ring-offset-2">
              <AvatarImage src="/lovable-uploads/0950e701-254f-41c2-9f33-1fa067702b38.png" alt="User Avatar" />
              <AvatarFallback className="bg-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>
              </AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-medium mb-3">{isLoggedIn ? 'مرحباً' : 'زائر'}</h2>
            {isLoggedIn ? (
              <div className="space-y-2 w-full">
                <Button 
                  className="w-full bg-rahati-purple text-white hover:bg-rahati-purple/90 rounded-full py-6 shadow-md transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]"
                  asChild
                >
                  <Link to="/account">
                    <User className="h-4 w-4 mr-2" />
                    <span>حسابي</span>
                  </Link>
                </Button>
                <Button 
                  variant="outline"
                  className="w-full border-red-500 text-red-500 hover:bg-red-50 rounded-full py-6 shadow-sm"
                  onClick={onLogoutClick}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>تسجيل الخروج</span>
                </Button>
              </div>
            ) : (
              <Button 
                className="w-full bg-rahati-purple text-white hover:bg-rahati-purple/90 rounded-full py-6 shadow-md transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]" 
                onClick={onLoginClick}
              >
                تسجيل الدخول
              </Button>
            )}
          </div>
          
          <div className="flex-1 p-4 overflow-auto">
            {/* Main Navigation */}
            <div className="space-y-4">
              <div className="py-4">
                <Separator className="mb-4 bg-gray-200" />
                
                <nav className="space-y-6">
                  {/* Shopping */}
                  <div className="flex justify-between items-center group hover:bg-gray-100 rounded-lg p-2 transition-all duration-200">
                    <ShoppingBag className="h-5 w-5 text-rahati-purple" />
                    <Link to="/" className="text-lg font-medium text-gray-800 group-hover:text-rahati-purple transition-colors flex items-center justify-between w-full">
                      <span>التسوق</span>
                      <ChevronRight className="h-4 w-4 text-gray-400 rtl:rotate-180" />
                    </Link>
                  </div>
                  
                  {/* Real Estate */}
                  <div className="flex justify-between items-center group hover:bg-gray-100 rounded-lg p-2 transition-all duration-200">
                    <Building className="h-5 w-5 text-rahati-purple" />
                    <Link to="/" className="text-lg font-medium text-gray-800 group-hover:text-rahati-purple transition-colors flex items-center justify-between w-full">
                      <span>العقارات</span>
                      <ChevronRight className="h-4 w-4 text-gray-400 rtl:rotate-180" />
                    </Link>
                  </div>
                  
                  {/* Restaurants */}
                  <div className="flex justify-between items-center group hover:bg-gray-100 rounded-lg p-2 transition-all duration-200">
                    <Utensils className="h-5 w-5 text-rahati-purple" />
                    <Link to="/" className="text-lg font-medium text-gray-800 group-hover:text-rahati-purple transition-colors flex items-center justify-between w-full">
                      <span>المطاعم</span>
                      <ChevronRight className="h-4 w-4 text-gray-400 rtl:rotate-180" />
                    </Link>
                  </div>
                  
                  {/* Cars */}
                  <div className="flex justify-between items-center group hover:bg-gray-100 rounded-lg p-2 transition-all duration-200">
                    <Car className="h-5 w-5 text-rahati-purple" />
                    <Link to="/" className="text-lg font-medium text-gray-800 group-hover:text-rahati-purple transition-colors flex items-center justify-between w-full">
                      <span>السيارات</span>
                      <ChevronRight className="h-4 w-4 text-gray-400 rtl:rotate-180" />
                    </Link>
                  </div>
                  
                  {/* Discounts */}
                  <div className="flex justify-between items-center group hover:bg-gray-100 rounded-lg p-2 transition-all duration-200">
                    <Percent className="h-5 w-5 text-rahati-purple" />
                    <Link to="/" className="text-lg font-medium text-gray-800 group-hover:text-rahati-purple transition-colors flex items-center justify-between w-full">
                      <span>التخفيضات</span>
                      <ChevronRight className="h-4 w-4 text-gray-400 rtl:rotate-180" />
                    </Link>
                  </div>

                  <Separator className="bg-gray-200" />
                  
                  {/* Create Store */}
                  <div className="flex justify-between items-center group hover:bg-gray-100 rounded-lg p-2 transition-all duration-200">
                    <Store className="h-5 w-5 text-green-600" />
                    <Link 
                      to="/add-store"
                      className="text-lg font-medium text-gray-800 group-hover:text-green-600 transition-colors flex items-center justify-between w-full"
                    >
                      <span>إنشاء متجر</span>
                      <ChevronRight className="h-4 w-4 text-gray-400 rtl:rotate-180" />
                    </Link>
                  </div>
                  
                  {/* User Orders - Only show when logged in */}
                  {isLoggedIn && (
                    <div className="flex justify-between items-center group hover:bg-gray-100 rounded-lg p-2 transition-all duration-200">
                      <Package className="h-5 w-5 text-rahati-purple" />
                      <Link 
                        to="/orders"
                        className="text-lg font-medium text-gray-800 group-hover:text-rahati-purple transition-colors flex items-center justify-between w-full"
                      >
                        <span>طلباتي</span>
                        <ChevronRight className="h-4 w-4 text-gray-400 rtl:rotate-180" />
                      </Link>
                    </div>
                  )}
                  
                  {/* Change Language */}
                  <div className="flex justify-between items-center group hover:bg-gray-100 rounded-lg p-2 transition-all duration-200">
                    <Globe className="h-5 w-5 text-blue-500" />
                    <button 
                      onClick={onLanguageClick}
                      className="text-lg font-medium text-gray-800 group-hover:text-blue-500 transition-colors flex items-center justify-between w-full"
                    >
                      <span>تغيير اللغة</span>
                      <ChevronRight className="h-4 w-4 text-gray-400 rtl:rotate-180" />
                    </button>
                  </div>
                  
                  {/* Contact Us */}
                  <div className="flex justify-between items-center group hover:bg-gray-100 rounded-lg p-2 transition-all duration-200">
                    <Mail className="h-5 w-5 text-orange-500" />
                    <a 
                      href="mailto:info@rahati.com" 
                      className="text-lg font-medium text-gray-800 group-hover:text-orange-500 transition-colors flex items-center justify-between w-full"
                    >
                      <span>اتصل بنا</span>
                      <ChevronRight className="h-4 w-4 text-gray-400 rtl:rotate-180" />
                    </a>
                  </div>
                  
                  {/* About Us */}
                  <div className="flex justify-between items-center group hover:bg-gray-100 rounded-lg p-2 transition-all duration-200">
                    <Info className="h-5 w-5 text-purple-500" />
                    <Link to="/" className="text-lg font-medium text-gray-800 group-hover:text-purple-500 transition-colors flex items-center justify-between w-full">
                      <span>من نحن</span>
                      <ChevronRight className="h-4 w-4 text-gray-400 rtl:rotate-180" />
                    </Link>
                  </div>

                  {/* Technical Support */}
                  <div className="flex justify-between items-center group hover:bg-gray-100 rounded-lg p-2 transition-all duration-200">
                    <Phone className="h-5 w-5 text-green-600" />
                    <button 
                      onClick={handleWhatsAppSupport}
                      className="text-lg font-medium text-gray-800 group-hover:text-green-600 transition-colors flex items-center justify-between w-full"
                    >
                      <span>الدعم الفني: 31465497</span>
                      <ChevronRight className="h-4 w-4 text-gray-400 rtl:rotate-180" />
                    </button>
                  </div>
                </nav>
              </div>
            </div>
          </div>
          
          {/* Social Media Links */}
          <div className="p-6 border-t border-gray-200 bg-white">
            <h3 className="text-md font-medium mb-3 text-center">تواصل معنا</h3>
            <div className="flex justify-between items-center">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-colors shadow-sm"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-pink-500 text-white p-3 rounded-full hover:bg-pink-600 transition-colors shadow-sm"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://tiktok.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-black text-white p-3 rounded-full hover:bg-gray-800 transition-colors shadow-sm"
                aria-label="TikTok"
              >
                <TikTok />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition-colors shadow-sm"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a 
                href="https://snapchat.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-yellow-400 text-white p-3 rounded-full hover:bg-yellow-500 transition-colors shadow-sm"
                aria-label="Snapchat"
              >
                <Snapchat />
              </a>
            </div>
          </div>

          {/* WhatsApp Support */}
          <div className="p-4 bg-green-50 border-t border-green-200">
            <button 
              onClick={handleWhatsAppSupport}
              className="w-full flex items-center justify-center gap-2 bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-colors shadow-md"
            >
              <MessagesSquare className="h-5 w-5" />
              <span>تواصل معنا عبر واتساب</span>
            </button>
          </div>
          
          {/* Footer */}
          <div className="py-4 px-6 text-center bg-gray-50 border-t border-gray-200">
            <p className="text-gray-500 text-sm">جميع الحقوق محفوظة © 2025 راحتي</p>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default Sidebar;
