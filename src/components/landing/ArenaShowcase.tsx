import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface FeaturedEvent {
  id: string;
  eventName: string;
  eventType: string;
  date: string;
  attendees: number;
  rating: number;
  image: string;
  highlights: string[];
}

const featuredEvents: FeaturedEvent[] = [
  {
    id: "1",
    eventName: "Corporate Gala Night",
    eventType: "Corporate Event",
    date: "January 2026",
    attendees: 450,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600",
    highlights: ["Live Band", "Gourmet Dinner", "Networking"],
  },
  {
    id: "2",
    eventName: "Wedding Reception",
    eventType: "Wedding",
    date: "December 2025",
    attendees: 300,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=600",
    highlights: ["Elegant Décor", "Live Music", "Photo Booth"],
  },
  {
    id: "3",
    eventName: "Product Launch",
    eventType: "Corporate Event",
    date: "November 2025",
    attendees: 200,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600",
    highlights: ["Tech Showcase", "Media Coverage", "Cocktails"],
  },
];

const ArenaShowcase = () => {
  return (
    <section className="py-12 sm:py-20 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-16">
          <Badge variant="premium" className="mb-4">Featured Events</Badge>
          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
            Recent <span className="gold-text">Featured Events</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto px-2">
            Discover the memorable occasions hosted at our venue, from elegant weddings to prestigious corporate gatherings.
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 mb-8 sm:mb-12">
          {featuredEvents.map((event, index) => (
            <EventCard key={event.id} event={event} index={index} />
          ))}
        </div>

        {/* Book Event Button */}
        <div className="text-center">
          <Link to="/book">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Book Your Event
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

const EventCard = ({ event, index }: { event: FeaturedEvent; index: number }) => {
  return (
    <Card 
      variant="elevated" 
      className="overflow-hidden group animate-fade-in"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.image}
          alt={event.eventName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
        
        {/* Event Type Badge */}
        <div className="absolute top-4 right-4">
          <Badge variant="premium" className="capitalize">
            {event.eventType}
          </Badge>
        </div>

        {/* Rating */}
        <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full">
          <Star className="w-4 h-4 text-primary fill-primary" />
          <span className="text-sm font-medium">{event.rating}</span>
        </div>
      </div>

      <CardContent className="p-4 sm:p-5 text-center sm:text-left">
        {/* Title & Date */}
        <h3 className="font-display text-lg sm:text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
          {event.eventName}
        </h3>
        <div className="flex items-center justify-center sm:justify-start gap-1 text-muted-foreground text-sm mb-4">
          <Calendar className="w-4 h-4" />
          {event.date}
        </div>

        {/* Highlights */}
        <div className="flex flex-wrap gap-2 mb-4 justify-center sm:justify-start">
          {event.highlights.slice(0, 3).map((highlight) => (
            <span key={highlight} className="text-xs px-2 py-1 bg-secondary rounded-md text-secondary-foreground">
              {highlight}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-border gap-2 sm:gap-0">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span className="text-sm">{event.attendees} Attendees</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            Success Story
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArenaShowcase;
