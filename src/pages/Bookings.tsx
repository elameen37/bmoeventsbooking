import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  FileText, 
  ChevronLeft,
  Search,
  Filter
} from "lucide-react";
import PageTransition from "@/components/PageTransition";
import PageSkeleton from "@/components/skeletons/PageSkeleton";
import { useUserBookings } from "@/hooks/useBookings";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const BookingsPage = () => {
  const navigate = useNavigate();
  const { data: bookings, isLoading } = useUserBookings();
  const [searchQuery, setSearchQuery] = useState("");

  if (isLoading) {
    return <PageSkeleton variant="dashboard" />;
  }

  const filteredBookings = bookings?.filter(booking => 
    booking.event_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (booking.arenas as any)?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageTransition>
      <main className="min-h-screen bg-background pt-24 pb-12">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mb-2 -ml-2 text-muted-foreground"
                onClick={() => navigate("/dashboard")}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to Dashboard
              </Button>
              <h1 className="font-display text-3xl font-bold">My Bookings</h1>
              <p className="text-muted-foreground">Manage and track all your venue reservations</p>
            </div>
            <Button variant="premium" onClick={() => navigate("/book")}>
              + New Booking
            </Button>
          </div>

          <Card variant="glass" className="mb-8">
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle className="text-lg">Booking History</CardTitle>
                <div className="flex gap-2 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search bookings..." 
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredBookings && filteredBookings.length > 0 ? (
                <div className="grid gap-4">
                  {filteredBookings.map((booking) => (
                    <div 
                      key={booking.id}
                      className="group flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border border-border bg-card/50 hover:border-primary/50 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4 mb-4 md:mb-0">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                          <Calendar className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{booking.event_title}</h3>
                            <Badge variant={
                              booking.status === "confirmed" ? "available" : 
                              booking.status === "pending" ? "pending" : "booked"
                            }>
                              {booking.status}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5" />
                              {(booking.arenas as any)?.name}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              {new Date(booking.event_date).toLocaleDateString('en-NG', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                            <span className="flex items-center gap-1.5 font-medium text-foreground">
                              ₦{(booking.total_amount || 0).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/invoice/${booking.id}`)}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          {booking.status === "confirmed" ? "Receipt" : "Invoice"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">No bookings found</h3>
                  <p className="text-muted-foreground mb-6">
                    {searchQuery ? "Try adjusting your search terms" : "You haven't made any bookings yet"}
                  </p>
                  {!searchQuery && (
                    <Button variant="premium" onClick={() => navigate("/book")}>
                      Make Your First Booking
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </PageTransition>
  );
};

export default BookingsPage;
