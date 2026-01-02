import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Star, Calendar, Clock, Wifi, Car, Speaker, Wind, Film, Utensils } from "lucide-react";
interface Arena {
  id: string;
  name: string;
  location: string;
  address: string;
  capacity: number;
  rating: number;
  reviews: number;
  pricePerHour: number;
  image: string;
  status: "available" | "booked" | "maintenance";
  description: string;
  features: {
    icon: React.ElementType;
    name: string;
  }[];
}
const arenas: Arena[] = [{
  id: "1",
  name: "Grand Ballroom",
  location: "Wuse II, Abuja",
  address: "Plot 174, Riverplate Park, Wuse II, Abuja",
  capacity: 1000,
  rating: 4.9,
  reviews: 128,
  pricePerHour: 2950000,
  image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800",
  status: "available",
  description: "Our flagship venue perfect for grand weddings, galas, and corporate events. Features stunning chandeliers and state-of-the-art facilities.",
  features: [{
    icon: Speaker,
    name: "Sound System"
  }, {
    icon: Film,
    name: "Stage & Lighting"
  }, {
    icon: Wind,
    name: "Central AC"
  }, {
    icon: Car,
    name: "Valet Parking"
  }, {
    icon: Wifi,
    name: "High-Speed WiFi"
  }, {
    icon: Utensils,
    name: "Catering Kitchen"
  }]
}, {
  id: "2",
  name: "Executive Conference Hall",
  location: "Maitama, Abuja",
  address: "12 Aguiyi Ironsi Street, Maitama",
  capacity: 1000,
  rating: 4.8,
  reviews: 89,
  pricePerHour: 75000,
  image: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=800",
  status: "available",
  description: "Professional conference space ideal for corporate meetings, seminars, and executive gatherings. Equipped with modern technology.",
  features: [{
    icon: Film,
    name: "4K Projector"
  }, {
    icon: Wifi,
    name: "Video Conferencing"
  }, {
    icon: Wind,
    name: "Climate Control"
  }, {
    icon: Car,
    name: "Free Parking"
  }]
}, {
  id: "3",
  name: "Outdoor Pavilion",
  location: "Garki, Abuja",
  address: "Area 11, Garki District",
  capacity: 1000,
  rating: 4.7,
  reviews: 156,
  pricePerHour: 200000,
  image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800",
  status: "booked",
  description: "Spacious outdoor venue perfect for concerts, festivals, and large celebrations. Beautiful garden setting with flexible layout options.",
  features: [{
    icon: Speaker,
    name: "Concert Sound"
  }, {
    icon: Film,
    name: "Stage Ready"
  }, {
    icon: Car,
    name: "500+ Parking"
  }, {
    icon: Utensils,
    name: "Catering Area"
  }]
}, {
  id: "4",
  name: "Intimate Lounge",
  location: "Central Area, Abuja",
  address: "CBD, Central Business District",
  capacity: 1000,
  rating: 4.9,
  reviews: 67,
  pricePerHour: 50000,
  image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
  status: "available",
  description: "Cozy and elegant space for intimate gatherings, cocktail parties, and exclusive events. Perfect for networking sessions.",
  features: [{
    icon: Speaker,
    name: "Background Music"
  }, {
    icon: Wind,
    name: "AC"
  }, {
    icon: Wifi,
    name: "WiFi"
  }, {
    icon: Utensils,
    name: "Bar Service"
  }]
}, {
  id: "5",
  name: "Rooftop Terrace",
  location: "Jabi, Abuja",
  address: "Jabi Lake Mall, Jabi District",
  capacity: 1000,
  rating: 4.8,
  reviews: 94,
  pricePerHour: 120000,
  image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800",
  status: "maintenance",
  description: "Stunning rooftop venue with panoramic city views. Ideal for sunset cocktails, engagement parties, and memorable celebrations.",
  features: [{
    icon: Film,
    name: "LED Walls"
  }, {
    icon: Speaker,
    name: "DJ Setup"
  }, {
    icon: Car,
    name: "Mall Parking"
  }, {
    icon: Utensils,
    name: "Kitchen"
  }]
}];
const ArenasPage = () => {
  return <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="mb-8">
            <Badge variant="premium" className="mb-4">Our Venues</Badge>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Explore Our <span className="gold-text">Event Arenas</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Discover the perfect venue for your next event. Each arena offers unique features and world-class amenities.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap gap-3 mb-8">
            <Button variant="premium" size="sm">All Venues</Button>
            <Button variant="outline" size="sm">Available</Button>
            <Button variant="outline" size="sm">Wuse II</Button>
            <Button variant="outline" size="sm">Maitama</Button>
            <Button variant="outline" size="sm">Garki</Button>
          </div>

          {/* Arena Cards */}
          <div className="space-y-6">
            {arenas.map((arena, index) => <ArenaDetailCard key={arena.id} arena={arena} index={index} />)}
          </div>
        </div>
      </main>
      <Footer />
    </div>;
};
const ArenaDetailCard = ({
  arena,
  index
}: {
  arena: Arena;
  index: number;
}) => {
  const statusVariant = {
    available: "available",
    booked: "booked",
    maintenance: "maintenance"
  } as const;
  return <Card variant="glass" className="overflow-hidden animate-fade-in" style={{
    animationDelay: `${index * 0.1}s`
  }}>
      <div className="grid md:grid-cols-3 gap-0">
        {/* Image */}
        <div className="relative h-64 md:h-auto">
          <img src={arena.image} alt={arena.name} className="w-full h-full object-cover" />
          <div className="absolute top-4 left-4">
            <Badge variant={statusVariant[arena.status]} className="capitalize">
              {arena.status}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <CardContent className="md:col-span-2 p-6">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="font-display text-2xl font-bold mb-1">{arena.name}</h3>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{arena.address}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-1 bg-secondary px-3 py-1.5 rounded-full">
                <Star className="w-4 h-4 text-primary fill-primary" />
                <span className="font-semibold">{arena.rating}</span>
                <span className="text-muted-foreground text-sm">({arena.reviews} reviews)</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-muted-foreground mb-4">{arena.description}</p>

            {/* Features */}
            <div className="flex flex-wrap gap-2 mb-4">
              {arena.features.map(feature => <div key={feature.name} className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary rounded-lg">
                  <feature.icon className="w-4 h-4 text-primary" />
                  <span className="text-sm">{feature.name}</span>
                </div>)}
            </div>

            {/* Footer */}
            <div className="mt-auto pt-4 border-t border-border flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <span>Up to {arena.capacity} guests</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <span>Hourly   </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-2xl font-bold text-primary">₦{arena.pricePerHour.toLocaleString()}</span>
                  <span className="text-muted-foreground">   - 8hours</span>
                </div>
                <Button variant="premium" disabled={arena.status !== "available"}>
                  <Calendar className="w-4 h-4" />
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>;
};
export default ArenasPage;