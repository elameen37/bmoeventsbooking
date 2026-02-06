import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import ScrollToTop from "@/components/ui/scroll-to-top";
import PageTransition from "@/components/PageTransition";
import PageSkeleton from "@/components/skeletons/PageSkeleton";
import { useArenas } from "@/hooks/useArenas";

const PricingPage = () => {
  const { data: arenas, isLoading } = useArenas();
  
  // Get the B.M.O Hall from database
  const bmoHall = arenas?.find(arena => arena.name === "B.M.O Hall");

  if (isLoading) {
    return <PageSkeleton variant="pricing" />;
  }
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 sm:pt-24 pb-8 sm:pb-12">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          {/* Header */}
          <div className="mb-8 sm:mb-12 text-center">
            <Badge variant="premium" className="mb-4">Transparent Pricing</Badge>
            <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
              Simple & <span className="gold-text">Flexible Pricing</span>
            </h1>
            <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto px-2">
              Choose the perfect venue and package for your event. All prices include our standard amenities.
            </p>
          </div>

          {/* Pricing Card */}
          <div className="flex justify-center mb-10 sm:mb-16">
            <div className="w-full max-w-md">
              <PricingCard
                name="B.M.O Hall"
                price={bmoHall ? bmoHall.price_per_hour.toLocaleString() : "2,950,000"}
                description="Our premier venue for grand celebrations and memorable events"
                capacity={bmoHall ? `Up to ${bmoHall.capacity} guests` : "Up to 500 guests"}
                features={bmoHall?.amenities || [
                  "8-hour venue access",
                  "Premium sound system",
                  "Chiavari chairs",
                  "Round tables",
                  "Central AC",
                  "Free parking",
                  "Security personnel",
                ]}
                icon={Crown}
              />
            </div>
          </div>

          {/* Add-ons Section */}
          <div className="mb-10 sm:mb-16">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="font-display text-xl sm:text-3xl font-bold mb-2">
                Optional <span className="gold-text">Add-ons</span>
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">Enhance your event with our premium services</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <AddOnCard title="Extended Hours" />
              <AddOnCard title="Premium Decor" />
              <AddOnCard title="DJ & Lighting" />
              <AddOnCard title="Full Catering" />
              <AddOnCard title="Photography" />
              <AddOnCard title="Videography" />
              <AddOnCard title="Live Band" />
              <AddOnCard title="Valet Parking" />
            </div>
          </div>

          {/* CTA Section */}
          <Card variant="glass" className="text-center p-6 sm:p-8 md:p-12">
            <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">
              Need a Custom Package?
            </h3>
            <p className="text-muted-foreground text-sm sm:text-base mb-4 sm:mb-6 max-w-xl mx-auto px-2">
              We offer tailored packages for corporate clients, recurring events, and special occasions. 
              Contact us to discuss your specific requirements.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link to="/contact">
                <Button variant="premium" size="lg" className="w-full sm:w-auto">
                  Contact Us
                </Button>
              </Link>
              <Link to="/book">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Book Now
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
      </div>
    </PageTransition>
  );
};

const PricingCard = ({
  name,
  price,
  description,
  capacity,
  features,
  icon: Icon,
}: {
  name: string;
  price: string;
  description: string;
  capacity: string;
  features: string[];
  icon: React.ElementType;
}) => (
  <Card variant="glass" className="relative border-primary ring-2 ring-primary/20">
    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
      <Badge variant="premium">Our Venue</Badge>
    </div>
    <CardHeader className="text-center pb-4">
      <div className="w-12 h-12 rounded-full gold-gradient mx-auto mb-3 flex items-center justify-center">
        <Icon className="w-6 h-6 text-primary-foreground" />
      </div>
      <CardTitle className="font-display text-xl">{name}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent className="text-center">
      <div className="mb-4">
        <span className="text-3xl font-bold text-primary">₦{price}</span>
        <span className="text-muted-foreground text-sm block">for 8 hours</span>
      </div>
      <Badge variant="secondary" className="mb-6">{capacity}</Badge>
      
      <ul className="space-y-2 text-left mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-sm">
            <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Link to="/book">
        <Button variant="premium" className="w-full">
          Book This Venue
        </Button>
      </Link>
    </CardContent>
  </Card>
);

const AddOnCard = ({
  title,
}: {
  title: string;
}) => (
  <Card variant="glass" className="p-4">
    <div className="flex items-center justify-center">
      <span className="font-medium text-center">{title}</span>
    </div>
  </Card>
);

export default PricingPage;
