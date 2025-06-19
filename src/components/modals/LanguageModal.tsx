
import React from 'react';
import { Languages, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

const LanguageModal: React.FC<LanguageModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onLanguageChange
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 justify-center">
            <Languages className="h-5 w-5" />
            <span>اختر اللغة</span>
          </DialogTitle>
          <DialogDescription className="sr-only">
            اختر لغة التطبيق المفضلة لديك
          </DialogDescription>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <RadioGroup 
            defaultValue={currentLanguage} 
            onValueChange={onLanguageChange}
            className="flex flex-col gap-4"
          >
            <div className="flex items-center space-x-2 space-x-reverse justify-end hover:bg-muted/50 p-2 rounded-md cursor-pointer">
              <Label 
                htmlFor="arabic" 
                className="text-base cursor-pointer flex-1 text-right"
              >
                العربية
              </Label>
              <RadioGroupItem value="ar" id="arabic" />
            </div>
            <div className="flex items-center space-x-2 space-x-reverse justify-end hover:bg-muted/50 p-2 rounded-md cursor-pointer">
              <Label 
                htmlFor="english" 
                className="text-base cursor-pointer flex-1 text-right"
              >
                English
              </Label>
              <RadioGroupItem value="en" id="english" />
            </div>
            <div className="flex items-center space-x-2 space-x-reverse justify-end hover:bg-muted/50 p-2 rounded-md cursor-pointer">
              <Label 
                htmlFor="french" 
                className="text-base cursor-pointer flex-1 text-right"
              >
                Français
              </Label>
              <RadioGroupItem value="fr" id="french" />
            </div>
          </RadioGroup>
          
          <DialogFooter>
            <Button type="submit" className="w-full bg-rahati-purple hover:bg-rahati-purple/90">
              تم
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LanguageModal;
