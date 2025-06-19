import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Store, UploadCloud, Building, Phone, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { createStore } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(3, { message: 'يجب أن يكون اسم المتجر أكثر من 3 أحرف' }),
  description: z.string().min(10, { message: 'يجب أن يكون الوصف أكثر من 10 أحرف' }),
  type: z.enum(['store', 'restaurant', 'realestate', 'car']),
  contactPhone: z.string().regex(/^\d{8}$/, { message: 'يرجى إدخال رقم هاتف موريتاني صحيح (8 أرقام)' }),
  city: z.string().min(2, { message: 'يرجى اختيار مدينة' }),
  deliveryPrice: z.number().min(0, { message: 'سعر التوصيل يجب أن يكون 0 أو أكثر' }),
});

const AddStorePage = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      type: 'store',
      contactPhone: '',
      city: '',
      deliveryPrice: 0,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const storeData = {
        name: values.name,
        description: values.description,
        type: values.type,
        contactPhone: values.contactPhone,
        city: values.city,
        deliveryPrice: values.deliveryPrice,
        image: selectedImage || undefined,
      };

      await createStore(storeData);
      
      toast({
        title: "تم إرسال طلبك",
        description: "سنقوم بمراجعة طلبك وإعلامك بالقرار قريباً",
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error creating store:', error);
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-rahati-purple">إضافة متجر جديد</CardTitle>
            <CardDescription>أنشئ متجرك الخاص وابدأ البيع على منصتنا</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Image Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {previewUrl ? (
                    <div className="relative w-full h-48 mx-auto mb-4">
                      <img src={previewUrl} alt="Store Preview" className="h-full mx-auto object-contain" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setSelectedImage(null);
                          setPreviewUrl(null);
                        }}
                      >
                        حذف
                      </Button>
                    </div>
                  ) : (
                    <UploadCloud className="h-12 w-12 mx-auto text-gray-400" />
                  )}
                  <label
                    htmlFor="storeImage"
                    className="mt-2 cursor-pointer block text-sm font-medium text-gray-700"
                  >
                    <span className="mt-2 block text-sm font-medium text-gray-700">
                      {previewUrl ? 'تغيير الصورة' : 'قم بإرفاق صورة للمتجر'}
                    </span>
                    <span className="mt-1 block text-xs text-gray-500">
                      PNG, JPG, GIF up to 5MB
                    </span>
                    <Input
                      id="storeImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="sr-only"
                    />
                  </label>
                </div>

                {/* Store Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>اسم المتجر</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Store className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input
                            placeholder="أدخل اسم المتجر"
                            className="pl-3 pr-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Store Type */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>نوع المتجر</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر نوع المتجر" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="store">متجر عام</SelectItem>
                          <SelectItem value="restaurant">مطعم</SelectItem>
                          <SelectItem value="realestate">عقارات</SelectItem>
                          <SelectItem value="car">سيارات</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        حدد النوع بدقة ليظهر المتجر في القسم المناسب
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>وصف المتجر</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="اكتب وصفاً مختصراً عن متجرك والمنتجات التي تقدمها"
                          className="resize-none min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Contact Phone */}
                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>رقم التواصل</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input
                            type="tel"
                            placeholder="أدخل رقم الهاتف"
                            className="pl-3 pr-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        سيتم استخدام هذا الرقم للتواصل بخصوص الطلبات
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* City */}
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>المدينة</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input
                            placeholder="أدخل اسم المدينة"
                            className="pl-3 pr-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Delivery Price */}
                <FormField
                  control={form.control}
                  name="deliveryPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>سعر التوصيل (أوقية)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="أدخل سعر التوصيل"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        سعر التوصيل الذي سيتم إضافته لكل طلب من متجرك
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full bg-rahati-purple hover:bg-rahati-purple/90"
                    disabled={isLoading}
                  >
                    {isLoading ? 'جاري الإرسال...' : 'إرسال طلب إنشاء المتجر'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddStorePage;
