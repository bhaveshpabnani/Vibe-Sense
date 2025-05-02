import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { SidebarProvider } from "@/context/SidebarContext";
import { Loader2 } from "lucide-react";
import { ChatHistoryProvider } from "@/components/layout/Sidebar";

// Pages
import Login from "./pages/Login";
import HRDashboard from "./pages/HRDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import NotFound from "./pages/NotFound";
import Sidebar from "./components/layout/Sidebar";
import Index from "./pages/Index";

// HR Pages
import Employees from "./pages/hr/Employees";
import HRCalendar from "./pages/hr/Calendar";
import Reports from "./pages/hr/Reports";
import Settings from "./pages/hr/Settings";

// Employee Pages
import Chat from "./pages/employee/Chat";
import QAndA from "./pages/employee/QAndA";
import History from "./pages/employee/History";
import EmployeeSettings from "./pages/employee/Settings";

const queryClient = new QueryClient();  

// Protected route component with improved loading and authentication handling
const ProtectedRoute = ({ 
  children, 
  requiredRole 
}: { 
  children: JSX.Element, 
  requiredRole?: "hr" | "employee" 
}) => {
  const { user, isLoading } = useAuth();
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 size={48} className="animate-spin text-primary mb-4" />
          <p className="text-lg">Verifying your access...</p>
        </div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Redirect to appropriate dashboard if role doesn't match
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === "hr" ? "/hr/dashboard" : "/employee/dashboard"} replace />;
  }
  
  // Render children if all checks pass
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();
  
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Index />} />
      
      {/* HR Routes */}
      <Route path="/hr/dashboard" element={
        <ProtectedRoute requiredRole="hr">
          <HRDashboard />
        </ProtectedRoute>
      } />
      <Route path="/hr/employees" element={
        <ProtectedRoute requiredRole="hr">
          <Employees />
        </ProtectedRoute>
      } />
      <Route path="/hr/calendar" element={
        <ProtectedRoute requiredRole="hr">
          <HRCalendar />
        </ProtectedRoute>
      } />
      <Route path="/hr/reports" element={
        <ProtectedRoute requiredRole="hr">
          <Reports />
        </ProtectedRoute>
      } />
      <Route path="/hr/settings" element={
        <ProtectedRoute requiredRole="hr">
          <Settings />
        </ProtectedRoute>
      } />
      
      {/* Employee Routes */}
      <Route path="/employee/dashboard" element={
        <ProtectedRoute requiredRole="employee">
          <EmployeeDashboard />
        </ProtectedRoute>
      } />
      <Route path="/employee/chat" element={
        <ProtectedRoute requiredRole="employee">
          <Chat />
        </ProtectedRoute>
      } />
      <Route path="/employee/chat/:chatId" element={
        <ProtectedRoute requiredRole="employee">
          <Chat />
        </ProtectedRoute>
      } />
      <Route path="/employee/qa" element={
        <ProtectedRoute requiredRole="employee">
          <QAndA />
        </ProtectedRoute>
      } />
      <Route path="/employee/history" element={
        <ProtectedRoute requiredRole="employee">
          <History />
        </ProtectedRoute>
      } />
      <Route path="/employee/settings" element={
        <ProtectedRoute requiredRole="employee">
          <EmployeeSettings />
        </ProtectedRoute>
      } />
      
      {/* 404 Page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// Main App component with Sidebar rendering only for authenticated routes
const App = () => {
  const { user, isLoading } = useAuth();
  
  return (
    <div className="flex min-h-screen w-full">
      {user && !isLoading && <Sidebar />}
      <div className="flex-1">
        <AppRoutes />
      </div>
      <Toaster />
      <Sonner />
    </div>
  );
};

// Root component with all providers
const Root = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <SidebarProvider>
          <ChatHistoryProvider>
            <BrowserRouter>
              <div className="flex min-h-screen w-full">
                <ProtectedRoute>
                  <Sidebar />
                </ProtectedRoute>
                <div className="flex-1">
                  <AppRoutes />
                </div>
              </div>
              <Toaster />
              <Sonner />
            </BrowserRouter>
          </ChatHistoryProvider>
        </SidebarProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default Root;
