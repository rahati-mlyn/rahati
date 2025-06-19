
import React from 'react';
import { Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const AddStoreButton = () => {
  return (
    <Button 
      variant="outline" 
      className="bg-rahati-yellow text-rahati-dark hover:bg-rahati-yellow/90 flex items-center gap-1 shadow-sm hover:shadow-md transition-all duration-300"
      asChild
    >
      <Link to="/add-store">
        <Store className="h-4 w-4" />
        <span>إنشاء متجر</span>
      </Link>
    </Button>
  );
};

export default AddStoreButton;
