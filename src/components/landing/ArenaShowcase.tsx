import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface Arena {
  id: string;
  name: string;
  location: string;
  capacity: number;
  rating: number;
  pricePerHour: number;
  image: string;
  status: "available" | "booked" | "maintenance";
  features: string[];
}

const arenas: Arena[] = [
  {
    id: "1",
    name: "Grand Ballroom",
    location: "Wuse II, Abuja",
    capacity: 500,
    rating: 4.9,
    pricePerHour: 150000,
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600",
    status: "available",
    features: ["Stage", "Sound System", "Lighting", "AC"],
  },
  {
    id: "2",
    name: "Executive Conference Hall",
    location: "Maitama, Abuja",
    capacity: 150,
    rating: 4.8,
    pricePerHour: 75000,
    image: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=600",
    status: "available",
    features: ["Projector", "Video Conf", "Whiteboard", "AC"],
  },
  {
    id: "3",
    name: "Outdoor Pavilion",
    location: "Garki, Abuja",
    capacity: 1000,
    rating: 4.7,
    pricePerHour: 200000,
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600",
    status: "booked",
    features: ["Open Air", "Tent Available", "Generator", "Parking"],
  },
];

const ArenaShowcase = () => {
  return (
    <section className="py-12 sm:py-20 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-16">
          <Badge variant="premium" className="mb-4">Featured Venues</Badge>
          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
            Our Premier <span className="gold-text">Event Arenas</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto px-2">
            Explore our collection of world-class event spaces, each designed to make your occasion extraordinary.
          </p>
        </div>

        {/* Arena Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 mb-8 sm:mb-12">
          {arenas.map((arena, index) => (
            <ArenaCard key={arena.id} arena={arena} index={index} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link to="/arenas">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              View All Arenas
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

const ArenaCard = ({ arena, index }: { arena: Arena; index: number }) => {
  const statusVariant = {
    available: "available",
    booked: "booked",
    maintenance: "maintenance",
  } as const;

  return (
    <Card 
      variant="elevated" 
      className="overflow-hidden group animate-fade-in"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={arena.image}
          alt={arena.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <Badge variant={statusVariant[arena.status]} className="capitalize">
            {arena.status}
          </Badge>
        </div>

        {/* Rating */}
        <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full">
          <Star className="w-4 h-4 text-primary fill-primary" />
          <span className="text-sm font-medium">{arena.rating}</span>
        </div>
      </div>

      <CardContent className="p-4 sm:p-5 text-center sm:text-left">
        {/* Title & Location */}
        <h3 className="font-display text-lg sm:text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
          {arena.name}
        </h3>
        <div className="flex items-center justify-center sm:justify-start gap-1 text-muted-foreground text-sm mb-4">
          <MapPin className="w-4 h-4" />
          {arena.location}
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-4 justify-center sm:justify-start">
          {arena.features.slice(0, 3).map((feature) => (
            <span key={feature} className="text-xs px-2 py-1 bg-secondary rounded-md text-secondary-foreground">
              {feature}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-border gap-2 sm:gap-0">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span className="text-sm">Up to {arena.capacity}</span>
          </div>
          <div className="text-center sm:text-right">
            <span className="text-lg font-bold text-primary">₦{arena.pricePerHour.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">/hour</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArenaShowcase;
