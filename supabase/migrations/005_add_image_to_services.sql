-- Add image_url column to services table
ALTER TABLE services ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Create storage bucket for service images (run this in Supabase dashboard Storage section)
-- Or use this SQL if you have permissions:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('service-images', 'service-images', true);

-- Storage policy for service images (public read, authenticated write)
-- These need to be run in Supabase dashboard under Storage > Policies
