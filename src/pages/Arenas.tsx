import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Star, Calendar, Clock, Car, Wind, Utensils, Shield, ShieldCheck, Armchair, Circle, Zap } from "lucide-react";
import ImageMarquee from "@/components/ui/image-marquee";
import ArenaCardSkeleton from "@/components/arenas/ArenaCardSkeleton";
import ScrollToTop from "@/components/ui/scroll-to-top";

import bmoHall1 from "@/assets/bmo-hall-1.jpg";
import bmoHall2 from "@/assets/bmo-hall-2.jpg";
import bmoHall3 from "@/assets/bmo-hall-3.jpg";
import bmoHall4 from "@/assets/bmo-hall-4.jpg";

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
  marqueeImages: string[];
  status: "available" | "booked" | "maintenance";
  description: string;
  features: {
    icon: React.ElementType;
    name: string;
  }[];
}
const arenas: Arena[] = [{
  id: "1",
  name: "B.M.O Hall - 1",
  location: "Wuse II, Abuja",
  address: "Plot 174, Riverplate Park, Wuse II, Abuja",
  capacity: 1000,
  rating: 4.8,
  reviews: 89,
  pricePerHour: 75000,
  image: bmoHall1,
  marqueeImages: [bmoHall1, bmoHall2, bmoHall3, bmoHall4],
  status: "available",
  description: "Professional conference space ideal for corporate meetings, seminars, and executive gatherings. Equipped with modern technology.",
  features: [{
    icon: Shield,
    name: "Security Guards"
  }, {
    icon: Armchair,
    name: "Chivalry Chairs"
  }, {
    icon: Circle,
    name: "Round Tables"
  }, {
    icon: Zap,
    name: "8-hour Power Supply"
  }, {
    icon: Wind,
    name: "Central AC"
  }, {
    icon: Car,
    name: "Free Parking"
  }, {
    icon: Utensils,
    name: "Catering Area"
  }]
}, {
  id: "2",
  name: "B.M.O Hall - 2",
  location: "Wuse II, Abuja",
  address: "Plot 174, Riverplate Park, Wuse II, Abuja",
  capacity: 1000,
  rating: 4.7,
  reviews: 156,
  pricePerHour: 200000,
  image: bmoHall2,
  marqueeImages: [bmoHall2, bmoHall1, bmoHall3, bmoHall4],
  status: "booked",
  description: "Spacious outdoor venue perfect for concerts, festivals, and large celebrations. Beautiful garden setting with flexible layout options.",
  features: [{
    icon: Shield,
    name: "Security Guards"
  }, {
    icon: ShieldCheck,
    name: "Police Personnel"
  }, {
    icon: Armchair,
    name: "Chivalry Chairs"
  }, {
    icon: Circle,
    name: "Round Tables"
  }, {
    icon: Zap,
    name: "8-hour Power Supply"
  }, {
    icon: Wind,
    name: "Central AC"
  }, {
    icon: Car,
    name: "Free Parking"
  }, {
    icon: Utensils,
    name: "Catering Area"
  }]
}, {
  id: "3",
  name: "B.M.O Hall - 3",
  location: "Wuse II, Abuja",
  address: "Plot 174, Riverplate Park, Wuse II, Abuja",
  capacity: 1000,
  rating: 4.9,
  reviews: 67,
  pricePerHour: 50000,
  image: bmoHall3,
  marqueeImages: [bmoHall3, bmoHall1, bmoHall2, bmoHall4],
  status: "available",
  description: "Cozy and elegant space for intimate gatherings, cocktail parties, and exclusive events. Perfect for networking sessions.",
  features: [{
    icon: Shield,
    name: "Security Guards"
  }, {
    icon: Armchair,
    name: "Chivalry Chairs"
  }, {
    icon: Circle,
    name: "Round Tables"
  }, {
    icon: Zap,
    name: "8-hour Power Supply"
  }, {
    icon: Wind,
    name: "Central AC"
  }, {
    icon: Car,
    name: "Free Parking"
  }, {
    icon: Utensils,
    name: "Catering Area"
  }]
}, {
  id: "4",
  name: "B.M.O Hall - 4",
  location: "Wuse II, Abuja",
  address: "Plot 174, Riverplate Park, Wuse II, Abuja",
  capacity: 1000,
  rating: 4.8,
  reviews: 94,
  pricePerHour: 120000,
  image: bmoHall4,
  marqueeImages: [bmoHall4, bmoHall1, bmoHall2, bmoHall3],
  status: "maintenance",
  description: "Stunning rooftop venue with panoramic city views. Ideal for sunset cocktails, engagement parties, and memorable celebrations.",
  features: [{
    icon: Shield,
    name: "Security Guards"
  }, {
    icon: Armchair,
    name: "Chivalry Chairs"
  }, {
    icon: Circle,
    name: "Round Tables"
  }, {
    icon: Zap,
    name: "8-hour Power Supply"
  }, {
    icon: Wind,
    name: "Central AC"
  }, {
    icon: Car,
    name: "Free Parking"
  }, {
    icon: Utensils,
    name: "Catering Area"
  }]
}];
const ArenasPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 sm:pt-24 pb-8 sm:pb-12">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="mb-6 sm:mb-8 text-center sm:text-left">
            <Badge variant="premium" className="mb-4">Our Venues</Badge>
            <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
              Explore Our <span className="gold-text">Event Arenas</span>
            </h1>
            <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto sm:mx-0">
              Discover the perfect venue for your next event. Each arena offers unique features and world-class amenities.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8 justify-center sm:justify-start">
            <Button variant="premium" size="sm">All Venues</Button>
            <Button variant="outline" size="sm">Available</Button>
            <Button variant="outline" size="sm">Wuse II</Button>
            <Button variant="outline" size="sm">Maitama</Button>
            <Button variant="outline" size="sm">Garki</Button>
          </div>

          {/* Arena Cards */}
          <div className="space-y-4 sm:space-y-6">
            {isLoading
              ? [1, 2, 3, 4].map((i) => <ArenaCardSkeleton key={i} />)
              : arenas.map((arena, index) => <ArenaDetailCard key={arena.id} arena={arena} index={index} />)
            }
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
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
      <div className="flex flex-col">
        {/* Marquee Images */}
        <div className="border-b border-border">
          <ImageMarquee images={arena.marqueeImages} speed={25} className="py-2 sm:py-3" />
        </div>
        
        <div className="grid md:grid-cols-3 gap-0">
          {/* Main Image */}
          <div className="relative h-48 sm:h-64 md:h-auto">
            <img src={arena.image} alt={arena.name} className="w-full h-full object-cover" />
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
              <Badge variant={statusVariant[arena.status]} className="capitalize">
                {arena.status}
              </Badge>
            </div>
          </div>

        {/* Content */}
        <CardContent className="md:col-span-2 p-4 sm:p-6">
          <div className="flex flex-col h-full text-center md:text-left">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:flex-wrap items-center md:items-start justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div>
                <h3 className="font-display text-xl sm:text-2xl font-bold mb-1">{arena.name}</h3>
                <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground text-sm">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="line-clamp-1">{arena.address}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-1 bg-secondary px-3 py-1.5 rounded-full">
                <Star className="w-4 h-4 text-primary fill-primary" />
                <span className="font-semibold">{arena.rating}</span>
                <span className="text-muted-foreground text-xs sm:text-sm">({arena.reviews} reviews)</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-muted-foreground text-sm sm:text-base mb-3 sm:mb-4">{arena.description}</p>

            {/* Features */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4 justify-center md:justify-start">
              {arena.features.map(feature => <div key={feature.name} className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-secondary rounded-lg">
                  <feature.icon className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                  <span className="text-xs sm:text-sm">{feature.name}</span>
                </div>)}
            </div>

            {/* Footer */}
            <div className="mt-auto pt-3 sm:pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
              <div className="flex flex-wrap gap-3 sm:gap-6 justify-center md:justify-start">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                  <span>Up to {arena.capacity} guests</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                  <span>Hourly</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <div className="text-center sm:text-right">
                  <span className="text-xl sm:text-2xl font-bold text-primary">₦{arena.pricePerHour.toLocaleString()}</span>
                  <span className="text-muted-foreground text-sm"> - 8hours</span>
                </div>
                <Button variant="premium" disabled={arena.status !== "available"} className="w-full sm:w-auto">
                  <Calendar className="w-4 h-4" />
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
        </div>
      </div>
    </Card>;
};
export default ArenasPage;