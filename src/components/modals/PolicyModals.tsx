import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Shield, Info, CheckCircle2 } from "lucide-react";

interface ModalProps {
  children: React.ReactNode;
}

export const AboutUsModal = ({ children }: ModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] glass-card border-primary/20 bg-background/95 backdrop-blur-xl">
        <DialogHeader>
          <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center mb-4">
            <Info className="w-7 h-7 text-primary-foreground" />
          </div>
          <DialogTitle className="font-display text-3xl font-bold gold-text">About B.M.O Events Arena</DialogTitle>
          <DialogDescription className="text-muted-foreground/80 mt-2">
            Abuja's premier destination for high-profile events and unforgettable celebrations.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] mt-6 pr-4">
          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p>
              B.M.O Events Arena is Abuja's premier luxury event destination. Located in the heart of Wuse II, 
              our facility offers two stunning, world-class halls designed to make your celebrations truly unforgettable.
            </p>
            <p>
              From grand weddings to high-level corporate gatherings, our space combines modern elegance with 
              state-of-the-art facilities, ensuring every moment is perfect.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {[
                "2 Premium, Multi-purpose Halls",
                "500+ Successfully Hosted Events",
                "Professional Event Coordination",
                "State-of-the-Art Sound & Lighting"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-secondary/30 border border-border/50">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
            
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 mt-6">
              <p className="text-sm italic text-foreground/80">
                "Our mission is to provide an exquisite environment where every detail is tailored to create 
                lasting memories for our clients and their guests."
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export const TermsModal = ({ children }: ModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] glass-card border-primary/20 bg-background/95 backdrop-blur-xl">
        <DialogHeader>
          <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center mb-4">
            <Calendar className="w-7 h-7 text-primary-foreground" />
          </div>
          <DialogTitle className="font-display text-3xl font-bold gold-text">Terms of Service</DialogTitle>
          <DialogDescription className="text-muted-foreground/80 mt-2">
            Please review our booking policies and house rules.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] mt-6 pr-4">
          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <section className="space-y-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <div className="w-1.5 h-6 bg-primary rounded-full" />
                1. Booking & Payments
              </h3>
              <p className="text-sm">
                A 50% non-refundable deposit is required to confirm any booking. The remaining balance must be paid 
                at least 14 days before the scheduled event date.
              </p>
            </section>
            
            <section className="space-y-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <div className="w-1.5 h-6 bg-primary rounded-full" />
                2. Use of Space
              </h3>
              <p className="text-sm">
                Clients are responsible for any damages to the property, furniture, or high-end equipment provided 
                by the venue during their event duration.
              </p>
            </section>
            
            <section className="space-y-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <div className="w-1.5 h-6 bg-primary rounded-full" />
                3. Prohibited Activities
              </h3>
              <p className="text-sm">
                For the safety of all guests, no illegal substances, hazardous materials, or unauthorized 
                firearms are allowed on the premises at any time.
              </p>
            </section>
            
            <section className="space-y-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <div className="w-1.5 h-6 bg-primary rounded-full" />
                4. Cancellations
              </h3>
              <p className="text-sm">
                Cancellations made less than 30 days before the event will result in the forfeiture of the 
                initial deposit. Partial refunds for the balance are handled on a case-by-case basis.
              </p>
            </section>
            
            <section className="space-y-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <div className="w-1.5 h-6 bg-primary rounded-full" />
                5. Liability
              </h3>
              <p className="text-sm">
                B.M.O Events Arena is not liable for the loss or damage of any personal belongings 
                brought into the facility by the client or their guests.
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export const PrivacyModal = ({ children }: ModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] glass-card border-primary/20 bg-background/95 backdrop-blur-xl">
        <DialogHeader>
          <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center mb-4">
            <Shield className="w-7 h-7 text-primary-foreground" />
          </div>
          <DialogTitle className="font-display text-3xl font-bold gold-text">Privacy Policy</DialogTitle>
          <DialogDescription className="text-muted-foreground/80 mt-2">
            How we protect your data and respect your privacy.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] mt-6 pr-4">
          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p>
              Your privacy is extremely important to us. This policy details how we handle the personal information 
              we collect through the B.M.O Events Arena booking platform.
            </p>
            
            <section className="space-y-2">
              <h3 className="font-semibold text-foreground">Data Collection</h3>
              <p className="text-sm">
                We collect essential information such as your name, email address, phone number, and event details 
                to facilitate smooth booking and communication.
              </p>
            </section>
            
            <section className="space-y-2">
              <h3 className="font-semibold text-foreground">Data Usage</h3>
              <p className="text-sm">
                Your data is used solely for managing your reservations, sending updates about your bookings, 
                and improving our service offerings. We never sell your data to third-party marketers.
              </p>
            </section>
            
            <section className="space-y-2">
              <h3 className="font-semibold text-foreground">Security</h3>
              <p className="text-sm">
                We implement industry-standard encryption and security measures to protect your information 
                from unauthorized access or disclosure.
              </p>
            </section>
            
            <section className="space-y-2">
              <h3 className="font-semibold text-foreground">Your Rights</h3>
              <p className="text-sm">
                You have the right to request access to the personal data we hold about you, or to request its 
                deletion from our systems at any time, subject to legal requirements.
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
