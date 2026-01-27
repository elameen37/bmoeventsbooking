import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Star, Calendar, Clock, Car, Wind, Utensils, Shield, ShieldCheck, Armchair, Circle, Zap } from "lucide-react";
import ImageMarquee from "@/components/ui/image-marquee";
import ArenaCardSkeleton from "@/components/arenas/ArenaCardSkeleton";
import ScrollToTop from "@/components/ui/scroll-to-top";
import PageTransition from "@/components/PageTransition";
import { useArenas, type Arena as DBArena } from "@/hooks/useArenas";

import bmoHall1 from "@/assets/bmo-hall-1.jpg";
import bmoHall2 from "@/assets/bmo-hall-2.jpg";

// Feature icons mapping
const featureIcons: Record<string, React.ElementType> = {
  "Security Guards": Shield,
  "Police Personnel": ShieldCheck,
  "Chivalry Chairs": Armchair,
  "Round Tables": Circle,
  "8-hour Power Supply": Zap,
  "Central AC": Wind,
  "Free Parking": Car,
  "Catering Area": Utensils,
  "Professional Sound System": Zap,
  "LED Lighting": Zap,
  "VIP Lounge": Armchair,
  "Catering Kitchen": Utensils,
  "Parking Space": Car,
  "Air Conditioning": Wind,
  "Stage Platform": Circle,
  "Bridal Suite": Armchair,
  "Outdoor Garden": Car,
};

// Arena images mapping (since images are stored locally)
const arenaImages: Record<string, string> = {
  "B.M.O Hall - 1": bmoHall1,
  "B.M.O Hall - 2": bmoHall2,
};

const ArenasPage = () => {
  const { data: arenas, isLoading, error } = useArenas();
  const [filter, setFilter] = useState<"all" | "available" | "booked">("all");

  const filteredArenas = arenas?.filter((arena) => {
    if (filter === "all") return true;
    return arena.status === filter;
  }) || [];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 sm:pt-24 pb-8 sm:pb-12">
          <div className="container mx-auto px-6 sm:px-8 lg:px-12">
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
              <Button 
                variant={filter === "all" ? "premium" : "outline"} 
                size="sm"
                onClick={() => setFilter("all")}
              >
                All Venues
              </Button>
              <Button 
                variant={filter === "available" ? "premium" : "outline"} 
                size="sm"
                onClick={() => setFilter("available")}
              >
                Available
              </Button>
              <Button 
                variant={filter === "booked" ? "premium" : "outline"} 
                size="sm"
                onClick={() => setFilter("booked")}
              >
                Booked
              </Button>
            </div>

            {/* Arena Cards */}
            <div className="space-y-4 sm:space-y-6">
              {isLoading ? (
                [1, 2].map((i) => <ArenaCardSkeleton key={i} />)
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-destructive">Failed to load venues. Please try again.</p>
                </div>
              ) : filteredArenas.length > 0 ? (
                filteredArenas.map((arena, index) => (
                  <ArenaDetailCard key={arena.id} arena={arena} index={index} />
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No venues match the selected filter.</p>
                </div>
              )}
            </div>
          </div>
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </PageTransition>
  );
};

const ArenaDetailCard = ({
  arena,
  index
}: {
  arena: DBArena;
  index: number;
}) => {
  const navigate = useNavigate();
  const statusVariant = {
    available: "available",
    booked: "booked",
    maintenance: "maintenance"
  } as const;

  const image = arenaImages[arena.name] || bmoHall1;
  const marqueeImages = [bmoHall1, bmoHall2];
  const features = (arena.amenities || []).map(name => ({
    icon: featureIcons[name] || Shield,
    name
  }));

  const handleBookNow = () => {
    navigate(`/book?arena=${arena.id}`);
  };

  return (
    <Card variant="glass" className="overflow-hidden animate-fade-in" style={{
      animationDelay: `${index * 0.1}s`
    }}>
      <div className="flex flex-col">
        {/* Marquee Images */}
        <div className="border-b border-border">
          <ImageMarquee images={marqueeImages} speed={25} className="py-2 sm:py-3" />
        </div>
        
        <div className="grid md:grid-cols-3 gap-0">
          {/* Main Image */}
          <div className="relative h-48 sm:h-64 md:h-auto">
            <img src={image} alt={arena.name} className="w-full h-full object-cover" />
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
                    <span className="line-clamp-1">{arena.location}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 bg-secondary px-3 py-1.5 rounded-full">
                  <Star className="w-4 h-4 text-primary fill-primary" />
                  <span className="font-semibold">4.8</span>
                  <span className="text-muted-foreground text-xs sm:text-sm">(100+ reviews)</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-muted-foreground text-sm sm:text-base mb-3 sm:mb-4">{arena.description}</p>

              {/* Features */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4 justify-center md:justify-start">
                {features.slice(0, 7).map(feature => (
                  <div key={feature.name} className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-secondary rounded-lg">
                    <feature.icon className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                    <span className="text-xs sm:text-sm">{feature.name}</span>
                  </div>
                ))}
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
                    <span>8 hours</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
                  <div className="text-center sm:text-right">
                    <span className="text-xl sm:text-2xl font-bold text-primary">₦{arena.price_per_hour.toLocaleString()}</span>
                    <span className="text-muted-foreground text-sm"> - 8hours</span>
                  </div>
                  <Button 
                    variant="premium" 
                    disabled={arena.status !== "available"} 
                    className="w-full sm:w-auto"
                    onClick={handleBookNow}
                  >
                    <Calendar className="w-4 h-4" />
                    Book Now
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
};

export default ArenasPage;
