-- Tweletu Band Database Schema
-- This migration creates all necessary tables and policies for the application

-- Create Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(50) NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'viewer')),
  display_name VARCHAR(255),
  avatar_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create Music table
CREATE TABLE IF NOT EXISTS music (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  audio_url VARCHAR(500) NOT NULL,
  description TEXT,
  cover_url VARCHAR(500),
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create Videos table
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  video_url VARCHAR(500) NOT NULL,
  thumbnail_url VARCHAR(500),
  description TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name VARCHAR(255) NOT NULL,
  client_role VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  image_url VARCHAR(500),
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  location VARCHAR(500) NOT NULL,
  description TEXT,
  ticket_url VARCHAR(500),
  is_past BOOLEAN NOT NULL DEFAULT false,
  image_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  event_date VARCHAR(50) NOT NULL,
  location VARCHAR(500) NOT NULL,
  budget VARCHAR(100),
  message TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'confirmed', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create Gallery table
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500) NOT NULL,
  category VARCHAR(100) NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create Blog Posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt VARCHAR(500),
  featured_image VARCHAR(500),
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create Services table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(100),
  price NUMERIC(10, 2),
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create Page Settings table
CREATE TABLE IF NOT EXISTS page_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_name VARCHAR(255) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  meta_description TEXT,
  meta_keywords VARCHAR(500),
  content JSONB NOT NULL DEFAULT '{}',
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create Audit Logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(50) NOT NULL,
  table_name VARCHAR(100) NOT NULL,
  record_id VARCHAR(255),
  changes JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_music_order ON music("order");
CREATE INDEX idx_music_category ON music(category);
CREATE INDEX idx_videos_order ON videos("order");
CREATE INDEX idx_videos_category ON videos(category);
CREATE INDEX idx_testimonials_status ON testimonials(status);
CREATE INDEX idx_testimonials_created_at ON testimonials(created_at);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_is_past ON events(is_past);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_created_at ON bookings(created_at);
CREATE INDEX idx_gallery_category ON gallery(category);
CREATE INDEX idx_gallery_order ON gallery("order");
CREATE INDEX idx_blog_slug ON blog_posts(slug);
CREATE INDEX idx_blog_status ON blog_posts(status);
CREATE INDEX idx_blog_author ON blog_posts(author_id);
CREATE INDEX idx_blog_published_at ON blog_posts(published_at);
CREATE INDEX idx_services_order ON services("order");
CREATE INDEX idx_page_settings_page_name ON page_settings(page_name);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Row Level Security (RLS) Policies
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE music ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Users: Public read, authenticated update own, admin update all
CREATE POLICY "Users are viewable by everyone" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own record" ON users FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins can update any user" ON users FOR UPDATE USING (
  auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
) WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- Music: Public read, editor+ write
CREATE POLICY "Music is readable by everyone" ON music FOR SELECT USING (true);
CREATE POLICY "Editors can insert music" ON music FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'editor'))
);
CREATE POLICY "Editors can update music" ON music FOR UPDATE USING (
  auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'editor'))
) WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'editor')));
CREATE POLICY "Editors can delete music" ON music FOR DELETE USING (
  auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'editor'))
);

-- Videos: Public read, editor+ write
CREATE POLICY "Videos are readable by everyone" ON videos FOR SELECT USING (true);
CREATE POLICY "Editors can insert videos" ON videos FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'editor'))
);
CREATE POLICY "Editors can update videos" ON videos FOR UPDATE USING (
  auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'editor'))
) WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'editor')));
CREATE POLICY "Editors can delete videos" ON videos FOR DELETE USING (
  auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'editor'))
);

-- Testimonials: Public read approved, editor+ write
CREATE POLICY "Approved testimonials are readable" ON testimonials FOR SELECT USING (
  status = 'approved' OR auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'editor'))
);
CREATE POLICY "Editors can insert testimonials" ON testimonials FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'editor'))
);
CREATE POLICY "Editors can update testimonials" ON testimonials FOR UPDATE USING (
  auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'editor'))
) WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'editor')));
CREATE POLICY "Editors can delete testimonials" ON testimonials FOR DELETE USING (
  auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'editor'))
);

-- Events: Public read, editor+ write
CREATE POLICY "Events are readable by everyone" ON events FOR SELECT USING (true);
CREATE POLICY "Editors can insert events" ON events FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'editor'))
);
CREATE POLICY "Editors can update events" ON events FOR UPDATE USING (
  auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'editor'))
) WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'editor')));
CREATE POLICY "Editors can delete events" ON events FOR DELETE USING (
  auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'editor'))
);

-- Bookings: Public create, admin read/update
CREATE POLICY "Anyone can create bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can read bookings" ON bookings FOR SELECT USING (
  auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
);
CREATE POLICY "Admins can update bookings" ON bookings FOR UPDATE USING (
  auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
) WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));
CREATE POLICY "Admins can delete bookings" ON bookings FOR DELETE USING (
  auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
);

-- Gallery: Public read, editor+ write
CREATE POLICY "Gallery is readable by everyone" ON gallery FOR SELECT USING (true);
CREATE POLICY "Editors can insert gallery" ON gallery FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'editor'))
);
CREATE POLICY "Editors can update gallery" ON gallery FOR UPDATE USING (
  auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'editor'))
) WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'editor')));
CREATE POLICY "Editors can delete gallery" ON gallery FOR DELETE USING (
  auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'editor'))
);

-- Blog Posts: Public read published, editor+ full access
CREATE POLICY "Published blog posts are readable" ON blog_posts FOR SELECT USING (
  status = 'published' OR auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'editor'))
);
CREATE POLICY "Editors can insert blog posts" ON blog_posts FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'editor'))
);
CREATE POLICY "Editors can update blog posts" ON blog_posts FOR UPDATE USING (
  auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'editor'))
) WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'editor')));
CREATE POLICY "Editors can delete blog posts" ON blog_posts FOR DELETE USING (
  auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'editor'))
);

-- Services: Public read, editor+ write
CREATE POLICY "Services are readable by everyone" ON services FOR SELECT USING (true);
CREATE POLICY "Editors can insert services" ON services FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'editor'))
);
CREATE POLICY "Editors can update services" ON services FOR UPDATE USING (
  auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'editor'))
) WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'editor')));
CREATE POLICY "Editors can delete services" ON services FOR DELETE USING (
  auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'editor'))
);

-- Page Settings: Public read published, admin write
CREATE POLICY "Page settings are readable" ON page_settings FOR SELECT USING (true);
CREATE POLICY "Admins can insert page settings" ON page_settings FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
);
CREATE POLICY "Admins can update page settings" ON page_settings FOR UPDATE USING (
  auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
) WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));
CREATE POLICY "Admins can delete page settings" ON page_settings FOR DELETE USING (
  auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
);

-- Audit Logs: Admin read only
CREATE POLICY "Admins can read audit logs" ON audit_logs FOR SELECT USING (
  auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
);
CREATE POLICY "System can insert audit logs" ON audit_logs FOR INSERT WITH CHECK (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_music_updated_at BEFORE UPDATE ON music FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gallery_updated_at BEFORE UPDATE ON gallery FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_page_settings_updated_at BEFORE UPDATE ON page_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
