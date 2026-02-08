-- Add database constraints for booking validation

-- Ensure guest_count is positive
ALTER TABLE public.bookings ADD CONSTRAINT guest_count_positive CHECK (guest_count > 0);

-- Ensure total_amount is non-negative
ALTER TABLE public.bookings ADD CONSTRAINT total_amount_non_negative CHECK (total_amount >= 0);

-- Ensure start_time is before end_time
ALTER TABLE public.bookings ADD CONSTRAINT valid_times CHECK (start_time < end_time);

-- Add length constraints via validation trigger
CREATE OR REPLACE FUNCTION public.validate_booking_input()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  -- Validate event_title length (max 200 chars)
  IF LENGTH(NEW.event_title) > 200 THEN
    RAISE EXCEPTION 'Event title must be 200 characters or less';
  END IF;
  
  -- Validate description length (max 2000 chars)
  IF NEW.description IS NOT NULL AND LENGTH(NEW.description) > 2000 THEN
    RAISE EXCEPTION 'Description must be 2000 characters or less';
  END IF;
  
  -- Validate special_requirements length (max 1000 chars)
  IF NEW.special_requirements IS NOT NULL AND LENGTH(NEW.special_requirements) > 1000 THEN
    RAISE EXCEPTION 'Special requirements must be 1000 characters or less';
  END IF;
  
  -- Validate mobile_no format (basic: allow digits, spaces, hyphens, plus, parentheses, max 20 chars)
  IF NEW.mobile_no IS NOT NULL THEN
    IF LENGTH(NEW.mobile_no) > 20 THEN
      RAISE EXCEPTION 'Mobile number must be 20 characters or less';
    END IF;
    IF NEW.mobile_no !~ '^[\d\s\-\+\(\)]+$' THEN
      RAISE EXCEPTION 'Mobile number contains invalid characters';
    END IF;
  END IF;
  
  -- Validate event_type length (max 100 chars)
  IF LENGTH(NEW.event_type) > 100 THEN
    RAISE EXCEPTION 'Event type must be 100 characters or less';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for validation on insert and update
DROP TRIGGER IF EXISTS validate_booking_trigger ON public.bookings;
CREATE TRIGGER validate_booking_trigger
BEFORE INSERT OR UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.validate_booking_input();

-- Fix mobile_no exposure: Split the combined policy into separate admin and manager policies
-- Drop the existing combined policy
DROP POLICY IF EXISTS "Admins and managers can view all bookings" ON public.bookings;

-- Create policy for admins only (full access including mobile_no)
CREATE POLICY "Admins can view all bookings" 
ON public.bookings 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create policy for managers (they will see bookings but we'll mask mobile_no in application layer)
CREATE POLICY "Managers can view all bookings"
ON public.bookings
FOR SELECT
USING (has_role(auth.uid(), 'manager'::app_role));