import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Calendar, Building2, LayoutDashboard, Shield, Users, Star, Menu, LogOut, Home, ImageIcon, DollarSign, PenTool, Layout } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingsTable } from "@/components/admin/BookingsTable";
import { ArenaManagement } from "@/components/admin/ArenaManagement";
import FeaturedEventsManagement from "@/components/admin/FeaturedEventsManagement";
import GalleryManagement from "@/components/admin/GalleryManagement";
import PriceControl from "@/components/admin/PriceControl";
import SignatureManagement from "@/components/admin/SignatureManagement";
import HeroManagement from "@/components/admin/HeroManagement";
import NotificationBell from "@/components/NotificationBell";
import { useIsAdmin } from "@/hooks/useUserRole";
import { useAuth } from "@/contexts/AuthContext";
import { useAllBookings } from "@/hooks/useAdminBookings";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const AdminPage = () => {
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { user, signOut, loading: authLoading } = useAuth();
  const { isManager, isLoading: roleLoading } = useIsAdmin();
  const { data: bookings } = useAllBookings();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!roleLoading && !isManager && user) {
      navigate("/dashboard");
    }
  }, [isManager, roleLoading, user, navigate]);

  if (authLoading || roleLoading) {
    return (
      <main className="pt-24 pb-16 px-6 sm:px-8 lg:px-12">
        <div className="container mx-auto max-w-7xl">
          <Skeleton className="h-10 w-64 mb-8" />
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </main>
    );
  }

  if (!isManager) {
    return null;
  }

  const pendingCount = bookings?.filter((b) => b.status === "pending").length || 0;
  const confirmedCount = bookings?.filter((b) => b.status === "confirmed").length || 0;
  const totalRevenue = bookings
    ?.filter((b) => b.status === "confirmed")
    .reduce((sum, b) => sum + b.total_amount, 0) || 0;

  return (
    <main className="pt-24 pb-16 px-6 sm:px-8 lg:px-12">
      <div className="container mx-auto max-w-7xl">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/" className="flex items-center gap-1.5">
                    <Home className="w-4 h-4" />
                    <span className="hidden sm:inline">Home</span>
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Admin</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Header */}
          <div className="flex items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              {/* Mobile Menu Trigger */}
              <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="lg:hidden shrink-0">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0">
                  <SheetHeader className="p-6 border-b border-border">
                    <SheetTitle asChild>
                      <Link to="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg gold-gradient flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div>
                          <span className="font-display text-lg font-bold">B.M.O</span>
                          <span className="text-xs block text-muted-foreground">Events Arena</span>
                        </div>
                      </Link>
                    </SheetTitle>
                  </SheetHeader>
                  
                  <nav className="p-4 space-y-1">
                    <NavItem icon={LayoutDashboard} label="Dashboard" onClick={() => { navigate("/dashboard"); setMobileNavOpen(false); }} />
                    <NavItem icon={Shield} label="Admin Panel" active onClick={() => setMobileNavOpen(false)} />
                    <NavItem icon={Users} label="User Management" onClick={() => { navigate("/admin/users"); setMobileNavOpen(false); }} />
                    <NavItem icon={Calendar} label="Calendar" onClick={() => { navigate("/calendar"); setMobileNavOpen(false); }} />
                    <NavItem icon={Building2} label="Arenas" onClick={() => { navigate("/arenas"); setMobileNavOpen(false); }} />
                  </nav>

                  <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center">
                        <span className="text-primary-foreground font-semibold">
                          {user?.email?.[0]?.toUpperCase() || "A"}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm">Admin</div>
                        <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start text-muted-foreground"
                      onClick={() => { handleSignOut(); setMobileNavOpen(false); }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>

              <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center shrink-0 hidden sm:flex">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-display font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground text-sm sm:text-base">Manage bookings and arena availability</p>
              </div>
            </div>
            <Button asChild variant="outline" className="gap-2 hidden sm:flex">
              <Link to="/admin/users">
                <Users className="w-4 h-4" />
                Manage Users
              </Link>
            </Button>
            <div className="hidden sm:block">
              <NotificationBell />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending Requests
                </CardTitle>
                <Calendar className="w-4 h-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-warning">{pendingCount}</div>
                <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Confirmed Bookings
                </CardTitle>
                <LayoutDashboard className="w-4 h-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-success">{confirmedCount}</div>
                <p className="text-xs text-muted-foreground mt-1">Total confirmed</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Revenue
                </CardTitle>
                <Building2 className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold gold-text">
                  ₦{totalRevenue.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">From confirmed bookings</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="bookings" className="space-y-6">
            <TabsList className="bg-muted/50 p-1 flex-wrap h-auto">
              <TabsTrigger value="bookings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Calendar className="w-4 h-4 mr-2" />
                Bookings
              </TabsTrigger>
              <TabsTrigger value="arenas" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Building2 className="w-4 h-4 mr-2" />
                Arenas
              </TabsTrigger>
              <TabsTrigger value="featured" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Star className="w-4 h-4 mr-2" />
                Featured Events
              </TabsTrigger>
              <TabsTrigger value="gallery" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <ImageIcon className="w-4 h-4 mr-2" />
                Gallery
              </TabsTrigger>
              <TabsTrigger value="pricing" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <DollarSign className="w-4 h-4 mr-2" />
                Pricing
              </TabsTrigger>
              <TabsTrigger value="signature" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <PenTool className="w-4 h-4 mr-2" />
                Signature
              </TabsTrigger>
              <TabsTrigger value="hero" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Layout className="w-4 h-4 mr-2" />
                Hero
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bookings" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-display font-semibold">All Bookings</h2>
              </div>
              <BookingsTable />
            </TabsContent>

            <TabsContent value="arenas" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-display font-semibold">Arena Management</h2>
              </div>
              <ArenaManagement />
            </TabsContent>

            <TabsContent value="featured" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-display font-semibold">Featured Events Management</h2>
              </div>
              <FeaturedEventsManagement />
            </TabsContent>

            <TabsContent value="gallery" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-display font-semibold">Gallery Management</h2>
              </div>
              <GalleryManagement />
            </TabsContent>

            <TabsContent value="pricing" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-display font-semibold">Price Control</h2>
              </div>
              <PriceControl />
            </TabsContent>

            <TabsContent value="signature" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-display font-semibold">Invoice Signature</h2>
              </div>
              <SignatureManagement />
            </TabsContent>

            <TabsContent value="hero" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-display font-semibold">Hero Section Manager</h2>
              </div>
              <HeroManagement />
            </TabsContent>
          </Tabs>
        </div>
      </main>
  );
};

const NavItem = ({ 
  icon: Icon, 
  label, 
  active = false,
  onClick
}: { 
  icon: React.ElementType; 
  label: string; 
  active?: boolean;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
      active
        ? "bg-primary/10 text-primary font-medium"
        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
    }`}
  >
    <Icon className="w-5 h-5" />
    {label}
  </button>
);

export default AdminPage;
