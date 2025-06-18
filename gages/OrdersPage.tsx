
import React, { useState, useEffect } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { getUserOrders } from '@/services/api';
import { OrderResponse } from '@/types/apiTypes';
import { useAuth } from '@/hooks/useAuthContext';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

const OrdersPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();

  const { data: ordersData } = useQuery({
    queryKey: ['orders'],
    queryFn: getUserOrders,
    meta: {
      onError: (error: Error) => {
        console.error("Error fetching orders:", error);
        toast({
          variant: "destructive",
          title: "خطأ",
          description: "حدث خطأ أثناء جلب الطلبات"
        });
      }
    }
  });

  useEffect(() => {
    if (ordersData) {
      setOrders(ordersData);
      setIsLoading(false);
    }
  }, [ordersData]);

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return order.status === 'pending';
    if (activeTab === 'preparing') return order.status === 'preparing';
    if (activeTab === 'shipping') return order.status === 'shipping';
    if (activeTab === 'delivered') return order.status === 'delivered';
    if (activeTab === 'rejected') return order.status === 'rejected';
    return true;
  });

  const handleContact = (phone: string) => {
    window.open(`https://wa.me/${phone}`, '_blank');
  };

  const renderOrderStatus = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <div className="flex items-center text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full text-sm">
            <Clock className="h-4 w-4 mr-2" />
            <span>معلّق</span>
          </div>
        );
      case 'preparing':
        return (
          <div className="flex items-center text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-sm">
            <Package className="h-4 w-4 mr-2" />
            <span>جاري التجهيز</span>
          </div>
        );
      case 'shipping':
        return (
          <div className="flex items-center text-purple-600 bg-purple-50 px-3 py-1 rounded-full text-sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            <span>جاري الإرسال</span>
          </div>
        );
      case 'delivered':
        return (
          <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm">
            <CheckCircle className="h-4 w-4 mr-2" />
            <span>تم الاستلام</span>
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center text-red-600 bg-red-50 px-3 py-1 rounded-full text-sm">
            <XCircle className="h-4 w-4 mr-2" />
            <span>مرفوض</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">طلباتي</h1>
          <p className="mt-2 text-gray-600">جميع طلباتك السابقة وحالتها</p>
        </div>

        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList className="bg-white rounded-lg mb-6 p-1 border">
            <TabsTrigger value="all" className="data-[state=active]:bg-rahati-purple data-[state=active]:text-white">
              جميع الطلبات
            </TabsTrigger>
            <TabsTrigger value="pending" className="data-[state=active]:bg-rahati-purple data-[state=active]:text-white">
              معلقة
            </TabsTrigger>
            <TabsTrigger value="preparing" className="data-[state=active]:bg-rahati-purple data-[state=active]:text-white">
              قيد التجهيز
            </TabsTrigger>
            <TabsTrigger value="shipping" className="data-[state=active]:bg-rahati-purple data-[state=active]:text-white">
              قيد الإرسال
            </TabsTrigger>
            <TabsTrigger value="delivered" className="data-[state=active]:bg-rahati-purple data-[state=active]:text-white">
              تم الاستلام
            </TabsTrigger>
            <TabsTrigger value="rejected" className="data-[state=active]:bg-rahati-purple data-[state=active]:text-white">
              مرفوضة
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-rahati-purple border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-4 text-gray-600">جاري تحميل الطلبات...</p>
              </div>
            ) : filteredOrders.length > 0 ? (
              <div className="space-y-6">
                {filteredOrders.map((order) => (
                  <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardHeader className="pb-0">
                      <div className="flex justify-between items-center flex-wrap gap-4">
                        <div>
                          <CardTitle className="text-lg">
                            طلب #{order.id.slice(0, 6)}
                          </CardTitle>
                          <CardDescription>
                            {new Date(order.orderDate).toLocaleDateString('ar-EG', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </CardDescription>
                        </div>
                        {renderOrderStatus(order.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-2">المنتجات:</h4>
                          <div className="space-y-2">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex justify-between text-sm border-b pb-2">
                                <div>
                                  <span className="font-medium">{item.name}</span>
                                  <span className="text-gray-500"> ({item.quantity} قطعة)</span>
                                </div>
                                <span className="font-semibold">{item.subtotal} أوقية</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex justify-between font-bold">
                          <span>الإجمالي:</span>
                          <span>{order.total} أوقية</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 justify-end mt-4">
                          <Button
                            variant="outline"
                            onClick={() => navigate(`/orders/${order.id}`)}
                          >
                            عرض التفاصيل
                          </Button>
                          
                          {order.status === 'rejected' && (
                            <Button 
                              onClick={() => handleContact('22231465497')}
                              className="bg-green-500 hover:bg-green-600"
                            >
                              تواصل مع المتجر
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <Package className="h-12 w-12 text-gray-400 mx-auto" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">لا توجد طلبات</h3>
                <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                  {activeTab === 'all' 
                    ? 'لم تقم بإجراء أي طلبات بعد. تصفح منتجاتنا وقم بإضافتها إلى سلة المشتريات.' 
                    : `ليس لديك طلبات ${
                        activeTab === 'pending' ? 'معلقة' :
                        activeTab === 'preparing' ? 'قيد التجهيز' :
                        activeTab === 'shipping' ? 'قيد الإرسال' :
                        activeTab === 'delivered' ? 'مستلمة' : 'مرفوضة'
                      } حالياً.`
                  }
                </p>
                <div className="mt-6">
                  <Button onClick={() => navigate('/')} className="bg-rahati-purple hover:bg-rahati-purple/90">
                    تصفح المنتجات
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OrdersPage;
