import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Users, MapPin, CreditCard, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const BookPage = () => {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
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
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an arena" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grand">Grand Ballroom - Wuse II</SelectItem>
                        <SelectItem value="executive">Executive Conference Hall - Maitama</SelectItem>
                        <SelectItem value="outdoor">Outdoor Pavilion - Garki</SelectItem>
                        <SelectItem value="lounge">Intimate Lounge - Central Area</SelectItem>
                        <SelectItem value="rooftop">Rooftop Terrace - Jabi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Event Date</Label>
                      <Input type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label>Expected Guests</Label>
                      <Input type="number" placeholder="Number of guests" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Time</Label>
                      <Input type="time" />
                    </div>
                    <div className="space-y-2">
                      <Label>End Time</Label>
                      <Input type="time" />
                    </div>
                  </div>

                  <Button variant="premium" className="w-full" onClick={() => setStep(2)}>
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
                    <Select>
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
                    <Input placeholder="e.g., Annual Corporate Gala" />
                  </div>

                  <div className="space-y-2">
                    <Label>Event Description</Label>
                    <Textarea placeholder="Tell us more about your event..." rows={4} />
                  </div>

                  <div className="space-y-2">
                    <Label>Special Requirements</Label>
                    <Textarea placeholder="Any special requirements or setup needs..." rows={3} />
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                      Back
                    </Button>
                    <Button variant="premium" className="flex-1" onClick={() => setStep(3)}>
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
                  <CardDescription>Your contact details for booking confirmation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>First Name</Label>
                      <Input placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <Label>Last Name</Label>
                      <Input placeholder="Doe" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input type="email" placeholder="john@example.com" />
                  </div>

                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input type="tel" placeholder="+234 801 234 5678" />
                  </div>

                  <div className="space-y-2">
                    <Label>Company / Organization (Optional)</Label>
                    <Input placeholder="Your company name" />
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>
                      Back
                    </Button>
                    <Button variant="premium" className="flex-1" onClick={() => setStep(4)}>
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
                        <span>Grand Ballroom - Wuse II</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date</span>
                        <span>January 15, 2026</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Time</span>
                        <span>10:00 AM - 6:00 PM (8 hours)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Guests</span>
                        <span>200 guests</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="p-4 rounded-lg border border-primary/20 space-y-3">
                    <h4 className="font-semibold">Payment Details</h4>
                    
                    <div className="grid gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Venue (8 hours × ₦150,000)</span>
                        <span>₦1,200,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Service Fee</span>
                        <span>₦50,000</span>
                      </div>
                      <div className="border-t border-border pt-2 mt-2 flex justify-between font-semibold">
                        <span>Total</span>
                        <span className="text-primary">₦1,250,000</span>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      * 50% deposit required to confirm booking. Balance due 7 days before event.
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline" className="flex-1" onClick={() => setStep(3)}>
                      Back
                    </Button>
                    <Button 
                      variant="premium" 
                      className="flex-1"
                      onClick={() => {
                        toast({
                          title: "Booking Request Submitted!",
                          description: "We'll send you a confirmation email shortly.",
                        });
                      }}
                    >
                      Confirm Booking
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookPage;
