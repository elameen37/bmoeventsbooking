import { useState, useEffect } from "react";
import HeroSection from "@/components/landing/HeroSection";
import ArenaShowcase from "@/components/landing/ArenaShowcase";
import EventsGallery from "@/components/landing/EventsGallery";
import FeaturesSection from "@/components/landing/FeaturesSection";
import CTASection from "@/components/landing/CTASection";
import PageTransition from "@/components/PageTransition";
import PageSkeleton from "@/components/skeletons/PageSkeleton";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <PageSkeleton variant="home" />;
  }

  return (
    <PageTransition>
      <main className="pt-16">
        <HeroSection />
        <ArenaShowcase />
        <EventsGallery />
        <FeaturesSection />
        <CTASection />
      </main>
    </PageTransition>
  );
};

export default Index;
