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
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useAdminSettings } from "@/hooks/useAdminSettings";

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
  const { data: signatureSetting } = useAdminSettings("admin_signature");

  const adminSignature = signatureSetting?.setting_value || null;
  const depositAmount = booking?.deposit_amount || 0;
  const totalAmount = booking?.total_amount || 0;
  const isFullyPaid = depositAmount >= totalAmount && totalAmount > 0;
  const isReceipt = isFullyPaid;
  const documentTitle = isReceipt ? "Receipt" : "Invoice";
  const invoiceNumber = booking ? `BMO-${booking.id.slice(0, 8).toUpperCase()}` : "";

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    const element = document.getElementById("invoice-content");
    if (!element) return;
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = 210;
      const pdfHeight = 297;
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      let position = 0;
      let heightLeft = imgHeight;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      const filename = `${isReceipt ? "Receipt" : "Invoice"}-${invoiceNumber}.pdf`;
      pdf.save(filename);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
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
  const subtotal = Math.round(booking.total_amount / 1.075);
  const vatAmount = booking.total_amount - subtotal;
  const outstandingBalance = Math.max(0, totalAmount - depositAmount);

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
            <Button variant="premium" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Invoice Document */}
      <div className="max-w-3xl mx-auto px-6 py-8 print:px-0 print:py-0 print:max-w-none">
        <div id="invoice-content" className="bg-card rounded-xl border border-border p-8 lg:p-12 print:border-none print:rounded-none print:shadow-none print:bg-white print:text-black print:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-9 h-9 rounded-lg gold-gradient flex items-center justify-center print:bg-orange-500">
                  <Calendar className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-display text-xl font-bold leading-tight">B.M.O Events Arena</h1>
                  <p className="text-xs text-muted-foreground print:text-gray-500">Premium Event Venues</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <h2 className="font-display text-2xl font-bold gold-text print:text-orange-600">
                {documentTitle}
              </h2>
              <p className="text-xs text-muted-foreground print:text-gray-500">
                #{invoiceNumber}
              </p>
              {isReceipt ? (
                <Badge variant="available" className="mt-1">Paid in Full</Badge>
              ) : depositAmount > 0 ? (
                <Badge variant="pending" className="mt-1">Partial Payment</Badge>
              ) : booking.status === "pending" ? (
                <Badge variant="pending" className="mt-1">Pending Payment</Badge>
              ) : (
                <Badge variant="booked" className="mt-1">Cancelled</Badge>
              )}
            </div>
          </div>

          {/* Dates Row */}
          <div className="grid sm:grid-cols-2 gap-4 mb-5 p-3 rounded-lg bg-secondary/30 print:bg-gray-50">
            <div>
              <p className="text-[10px] text-muted-foreground print:text-gray-500 uppercase tracking-wider mb-0.5">Issue Date</p>
              <p className="text-sm font-medium">{format(parseISO(booking.created_at), "MMMM d, yyyy")}</p>
            </div>
            <div className="sm:text-right">
              <p className="text-[10px] text-muted-foreground print:text-gray-500 uppercase tracking-wider mb-0.5">Event Date</p>
              <p className="text-sm font-medium">{format(parseISO(booking.event_date), "MMMM d, yyyy")}</p>
            </div>
          </div>

          {/* Client & Venue Info */}
          <div className="grid sm:grid-cols-2 gap-5 mb-5">
            <div>
              <h3 className="text-[10px] text-muted-foreground print:text-gray-500 uppercase tracking-wider mb-1.5">Billed To</h3>
              <p className="text-sm font-semibold">{profile?.first_name} {profile?.last_name}</p>
              <p className="text-xs text-muted-foreground print:text-gray-500">{user?.email}</p>
              {profile?.phone && (
                <p className="text-xs text-muted-foreground print:text-gray-500">{profile.phone}</p>
              )}
              {profile?.company && (
                <p className="text-xs text-muted-foreground print:text-gray-500">{profile.company}</p>
              )}
            </div>
            <div>
              <h3 className="text-[10px] text-muted-foreground print:text-gray-500 uppercase tracking-wider mb-1.5">Venue Details</h3>
              <div className="space-y-1 text-xs">
                <p className="flex items-center gap-1.5 text-sm font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-primary print:text-orange-500" />
                  {arena?.name}
                </p>
                <p className="text-muted-foreground print:text-gray-500 pl-5">{arena?.location}</p>
                <p className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-primary print:text-orange-500" />
                  {booking.start_time.slice(0, 5)} — {booking.end_time.slice(0, 5)}
                </p>
                <p className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-primary print:text-orange-500" />
                  {booking.guest_count} guests
                </p>
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="mb-5">
            <h3 className="text-[10px] text-muted-foreground print:text-gray-500 uppercase tracking-wider mb-1.5">Event Information</h3>
            <div className="rounded-lg border border-border print:border-gray-200 overflow-hidden">
              <table className="w-full text-xs">
                <tbody>
                  <tr className="border-b border-border print:border-gray-200">
                    <td className="px-3 py-2 text-muted-foreground print:text-gray-500 w-32">Event Title</td>
                    <td className="px-3 py-2 font-medium">{booking.event_title}</td>
                  </tr>
                  <tr className="border-b border-border print:border-gray-200">
                    <td className="px-3 py-2 text-muted-foreground print:text-gray-500">Event Type</td>
                    <td className="px-3 py-2 capitalize">{booking.event_type}</td>
                  </tr>
                  {booking.description && (
                    <tr className="border-b border-border print:border-gray-200">
                      <td className="px-3 py-2 text-muted-foreground print:text-gray-500 align-top">Description</td>
                      <td className="px-3 py-2">{booking.description}</td>
                    </tr>
                  )}
                  {booking.special_requirements && (
                    <tr>
                      <td className="px-3 py-2 text-muted-foreground print:text-gray-500 align-top">Special Req.</td>
                      <td className="px-3 py-2">{booking.special_requirements}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pricing Table */}
          <div className="mb-5">
            <h3 className="text-[10px] text-muted-foreground print:text-gray-500 uppercase tracking-wider mb-1.5">Payment Summary</h3>
            <div className="rounded-lg border border-border print:border-gray-200 overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-secondary/50 print:bg-gray-100">
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground print:text-gray-600">Description</th>
                    <th className="px-3 py-2 text-right font-medium text-muted-foreground print:text-gray-600">Amount</th>
                  </tr>
                </thead>
                <tbody>
                   <tr className="border-t border-border print:border-gray-200">
                    <td className="px-3 py-2">
                      <p className="font-medium">Subtotal (Venue Rental)</p>
                      <p className="text-[10px] text-muted-foreground print:text-gray-500">
                        {format(parseISO(booking.event_date), "MMM d, yyyy")} • {booking.start_time.slice(0, 5)} – {booking.end_time.slice(0, 5)}
                      </p>
                    </td>
                    <td className="px-3 py-2 text-right">₦{subtotal.toLocaleString()}</td>
                  </tr>
                  <tr className="border-t border-border print:border-gray-200">
                    <td className="px-3 py-2">VAT (7.5%)</td>
                    <td className="px-3 py-2 text-right">₦{vatAmount.toLocaleString()}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-primary/30 print:border-orange-200 bg-primary/5 print:bg-orange-50">
                    <td className="px-3 py-3 font-display font-bold text-sm">Total</td>
                    <td className="px-3 py-3 text-right font-display font-bold text-sm text-primary print:text-orange-600">
                      ₦{booking.total_amount.toLocaleString()}
                    </td>
                  </tr>
                  <tr className="border-t border-border print:border-gray-200">
                    <td className="px-3 py-2 text-muted-foreground print:text-gray-500">Amount Paid</td>
                    <td className="px-3 py-2 text-right font-semibold text-success">
                      ₦{depositAmount.toLocaleString()}
                    </td>
                  </tr>
                  {!isReceipt && (
                    <tr className="border-t border-border print:border-gray-200 bg-destructive/5">
                      <td className="px-3 py-2 font-semibold text-destructive">Outstanding Balance</td>
                      <td className="px-3 py-2 text-right font-bold text-destructive">
                        ₦{outstandingBalance.toLocaleString()}
                      </td>
                    </tr>
                  )}
                </tfoot>
              </table>
            </div>
          </div>

          {/* Bank Details (Invoice only) */}
          {!isReceipt && (
            <div className="mb-5 p-3 rounded-lg border border-primary/20 bg-primary/5 print:bg-orange-50 print:border-orange-200">
              <h3 className="text-sm font-semibold mb-2">Payment Instructions</h3>
              <div className="grid sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-muted-foreground print:text-gray-500 mb-0.5">Account Name</p>
                  <p className="font-medium">B.M.O Events Arena</p>
                </div>
                <div>
                  <p className="text-muted-foreground print:text-gray-500 mb-0.5">Account Number</p>
                  <p className="font-mono font-medium">12-345-456-65</p>
                </div>
                <div>
                  <p className="text-muted-foreground print:text-gray-500 mb-0.5">Bank</p>
                  <p className="font-medium">GTBank</p>
                </div>
                <div>
                  <p className="text-muted-foreground print:text-gray-500 mb-0.5">Reference</p>
                  <p className="font-mono font-medium">{invoiceNumber}</p>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground print:text-gray-500 mt-2">
                * 70% deposit required to be settled one week before event date. Installment payments are accepted.
              </p>
            </div>
          )}

          {/* Receipt confirmation */}
          {isReceipt && (
            <div className="mb-5 p-3 rounded-lg border border-green-500/20 bg-green-500/5 print:bg-green-50 print:border-green-200 text-center">
              <p className="text-sm font-semibold text-green-500 print:text-green-600">✓ Payment Complete</p>
              <p className="text-xs text-muted-foreground print:text-gray-500 mt-0.5">
                Full payment of ₦{totalAmount.toLocaleString()} has been received. This serves as your official receipt.
              </p>
            </div>
          )}

          {/* Partial Payment Notice */}
          {!isReceipt && depositAmount > 0 && (
            <div className="mb-5 p-3 rounded-lg border border-warning/20 bg-warning/5 print:bg-yellow-50 print:border-yellow-200 text-center">
              <p className="text-sm font-semibold text-warning print:text-yellow-600">⏳ Partial Payment</p>
              <p className="text-xs text-muted-foreground print:text-gray-500 mt-0.5">
                ₦{depositAmount.toLocaleString()} of ₦{totalAmount.toLocaleString()} received. 
                Outstanding balance: ₦{outstandingBalance.toLocaleString()}. 
                A receipt will be issued once full payment is completed.
              </p>
            </div>
          )}

          {/* Authorized Signature */}
          {adminSignature && (
            <div className="mb-5 flex justify-end">
              <div className="text-center">
                <img
                  src={adminSignature}
                  alt="Authorized Signature"
                  className="h-16 object-contain mx-auto mb-1"
                />
                <div className="w-40 border-t border-border print:border-gray-300 pt-1">
                  <p className="text-[10px] text-muted-foreground print:text-gray-500">Authorized Signature</p>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-border print:border-gray-200 pt-4 text-center">
            <p className="text-[10px] text-muted-foreground print:text-gray-500">
              B.M.O Events Arena • Premium Event Venues
            </p>
            <p className="text-[10px] text-muted-foreground print:text-gray-400 mt-0.5">
              Thank you for choosing B.M.O Events Arena. For inquiries, contact us at events@bmo.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
