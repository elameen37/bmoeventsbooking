import { format } from "date-fns";
import { Check, X, Clock, Calendar, Users, Building2, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAllBookings, useUpdateBookingStatus } from "@/hooks/useAdminBookings";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useIsAdmin } from "@/hooks/useUserRole";
const statusStyles = {
  pending: "bg-warning/20 text-warning border-warning/30",
  confirmed: "bg-success/20 text-success border-success/30",
  cancelled: "bg-destructive/20 text-destructive border-destructive/30",
};

export const BookingsTable = () => {
  const { data: bookings, isLoading } = useAllBookings();
  const updateStatus = useUpdateBookingStatus();
  const { toast } = useToast();
  const { isAdmin } = useIsAdmin();

  // Mask mobile number for non-admin users (managers)
  const maskMobileNumber = (mobile: string | null) => {
    if (!mobile) return null;
    if (isAdmin) return mobile;
    // Mask all but last 4 digits for managers
    if (mobile.length <= 4) return "****";
    return "****" + mobile.slice(-4);
  };

  const handleStatusChange = async (bookingId: string, status: "confirmed" | "cancelled") => {
    try {
      await updateStatus.mutateAsync({ bookingId, status });
      toast({
        title: status === "confirmed" ? "Booking Approved" : "Booking Rejected",
        description: `The booking has been ${status}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update booking status.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (!bookings?.length) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No bookings found</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Event</TableHead>
            <TableHead>Arena</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Guests</TableHead>
            <TableHead>Mobile</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id} className="hover:bg-muted/30">
              <TableCell>
                <div>
                  <p className="font-medium">{booking.event_title}</p>
                  <p className="text-sm text-muted-foreground">{booking.event_type}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span>{booking.arenas?.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p>{format(new Date(booking.event_date), "MMM d, yyyy")}</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.start_time} - {booking.end_time}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>{booking.guest_count}</span>
                </div>
              </TableCell>
              <TableCell>
                {booking.mobile_no ? (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{maskMobileNumber(booking.mobile_no)}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm">—</span>
                )}
              </TableCell>
              <TableCell>
                <span className="font-medium">₦{booking.total_amount.toLocaleString()}</span>
              </TableCell>
              <TableCell>
                <Badge className={statusStyles[booking.status]} variant="outline">
                  {booking.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {booking.status === "pending" && (
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-success border-success/30 hover:bg-success/10"
                      onClick={() => handleStatusChange(booking.id, "confirmed")}
                      disabled={updateStatus.isPending}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive border-destructive/30 hover:bg-destructive/10"
                      onClick={() => handleStatusChange(booking.id, "cancelled")}
                      disabled={updateStatus.isPending}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
