-- Create featured_events table
CREATE TABLE public.featured_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_date TEXT NOT NULL,
  attendees INTEGER NOT NULL,
  rating NUMERIC(2,1) NOT NULL DEFAULT 4.5,
  image_url TEXT,
  highlights TEXT[] DEFAULT '{}'::TEXT[],
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.featured_events ENABLE ROW LEVEL SECURITY;

-- Anyone can view active featured events
CREATE POLICY "Anyone can view active featured events"
ON public.featured_events
FOR SELECT
USING (is_active = true);

-- Admins can view all featured events
CREATE POLICY "Admins can view all featured events"
ON public.featured_events
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can insert featured events
CREATE POLICY "Admins can insert featured events"
ON public.featured_events
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update featured events
CREATE POLICY "Admins can update featured events"
ON public.featured_events
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete featured events
CREATE POLICY "Admins can delete featured events"
ON public.featured_events
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_featured_events_updated_at
BEFORE UPDATE ON public.featured_events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();