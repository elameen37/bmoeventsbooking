import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/landing/HeroSection";
import ArenaShowcase from "@/components/landing/ArenaShowcase";
import EventsGallery from "@/components/landing/EventsGallery";
import FeaturesSection from "@/components/landing/FeaturesSection";
import CTASection from "@/components/landing/CTASection";
import ScrollToTop from "@/components/ui/scroll-to-top";
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
      <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <HeroSection />
        <ArenaShowcase />
        <EventsGallery />
        <FeaturesSection />
        <CTASection />
      </main>
      <Footer />
      <ScrollToTop />
      </div>
    </PageTransition>
  );
};

export default Index;
