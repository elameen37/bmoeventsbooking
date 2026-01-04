import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Shield, Clock, CreditCard, Bell, Users } from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Smart Calendar",
    description: "Intuitive booking calendar with real-time availability across all arena locations.",
  },
  {
    icon: Shield,
    title: "Secure Booking",
    description: "Bank-grade security for all transactions with transparent pricing and instant confirmation.",
  },
  {
    icon: Clock,
    title: "Flexible Scheduling",
    description: "Book hourly, half-day, or full-day slots. Perfect for any event duration.",
  },
  {
    icon: CreditCard,
    title: "Easy Payments",
    description: "Direct bank transfer with deposit options. Automated receipts and invoices.",
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description: "Automatic email reminders and calendar invites for all your bookings.",
  },
  {
    icon: Users,
    title: "Multi-Role Access",
    description: "Dedicated dashboards for admins, managers, staff, and customers.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-12 sm:py-20 bg-background">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
            Why Choose <span className="gold-text">B.M.O Arena</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto px-2">
            Experience seamless event booking with our comprehensive venue management platform.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              variant="glass" 
              className="group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-4 sm:p-6 text-center sm:text-left">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors mx-auto sm:mx-0">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-lg sm:text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm sm:text-base">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
