import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import PageTransition from "@/components/PageTransition";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "What types of events can I host at B.M.O Events Arena?",
    answer: "We accommodate a wide range of events including weddings, corporate conferences, birthday parties, product launches, seminars, concerts, and private celebrations. Our versatile arenas can be customized to suit your specific event needs.",
  },
  {
    question: "How do I book an arena?",
    answer: "You can book an arena by visiting our Arenas page, selecting your preferred venue, choosing your date and time, and completing the booking form. You'll receive a confirmation email once your booking is processed.",
  },
  {
    question: "What is the deposit policy?",
    answer: "A 70% deposit is required to secure your booking. This deposit must be settled at least one week before the event date. The remaining balance is due on the day of the event.",
  },
  {
    question: "Can I cancel or reschedule my booking?",
    answer: "Yes, bookings can be cancelled or rescheduled. Please contact us at least 48 hours before your event date. Cancellation and rescheduling policies may vary depending on the timing and type of event.",
  },
  {
    question: "What amenities are included with the venue?",
    answer: "Each arena comes with standard amenities including chairs, tables, sound system, lighting, air conditioning, and parking space. Additional amenities such as projectors, decorations, and catering services can be arranged at extra cost.",
  },
  {
    question: "What is the capacity of your arenas?",
    answer: "Our arenas vary in capacity. Please visit the Arenas page to see detailed information about each venue including maximum guest capacity, layout options, and available configurations.",
  },
  {
    question: "Do you provide catering services?",
    answer: "We partner with trusted catering vendors who can provide a range of menu options for your event. You are also welcome to bring your own caterer, subject to our venue guidelines.",
  },
  {
    question: "What are your operating hours?",
    answer: "Our venues are available from 8:00 AM to 11:00 PM daily. Extended hours can be arranged for special events — please contact us to discuss your needs.",
  },
  {
    question: "Is parking available?",
    answer: "Yes, we provide ample parking space for guests at all our venues. VIP and reserved parking can be arranged upon request.",
  },
  {
    question: "How can I contact support?",
    answer: "You can reach us via email at info@bmoarena.com, call us at +234 801 234 5678, or visit our Contact page to send us a message directly.",
  },
];

const FAQ = () => {
  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <HelpCircle className="w-4 h-4" />
              Got Questions?
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Find answers to common questions about our venues, booking process, and event services.
            </p>
          </div>

          {/* FAQ Accordion */}
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border rounded-lg px-5 data-[state=open]:bg-secondary/30"
              >
                <AccordionTrigger className="text-left font-medium text-sm sm:text-base hover:no-underline py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* CTA */}
          <div className="mt-12 text-center p-6 rounded-xl bg-secondary/30 border border-border">
            <p className="text-muted-foreground mb-1 text-sm">Still have questions?</p>
            <a href="/contact" className="text-primary font-medium hover:underline text-sm">
              Contact our team →
            </a>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default FAQ;
