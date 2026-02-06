import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, Calendar } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import ScrollToTop from "@/components/ui/scroll-to-top";
import PageTransition from "@/components/PageTransition";

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message Sent!",
        description: "We'll get back to you within 24 hours.",
      });
    }, 1500);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 sm:pt-24 pb-8 sm:pb-12">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          {/* Header */}
          <div className="mb-8 sm:mb-12 text-center">
            <Badge variant="premium" className="mb-4">Get In Touch</Badge>
            <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
              Contact <span className="gold-text">B.M.O Events</span>
            </h1>
            <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto px-2">
              Have questions about our venues or need help planning your event? We're here to help!
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Contact Form */}
            <Card variant="glass" className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Send Us a Message
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we'll respond within 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" required />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="john@example.com" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" placeholder="+234 801 234 5678" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="booking">Booking Inquiry</SelectItem>
                        <SelectItem value="pricing">Pricing Questions</SelectItem>
                        <SelectItem value="tour">Schedule a Tour</SelectItem>
                        <SelectItem value="corporate">Corporate Partnership</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your event or inquiry..."
                      rows={5}
                      required
                    />
                  </div>

                  <Button type="submit" variant="premium" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-6">
              <Card variant="glass">
                <CardHeader>
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ContactInfo
                    icon={MapPin}
                    title="Address"
                    details={["Plot 174, Riverplate Park", "Ahmadu Bello Way, Wuse II, Abuja"]}
                  />
                  <ContactInfo
                    icon={Phone}
                    title="Phone"
                    details={["+234 801 234 5678", "+234 809 876 5432"]}
                  />
                  <ContactInfo
                    icon={Mail}
                    title="Email"
                    details={["info@bmoevents.com", "bookings@bmoevents.com"]}
                  />
                  <ContactInfo
                    icon={Clock}
                    title="Office Hours"
                    details={["Mon - Fri: 9:00 AM - 6:00 PM", "Sat: 10:00 AM - 4:00 PM"]}
                  />
                </CardContent>
              </Card>

              <Card variant="glass">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Schedule a Tour
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">
                    Want to see our venues in person? Book a free tour and let us show you around.
                  </p>
                  <Button variant="outline" className="w-full">
                    Book a Tour
                  </Button>
                </CardContent>
              </Card>

              {/* Google Map */}
              <Card variant="glass" className="overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.0!2d7.4567!3d9.0667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOcKwMDQnMDAuMCJOIDfCsDI3JzI0LjAiRQ!5e0!3m2!1sen!2sng!4v1699000000000!5m2!1sen!2sng&q=Plot+174+Riverplate+Park+Ahmadu+Bello+Way+Wuse+II+Abuja"
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="B.M.O Events Arena Location"
                  className="w-full"
                />
              </Card>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-10 sm:mt-16">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="font-display text-xl sm:text-3xl font-bold mb-2">
                Frequently Asked <span className="gold-text">Questions</span>
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">Quick answers to common questions</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 max-w-4xl mx-auto">
              <FAQCard
                question="How do I make a booking?"
                answer="You can book online through our website, call us directly, or visit our office. A 50% deposit is required to confirm your booking."
              />
              <FAQCard
                question="What is your cancellation policy?"
                answer="Cancellations made 30+ days before the event receive a full refund. 14-30 days receive 50% refund. Less than 14 days, no refund."
              />
              <FAQCard
                question="Can I bring my own caterer?"
                answer="Yes! We allow external caterers. However, we also have preferred catering partners we can recommend."
              />
              <FAQCard
                question="Is parking available?"
                answer="Yes, all our venues include free parking for your guests. Valet parking is available as an add-on service."
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
      </div>
    </PageTransition>
  );
};

const ContactInfo = ({
  icon: Icon,
  title,
  details,
}: {
  icon: React.ElementType;
  title: string;
  details: string[];
}) => (
  <div className="flex gap-3">
    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
      <Icon className="w-5 h-5 text-primary" />
    </div>
    <div>
      <h4 className="font-medium text-sm">{title}</h4>
      {details.map((detail, index) => (
        <p key={index} className="text-muted-foreground text-sm">{detail}</p>
      ))}
    </div>
  </div>
);

const FAQCard = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => (
  <Card variant="glass" className="p-4">
    <h4 className="font-medium mb-2">{question}</h4>
    <p className="text-muted-foreground text-sm">{answer}</p>
  </Card>
);

export default ContactPage;
