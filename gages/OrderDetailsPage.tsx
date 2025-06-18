
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  ShoppingBag, 
  CheckCircle, 
  XCircle,
  Clock,
  Store
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getOrderDetails } from '@/services/api';
import { OrderResponse } from '@/types/apiTypes';

const OrderDetailsPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) return;
      
      setIsLoading(true);
      try {
        const orderData = await getOrderDetails(orderId);
        setOrder(orderData);
      } catch (error) {
        console.error("Error fetching order details:", error);
        toast({
          title: "خطأ",
          description: "تعذر تحميل تفاصيل الطلب",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, toast]);

  const contactStore = (phone: string) => {
    window.open(`https://wa.me/${phone}`, '_blank');
  };

  // Group items by store
  const itemsByStore = order?.items.reduce((acc, item) => {
    if (!acc[item.storeId]) {
      acc[item.storeId] = [];
    }
    acc[item.storeId].push(item);
    return acc;
  }, {} as Record<string, typeof order.items>) || {};

  // Render order status steps
  const renderOrderStatusSteps = () => {
    if (!order) return null;
    
    const statuses = [
      { key: 'pending', label: 'معلق', icon: Clock },
      { key: 'preparing', label: 'قيد التجهيز', icon: Package },
      { key: 'shipping', label: 'قيد الإرسال', icon: Truck },
      { key: 'delivered', label: 'تم الاستلام', icon: CheckCircle },
    ];
    
    // Find current status index
    const currentIndex = statuses.findIndex(s => s.key === order.status);
    
    // Special case for rejected orders
    if (order.status === 'rejected') {
      return (
        <div className="flex justify-center items-center p-8 bg-red-50 rounded-lg mb-8">
          <XCircle className="h-12 w-12 text-red-500 mr-4" />
          <div>
            <h3 className="text-lg font-semibold text-red-700">تم رفض الطلب</h3>
            <p className="text-sm text-red-600">
              لمزيد من المعلومات، يرجى التواصل مع المتجر
            </p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="mb-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-gray-200"></div>
          </div>
          <div className="relative flex justify-between">
            {statuses.map((status, index) => {
              const StatusIcon = status.icon;
              const isActive = index <= currentIndex;
              const isComplete = index < currentIndex;
              
              return (
                <div key={status.key} className="text-center">
                  <div className="flex flex-col items-center">
                    <div 
                      className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                        isActive ? 'border-rahati-purple bg-rahati-purple text-white' : 'border-gray-300 bg-white text-gray-400'
                      }`}
                    >
                      {isComplete ? <CheckCircle className="h-5 w-5" /> : <StatusIcon className="h-5 w-5" />}
                    </div>
                    <div className="mt-2 text-sm font-medium text-gray-700">{status.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-rahati-purple border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل تفاصيل الطلب...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <XCircle className="h-12 w-12 text-red-500 mx-auto" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">لم يتم العثور على الطلب</h3>
            <p className="mt-2 text-sm text-gray-500">
              لم نتمكن من العثور على تفاصيل الطلب المطلوب
            </p>
            <div className="mt-6">
              <Button onClick={() => navigate('/orders')} className="bg-rahati-purple hover:bg-rahati-purple/90">
                <ArrowLeft className="h-4 w-4 mr-2" />
                العودة إلى الطلبات
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">تفاصيل الطلب #{orderId?.slice(0, 6)}</h1>
          <Button 
            variant="outline" 
            onClick={() => navigate('/orders')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>العودة</span>
          </Button>
        </div>
        
        {renderOrderStatusSteps()}
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>معلومات الطلب</CardTitle>
            <CardDescription>تفاصيل ومعلومات الطلب</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-500">رقم الطلب</div>
                  <div className="mt-1">{order.id}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">تاريخ الطلب</div>
                  <div className="mt-1">
                    {new Date(order.orderDate).toLocaleDateString('ar-EG', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">حالة الطلب</div>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'shipping' ? 'bg-purple-100 text-purple-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status === 'pending' ? 'معلق' : 
                       order.status === 'preparing' ? 'قيد التجهيز' : 
                       order.status === 'shipping' ? 'قيد الإرسال' : 
                       order.status === 'delivered' ? 'تم التوصيل' : 'مرفوض'}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">إجمالي الطلب</div>
                  <div className="mt-1 font-bold">{order.total} أوقية</div>
                </div>
              </div>
              
              {/* Tracking info if available */}
              {order.trackingInfo && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">معلومات التتبع</h4>
                  {order.trackingInfo.trackingNumber && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">رقم التتبع:</span>
                      <span className="font-medium">{order.trackingInfo.trackingNumber}</span>
                    </div>
                  )}
                  {order.trackingInfo.estimatedDelivery && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">موعد التسليم المتوقع:</span>
                      <span className="font-medium">{new Date(order.trackingInfo.estimatedDelivery).toLocaleDateString('ar-EG')}</span>
                    </div>
                  )}
                  {order.trackingInfo.lastUpdate && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">آخر تحديث:</span>
                      <span className="font-medium">{new Date(order.trackingInfo.lastUpdate).toLocaleDateString('ar-EG', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Items by store */}
        {Object.entries(itemsByStore).map(([storeId, items]) => (
          <Card key={storeId} className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Store className="mr-2 h-5 w-5 text-rahati-purple" />
                    <span>منتجات من {storeId}</span>
                  </CardTitle>
                  <CardDescription>
                    {items.length} {items.length === 1 ? 'منتج' : 'منتجات'}
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => contactStore('22231465497')}
                  className="text-green-600 border-green-600 hover:bg-green-50"
                >
                  تواصل مع المتجر
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b">
                    <div className="flex items-center">
                      <ShoppingBag className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-500">
                          {item.quantity} × {item.price} أوقية
                        </div>
                      </div>
                    </div>
                    <div className="font-bold">{item.subtotal} أوقية</div>
                  </div>
                ))}
                <div className="flex justify-between pt-2 font-bold">
                  <div>المجموع الفرعي</div>
                  <div>{items.reduce((sum, item) => sum + item.subtotal, 0)} أوقية</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Actions for rejected orders */}
        {order.status === 'rejected' && (
          <div className="flex justify-center mt-8">
            <Button 
              onClick={() => contactStore('22231465497')}
              className="bg-green-500 hover:bg-green-600"
            >
              تواصل مع المتجر لحل المشكلة
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailsPage;
