import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Clock, CheckCircle, Star, ArrowRight, Facebook, Instagram, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useAdminSettings } from "@/hooks/useAdminSettings";
import heroArena from "@/assets/hero-arena.jpg";
import hero1 from "@/assets/hero/hero-slide-1.png";
import hero2 from "@/assets/hero/hero-slide-2.png";
import hero3 from "@/assets/hero/hero-slide-3.png";
import hero4 from "@/assets/hero/hero-slide-4.png";
import hero5 from "@/assets/hero/hero-slide-5.png";

interface HeroSlide {
  id: string;
  image_url: string;
  title?: string;
  subtitle?: string;
  active: boolean;
}

interface HeroConfig {
  slides: HeroSlide[];
  transition: "fade" | "slide" | "zoom";
  duration: number;
  auto_play: boolean;
}

const DEFAULT_CONFIG: HeroConfig = {
  slides: [
    {
      id: "seed-1",
      image_url: hero1,
      title: "Perfect Event Space",
      subtitle: "Discover and book your premium events at B.M.O Events Arena, Abuja. From corporate conferences to grand celebrations.",
      active: true
    },
    {
      id: "seed-2",
      image_url: hero2,
      title: "Corporate Excellence",
      subtitle: "Executive conference rooms with state-of-the-art technology for your professional business needs.",
      active: true
    },
    {
      id: "seed-3",
      image_url: hero3,
      title: "Grand Celebrations",
      subtitle: "Beautiful outdoor marquee settings for unforgettable gala nights and garden parties.",
      active: true
    },
    {
      id: "seed-4",
      image_url: hero4,
      title: "Royal Weddings",
      subtitle: "Transform your dream wedding into reality in our majestic, crystal-adorned ballrooms.",
      active: true
    },
    {
      id: "seed-5",
      image_url: hero5,
      title: "Premium Networking",
      subtitle: "The ideal atmosphere for high-profile gala dinners and sophisticated networking events.",
      active: true
    }
  ],
  transition: "zoom",
  duration: 6,
  auto_play: true
};

const HeroSection = () => {
  const [scrollY, setScrollY] = useState(0);
  const { data: configSetting } = useAdminSettings("hero_config");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Parse config from DB or use default
  const config: HeroConfig = configSetting?.setting_value 
    ? { ...DEFAULT_CONFIG, ...JSON.parse(configSetting.setting_value) } 
    : DEFAULT_CONFIG;

  const activeSlides = config.slides.filter(s => s.active);
  const slidesCount = activeSlides.length;

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const nextSlide = useCallback(() => {
    if (slidesCount <= 1 || isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % slidesCount);
    setTimeout(() => setIsTransitioning(false), 800);
  }, [slidesCount, isTransitioning]);

  const prevSlide = () => {
    if (slidesCount <= 1 || isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + slidesCount) % slidesCount);
    setTimeout(() => setIsTransitioning(false), 800);
  };

  useEffect(() => {
    if (config.auto_play && slidesCount > 1) {
      const interval = setInterval(nextSlide, config.duration * 1000);
      return () => clearInterval(interval);
    }
  }, [config.auto_play, config.duration, slidesCount, nextSlide]);

  // Parallax multipliers
  const bgParallax = scrollY * 0.5;
  const contentParallax = scrollY * 0.2;
  const floatingParallax = scrollY * 0.3;

  const currentSlideData = activeSlides[currentSlide] || DEFAULT_CONFIG.slides[0];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Background Slides */}
      <div className="absolute inset-0 z-0">
        {activeSlides.map((slide, index) => {
          const isActive = index === currentSlide;
          let transitionClasses = "opacity-0 scale-100";
          
          if (isActive) {
            transitionClasses = "opacity-100 [.light_&]:opacity-90 scale-100 z-10";
          } else if (config.transition === "zoom" && !isActive) {
            transitionClasses = "opacity-0 scale-110 z-0";
          } else if (config.transition === "slide" && !isActive) {
            transitionClasses = `opacity-0 z-0 ${index < currentSlide ? "-translate-x-full" : "translate-x-full"}`;
          }

          return (
            <div 
              key={slide.id}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out will-change-transform ${transitionClasses}`}
              style={{ 
                transform: isActive ? `translateY(${bgParallax}px)` : undefined,
              }}
            >
              <img 
                src={slide.image_url} 
                alt="Background" 
                className="w-full h-[120%] object-cover" 
              />
              <div className="absolute inset-0 hero-overlay" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
            </div>
          );
        })}
        {/* Fallback if no images are active */}
        {slidesCount === 0 && (
          <div className="absolute inset-0">
            <img src={heroArena} alt="Default" className="w-full h-full object-cover" />
            <div className="absolute inset-0 hero-overlay" />
          </div>
        )}
      </div>

      {/* Content */}
      <div 
        className="relative z-10 container mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-20 flex items-center justify-center will-change-transform"
        style={{ transform: `translateY(${contentParallax}px)`, opacity: Math.max(0, 1 - scrollY * 0.002) }}
      >
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-6 sm:mb-8 animate-fade-in">
            <Star className="w-4 h-4 text-primary" />
            <span className="text-xs sm:text-sm font-medium text-primary">Premium Event Venue in Abuja</span>
          </div>

          {/* Heading */}
          <h1 
            key={`title-${currentSlide}`}
            className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 animate-slide-up" 
          >
            {currentSlideData.title?.includes("Book Your") ? (
              currentSlideData.title
            ) : (
              <>
                {currentSlideData.title || "Book Your"}
                <span className="block gold-text">
                  {currentSlideData.id === "default-1" ? "Perfect Event Space" : ""}
                </span>
              </>
            )}
            {currentSlideData.id !== "default-1" && !currentSlideData.title?.includes("Perfect Event Space") && (
              <span className="block gold-text">Extraordinary Events</span>
            )}
          </h1>

          {/* Description */}
          <p 
            key={`desc-${currentSlide}`}
            className="text-base sm:text-xl text-foreground/80 mb-6 sm:mb-8 max-w-2xl mx-auto animate-fade-in" 
            style={{ animationDelay: "0.2s" }}
          >
            {currentSlideData.subtitle || DEFAULT_CONFIG.slides[0].subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12 animate-fade-in justify-center delay-300">
            <Link to="/book">
              <Button variant="hero" size="xl" className="w-full sm:w-auto">
                <Calendar className="w-5 h-5 mr-2" />
                Book a Date
              </Button>
            </Link>
            <Link to="/calendar">
              <Button variant="outline" size="xl" className="w-full sm:w-auto bg-background/20 backdrop-blur-md">
                Explore Calendar
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Social Icons & Navigation Dots Area */}
          <div className="flex flex-col items-center gap-8">
            {/* Dots Counter */}
            {slidesCount > 1 && (
              <div className="flex items-center gap-3 py-2">
                {activeSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`group relative h-2 transition-all duration-300 rounded-full ${
                      idx === currentSlide ? "w-8 bg-primary" : "w-2 bg-primary/30 hover:bg-primary/50"
                    }`}
                  >
                    <span className="sr-only">Go to slide {idx + 1}</span>
                    {idx === currentSlide && config.auto_play && (
                      <span 
                        className="absolute inset-0 bg-white/40 rounded-full origin-left"
                        style={{ animation: `progress ${config.duration}s linear infinite` }}
                      />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Social Media */}
            <div className="flex items-center justify-center gap-4 animate-fade-in delay-500">
              <SocialLink href="https://facebook.com" icon={<Facebook className="w-5 h-5" />} />
              <SocialLink href="https://instagram.com" icon={<Instagram className="w-5 h-5" />} />
              <SocialLink 
                href="https://tiktok.com" 
                icon={
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                } 
              />
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-12 sm:mt-16 grid grid-cols-3 gap-4 sm:gap-8 animate-fade-in delay-700">
            <StatItem icon={<Users />} value="10K+" label="Events Hosted" />
            <StatItem icon={<Clock />} value="24/7" label="Support" />
            <StatItem icon={<CheckCircle />} value="99%" label="Satisfaction" />
          </div>
        </div>
      </div>

      {/* Manual Navigation Controls (Desktop) */}
      {slidesCount > 1 && (
        <div className="hidden lg:block">
          <button 
            onClick={prevSlide}
            className="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center text-white hover:bg-primary transition-all duration-300 z-20 group"
          >
            <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center text-white hover:bg-primary transition-all duration-300 z-20 group"
          >
            <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      )}

      {/* Floating Elements */}
      <div 
        className="absolute right-10 top-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float will-change-transform z-0"
        style={{ transform: `translateY(${-floatingParallax}px)` }}
      />
      <div 
        className="absolute left-10 top-1/3 w-32 h-32 bg-primary/5 rounded-full blur-2xl animate-float will-change-transform z-0"
        style={{ animationDelay: "1s", transform: `translateY(${-floatingParallax * 1.2}px)` }}
      />
    </section>
  );
};

const SocialLink = ({ href, icon }: { href: string; icon: React.ReactNode }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="w-11 h-11 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110 backdrop-blur-sm"
  >
    {icon}
  </a>
);

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
    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shadow-inner">
      {icon}
    </div>
    <div className="space-y-0.5">
      <div className="font-display text-lg sm:text-2xl font-bold text-foreground">{value}</div>
      <div className="text-[10px] sm:text-xs uppercase tracking-widest text-muted-foreground font-semibold">{label}</div>
    </div>
  </div>
);

export default HeroSection;