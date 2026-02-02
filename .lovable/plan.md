

# Change "Our Premier Event Arenas" to "Recent Featured Events"

## Overview
Transform the current arena showcase section from displaying venue information to showcasing recent featured events that have been held at BMO Events Arena.

## Changes

### 1. Update Section Header Text
- Change heading from "Our Premier **Event Arenas**" to "Recent **Featured Events**"
- Update subtitle from venue-focused to event-focused messaging
- Change button text from "View All Arenas" to "Book Your Event"

### 2. Replace Arena Data with Featured Events Data
Transform the data structure from venues to events:

| Current (Arena)     | New (Event)           |
|---------------------|----------------------|
| name                | eventName            |
| location            | eventType            |
| capacity            | attendees            |
| rating              | Keep for testimonial |
| pricePerHour        | Remove               |
| status              | date                 |
| features            | highlights           |

### 3. Sample Events to Display
- **Corporate Gala Night** - A prestigious networking event with 450 guests
- **Wedding Reception** - An elegant celebration with 300 guests  
- **Product Launch** - A tech company showcase with 200 attendees

### 4. Update Card Component
- Replace venue-specific fields with event details
- Show event date instead of status badge
- Display attendee count instead of capacity
- Replace price with event type badge
- Update features to show event highlights

---

## Technical Details

### File to Modify
`src/components/landing/ArenaShowcase.tsx`

### Data Structure Change
```typescript
interface FeaturedEvent {
  id: string;
  eventName: string;
  eventType: string;
  date: string;
  attendees: number;
  image: string;
  highlights: string[];
  testimonial?: string;
}
```

### Sample Data
```typescript
const featuredEvents = [
  {
    id: "1",
    eventName: "Corporate Gala Night",
    eventType: "Corporate Event",
    date: "January 2026",
    attendees: 450,
    image: "unsplash-corporate-event",
    highlights: ["Live Band", "Gourmet Dinner", "Networking"],
  },
  // ... more events
];
```

### UI Updates
- Icon changes: Replace `MapPin` with `Calendar`, keep `Users`
- Remove price display, add event type badge
- Update card footer to show date and attendee count

