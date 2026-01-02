import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths, isSameDay } from "date-fns";

interface BookingEvent {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  arena: string;
  status: "confirmed" | "pending" | "cancelled";
}

const sampleEvents: BookingEvent[] = [
  {
    id: "1",
    title: "Corporate Conference",
    date: new Date(2026, 0, 5),
    startTime: "09:00",
    endTime: "17:00",
    arena: "Grand Ballroom",
    status: "confirmed",
  },
  {
    id: "2",
    title: "Wedding Reception",
    date: new Date(2026, 0, 10),
    startTime: "14:00",
    endTime: "22:00",
    arena: "Outdoor Pavilion",
    status: "confirmed",
  },
  {
    id: "3",
    title: "Product Launch",
    date: new Date(2026, 0, 15),
    startTime: "10:00",
    endTime: "14:00",
    arena: "Executive Hall",
    status: "pending",
  },
  {
    id: "4",
    title: "Gala Dinner",
    date: new Date(2026, 0, 20),
    startTime: "18:00",
    endTime: "23:00",
    arena: "Grand Ballroom",
    status: "confirmed",
  },
];

const BookingCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [view, setView] = useState<"month" | "week" | "agenda">("month");

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get the starting day of the week for the first day of the month
  const startDay = monthStart.getDay();
  const emptyDays = Array(startDay).fill(null);

  const getEventsForDate = (date: Date) => {
    return sampleEvents.filter((event) => isSameDay(event.date, date));
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold">{format(currentDate, "MMMM yyyy")}</h2>
          <p className="text-muted-foreground">View and manage arena bookings</p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex rounded-lg border border-border overflow-hidden">
            {["month", "week", "agenda"].map((v) => (
              <button
                key={v}
                onClick={() => setView(v as typeof view)}
                className={`px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                  view === v
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
              Today
            </Button>
            <Button variant="outline" size="icon" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <Card variant="glass" className="lg:col-span-2">
          <CardContent className="p-4">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {emptyDays.map((_, index) => (
                <div key={`empty-${index}`} className="h-24 rounded-lg" />
              ))}
              
              {daysInMonth.map((day) => {
                const events = getEventsForDate(day);
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                
                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={`h-24 rounded-lg p-2 text-left transition-all hover:bg-secondary/50 ${
                      !isSameMonth(day, currentDate) ? "opacity-30" : ""
                    } ${isToday(day) ? "border-2 border-primary" : "border border-border/50"} ${
                      isSelected ? "bg-primary/10 border-primary" : ""
                    }`}
                  >
                    <span className={`text-sm font-medium ${isToday(day) ? "text-primary" : ""}`}>
                      {format(day, "d")}
                    </span>
                    
                    {/* Event Indicators */}
                    <div className="mt-1 space-y-0.5">
                      {events.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          className={`text-xs px-1.5 py-0.5 rounded truncate ${
                            event.status === "confirmed"
                              ? "bg-status-available/20 text-status-available"
                              : event.status === "pending"
                              ? "bg-status-pending/20 text-status-pending"
                              : "bg-status-booked/20 text-status-booked"
                          }`}
                        >
                          {event.title}
                        </div>
                      ))}
                      {events.length > 2 && (
                        <span className="text-xs text-muted-foreground">+{events.length - 2} more</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Selected Date Details */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-primary" />
              {selectedDate ? format(selectedDate, "EEEE, MMM d") : "Select a date"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDate ? (
              selectedDateEvents.length > 0 ? (
                <div className="space-y-4">
                  {selectedDateEvents.map((event) => (
                    <div key={event.id} className="p-4 rounded-lg bg-secondary/50 border border-border space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium">{event.title}</h4>
                        <Badge
                          variant={
                            event.status === "confirmed"
                              ? "available"
                              : event.status === "pending"
                              ? "pending"
                              : "booked"
                          }
                        >
                          {event.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {event.startTime} - {event.endTime}
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {event.arena}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">No events scheduled</p>
                  <Button variant="premium" size="sm" className="mt-4">
                    Book This Date
                  </Button>
                </div>
              )
            ) : (
              <div className="text-center py-8">
                <CalendarIcon className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">Click on a date to see details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-status-available" />
          <span className="text-sm text-muted-foreground">Confirmed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-status-pending" />
          <span className="text-sm text-muted-foreground">Pending</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-status-booked" />
          <span className="text-sm text-muted-foreground">Cancelled</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-status-maintenance" />
          <span className="text-sm text-muted-foreground">Maintenance</span>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;
