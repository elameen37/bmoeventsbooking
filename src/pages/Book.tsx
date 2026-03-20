import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Users, MapPin, CreditCard, CheckCircle, LogIn, Copy } from "lucide-react";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle,
  AlertDialogCancel 
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import PageTransition from "@/components/PageTransition";
import { useAuth } from "@/contexts/AuthContext";
import { useArenas } from "@/hooks/useArenas";
import { useCreateBooking } from "@/hooks/useBookings";
import { useProfile } from "@/hooks/useProfile";

const BookPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const { data: arenas, isLoading: arenasLoading } = useArenas();
  const { data: profile } = useProfile();
  const createBooking = useCreateBooking();
  
  const [step, setStep] = useState(1);
  const [selectedArena, setSelectedArena] = useState<string>("");
  
  // Form state
  const [eventDate, setEventDate] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [eventType, setEventType] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [specialRequirements, setSpecialRequirements] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [showDepositError, setShowDepositError] = useState(false);

  // Pre-select arena from URL param
  useEffect(() => {
    const arenaId = searchParams.get("arena");
    if (arenaId && arenas?.find(a => a.id === arenaId)) {
      setSelectedArena(arenaId);
    }
  }, [searchParams, arenas]);

  const selectedArenaData = arenas?.find(a => a.id === selectedArena);
  const basePrice = selectedArenaData?.price_per_hour || 0;
  const totalWithVat = Math.round(basePrice * 1.075);
  const minDepositRequired = Math.round(totalWithVat * 0.7);

  // Initialize deposit amount when moving to review step
  useEffect(() => {
    if (step === 4 && depositAmount === 0) {
      setDepositAmount(minDepositRequired);
    }
  }, [step, minDepositRequired]);

  const handleSubmitBooking = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to submit a booking.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedArena || !eventDate || !startTime || !endTime || !eventType || !eventTitle || !guestCount || !mobileNo.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (startTime >= endTime) {
      toast({
        title: "Invalid Time",
        description: "End time must be after start time.",
        variant: "destructive",
      });
      return;
    }

    if (depositAmount < minDepositRequired) {
      setShowDepositError(true);
      return;
    }

    try {
      await createBooking.mutateAsync({
        arena_id: selectedArena,
        event_date: eventDate,
        start_time: startTime,
        end_time: endTime,
        event_type: eventType,
        event_title: eventTitle,
        description: eventDescription || null,
        special_requirements: specialRequirements || null,
        guest_count: parseInt(guestCount),
        total_amount: totalWithVat,
        status: "pending",
        deposit_paid: false,
        mobile_no: mobileNo.trim(),
      });

      toast({
        title: "Booking Request Submitted!",
        description: "We'll review your booking and send you a confirmation email shortly.",
      });
      
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: error instanceof Error ? error.message : "Failed to create booking",
        variant: "destructive",
      });
    }
  };

  return (
    <PageTransition>
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-6">
            {/* Header */}
            <div className="mb-8 text-center">
              <Badge variant="premium" className="mb-4">Book Your Event</Badge>
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
                Reserve Your <span className="gold-text">Perfect Venue</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Complete the booking form below to secure your date at B.M.O Events Arena
              </p>
            </div>

            {/* Login prompt for guests */}
            {!authLoading && !user && (
              <div className="max-w-3xl mx-auto mb-8">
                <Card variant="glass" className="border-primary/20">
                  <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <LogIn className="w-8 h-8 text-primary" />
                      <div>
                        <h3 className="font-semibold">Login to Book</h3>
                        <p className="text-sm text-muted-foreground">Create an account or sign in to submit your booking</p>
                      </div>
                    </div>
                    <Button variant="premium" onClick={() => navigate("/auth")}>
                      Sign In / Sign Up
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Progress Steps */}
            <div className="flex justify-center mb-12">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4].map((s) => (
                  <div key={s} className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                        step >= s
                          ? "gold-gradient text-primary-foreground"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                    </div>
                    {s < 4 && (
                      <div className={`w-16 h-1 mx-2 rounded ${step > s ? "bg-primary" : "bg-secondary"}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Booking Form */}
            <div className="max-w-3xl mx-auto">
              {step === 1 && (
                <Card variant="glass" className="animate-fade-in">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      Select Arena & Date
                    </CardTitle>
                    <CardDescription>Choose your preferred venue and event date</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Arena Location</Label>
                      <Select value={selectedArena} onValueChange={setSelectedArena}>
                        <SelectTrigger>
                          <SelectValue placeholder={arenasLoading ? "Loading..." : "Select an arena"} />
                        </SelectTrigger>
                        <SelectContent>
                          {arenas?.filter(a => a.status === "available").map((arena) => (
                            <SelectItem key={arena.id} value={arena.id}>
                              {arena.name} - {arena.location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Event Date</Label>
                        <Input 
                          type="date" 
                          value={eventDate}
                          onChange={(e) => setEventDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Expected Guests</Label>
                        <Input 
                          type="number" 
                          placeholder="Number of guests"
                          value={guestCount}
                          onChange={(e) => setGuestCount(e.target.value)}
                          max={selectedArenaData?.capacity || 1000}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Start Time</Label>
                        <Input 
                          type="time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Time</Label>
                        <Input 
                          type="time"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                        />
                      </div>
                    </div>

                    <Button 
                      variant="premium" 
                      className="w-full" 
                      onClick={() => setStep(2)}
                      disabled={!selectedArena || !eventDate || !guestCount || !startTime || !endTime}
                    >
                      Continue to Event Details
                    </Button>
                  </CardContent>
                </Card>
              )}

              {step === 2 && (
                <Card variant="glass" className="animate-fade-in">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      Event Details
                    </CardTitle>
                    <CardDescription>Tell us about your event</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Event Type</Label>
                      <Select value={eventType} onValueChange={setEventType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="wedding">Wedding Reception</SelectItem>
                          <SelectItem value="corporate">Corporate Event</SelectItem>
                          <SelectItem value="conference">Conference</SelectItem>
                          <SelectItem value="birthday">Birthday Party</SelectItem>
                          <SelectItem value="concert">Concert / Show</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Event Title</Label>
                      <Input 
                        placeholder="e.g., Annual Corporate Gala"
                        value={eventTitle}
                        onChange={(e) => setEventTitle(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Event Description</Label>
                      <Textarea 
                        placeholder="Tell us more about your event..." 
                        rows={4}
                        value={eventDescription}
                        onChange={(e) => setEventDescription(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Special Requirements</Label>
                      <Textarea 
                        placeholder="Any special requirements or setup needs..." 
                        rows={3}
                        value={specialRequirements}
                        onChange={(e) => setSpecialRequirements(e.target.value)}
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                        Back
                      </Button>
                      <Button 
                        variant="premium" 
                        className="flex-1" 
                        onClick={() => setStep(3)}
                        disabled={!eventType || !eventTitle}
                      >
                        Continue to Contact Info
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {step === 3 && (
                <Card variant="glass" className="animate-fade-in">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      Contact Information
                    </CardTitle>
                    <CardDescription>
                      {user ? "Your contact details from your profile" : "Your contact details for booking confirmation"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {user ? (
                      <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-secondary/50 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Name</span>
                            <span>{profile?.first_name} {profile?.last_name}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Email</span>
                            <span>{user.email}</span>
                          </div>
                          {profile?.company && (
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Company</span>
                              <span>{profile.company}</span>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="mobileNo">Mobile Number *</Label>
                          <Input
                            id="mobileNo"
                            type="tel"
                            placeholder="e.g., +234 801 234 5678"
                            value={mobileNo}
                            onChange={(e) => setMobileNo(e.target.value)}
                          />
                          <p className="text-xs text-muted-foreground">We'll use this number to contact you about your booking</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">Please log in to continue with your booking</p>
                        <Button variant="premium" onClick={() => navigate("/auth")}>
                          Sign In / Sign Up
                        </Button>
                      </div>
                    )}

                    <div className="flex gap-4">
                      <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>
                        Back
                      </Button>
                      <Button 
                        variant="premium" 
                        className="flex-1" 
                        onClick={() => setStep(4)}
                        disabled={!user || !mobileNo.trim()}
                      >
                        Review Booking
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {step === 4 && (
                <Card variant="glass" className="animate-fade-in">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-primary" />
                      Review & Confirm
                    </CardTitle>
                    <CardDescription>Review your booking details before confirmation</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Booking Summary */}
                    <div className="p-4 rounded-lg bg-secondary/50 space-y-4">
                      <h4 className="font-semibold">Booking Summary</h4>
                      
                      <div className="grid gap-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Venue</span>
                          <span>{selectedArenaData ? `${selectedArenaData.name} - ${selectedArenaData.location}` : "Not selected"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Event</span>
                          <span>{eventTitle}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type</span>
                          <span className="capitalize">{eventType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Date</span>
                          <span>{eventDate ? new Date(eventDate).toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Time</span>
                          <span>{startTime} - {endTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Guests</span>
                          <span>{guestCount} guests</span>
                        </div>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="p-4 rounded-lg border border-primary/20 space-y-3">
                      <h4 className="font-semibold">Payment Details</h4>
                      
                      <div className="grid gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Subtotal (Venue Rental)
                          </span>
                          <span>₦{(selectedArenaData?.price_per_hour || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">VAT (7.5%)</span>
                          <span>₦{Math.round((selectedArenaData?.price_per_hour || 0) * 0.075).toLocaleString()}</span>
                        </div>
                        <div className="border-t border-border pt-2 mt-2 flex justify-between font-semibold">
                          <span>Total Amount Due</span>
                          <span className="text-primary font-bold">₦{totalWithVat.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="space-y-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
                        <div className="space-y-1.5">
                          <Label htmlFor="deposit" className="text-xs font-semibold uppercase tracking-wider text-primary">
                            Deposit to Pay (Min 70%)
                          </Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₦</span>
                            <Input
                              id="deposit"
                              type="number"
                              className="pl-7 bg-background"
                              value={depositAmount || ''}
                              onChange={(e) => setDepositAmount(Number(e.target.value))}
                              placeholder={minDepositRequired.toString()}
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-between text-sm pt-2 border-t border-primary/10">
                          <span className="text-muted-foreground">Remaining Balance</span>
                          <span className="font-semibold">₦{Math.max(0, totalWithVat - depositAmount).toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground space-y-2">
                        <p>* 70% deposit required to be settled one week before event date.</p>
                        <div className="mt-3 p-3 rounded-md bg-primary/10 border border-primary/20">
                          <p className="font-semibold text-foreground mb-1">Bank Details</p>
                          <p>B.M.O Events Arena</p>
                          <div className="flex items-center gap-2">
                            <p className="font-mono">12-345-456-65</p>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={() => {
                                navigator.clipboard.writeText("12-345-456-65")
                                  .then(() => toast({ title: "Copied!", description: "Account number copied to clipboard" }))
                                  .catch(() => toast({ title: "Failed to copy", variant: "destructive" }));
                              }}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <p>GTBank</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button variant="outline" className="flex-1" onClick={() => setStep(3)}>
                        Back
                      </Button>
                      <Button 
                        variant="premium" 
                        className="flex-1"
                        onClick={handleSubmitBooking}
                        disabled={createBooking.isPending}
                      >
                        {createBooking.isPending ? "Submitting..." : "Confirm Booking"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
          </div>
        </div>

        {/* Deposit Warning Dialog */}
        <AlertDialog open={showDepositError} onOpenChange={setShowDepositError}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-destructive" />
                Minimum Deposit Required
              </AlertDialogTitle>
              <AlertDialogDescription>
                To secure your booking, a minimum deposit of 70% (₦{minDepositRequired.toLocaleString()}) is required. 
                Please adjust your deposit amount to proceed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDepositAmount(minDepositRequired)}>
                Set to 70%
              </AlertDialogCancel>
              <AlertDialogAction className="gold-gradient">
                Adjust Manually
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </PageTransition>
  );
};

export default BookPage;
