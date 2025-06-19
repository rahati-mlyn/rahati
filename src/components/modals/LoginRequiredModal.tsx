import React from 'react';
import { AlertTriangle, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

const LoginRequiredModal: React.FC<LoginRequiredModalProps> = ({
  isOpen,
  onClose,
  onLogin
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
            <AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
          </div>
          <DialogTitle className="text-xl font-semibold">تسجيل الدخول مطلوب</DialogTitle>
          <DialogDescription className="text-center mt-2">
            يرجى تسجيل الدخول أولاً لضمان توصيل المنتجات إليك بشكل صحيح وآمن.
            <br />
            <span className="text-sm text-muted-foreground mt-2 block">
              تسجيل الدخول يساعدنا في تتبع طلباتك وإرسال التحديثات المهمة
            </span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-3 mt-6">
          <Button 
            onClick={onLogin}
            className="w-full bg-rahati-purple hover:bg-rahati-purple/90"
          >
            <LogIn className="mr-2 h-4 w-4" />
            تسجيل الدخول
          </Button>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="w-full"
          >
            إلغاء
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginRequiredModal;

