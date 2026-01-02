import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BookingCalendar from "@/components/calendar/BookingCalendar";

const CalendarPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-4xl font-bold mb-2">
              Booking <span className="gold-text">Calendar</span>
            </h1>
            <p className="text-muted-foreground">
              View availability and upcoming events across all B.M.O Arena locations
            </p>
          </div>

          <BookingCalendar />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CalendarPage;
