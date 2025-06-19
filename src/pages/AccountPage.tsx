
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { 
  User, 
  Package, 
  LogOut, 
  Store, 
  ShoppingBag, 
  Settings, 
  Edit 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Profile form schema
const profileFormSchema = z.object({
  name: z.string().min(2, { message: "الاسم يجب أن يكون حرفين على الأقل" }),
  email: z.string().email({ message: "يرجى إدخال بريد إلكتروني صحيح" }),
  phone: z.string().optional(),
  address: z.string().optional(),
});

const AccountPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  // Initialize form with user data
  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      address: '',
    },
  });

  const onSubmit = (values: z.infer<typeof profileFormSchema>) => {
    // Here you would send an API request to update the user profile
    console.log("Updated profile:", values);
    
    toast({
      title: "تم التحديث",
      description: "تم تحديث معلومات الحساب بنجاح",
    });
    
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const openStore = () => {
    if (user?.storeId) {
      navigate('/store-management');
    } else {
      navigate('/add-store');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">حسابي</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left sidebar */}
          <div className="lg:w-1/3">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4 ring-2 ring-rahati-purple/20 ring-offset-2">
                  <AvatarImage src="/lovable-uploads/0950e701-254f-41c2-9f33-1fa067702b38.png" alt={user?.name} />
                  <AvatarFallback className="bg-rahati-purple text-white text-xl">
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{user?.name}</CardTitle>
                <CardDescription>{user?.email}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/orders')}
                  >
                    <Package className="mr-2 h-4 w-4" />
                    <span>طلباتي</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={openStore}
                  >
                    <Store className="mr-2 h-4 w-4" />
                    <span>{user?.storeId ? 'إدارة المتجر' : 'إنشاء متجر'}</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/')}
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    <span>تسوق الآن</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>تسجيل الخروج</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content */}
          <div className="flex-1">
            <Tabs defaultValue="profile">
              <TabsList className="bg-white rounded-lg mb-6 p-1 border">
                <TabsTrigger value="profile" className="data-[state=active]:bg-rahati-purple data-[state=active]:text-white">
                  <User className="h-4 w-4 mr-2" />
                  <span>الملف الشخصي</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-rahati-purple data-[state=active]:text-white">
                  <Settings className="h-4 w-4 mr-2" />
                  <span>الإعدادات</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>معلومات الحساب</CardTitle>
                      <CardDescription>تحديث معلومات الملف الشخصي</CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      <span>{isEditing ? 'إلغاء' : 'تعديل'}</span>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>الاسم</FormLabel>
                                <FormControl>
                                  <Input placeholder="الاسم الكامل" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>البريد الإلكتروني</FormLabel>
                                <FormControl>
                                  <Input placeholder="البريد الإلكتروني" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>رقم الهاتف (اختياري)</FormLabel>
                                <FormControl>
                                  <Input placeholder="رقم الهاتف" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>العنوان (اختياري)</FormLabel>
                                <FormControl>
                                  <Input placeholder="العنوان" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="flex justify-end">
                            <Button type="submit" className="bg-rahati-purple hover:bg-rahati-purple/90">
                              حفظ التغييرات
                            </Button>
                          </div>
                        </form>
                      </Form>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">الاسم</h3>
                            <p className="mt-1">{user?.name}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">البريد الإلكتروني</h3>
                            <p className="mt-1">{user?.email}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">نوع الحساب</h3>
                            <p className="mt-1">
                              {user?.role === 'admin' ? 'مدير' : 
                               user?.role === 'store_owner' ? 'صاحب متجر' : 'مستخدم'}
                            </p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">تاريخ الانضمام</h3>
                            <p className="mt-1">منذ 3 أشهر</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>إعدادات الحساب</CardTitle>
                    <CardDescription>إدارة تفضيلات الحساب والإشعارات والأمان</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">تفضيلات الإشعارات</h3>
                        <div className="space-y-4">
                          {/* Notification settings would go here */}
                          <p className="text-center text-gray-500 py-4">
                            تفضيلات الإشعارات قيد التطوير
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-4">الأمان</h3>
                        <div className="space-y-4">
                          <Button variant="outline" className="w-full justify-start">
                            تغيير كلمة المرور
                          </Button>
                          <Button variant="destructive" className="w-full justify-start" onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>تسجيل الخروج من جميع الأجهزة</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
