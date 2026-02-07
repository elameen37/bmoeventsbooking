-- Create gallery_images table
CREATE TABLE public.gallery_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- Anyone can view active gallery images
CREATE POLICY "Anyone can view active gallery images"
ON public.gallery_images
FOR SELECT
USING (is_active = true);

-- Admins can view all gallery images
CREATE POLICY "Admins can view all gallery images"
ON public.gallery_images
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Admins can insert gallery images
CREATE POLICY "Admins can insert gallery images"
ON public.gallery_images
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Admins can update gallery images
CREATE POLICY "Admins can update gallery images"
ON public.gallery_images
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

-- Admins can delete gallery images
CREATE POLICY "Admins can delete gallery images"
ON public.gallery_images
FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Add trigger for updated_at
CREATE TRIGGER update_gallery_images_updated_at
BEFORE UPDATE ON public.gallery_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();