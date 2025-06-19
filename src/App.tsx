
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AddStorePage from "./pages/AddStorePage";
import NotFound from "./pages/NotFound";
import { isAuthenticated } from "@/services/api";
import { AuthProvider } from "@/hooks/useAuthContext";
import StoreManagementPage from "./pages/StoreManagementPage";
import AccountPage from "./pages/AccountPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected route component
const ProtectedRoute = ({ children }) => {
  const isAuth = isAuthenticated();
  
  if (!isAuth) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const App = () => {
  const [language, setLanguage] = useState<string>("ar");
  
  // Set RTL or LTR based on language
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route 
                path="/" 
                element={<HomePage language={language} onLanguageChange={setLanguage} />} 
              />
              <Route 
                path="/add-store" 
                element={<AddStorePage />} 
              />
              <Route 
                path="/store-management" 
                element={
                  <ProtectedRoute>
                    <StoreManagementPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/account" 
                element={
                  <ProtectedRoute>
                    <AccountPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/orders" 
                element={
                  <ProtectedRoute>
                    <OrdersPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/orders/:orderId" 
                element={
                  <ProtectedRoute>
                    <OrderDetailsPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
