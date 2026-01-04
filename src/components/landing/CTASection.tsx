import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Phone } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-12 sm:py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20" />
      <div className="absolute inset-0 bg-background/90" />
      
      {/* Decorative Elements */}
      <div className="absolute left-0 top-0 w-48 sm:w-72 h-48 sm:h-72 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute right-0 bottom-0 w-64 sm:w-96 h-64 sm:h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
            Ready to Host Your
            <span className="block gold-text">Unforgettable Event?</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-lg mb-6 sm:mb-8 px-2">
            Join thousands of satisfied customers who've made their events extraordinary at B.M.O Events Arena. 
            Book your venue today and experience premium service.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link to="/book">
              <Button variant="premium" size="xl" className="w-full sm:w-auto">
                <Calendar className="w-5 h-5" />
                Start Booking Now
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="xl" className="w-full sm:w-auto">
                <Phone className="w-5 h-5" />
                Contact Us
              </Button>
            </Link>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground mt-6 sm:mt-8">
            No hidden fees • Instant confirmation • 24/7 support
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
