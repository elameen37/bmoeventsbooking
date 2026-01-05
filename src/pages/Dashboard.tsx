import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";
import PageTransition from "@/components/PageTransition";

const DashboardPage = () => {
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
            <NavItem icon={CalendarDays} label="Calendar" />
            <NavItem icon={Building} label="Arenas" />
            <NavItem icon={FileText} label="Bookings" />
            <NavItem icon={Users} label="Customers" />
            <NavItem icon={DollarSign} label="Payments" />
            <NavItem icon={Bell} label="Notifications" badge={3} />
            <NavItem icon={Settings} label="Settings" />
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 w-64 p-6 border-t border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center">
              <span className="text-primary-foreground font-semibold">AD</span>
            </div>
            <div>
              <div className="font-medium text-sm">Admin User</div>
              <div className="text-xs text-muted-foreground">Super Admin</div>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground">
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
              <p className="text-muted-foreground">Welcome back! Here's your overview.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                View Calendar
              </Button>
              <Button variant="premium">
                + New Booking
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Total Bookings"
              value="156"
              change="+12%"
              icon={Calendar}
              trend="up"
            />
            <StatCard
              title="Revenue (Jan)"
              value="₦8.5M"
              change="+8%"
              icon={DollarSign}
              trend="up"
            />
            <StatCard
              title="Active Arenas"
              value="5"
              change="0"
              icon={Building}
              trend="neutral"
            />
            <StatCard
              title="Pending Approvals"
              value="8"
              change="-2"
              icon={Clock}
              trend="down"
            />
          </div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Upcoming Bookings */}
            <Card variant="glass" className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Upcoming Bookings</CardTitle>
                <Button variant="ghost" size="sm">
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <BookingItem
                    title="Corporate Conference"
                    date="Jan 5, 2026"
                    time="9:00 AM - 5:00 PM"
                    arena="Executive Hall"
                    status="confirmed"
                  />
                  <BookingItem
                    title="Wedding Reception"
                    date="Jan 10, 2026"
                    time="2:00 PM - 10:00 PM"
                    arena="Grand Ballroom"
                    status="confirmed"
                  />
                  <BookingItem
                    title="Product Launch"
                    date="Jan 15, 2026"
                    time="10:00 AM - 2:00 PM"
                    arena="Rooftop Terrace"
                    status="pending"
                  />
                  <BookingItem
                    title="Gala Dinner"
                    date="Jan 20, 2026"
                    time="6:00 PM - 11:00 PM"
                    arena="Grand Ballroom"
                    status="confirmed"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Arena Status */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-lg">Arena Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <ArenaStatus name="Grand Ballroom" location="Wuse II" status="available" />
                  <ArenaStatus name="Executive Hall" location="Maitama" status="booked" />
                  <ArenaStatus name="Outdoor Pavilion" location="Garki" status="booked" />
                  <ArenaStatus name="Intimate Lounge" location="Central" status="available" />
                  <ArenaStatus name="Rooftop Terrace" location="Jabi" status="maintenance" />
                </div>
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
  badge
}: { 
  icon: React.ElementType; 
  label: string; 
  active?: boolean;
  badge?: number;
}) => (
  <button
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
          {change} from last month
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
