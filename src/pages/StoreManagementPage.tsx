
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  Package, 
  BarChart, 
  Store, 
  ShoppingBag, 
  Plus, 
  Search,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuthContext';
import { getStoreStats, getStoreProducts, getStoreOrders } from '@/services/api';
import { StoreStats, StoreProductResponse, OrderResponse } from '@/types/apiTypes';
import { BarChart as ReChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StoreManagementPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<StoreStats | null>(null);
  const [products, setProducts] = useState<StoreProductResponse[]>([]);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Redirect if user has no store
  useEffect(() => {
    if (!user?.storeId) {
      toast({
        title: "غير مصرح",
        description: "ليس لديك متجر بعد",
        variant: "destructive",
      });
      navigate('/add-store');
    }
  }, [user, navigate, toast]);

  // Fetch data based on active tab
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.storeId) return;
      
      setIsLoading(true);
      try {
        // Fetch stats for dashboard
        if (activeTab === 'dashboard') {
          const statsData = await getStoreStats(user.storeId);
          setStats(statsData);
        } 
        // Fetch products
        else if (activeTab === 'products') {
          const productsData = await getStoreProducts(user.storeId);
          setProducts(productsData);
        } 
        // Fetch orders
        else if (activeTab === 'orders') {
          const ordersStatus = filterStatus !== 'all' ? filterStatus : undefined;
          const ordersData = await getStoreOrders(user.storeId, ordersStatus);
          setOrders(ordersData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // Error already handled by API service
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeTab, user?.storeId, filterStatus]);

  // Filter products by search query
  const filteredProducts = searchQuery
    ? products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;

  // Format data for charts
  const weeklyOrdersData = stats ? [
    { name: 'اليوم', orders: stats.orders.pending },
    { name: 'الأسبوع', orders: stats.orders.completed },
    { name: 'الشهر', orders: stats.orders.total },
  ] : [];

  const renderDashboard = () => {
    if (isLoading) return <div className="text-center py-8">جاري تحميل البيانات...</div>;
    
    if (!stats) return <div className="text-center py-8">لا توجد إحصائيات متاحة</div>;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold">المشاهدات</CardTitle>
            <CardDescription>إجمالي مشاهدات المتجر</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.views.total}</div>
            <div className="grid grid-cols-3 mt-4 text-sm">
              <div>
                <div className="text-gray-500">اليوم</div>
                <div className="font-semibold">{stats.views.today}</div>
              </div>
              <div>
                <div className="text-gray-500">الأسبوع</div>
                <div className="font-semibold">{stats.views.thisWeek}</div>
              </div>
              <div>
                <div className="text-gray-500">الشهر</div>
                <div className="font-semibold">{stats.views.thisMonth}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold">الطلبات</CardTitle>
            <CardDescription>إحصائيات الطلبات</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.orders.total}</div>
            <div className="grid grid-cols-2 mt-4 text-sm">
              <div>
                <div className="text-gray-500">معلقة</div>
                <div className="font-semibold">{stats.orders.pending}</div>
              </div>
              <div>
                <div className="text-gray-500">مكتملة</div>
                <div className="font-semibold">{stats.orders.completed}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold">المبيعات</CardTitle>
            <CardDescription>إجمالي المبيعات</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.revenue.total} أوقية</div>
            <div className="grid grid-cols-3 mt-4 text-sm">
              <div>
                <div className="text-gray-500">اليوم</div>
                <div className="font-semibold">{stats.revenue.today} أوقية</div>
              </div>
              <div>
                <div className="text-gray-500">الأسبوع</div>
                <div className="font-semibold">{stats.revenue.thisWeek} أوقية</div>
              </div>
              <div>
                <div className="text-gray-500">الشهر</div>
                <div className="font-semibold">{stats.revenue.thisMonth} أوقية</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Orders Chart */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>الطلبات</CardTitle>
            <CardDescription>إحصائيات الطلبات خلال الفترة الأخيرة</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ReChart
                  data={weeklyOrdersData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#8884d8" />
                </ReChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Top Products */}
        <Card className="col-span-full md:col-span-2">
          <CardHeader>
            <CardTitle>أفضل المنتجات مبيعاً</CardTitle>
            <CardDescription>المنتجات الأكثر مبيعاً في متجرك</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.topProducts.length > 0 ? (
              <div className="space-y-4">
                {stats.topProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <span className="font-medium">{product.name}</span>
                    <span className="text-sm text-gray-600">{product.sales} مبيعات</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                لا توجد مبيعات بعد
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderProducts = () => {
    if (isLoading) return <div className="text-center py-8">جاري تحميل البيانات...</div>;
    
    return (
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="البحث عن منتج..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4"
            />
          </div>
          <Button onClick={() => navigate('/add-product')} className="bg-rahati-purple hover:bg-rahati-purple/90">
            <Plus className="h-4 w-4 mr-2" />
            <span>إضافة منتج</span>
          </Button>
        </div>
        
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <div className={`px-2 py-1 text-xs rounded-full ${
                      product.status === 'approved' ? 'bg-green-100 text-green-800' :
                      product.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {product.status === 'approved' ? 'مقبول' : 
                       product.status === 'pending' ? 'معلق' : 'مرفوض'}
                    </div>
                  </div>
                  <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="font-bold text-lg">{product.price} أوقية</div>
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <Button variant="outline" size="sm" onClick={() => navigate(`/edit-product/${product.id}`)}>
                        تعديل
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">لا توجد منتجات</h3>
            <p className="mt-2 text-sm text-gray-500">
              قم بإضافة منتجات جديدة لعرضها في متجرك
            </p>
            <div className="mt-6">
              <Button onClick={() => navigate('/add-product')} className="bg-rahati-purple hover:bg-rahati-purple/90">
                <Plus className="h-4 w-4 mr-2" />
                <span>إضافة منتج جديد</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderOrders = () => {
    if (isLoading) return <div className="text-center py-8">جاري تحميل البيانات...</div>;

    // Filter options
    const filterOptions = [
      { value: 'all', label: 'جميع الطلبات' },
      { value: 'pending', label: 'معلقة' },
      { value: 'preparing', label: 'قيد التجهيز' },
      { value: 'shipping', label: 'قيد الإرسال' },
      { value: 'delivered', label: 'تم التوصيل' },
      { value: 'rejected', label: 'مرفوضة' },
    ];

    return (
      <div>
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-2">تصفية حسب الحالة</div>
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <Button
                key={option.value}
                variant={filterStatus === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus(option.value)}
                className={filterStatus === option.value ? "bg-rahati-purple hover:bg-rahati-purple/90" : ""}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
        
        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">طلب #{order.id.slice(0, 6)}</CardTitle>
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
                    <div className={`px-3 py-1 text-sm rounded-full ${
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
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-gray-500">المنتجات:</div>
                    {order.items.filter(item => item.storeId === user?.storeId).map((item) => (
                      <div key={item.id} className="flex justify-between border-b pb-2">
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-500">{item.quantity} x {item.price} أوقية</div>
                        </div>
                        <div className="font-bold">{item.subtotal} أوقية</div>
                      </div>
                    ))}
                    <div className="flex justify-between pt-2">
                      <div className="font-semibold">المجموع</div>
                      <div className="font-bold">{order.items
                        .filter(item => item.storeId === user?.storeId)
                        .reduce((sum, item) => sum + item.subtotal, 0)} أوقية</div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex flex-wrap gap-2 justify-end">
                    <Button 
                      variant="outline" 
                      onClick={() => navigate(`/order-details/${order.id}`)}
                    >
                      عرض التفاصيل
                    </Button>
                    {order.status === 'pending' && (
                      <>
                        <Button
                          onClick={() => {}} // To be implemented
                          className="bg-blue-500 hover:bg-blue-600"
                        >
                          قبول الطلب
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => {}} // To be implemented
                        >
                          رفض الطلب
                        </Button>
                      </>
                    )}
                    {order.status === 'preparing' && (
                      <Button
                        onClick={() => {}} // To be implemented
                        className="bg-purple-500 hover:bg-purple-600"
                      >
                        إرسال الطلب
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">لا توجد طلبات</h3>
            <p className="mt-2 text-sm text-gray-500">
              ستظهر الطلبات الجديدة هنا عندما يقوم العملاء بالطلب من متجرك
            </p>
          </div>
        )}
      </div>
    );
  };

  // Check if user has a store
  if (!user?.storeId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
            <CardTitle className="text-center mt-4">ليس لديك متجر</CardTitle>
            <CardDescription className="text-center">
              يجب إنشاء متجر أولاً للوصول إلى لوحة التحكم
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button 
              onClick={() => navigate('/add-store')}
              className="bg-rahati-purple hover:bg-rahati-purple/90"
            >
              <Store className="h-4 w-4 mr-2" />
              <span>إنشاء متجر جديد</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">لوحة تحكم المتجر</h1>
          <p className="mt-2 text-lg text-gray-600">مرحباً بك في لوحة تحكم متجرك</p>
        </div>
        
        <Tabs defaultValue="dashboard" onValueChange={setActiveTab}>
          <TabsList className="mb-8 bg-white p-1 rounded-lg border">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-rahati-purple data-[state=active]:text-white">
              <BarChart className="h-4 w-4 mr-2" />
              <span>الإحصائيات</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-rahati-purple data-[state=active]:text-white">
              <ShoppingBag className="h-4 w-4 mr-2" />
              <span>المنتجات</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-rahati-purple data-[state=active]:text-white">
              <Package className="h-4 w-4 mr-2" />
              <span>الطلبات</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            {renderDashboard()}
          </TabsContent>
          
          <TabsContent value="products">
            {renderProducts()}
          </TabsContent>
          
          <TabsContent value="orders">
            {renderOrders()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StoreManagementPage;
