import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Phone } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20" />
      <div className="absolute inset-0 bg-background/90" />
      
      {/* Decorative Elements */}
      <div className="absolute left-0 top-0 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute right-0 bottom-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Ready to Host Your
            <span className="block gold-text">Unforgettable Event?</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Join thousands of satisfied customers who've made their events extraordinary at B.M.O Events Arena. 
            Book your venue today and experience premium service.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/book">
              <Button variant="premium" size="xl">
                <Calendar className="w-5 h-5" />
                Start Booking Now
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="xl">
                <Phone className="w-5 h-5" />
                Contact Us
              </Button>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground mt-8">
            No hidden fees • Instant confirmation • 24/7 support
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
