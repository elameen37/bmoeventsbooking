import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useFeaturedEvents, FeaturedEvent } from "@/hooks/useFeaturedEvents";
import { Skeleton } from "@/components/ui/skeleton";

// Fallback events for when database is empty
const fallbackEvents: FeaturedEvent[] = [
  {
    id: "1",
    event_name: "Corporate Gala Night",
    event_type: "Corporate Event",
    event_date: "January 2026",
    attendees: 450,
    rating: 4.9,
    image_url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600",
    highlights: ["Live Band", "Gourmet Dinner", "Networking"],
    display_order: 0,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "2",
    event_name: "Wedding Reception",
    event_type: "Wedding",
    event_date: "December 2025",
    attendees: 300,
    rating: 4.8,
    image_url: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=600",
    highlights: ["Elegant Décor", "Live Music", "Photo Booth"],
    display_order: 1,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "3",
    event_name: "Product Launch",
    event_type: "Corporate Event",
    event_date: "November 2025",
    attendees: 200,
    rating: 4.7,
    image_url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600",
    highlights: ["Tech Showcase", "Media Coverage", "Cocktails"],
    display_order: 2,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
];

const ArenaShowcase = () => {
  const { data: events, isLoading } = useFeaturedEvents();
  
  // Use database events if available, otherwise fallback
  const displayEvents = events && events.length > 0 ? events : fallbackEvents;

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
          {isLoading ? (
            [...Array(3)].map((_, i) => <EventCardSkeleton key={i} />)
          ) : (
            displayEvents.slice(0, 3).map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))
          )}
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
          src={event.image_url || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600"}
          alt={event.event_name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
        
        {/* Event Type Badge */}
        <div className="absolute top-4 right-4">
          <Badge variant="premium" className="capitalize">
            {event.event_type}
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
          {event.event_name}
        </h3>
        <div className="flex items-center justify-center sm:justify-start gap-1 text-muted-foreground text-sm mb-4">
          <Calendar className="w-4 h-4" />
          {event.event_date}
        </div>

        {/* Highlights */}
        <div className="flex flex-wrap gap-2 mb-4 justify-center sm:justify-start">
          {(event.highlights || []).slice(0, 3).map((highlight) => (
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

const EventCardSkeleton = () => (
  <Card variant="elevated" className="overflow-hidden">
    <Skeleton className="h-48 w-full" />
    <CardContent className="p-4 sm:p-5 space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-16" />
      </div>
      <Skeleton className="h-8 w-full" />
    </CardContent>
  </Card>
);

export default ArenaShowcase;
