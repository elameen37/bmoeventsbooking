import BookingCalendar from "@/components/calendar/BookingCalendar";
import PageTransition from "@/components/PageTransition";

const CalendarPage = () => {
  return (
    <PageTransition>
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
    </PageTransition>
  );
};

export default CalendarPage;
