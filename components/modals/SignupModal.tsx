
import React, { useState } from 'react';
import { AtSign, Lock, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuthContext';
import { registerUser, googleLogin } from '@/services/api';
import { initializeGoogleAuth, signInWithGoogle } from '@/services/googleAuth';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({
  isOpen,
  onClose,
  onLoginClick
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { login } = useAuth();

  // Initialize Google Auth on component mount
  React.useEffect(() => {
    initializeGoogleAuth();
  }, []);

  const handleGoogleSignup = async () => {
    try {
      setIsLoading(true);
      const token = await signInWithGoogle();
      const response = await googleLogin(token);
      
      if (response.token) {
        login(response.token, response.user);
        onClose();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: error instanceof Error ? error.message : 'فشل في تسجيل الدخول باستخدام جوجل',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validatePhoneNumber = (phoneNumber: string) => {
    // Mauritanian phone number validation: 8 digits
    const phoneRegex = /^\d{8}$/;
    return phoneRegex.test(phoneNumber.replace(/\s+/g, ''));
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Limit to 8 digits for Mauritanian numbers
    return digits.slice(0, 8);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    setPhone(formattedPhone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !phone || !password) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "الرجاء ملء جميع الحقول",
      });
      return;
    }

    if (!validatePhoneNumber(phone)) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "الرجاء إدخال رقم هاتف موريتاني صحيح (8 أرقام)",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate signup process
      const response = await registerUser({ name, phone, password });
      
      if (response.token) {
        login(response.token, response.user);
        onClose();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: error instanceof Error ? error.message : 'حدث خطأ أثناء إنشاء الحساب',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const switchToLogin = () => {
    onClose();
    onLoginClick();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">إنشاء حساب جديد</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-4"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">الاسم</Label>
            <div className="relative">
              <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="أدخل اسمك"
                className="pl-3 pr-10"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">رقم الهاتف</Label>
            <div className="relative">
              <AtSign className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder="أدخل رقم الهاتف"
                className="pl-3 pr-10"
                value={phone}
                onChange={handlePhoneChange}
                required
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">كلمة المرور</Label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="أدخل كلمة المرور"
                className="pl-3 pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-rahati-purple hover:bg-rahati-purple/90"
            disabled={isLoading}
          >
            {isLoading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
          </Button>
        </form>
        
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-muted-foreground/30" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              أو باستخدام
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleGoogleSignup}
            disabled={isLoading}
          >
            Google
          </Button>
          <Button variant="outline" className="w-full" disabled={isLoading}>
            Facebook
          </Button>
        </div>
        
        <DialogFooter className="flex justify-center sm:justify-center">
          <div className="text-center text-sm">
            لديك حساب بالفعل؟{' '}
            <button
              type="button"
              className="text-rahati-purple hover:underline font-medium"
              onClick={switchToLogin}
              disabled={isLoading}
            >
              تسجيل الدخول
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SignupModal;
