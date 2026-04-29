/**
 * Type definitions for all database models
 */

export type UserRole = 'admin' | 'editor' | 'viewer';
export type ContentStatus = 'draft' | 'published' | 'archived';
export type BookingStatus = 'new' | 'contacted' | 'confirmed' | 'rejected';
export type TestimonialStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Music {
  id: string;
  title: string;
  category: string;
  audio_url: string;
  description: string | null;
  cover_url: string | null;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Video {
  id: string;
  title: string;
  category: string;
  video_url: string;
  thumbnail_url: string | null;
  description: string | null;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  client_role: string;
  content: string;
  rating: number;
  image_url: string | null;
  status: TestimonialStatus;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string | null;
  ticket_url: string | null;
  is_past: boolean;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  event_date: string;
  location: string;
  budget: string | null;
  message: string | null;
  status: BookingStatus;
  created_at: string;
  updated_at: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  author_id: string;
  status: ContentStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  price: number | null;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface PageSettings {
  id: string;
  page_name: string;
  title: string;
  meta_description: string | null;
  meta_keywords: string | null;
  content: Record<string, any>;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  table_name: string;
  record_id: string | null;
  changes: Record<string, any> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

// Form DTOs
export interface CreateMusicInput {
  title: string;
  category: string;
  audio_url: string;
  description?: string;
  cover_url?: string;
  order: number;
}

export interface UpdateMusicInput extends Partial<CreateMusicInput> {
  id: string;
}

export interface CreateVideoInput {
  title: string;
  category: string;
  video_url: string;
  thumbnail_url?: string;
  description?: string;
  order: number;
}

export interface UpdateVideoInput extends Partial<CreateVideoInput> {
  id: string;
}

export interface CreateEventInput {
  title: string;
  date: string;
  location: string;
  description?: string;
  ticket_url?: string;
  is_past: boolean;
  image_url?: string;
}

export interface UpdateEventInput extends Partial<CreateEventInput> {
  id: string;
}

export interface CreateTestimonialInput {
  client_name: string;
  client_role: string;
  content: string;
  rating: number;
  image_url?: string;
  status: TestimonialStatus;
}

export interface UpdateTestimonialInput extends Partial<CreateTestimonialInput> {
  id: string;
}

export interface CreateGalleryInput {
  title: string;
  description?: string;
  image_url: string;
  category: string;
  order: number;
}

export interface UpdateGalleryInput extends Partial<CreateGalleryInput> {
  id: string;
}

export interface CreateBlogPostInput {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  status: ContentStatus;
  published_at?: string;
}

export interface UpdateBlogPostInput extends Partial<CreateBlogPostInput> {
  id: string;
}

export interface CreateServiceInput {
  title: string;
  description: string;
  icon?: string;
  price?: number;
  order: number;
}

export interface UpdateServiceInput extends Partial<CreateServiceInput> {
  id: string;
}

export interface UpdatePageSettingsInput {
  page_name: string;
  title: string;
  meta_description?: string;
  meta_keywords?: string;
  content: Record<string, any>;
  published: boolean;
}

export interface CreateBookingInput {
  name: string;
  email: string;
  phone: string;
  event_date: string;
  location: string;
  budget?: string;
  message?: string;
}
