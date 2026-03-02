import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Download, Printer, Calendar, MapPin, Clock, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";

const useBookingDetails = (bookingId: string | undefined) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["booking-detail", bookingId],
    queryFn: async () => {
      if (!bookingId) throw new Error("No booking ID");
      const { data, error } = await supabase
        .from("bookings")
        .select("*, arenas(*)")
        .eq("id", bookingId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user && !!bookingId,
  });
};

const InvoicePage = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const { data: booking, isLoading } = useBookingDetails(bookingId);

  const isReceipt = booking?.status === "confirmed";
  const documentTitle = isReceipt ? "Receipt" : "Invoice";
  const invoiceNumber = booking ? `BMO-${booking.id.slice(0, 8).toUpperCase()}` : "";

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 lg:p-12">
        <div className="max-w-3xl mx-auto space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-[600px] w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold mb-2">Booking Not Found</h2>
          <p className="text-muted-foreground mb-4">This booking doesn't exist or you don't have access.</p>
          <Button variant="premium" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const arena = booking.arenas as any;
  const venueRental = booking.total_amount - 50000;
  const serviceFee = 50000;

  return (
    <div className="min-h-screen bg-background">
      {/* Action Bar - hidden on print */}
      <div className="print:hidden sticky top-0 z-10 bg-background/95 backdrop-blur-xl border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button variant="premium" onClick={handlePrint}>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Invoice Document */}
      <div className="max-w-3xl mx-auto px-6 py-8 print:px-0 print:py-0">
        <div className="bg-card rounded-xl border border-border p-8 lg:p-12 print:border-none print:rounded-none print:shadow-none print:bg-white print:text-black">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-lg gold-gradient flex items-center justify-center print:bg-orange-500">
                  <Calendar className="w-7 h-7 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-display text-2xl font-bold">B.M.O Events Arena</h1>
                  <p className="text-sm text-muted-foreground print:text-gray-500">Premium Event Venues</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <h2 className="font-display text-3xl font-bold gold-text print:text-orange-600">
                {documentTitle}
              </h2>
              <p className="text-sm text-muted-foreground print:text-gray-500 mt-1">
                #{invoiceNumber}
              </p>
              <Badge 
                variant={isReceipt ? "available" : booking.status === "pending" ? "pending" : "booked"} 
                className="mt-2"
              >
                {isReceipt ? "Paid" : booking.status === "pending" ? "Pending Payment" : "Cancelled"}
              </Badge>
            </div>
          </div>

          {/* Dates Row */}
          <div className="grid sm:grid-cols-2 gap-6 mb-10 p-4 rounded-lg bg-secondary/30 print:bg-gray-50">
            <div>
              <p className="text-xs text-muted-foreground print:text-gray-500 uppercase tracking-wider mb-1">Issue Date</p>
              <p className="font-medium">{format(parseISO(booking.created_at), "MMMM d, yyyy")}</p>
            </div>
            <div className="sm:text-right">
              <p className="text-xs text-muted-foreground print:text-gray-500 uppercase tracking-wider mb-1">Event Date</p>
              <p className="font-medium">{format(parseISO(booking.event_date), "MMMM d, yyyy")}</p>
            </div>
          </div>

          {/* Client & Venue Info */}
          <div className="grid sm:grid-cols-2 gap-8 mb-10">
            <div>
              <h3 className="text-xs text-muted-foreground print:text-gray-500 uppercase tracking-wider mb-3">Billed To</h3>
              <p className="font-semibold">{profile?.first_name} {profile?.last_name}</p>
              <p className="text-sm text-muted-foreground print:text-gray-500">{user?.email}</p>
              {profile?.phone && (
                <p className="text-sm text-muted-foreground print:text-gray-500">{profile.phone}</p>
              )}
              {profile?.company && (
                <p className="text-sm text-muted-foreground print:text-gray-500">{profile.company}</p>
              )}
            </div>
            <div>
              <h3 className="text-xs text-muted-foreground print:text-gray-500 uppercase tracking-wider mb-3">Venue Details</h3>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2 font-semibold">
                  <MapPin className="w-4 h-4 text-primary print:text-orange-500" />
                  {arena?.name}
                </p>
                <p className="text-muted-foreground print:text-gray-500 pl-6">{arena?.location}</p>
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary print:text-orange-500" />
                  {booking.start_time.slice(0, 5)} — {booking.end_time.slice(0, 5)}
                </p>
                <p className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary print:text-orange-500" />
                  {booking.guest_count} guests
                </p>
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="mb-8">
            <h3 className="text-xs text-muted-foreground print:text-gray-500 uppercase tracking-wider mb-3">Event Information</h3>
            <div className="rounded-lg border border-border print:border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-border print:border-gray-200">
                    <td className="px-4 py-3 text-muted-foreground print:text-gray-500 w-40">Event Title</td>
                    <td className="px-4 py-3 font-medium">{booking.event_title}</td>
                  </tr>
                  <tr className="border-b border-border print:border-gray-200">
                    <td className="px-4 py-3 text-muted-foreground print:text-gray-500">Event Type</td>
                    <td className="px-4 py-3 capitalize">{booking.event_type}</td>
                  </tr>
                  {booking.description && (
                    <tr className="border-b border-border print:border-gray-200">
                      <td className="px-4 py-3 text-muted-foreground print:text-gray-500 align-top">Description</td>
                      <td className="px-4 py-3">{booking.description}</td>
                    </tr>
                  )}
                  {booking.special_requirements && (
                    <tr>
                      <td className="px-4 py-3 text-muted-foreground print:text-gray-500 align-top">Special Req.</td>
                      <td className="px-4 py-3">{booking.special_requirements}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pricing Table */}
          <div className="mb-10">
            <h3 className="text-xs text-muted-foreground print:text-gray-500 uppercase tracking-wider mb-3">Payment Summary</h3>
            <div className="rounded-lg border border-border print:border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-secondary/50 print:bg-gray-100">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground print:text-gray-600">Description</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground print:text-gray-600">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border print:border-gray-200">
                    <td className="px-4 py-3">
                      <p className="font-medium">Venue Rental — {arena?.name}</p>
                      <p className="text-xs text-muted-foreground print:text-gray-500">
                        {format(parseISO(booking.event_date), "MMM d, yyyy")} • {booking.start_time.slice(0, 5)} – {booking.end_time.slice(0, 5)}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-right">₦{venueRental.toLocaleString()}</td>
                  </tr>
                  <tr className="border-t border-border print:border-gray-200">
                    <td className="px-4 py-3">Service Fee</td>
                    <td className="px-4 py-3 text-right">₦{serviceFee.toLocaleString()}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-primary/30 print:border-orange-200 bg-primary/5 print:bg-orange-50">
                    <td className="px-4 py-4 font-display font-bold text-base">Total</td>
                    <td className="px-4 py-4 text-right font-display font-bold text-base text-primary print:text-orange-600">
                      ₦{booking.total_amount.toLocaleString()}
                    </td>
                  </tr>
                  {!isReceipt && (
                    <tr className="border-t border-border print:border-gray-200">
                      <td className="px-4 py-3 text-muted-foreground print:text-gray-500">Deposit Required (50%)</td>
                      <td className="px-4 py-3 text-right font-semibold">
                        ₦{(booking.total_amount * 0.5).toLocaleString()}
                      </td>
                    </tr>
                  )}
                </tfoot>
              </table>
            </div>
          </div>

          {/* Bank Details (Invoice only) */}
          {!isReceipt && (
            <div className="mb-10 p-5 rounded-lg border border-primary/20 bg-primary/5 print:bg-orange-50 print:border-orange-200">
              <h3 className="font-semibold mb-3">Payment Instructions</h3>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground print:text-gray-500 mb-1">Account Name</p>
                  <p className="font-medium">B.M.O Events Arena</p>
                </div>
                <div>
                  <p className="text-muted-foreground print:text-gray-500 mb-1">Account Number</p>
                  <p className="font-mono font-medium">12-345-456-65</p>
                </div>
                <div>
                  <p className="text-muted-foreground print:text-gray-500 mb-1">Bank</p>
                  <p className="font-medium">GTBank</p>
                </div>
                <div>
                  <p className="text-muted-foreground print:text-gray-500 mb-1">Reference</p>
                  <p className="font-mono font-medium">{invoiceNumber}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground print:text-gray-500 mt-4">
                * 50% deposit required to confirm booking. Balance of 70% due one week before event date.
              </p>
            </div>
          )}

          {/* Receipt confirmation */}
          {isReceipt && (
            <div className="mb-10 p-5 rounded-lg border border-green-500/20 bg-green-500/5 print:bg-green-50 print:border-green-200 text-center">
              <p className="font-semibold text-green-500 print:text-green-600">✓ Payment Confirmed</p>
              <p className="text-sm text-muted-foreground print:text-gray-500 mt-1">
                This booking has been confirmed and payment has been received.
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-border print:border-gray-200 pt-6 text-center">
            <p className="text-xs text-muted-foreground print:text-gray-500">
              B.M.O Events Arena • Premium Event Venues
            </p>
            <p className="text-xs text-muted-foreground print:text-gray-400 mt-1">
              Thank you for choosing B.M.O Events Arena. For inquiries, contact us at events@bmo.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
