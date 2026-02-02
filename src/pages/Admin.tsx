import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Calendar, Building2, LayoutDashboard, Shield, Users, Star } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingsTable } from "@/components/admin/BookingsTable";
import { ArenaManagement } from "@/components/admin/ArenaManagement";
import FeaturedEventsManagement from "@/components/admin/FeaturedEventsManagement";
import { useIsAdmin } from "@/hooks/useUserRole";
import { useAuth } from "@/contexts/AuthContext";
import { useAllBookings } from "@/hooks/useAdminBookings";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const AdminPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isManager, isLoading: roleLoading } = useIsAdmin();
  const { data: bookings } = useAllBookings();

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
      <div className="min-h-screen bg-background">
        <Navbar />
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
        <Footer />
      </div>
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
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16 px-6 sm:px-8 lg:px-12">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground">Manage bookings and arena availability</p>
              </div>
            </div>
            <Button asChild variant="outline" className="gap-2">
              <Link to="/admin/users">
                <Users className="w-4 h-4" />
                Manage Users
              </Link>
            </Button>
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
            <TabsList className="bg-muted/50 p-1">
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
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminPage;
