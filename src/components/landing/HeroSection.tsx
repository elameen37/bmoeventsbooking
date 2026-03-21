import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Clock, CheckCircle, Star, ArrowRight, Facebook, Instagram } from "lucide-react";
import { useState, useEffect } from "react";
import heroArena from "@/assets/hero-arena.jpg";

const HeroSection = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Parallax multipliers for different layers
  const bgParallax = scrollY * 0.5;
  const contentParallax = scrollY * 0.2;
  const floatingParallax = scrollY * 0.3;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <div 
        className="absolute inset-0 will-change-transform"
        style={{ transform: `translateY(${bgParallax}px) scale(${1 + scrollY * 0.0002})` }}
      >
        <img 
          src={heroArena} 
          alt="B.M.O Events Arena" 
          className="w-full h-[120%] object-cover" 
        />
        <div className="absolute inset-0 hero-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Content with subtle parallax */}
      <div 
        className="relative z-10 container mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-20 flex items-center justify-center will-change-transform"
        style={{ transform: `translateY(${contentParallax}px)`, opacity: Math.max(0, 1 - scrollY * 0.002) }}
      >
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-6 sm:mb-8 animate-fade-in">
            <Star className="w-4 h-4 text-primary" />
            <span className="text-xs sm:text-sm font-medium text-primary">Premium Event Venue in Abuja</span>
          </div>

          {/* Heading */}
          <h1 
            className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 animate-fade-in" 
            style={{ animationDelay: "0.1s" }}
          >
            Book Your
            <span className="block gold-text">Perfect Event Space</span>
          </h1>

          {/* Description */}
          <p 
            className="text-base sm:text-xl text-foreground/80 mb-6 sm:mb-8 max-w-xl mx-auto animate-fade-in" 
            style={{ animationDelay: "0.2s" }}
          >
            Discover and book your premium events at B.M.O Events Arena, Abuja. From corporate conferences to grand celebrations, find the ideal venue for your unforgettable moments.
          </p>

          {/* CTA Buttons */}
          <div 
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12 animate-fade-in justify-center" 
            style={{ animationDelay: "0.3s" }}
          >
            <Link to="/book">
              <Button variant="hero" size="xl" className="w-full sm:w-auto">
                <Calendar className="w-5 h-5" />
                Book a Date
              </Button>
            </Link>
            <Link to="/calendar">
              <Button variant="outline" size="xl" className="w-full sm:w-auto">
                Explore Calendar
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>

          {/* Social Media Buttons */}
          <div 
            className="flex items-center justify-center gap-4 mb-8 sm:mb-12 animate-fade-in" 
            style={{ animationDelay: "0.35s" }}
          >
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
            </a>
          </div>

          {/* Stats */}
          <div 
            className="grid grid-cols-3 gap-4 sm:gap-6 animate-fade-in" 
            style={{ animationDelay: "0.4s" }}
          >
            <StatItem icon={<Users />} value="10K+" label="Events Hosted" />
            <StatItem icon={<Clock />} value="24/7" label="Support" />
            <StatItem icon={<CheckCircle />} value="99%" label="Satisfaction" />
          </div>
        </div>
      </div>

      {/* Floating Elements with enhanced parallax */}
      <div 
        className="absolute right-10 top-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float will-change-transform"
        style={{ transform: `translateY(${-floatingParallax}px)` }}
      />
      <div 
        className="absolute right-1/4 bottom-1/4 w-48 h-48 bg-accent/10 rounded-full blur-3xl animate-float will-change-transform"
        style={{ animationDelay: "2s", transform: `translateY(${-floatingParallax * 0.7}px)` }}
      />
      <div 
        className="absolute left-10 top-1/3 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-float will-change-transform"
        style={{ animationDelay: "1s", transform: `translateY(${-floatingParallax * 1.2}px)` }}
      />
    </section>
  );
};

const StatItem = ({
  icon,
  value,
  label
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) => (
  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
      {icon}
    </div>
    <div>
      <div className="font-display text-lg sm:text-xl font-bold text-foreground">{value}</div>
      <div className="text-xs sm:text-sm text-muted-foreground">{label}</div>
    </div>
  </div>
);

export default HeroSection;