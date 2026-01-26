
# Backend Integration with Lovable Cloud (Supabase)

This plan adds real backend functionality to your BMO Events Arena booking platform, enabling user authentication, data persistence, and dynamic content management.

---

## What This Enables

- **Real user accounts** - Users can create accounts, log in, and manage their bookings
- **Persistent bookings** - All bookings are saved to a database and can be retrieved anytime
- **Protected dashboard** - Only logged-in users can access the dashboard
- **Dynamic arena data** - Arenas are fetched from the database instead of being hardcoded
- **Real-time availability** - Calendar shows actual bookings from the database

---

## Phase 1: Enable Lovable Cloud

**Action Required**: Enable Lovable Cloud to spin up a Supabase backend

This provides:
- PostgreSQL database
- Authentication system
- Row-level security for data protection

---

## Phase 2: Database Schema

Create the following tables:

### Arenas Table
Stores venue information:
- `id` (UUID, primary key)
- `name` (text) - e.g., "B.M.O Hall - 1"
- `location` (text) - e.g., "Wuse II"
- `description` (text)
- `capacity` (integer)
- `price_per_hour` (integer)
- `status` (enum: available, booked, maintenance)
- `image_url` (text)
- `amenities` (text array)
- `created_at` (timestamp)

### Bookings Table
Stores all booking requests:
- `id` (UUID, primary key)
- `user_id` (UUID, references auth.users)
- `arena_id` (UUID, references arenas)
- `event_title` (text)
- `event_type` (text)
- `event_date` (date)
- `start_time` (time)
- `end_time` (time)
- `guest_count` (integer)
- `description` (text)
- `special_requirements` (text)
- `status` (enum: pending, confirmed, cancelled)
- `total_amount` (integer)
- `deposit_paid` (boolean)
- `created_at` (timestamp)

### User Roles Table
For role-based access control:
- `id` (UUID, primary key)
- `user_id` (UUID, references auth.users)
- `role` (enum: admin, manager, staff, customer)

### Profiles Table
Extended user information:
- `id` (UUID, references auth.users)
- `first_name` (text)
- `last_name` (text)
- `phone` (text)
- `company` (text)
- `created_at` (timestamp)

---

## Phase 3: Authentication Integration

Update the Auth page to use Supabase Auth:

**Login flow**:
1. User enters email/password
2. Call Supabase `signInWithPassword`
3. On success, redirect to dashboard
4. Store session in Supabase auth context

**Signup flow**:
1. User fills registration form
2. Call Supabase `signUp` with email/password
3. Create profile record with additional details
4. Send email verification
5. Redirect to login

**Session management**:
- Create an `AuthProvider` context
- Wrap the app to provide auth state globally
- Auto-redirect unauthenticated users from protected routes

---

## Phase 4: Protected Routes

Create a route guard for authenticated pages:

**Protected routes**:
- `/dashboard` - User dashboard
- `/book` - Booking form (require login to submit)

**Implementation**:
- Create `ProtectedRoute` component
- Check auth state before rendering
- Redirect to `/auth` if not logged in

---

## Phase 5: Data Integration

### Arenas Page
- Fetch arenas from database using React Query
- Replace hardcoded arena data with dynamic data
- Filter by actual status from database

### Booking Form
- Fetch available arenas from database
- Submit booking to database
- Associate booking with logged-in user
- Calculate pricing from arena data

### Dashboard
- Fetch user's bookings from database
- Show real statistics based on actual data
- Display upcoming bookings for the user

### Calendar
- Fetch all bookings from database
- Display actual events on calendar dates
- Filter by arena if needed

---

## Phase 6: Row-Level Security (RLS)

Secure the database with policies:

**Arenas**:
- Everyone can view arenas (public read)
- Only admins can create/update/delete arenas

**Bookings**:
- Users can view their own bookings
- Admins/managers can view all bookings
- Users can create bookings for themselves
- Only admins can update booking status

**Profiles**:
- Users can view/update their own profile
- Admins can view all profiles

---

## Files to Create/Modify

### New Files
```text
src/
├── integrations/
│   └── supabase/
│       ├── client.ts          # Supabase client setup
│       └── types.ts           # TypeScript types for database
├── contexts/
│   └── AuthContext.tsx        # Authentication context provider
├── components/
│   └── auth/
│       └── ProtectedRoute.tsx # Route protection component
└── hooks/
    ├── useAuth.ts             # Authentication hook
    ├── useArenas.ts           # Arenas data hook
    └── useBookings.ts         # Bookings data hook
```

### Modified Files
```text
src/App.tsx                    # Add AuthProvider, protect routes
src/pages/Auth.tsx             # Integrate Supabase auth
src/pages/Dashboard.tsx        # Fetch real user data
src/pages/Arenas.tsx           # Fetch arenas from database
src/pages/Book.tsx             # Submit to database
src/components/calendar/BookingCalendar.tsx  # Fetch real bookings
```

---

## Implementation Order

1. **Enable Lovable Cloud** - You'll need to approve this action
2. **Create database tables and policies** - SQL migrations
3. **Set up auth context and hooks** - React integration layer
4. **Update Auth page** - Real login/signup functionality
5. **Add protected routes** - Secure dashboard and booking
6. **Integrate arenas page** - Fetch from database
7. **Integrate booking form** - Save to database
8. **Update dashboard** - Show user's actual bookings
9. **Update calendar** - Display real events

---

## Technical Details

### Supabase Client Setup
Creates a singleton client configured with environment variables for the Supabase URL and anonymous key.

### React Query Integration
Uses existing @tanstack/react-query for:
- Caching arena and booking data
- Automatic refetching on focus
- Loading and error states
- Optimistic updates for better UX

### Type Safety
Generates TypeScript types from the database schema to ensure type-safe queries throughout the application.

### Error Handling
- Toast notifications for auth errors
- Form validation before submission
- Graceful fallbacks for network issues
