-- SQL to run in Supabase SQL Editor
-- This will create the necessary tables for your website

-- Create pages table for dynamic content
CREATE TABLE pages (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  meta_description TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contact submissions table
CREATE TABLE contact_submissions (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert some sample pages
INSERT INTO pages (title, slug, content, meta_description, is_published) VALUES
(
  'Home',
  'home',
  '{"hero": {"title": "Higgs Boson Consultancy", "subtitle": "Expert consulting services"}}',
  'Professional consulting services for your business needs',
  true
),
(
  'About Us',
  'about',
  '{"content": "We are a leading consultancy firm..."}',
  'Learn more about our company and team',
  true
),
(
  'Services',
  'services',
  '{"services": [{"title": "Consulting", "description": "Expert advice"}]}',
  'Our range of professional consulting services',
  true
);

-- Enable Row Level Security (RLS) for security
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to published pages
CREATE POLICY "Public pages are viewable by everyone" ON pages
  FOR SELECT USING (is_published = true);

-- Create policy for contact form submissions (insert only)
CREATE POLICY "Anyone can submit contact form" ON contact_submissions
  FOR INSERT WITH CHECK (true);

-- You can view contact submissions in the Supabase dashboard
-- or create admin policies later for management
