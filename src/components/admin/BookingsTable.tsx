import { useState } from "react";
import { format } from "date-fns";
import { Check, X, Clock, Calendar, Users, Building2, Phone, Search, Filter, Plus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAllBookings, useUpdateBookingStatus, useUpdateDepositAmount } from "@/hooks/useAdminBookings";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useIsAdmin } from "@/hooks/useUserRole";
import { cn } from "@/lib/utils";

const statusStyles = {
  pending: "bg-warning/20 text-warning border-warning/30",
  confirmed: "bg-success/20 text-success border-success/30",
  cancelled: "bg-destructive/20 text-destructive border-destructive/30",
};

export const BookingsTable = () => {
  const { data: bookings, isLoading } = useAllBookings();
  const updateStatus = useUpdateBookingStatus();
  const updateDeposit = useUpdateDepositAmount();
  const { toast } = useToast();
  const { isAdmin } = useIsAdmin();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [additionalPayment, setAdditionalPayment] = useState<string>("");

  const today = new Date().toISOString().split("T")[0];

  // Mask mobile number for non-admin users (managers)
  const maskMobileNumber = (mobile: string | null) => {
    if (!mobile) return null;
    if (isAdmin) return mobile;
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

  const handleAddPayment = (booking: any) => {
    setSelectedBooking(booking);
    setAdditionalPayment("");
    setPaymentDialogOpen(true);
  };

  const handleSubmitPayment = async () => {
    if (!selectedBooking || !additionalPayment) return;

    const payment = Number(additionalPayment);
    if (payment <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid payment amount.",
        variant: "destructive",
      });
      return;
    }

    const currentDeposit = selectedBooking.deposit_amount || 0;
    const newTotal = currentDeposit + payment;
    const totalAmount = selectedBooking.total_amount;

    if (newTotal > totalAmount) {
      toast({
        title: "Overpayment",
        description: `Payment would exceed total amount. Maximum additional payment: ₦${(totalAmount - currentDeposit).toLocaleString()}`,
        variant: "destructive",
      });
      return;
    }

    try {
      await updateDeposit.mutateAsync({
        bookingId: selectedBooking.id,
        newDepositAmount: newTotal,
        totalAmount,
      });

      const isNowFullyPaid = newTotal >= totalAmount;
      toast({
        title: isNowFullyPaid ? "Payment Complete!" : "Payment Recorded",
        description: isNowFullyPaid
          ? `Full payment of ₦${totalAmount.toLocaleString()} received. Receipt is now available.`
          : `₦${payment.toLocaleString()} recorded. Outstanding balance: ₦${(totalAmount - newTotal).toLocaleString()}`,
      });

      setPaymentDialogOpen(false);
      setSelectedBooking(null);
      setAdditionalPayment("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record payment.",
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

  // Filter bookings
  const filteredBookings = bookings?.filter((booking) => {
    const matchesSearch =
      searchQuery === "" ||
      booking.event_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.arenas?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.event_type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (!bookings?.length) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No bookings found</p>
      </div>
    );
  }

  return (
    <>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by event, arena, or type..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-44">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="whitespace-nowrap">Event</TableHead>
                <TableHead className="whitespace-nowrap">Arena</TableHead>
                <TableHead className="whitespace-nowrap">Date & Time</TableHead>
                <TableHead className="whitespace-nowrap">Guests</TableHead>
                <TableHead className="whitespace-nowrap">Mobile</TableHead>
                <TableHead className="whitespace-nowrap">Amount</TableHead>
                <TableHead className="whitespace-nowrap">Paid</TableHead>
                <TableHead className="whitespace-nowrap">Balance</TableHead>
                <TableHead className="whitespace-nowrap">Status</TableHead>
                <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings?.map((booking) => {
                const isPastEvent = booking.event_date < today;
                const depositAmount = booking.deposit_amount || 0;
                const balance = booking.total_amount - depositAmount;
                const isFullyPaid = balance <= 0;

                return (
                  <TableRow
                    key={booking.id}
                    className={`hover:bg-muted/30 ${isPastEvent ? "opacity-60 bg-muted/20" : ""}`}
                  >
                    <TableCell className="whitespace-nowrap">
                      <div>
                        <p className="font-medium text-sm sm:text-base">{booking.event_title}</p>
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs text-muted-foreground">{booking.event_type}</p>
                          {isPastEvent && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                              Past
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm sm:text-base">
                        <Building2 className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span>{booking.arenas?.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm sm:text-base">
                        <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                        <div>
                          <p>{format(new Date(booking.event_date), "MMM d, yyyy")}</p>
                          <p className="text-xs text-muted-foreground">
                            {booking.start_time} - {booking.end_time}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm sm:text-base">
                        <Users className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span>{booking.guest_count}</span>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {booking.mobile_no ? (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                          <span>{maskMobileNumber(booking.mobile_no)}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <span className="font-medium text-sm sm:text-base">₦{booking.total_amount.toLocaleString()}</span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <span className={`text-sm font-medium ${isFullyPaid ? "text-success" : "text-warning"}`}>
                        ₦{depositAmount.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {isFullyPaid ? (
                        <Badge className="bg-success/20 text-success border-success/30 text-[10px]" variant="outline">
                          Paid
                        </Badge>
                      ) : (
                        <span className="text-sm font-medium text-destructive">
                          ₦{balance.toLocaleString()}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <Badge className={cn(statusStyles[booking.status as keyof typeof statusStyles], "text-[10px]")} variant="outline">
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {!isFullyPaid && booking.status !== "cancelled" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-primary border-primary/30 hover:bg-primary/10 text-xs"
                            onClick={() => handleAddPayment(booking)}
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Pay
                          </Button>
                        )}
                        {booking.status === "pending" && (
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0 text-success border-success/30 hover:bg-success/10"
                              onClick={() => handleStatusChange(booking.id, "confirmed")}
                              disabled={updateStatus.isPending}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0 text-destructive border-destructive/30 hover:bg-destructive/10"
                              onClick={() => handleStatusChange(booking.id, "cancelled")}
                              disabled={updateStatus.isPending}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {filteredBookings?.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No bookings match your search criteria</p>
        </div>
      )}

      {/* Add Payment Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Record Payment
            </DialogTitle>
            <DialogDescription>
              Add an installment payment for this booking.
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-secondary/50 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Event</span>
                  <span className="font-medium">{selectedBooking.event_title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Amount</span>
                  <span className="font-medium">₦{selectedBooking.total_amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount Paid</span>
                  <span className="font-medium text-success">
                    ₦{(selectedBooking.deposit_amount || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between border-t border-border pt-2">
                  <span className="text-muted-foreground font-semibold">Outstanding Balance</span>
                  <span className="font-bold text-destructive">
                    ₦{(selectedBooking.total_amount - (selectedBooking.deposit_amount || 0)).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentAmount">Payment Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₦</span>
                  <Input
                    id="paymentAmount"
                    type="number"
                    className="pl-7"
                    placeholder="Enter amount"
                    value={additionalPayment}
                    onChange={(e) => setAdditionalPayment(e.target.value)}
                    max={selectedBooking.total_amount - (selectedBooking.deposit_amount || 0)}
                  />
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Max: ₦{(selectedBooking.total_amount - (selectedBooking.deposit_amount || 0)).toLocaleString()}
                </p>
              </div>

              {additionalPayment && Number(additionalPayment) > 0 && (
                <div className="p-3 rounded-lg border border-primary/20 bg-primary/5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">New Total Paid</span>
                    <span className="font-semibold text-primary">
                      ₦{((selectedBooking.deposit_amount || 0) + Number(additionalPayment)).toLocaleString()}
                    </span>
                  </div>
                  {(selectedBooking.deposit_amount || 0) + Number(additionalPayment) >= selectedBooking.total_amount && (
                    <p className="text-success text-xs mt-1 font-medium">
                      ✓ This will complete the full payment. A receipt will become available.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="premium"
              onClick={handleSubmitPayment}
              disabled={!additionalPayment || Number(additionalPayment) <= 0 || updateDeposit.isPending}
            >
              {updateDeposit.isPending ? "Recording..." : "Record Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
