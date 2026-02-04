import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  MapPin,
  Bell,
  Settings,
  LogOut,
  LayoutDashboard,
  CalendarDays,
  Building,
  FileText,
  ChevronRight,
  Shield
} from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useUserBookings, useUpcomingBookings } from "@/hooks/useBookings";
import { useArenas } from "@/hooks/useArenas";
import { useIsAdmin } from "@/hooks/useUserRole";

const DashboardSkeleton = () => (
  <div className="min-h-screen bg-background flex">
    {/* Sidebar Skeleton */}
    <aside className="w-64 border-r border-border bg-card hidden lg:block">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <div>
            <Skeleton className="h-5 w-16 mb-1" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </aside>

    {/* Main Content Skeleton */}
    <main className="flex-1 overflow-auto">
      <div className="p-6 lg:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <Skeleton className="h-9 w-48 mb-2" />
            <Skeleton className="h-5 w-64" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32 rounded-lg" />
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-5 rounded-xl border border-border bg-card/50">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-20" />
                </div>
                <Skeleton className="h-10 w-10 rounded-lg" />
              </div>
              <Skeleton className="h-4 w-32 mt-2" />
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-6 rounded-xl border border-border bg-card/50">
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-20 w-full rounded-lg" />
              ))}
            </div>
          </div>
          <div className="p-6 rounded-xl border border-border bg-card/50">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
);

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: userBookings, isLoading: bookingsLoading } = useUserBookings();
  const { data: upcomingBookings } = useUpcomingBookings();
  const { data: arenas } = useArenas();
  const { isManager } = useIsAdmin();

  const isLoading = authLoading || profileLoading || bookingsLoading;

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Calculate stats
  const totalBookings = userBookings?.length || 0;
  const pendingBookings = userBookings?.filter(b => b.status === "pending").length || 0;
  const confirmedBookings = userBookings?.filter(b => b.status === "confirmed").length || 0;
  const totalSpent = userBookings?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0;

  const initials = profile?.first_name && profile?.last_name 
    ? `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase()
    : user?.email?.[0]?.toUpperCase() || "U";

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border bg-card hidden lg:block">
          <div className="p-6">
            <Link to="/" className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 rounded-lg gold-gradient flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <span className="font-display text-lg font-bold">B.M.O</span>
                <span className="text-xs block text-muted-foreground">Events Arena</span>
              </div>
            </Link>

            <nav className="space-y-1">
              <NavItem icon={LayoutDashboard} label="Dashboard" active />
              <NavItem icon={CalendarDays} label="Calendar" onClick={() => navigate("/calendar")} />
              <NavItem icon={Building} label="Arenas" onClick={() => navigate("/arenas")} />
              <NavItem icon={FileText} label="My Bookings" badge={pendingBookings > 0 ? pendingBookings : undefined} />
              <NavItem icon={Bell} label="Notifications" />
              <NavItem icon={Settings} label="Settings" />
              {isManager && (
                <NavItem icon={Shield} label="Admin Panel" onClick={() => navigate("/admin")} />
              )}
            </nav>
          </div>

          <div className="absolute bottom-0 left-0 w-64 p-6 border-t border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center">
                <span className="text-primary-foreground font-semibold">{initials}</span>
              </div>
              <div>
                <div className="font-medium text-sm">
                  {profile?.first_name} {profile?.last_name}
                </div>
                <div className="text-xs text-muted-foreground">{user?.email}</div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-muted-foreground"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="font-display text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">
                  Welcome back, {profile?.first_name || "there"}! Here's your overview.
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate("/calendar")}>
                  <Calendar className="w-4 h-4 mr-2" />
                  View Calendar
                </Button>
                <Button variant="premium" onClick={() => navigate("/book")}>
                  + New Booking
                </Button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard
                title="Total Bookings"
                value={totalBookings.toString()}
                change="All time"
                icon={Calendar}
                trend="neutral"
              />
              <StatCard
                title="Confirmed"
                value={confirmedBookings.toString()}
                change="Active bookings"
                icon={DollarSign}
                trend="up"
              />
              <StatCard
                title="Available Venues"
                value={(arenas?.filter(a => a.status === "available").length || 0).toString()}
                change="Ready to book"
                icon={Building}
                trend="up"
              />
              <StatCard
                title="Pending"
                value={pendingBookings.toString()}
                change="Awaiting approval"
                icon={Clock}
                trend={pendingBookings > 0 ? "neutral" : "down"}
              />
            </div>

            {/* Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Upcoming Bookings */}
              <Card variant="glass" className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Your Upcoming Bookings</CardTitle>
                  <Button variant="ghost" size="sm">
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardHeader>
                <CardContent>
                  {upcomingBookings && upcomingBookings.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingBookings.map((booking) => (
                        <BookingItem
                          key={booking.id}
                          title={booking.event_title}
                          date={new Date(booking.event_date).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}
                          time={`${booking.start_time.slice(0, 5)} - ${booking.end_time.slice(0, 5)}`}
                          arena={(booking.arenas as any)?.name || "Unknown Venue"}
                          status={booking.status as "confirmed" | "pending" | "cancelled"}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                      <p className="text-muted-foreground mb-4">No upcoming bookings</p>
                      <Button variant="premium" size="sm" onClick={() => navigate("/book")}>
                        Book a Venue
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Arena Status */}
              <Card variant="glass">
                <CardHeader>
                  <CardTitle className="text-lg">Venue Availability</CardTitle>
                </CardHeader>
                <CardContent>
                  {arenas && arenas.length > 0 ? (
                    <div className="space-y-4">
                      {arenas.map((arena) => (
                        <ArenaStatus 
                          key={arena.id}
                          name={arena.name} 
                          location={arena.location} 
                          status={arena.status as "available" | "booked" | "maintenance"} 
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No venues found</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

const NavItem = ({ 
  icon: Icon, 
  label, 
  active = false,
  badge,
  onClick
}: { 
  icon: React.ElementType; 
  label: string; 
  active?: boolean;
  badge?: number;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
      active
        ? "bg-primary/10 text-primary font-medium"
        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
    }`}
  >
    <div className="flex items-center gap-3">
      <Icon className="w-5 h-5" />
      {label}
    </div>
    {badge && (
      <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
        {badge}
      </span>
    )}
  </button>
);

const StatCard = ({
  title,
  value,
  change,
  icon: Icon,
  trend,
}: {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  trend: "up" | "down" | "neutral";
}) => (
  <Card variant="glass">
    <CardContent className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="font-display text-2xl font-bold">{value}</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
      <div className="mt-2 flex items-center gap-1">
        <TrendingUp className={`w-4 h-4 ${
          trend === "up" ? "text-status-available" : 
          trend === "down" ? "text-status-booked" : 
          "text-muted-foreground"
        }`} />
        <span className={`text-sm ${
          trend === "up" ? "text-status-available" : 
          trend === "down" ? "text-status-booked" : 
          "text-muted-foreground"
        }`}>
          {change}
        </span>
      </div>
    </CardContent>
  </Card>
);

const BookingItem = ({
  title,
  date,
  time,
  arena,
  status,
}: {
  title: string;
  date: string;
  time: string;
  arena: string;
  status: "confirmed" | "pending" | "cancelled";
}) => (
  <div className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
      <Calendar className="w-6 h-6 text-primary" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1">
        <h4 className="font-medium truncate">{title}</h4>
        <Badge variant={status === "confirmed" ? "available" : status === "pending" ? "pending" : "booked"}>
          {status}
        </Badge>
      </div>
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {date} • {time}
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {arena}
        </span>
      </div>
    </div>
  </div>
);

const ArenaStatus = ({
  name,
  location,
  status,
}: {
  name: string;
  location: string;
  status: "available" | "booked" | "maintenance";
}) => (
  <div className="flex items-center justify-between">
    <div>
      <h4 className="font-medium text-sm">{name}</h4>
      <p className="text-xs text-muted-foreground">{location}</p>
    </div>
    <Badge variant={status === "available" ? "available" : status === "booked" ? "booked" : "maintenance"}>
      {status}
    </Badge>
  </div>
);

export default DashboardPage;
