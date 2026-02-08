import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      
      setScrollProgress(progress);
      setIsVisible(scrollTop > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const circumference = 2 * Math.PI * 20;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-6 right-6 z-50 group",
        "h-14 w-14 sm:h-16 sm:w-16",
        "transition-all duration-500 ease-out",
        isVisible 
          ? "opacity-100 translate-y-0 scale-100" 
          : "opacity-0 translate-y-8 scale-75 pointer-events-none"
      )}
      aria-label="Scroll to top"
    >
      {/* Outer glow effect */}
      <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl group-hover:bg-primary/30 transition-all duration-300" />
      
      {/* Progress ring background */}
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 48 48">
        <circle
          cx="24"
          cy="24"
          r="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-muted/30"
        />
        {/* Progress ring */}
        <circle
          cx="24"
          cy="24"
          r="20"
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset,
            transition: "stroke-dashoffset 0.1s ease-out",
          }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--accent))" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Inner button */}
      <div className={cn(
        "absolute inset-2 rounded-full",
        "bg-gradient-to-br from-primary to-primary/80",
        "flex items-center justify-center",
        "shadow-lg shadow-primary/25",
        "transition-all duration-300",
        "group-hover:shadow-xl group-hover:shadow-primary/40",
        "group-hover:scale-105",
        "group-active:scale-95"
      )}>
        <ArrowUp className={cn(
          "h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground",
          "transition-transform duration-300",
          "group-hover:-translate-y-0.5"
        )} />
      </div>
    </button>
  );
};

export default ScrollToTop;
