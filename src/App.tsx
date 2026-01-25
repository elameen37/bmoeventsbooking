import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CalendarPage from "./pages/Calendar";
import ArenasPage from "./pages/Arenas";
import BookPage from "./pages/Book";
import DashboardPage from "./pages/Dashboard";
import PricingPage from "./pages/Pricing";
import ContactPage from "./pages/Contact";
import AuthPage from "./pages/Auth";
import NotFound from "./pages/NotFound";
import ScrollToTopOnNavigate from "./components/ScrollToTopOnNavigate";
import NavigationProgress from "./components/NavigationProgress";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <NavigationProgress />
        <ScrollToTopOnNavigate />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/arenas" element={<ArenasPage />} />
          <Route path="/book" element={<BookPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/auth" element={<AuthPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
