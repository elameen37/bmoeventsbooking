import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Star, Sparkles, Crown } from "lucide-react";
import { Link } from "react-router-dom";

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="mb-12 text-center">
            <Badge variant="premium" className="mb-4">Transparent Pricing</Badge>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Simple & <span className="gold-text">Flexible Pricing</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Choose the perfect venue and package for your event. All prices include our standard amenities.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <PricingCard
              name="B.M.O Hall - 1"
              price="75,000"
              description="Perfect for intimate gatherings and corporate meetings"
              capacity="Up to 200 guests"
              features={[
                "8-hour venue access",
                "Basic sound system",
                "100 Chiavari chairs",
                "10 round tables",
                "Central AC",
                "Free parking",
                "Security personnel",
              ]}
              icon={Star}
            />
            <PricingCard
              name="B.M.O Hall - 2"
              price="200,000"
              description="Ideal for grand celebrations and large events"
              capacity="Up to 500 guests"
              popular
              features={[
                "8-hour venue access",
                "Premium sound system",
                "300 Chiavari chairs",
                "30 round tables",
                "Central AC",
                "Free parking",
                "Police personnel",
                "Dedicated event coordinator",
                "Bridal suite access",
              ]}
              icon={Crown}
            />
            <PricingCard
              name="B.M.O Hall - 3"
              price="50,000"
              description="Cozy space for small gatherings and cocktails"
              capacity="Up to 100 guests"
              features={[
                "8-hour venue access",
                "Basic sound system",
                "50 Chiavari chairs",
                "5 round tables",
                "Central AC",
                "Free parking",
                "Security personnel",
              ]}
              icon={Sparkles}
            />
            <PricingCard
              name="B.M.O Hall - 4"
              price="120,000"
              description="Versatile space for mid-sized events"
              capacity="Up to 300 guests"
              features={[
                "8-hour venue access",
                "Premium sound system",
                "200 Chiavari chairs",
                "20 round tables",
                "Central AC",
                "Free parking",
                "Security personnel",
                "Catering kitchen access",
              ]}
              icon={Star}
            />
          </div>

          {/* Add-ons Section */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="font-display text-3xl font-bold mb-2">
                Optional <span className="gold-text">Add-ons</span>
              </h2>
              <p className="text-muted-foreground">Enhance your event with our premium services</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <AddOnCard title="Extended Hours" price="15,000" unit="/hour" />
              <AddOnCard title="Premium Decor" price="150,000" unit="flat" />
              <AddOnCard title="DJ & Lighting" price="100,000" unit="flat" />
              <AddOnCard title="Full Catering" price="5,000" unit="/plate" />
              <AddOnCard title="Photography" price="80,000" unit="flat" />
              <AddOnCard title="Videography" price="120,000" unit="flat" />
              <AddOnCard title="Live Band" price="200,000" unit="flat" />
              <AddOnCard title="Valet Parking" price="50,000" unit="flat" />
            </div>
          </div>

          {/* CTA Section */}
          <Card variant="glass" className="text-center p-8 md:p-12">
            <h3 className="font-display text-2xl md:text-3xl font-bold mb-4">
              Need a Custom Package?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              We offer tailored packages for corporate clients, recurring events, and special occasions. 
              Contact us to discuss your specific requirements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button variant="premium" size="lg">
                  Contact Us
                </Button>
              </Link>
              <Link to="/book">
                <Button variant="outline" size="lg">
                  Book Now
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const PricingCard = ({
  name,
  price,
  description,
  capacity,
  features,
  popular = false,
  icon: Icon,
}: {
  name: string;
  price: string;
  description: string;
  capacity: string;
  features: string[];
  popular?: boolean;
  icon: React.ElementType;
}) => (
  <Card variant="glass" className={`relative ${popular ? "border-primary ring-2 ring-primary/20" : ""}`}>
    {popular && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
        <Badge variant="premium">Most Popular</Badge>
      </div>
    )}
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
        <Button variant={popular ? "premium" : "outline"} className="w-full">
          Book This Venue
        </Button>
      </Link>
    </CardContent>
  </Card>
);

const AddOnCard = ({
  title,
  price,
  unit,
}: {
  title: string;
  price: string;
  unit: string;
}) => (
  <Card variant="glass" className="p-4">
    <div className="flex items-center justify-between">
      <span className="font-medium">{title}</span>
      <div className="text-right">
        <span className="text-primary font-semibold">₦{price}</span>
        <span className="text-muted-foreground text-xs block">{unit}</span>
      </div>
    </div>
  </Card>
);

export default PricingPage;
