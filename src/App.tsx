import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Layout from "@/components/layout/Layout";
import Index from "./pages/Index";
import CalendarPage from "./pages/Calendar";
import ArenasPage from "./pages/Arenas";
import BookPage from "./pages/Book";
import DashboardPage from "./pages/Dashboard";
import AdminPage from "./pages/Admin";
import UserManagementPage from "./pages/UserManagement";
import PricingPage from "./pages/Pricing";
import ContactPage from "./pages/Contact";
import AuthPage from "./pages/Auth";
import NotFound from "./pages/NotFound";
import ScrollToTopOnNavigate from "./components/ScrollToTopOnNavigate";
import NavigationProgress from "./components/NavigationProgress";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <NavigationProgress />
          <ScrollToTopOnNavigate />
          <Routes>
            {/* Pages with full layout (Navbar + Footer + ScrollToTop) */}
            <Route path="/" element={<Layout><Index /></Layout>} />
            <Route path="/calendar" element={<Layout><CalendarPage /></Layout>} />
            <Route path="/arenas" element={<Layout><ArenasPage /></Layout>} />
            <Route path="/book" element={<Layout><BookPage /></Layout>} />
            <Route path="/pricing" element={<Layout><PricingPage /></Layout>} />
            <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <Layout><AdminPage /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute>
                <Layout><UserManagementPage /></Layout>
              </ProtectedRoute>
            } />
            
            {/* Pages with custom layouts (no Layout wrapper) */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Catch-all */}
            <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
