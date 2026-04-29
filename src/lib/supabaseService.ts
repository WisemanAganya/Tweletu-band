/**
 * Supabase Service Layer
 * Handles all database operations with type safety and error handling
 */

import { supabase } from './supabase';
import {
  Music,
  Video,
  Event,
  Testimonial,
  BlogPost,
  Service,
  GalleryItem,
  PageSettings,
  Booking,
  CreateMusicInput,
  UpdateMusicInput,
  CreateVideoInput,
  UpdateVideoInput,
  CreateEventInput,
  UpdateEventInput,
  CreateTestimonialInput,
  UpdateTestimonialInput,
  CreateBlogPostInput,
  UpdateBlogPostInput,
  CreateServiceInput,
  UpdateServiceInput,
  UpdatePageSettingsInput,
  CreateGalleryInput,
  UpdateGalleryInput,
  CreateBookingInput,
} from '../types';

const handleError = (error: any, operation: string) => {
  console.error(`Error during ${operation}:`, error);
  throw new Error(error?.message || `Failed to ${operation}`);
};

// Music Operations
export const musicService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('music')
        .select('*')
        .order('order', { ascending: true });
      if (error) throw error;
      return data as Music[];
    } catch (error) {
      handleError(error, 'fetch music');
    }
  },

  async getById(id: string) {
    try {
      const { data, error } = await supabase
        .from('music')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as Music;
    } catch (error) {
      handleError(error, 'fetch music by id');
    }
  },

  async create(input: CreateMusicInput) {
    try {
      const { data, error } = await supabase
        .from('music')
        .insert({
          ...input,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
      if (error) throw error;
      return data as Music;
    } catch (error) {
      handleError(error, 'create music');
    }
  },

  async update(input: UpdateMusicInput) {
    try {
      const { id, ...rest } = input;
      const { data, error } = await supabase
        .from('music')
        .update({
          ...rest,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Music;
    } catch (error) {
      handleError(error, 'update music');
    }
  },

  async delete(id: string) {
    try {
      const { error } = await supabase
        .from('music')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (error) {
      handleError(error, 'delete music');
    }
  },
};

// Video Operations
export const videoService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('order', { ascending: true });
      if (error) throw error;
      return data as Video[];
    } catch (error) {
      handleError(error, 'fetch videos');
    }
  },

  async getById(id: string) {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as Video;
    } catch (error) {
      handleError(error, 'fetch video by id');
    }
  },

  async create(input: CreateVideoInput) {
    try {
      const { data, error } = await supabase
        .from('videos')
        .insert({
          ...input,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
      if (error) throw error;
      return data as Video;
    } catch (error) {
      handleError(error, 'create video');
    }
  },

  async update(input: UpdateVideoInput) {
    try {
      const { id, ...rest } = input;
      const { data, error } = await supabase
        .from('videos')
        .update({
          ...rest,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Video;
    } catch (error) {
      handleError(error, 'update video');
    }
  },

  async delete(id: string) {
    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (error) {
      handleError(error, 'delete video');
    }
  },
};

// Event Operations
export const eventService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: false });
      if (error) throw error;
      return data as Event[];
    } catch (error) {
      handleError(error, 'fetch events');
    }
  },

  async getById(id: string) {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as Event;
    } catch (error) {
      handleError(error, 'fetch event by id');
    }
  },

  async getUpcoming() {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_past', false)
        .order('date', { ascending: true });
      if (error) throw error;
      return data as Event[];
    } catch (error) {
      handleError(error, 'fetch upcoming events');
    }
  },

  async create(input: CreateEventInput) {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert({
          ...input,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
      if (error) throw error;
      return data as Event;
    } catch (error) {
      handleError(error, 'create event');
    }
  },

  async update(input: UpdateEventInput) {
    try {
      const { id, ...rest } = input;
      const { data, error } = await supabase
        .from('events')
        .update({
          ...rest,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Event;
    } catch (error) {
      handleError(error, 'update event');
    }
  },

  async delete(id: string) {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (error) {
      handleError(error, 'delete event');
    }
  },
};

// Testimonial Operations
export const testimonialService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Testimonial[];
    } catch (error) {
      handleError(error, 'fetch testimonials');
    }
  },

  async getApproved() {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Testimonial[];
    } catch (error) {
      handleError(error, 'fetch approved testimonials');
    }
  },

  async getById(id: string) {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as Testimonial;
    } catch (error) {
      handleError(error, 'fetch testimonial by id');
    }
  },

  async create(input: CreateTestimonialInput) {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .insert({
          ...input,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
      if (error) throw error;
      return data as Testimonial;
    } catch (error) {
      handleError(error, 'create testimonial');
    }
  },

  async update(input: UpdateTestimonialInput) {
    try {
      const { id, ...rest } = input;
      const { data, error } = await supabase
        .from('testimonials')
        .update({
          ...rest,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Testimonial;
    } catch (error) {
      handleError(error, 'update testimonial');
    }
  },

  async delete(id: string) {
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (error) {
      handleError(error, 'delete testimonial');
    }
  },
};

// Blog Operations
export const blogService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false });
      if (error) throw error;
      return data as BlogPost[];
    } catch (error) {
      handleError(error, 'fetch blog posts');
    }
  },

  async getPublished() {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });
      if (error) throw error;
      return data as BlogPost[];
    } catch (error) {
      handleError(error, 'fetch published blog posts');
    }
  },

  async getBySlug(slug: string) {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single();
      if (error) throw error;
      return data as BlogPost;
    } catch (error) {
      handleError(error, 'fetch blog post by slug');
    }
  },

  async getById(id: string) {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as BlogPost;
    } catch (error) {
      handleError(error, 'fetch blog post by id');
    }
  },

  async create(input: CreateBlogPostInput, authorId: string) {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert({
          ...input,
          author_id: authorId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
      if (error) throw error;
      return data as BlogPost;
    } catch (error) {
      handleError(error, 'create blog post');
    }
  },

  async update(input: UpdateBlogPostInput) {
    try {
      const { id, ...rest } = input;
      const { data, error } = await supabase
        .from('blog_posts')
        .update({
          ...rest,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as BlogPost;
    } catch (error) {
      handleError(error, 'update blog post');
    }
  },

  async delete(id: string) {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (error) {
      handleError(error, 'delete blog post');
    }
  },
};

// Service Operations
export const serviceService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('order', { ascending: true });
      if (error) throw error;
      return data as Service[];
    } catch (error) {
      handleError(error, 'fetch services');
    }
  },

  async getById(id: string) {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as Service;
    } catch (error) {
      handleError(error, 'fetch service by id');
    }
  },

  async create(input: CreateServiceInput) {
    try {
      const { data, error } = await supabase
        .from('services')
        .insert({
          ...input,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
      if (error) throw error;
      return data as Service;
    } catch (error) {
      handleError(error, 'create service');
    }
  },

  async update(input: UpdateServiceInput) {
    try {
      const { id, ...rest } = input;
      const { data, error } = await supabase
        .from('services')
        .update({
          ...rest,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Service;
    } catch (error) {
      handleError(error, 'update service');
    }
  },

  async delete(id: string) {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (error) {
      handleError(error, 'delete service');
    }
  },
};

// Gallery Operations
export const galleryService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('order', { ascending: true });
      if (error) throw error;
      return data as GalleryItem[];
    } catch (error) {
      handleError(error, 'fetch gallery');
    }
  },

  async getByCategory(category: string) {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .eq('category', category)
        .order('order', { ascending: true });
      if (error) throw error;
      return data as GalleryItem[];
    } catch (error) {
      handleError(error, 'fetch gallery by category');
    }
  },

  async getById(id: string) {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as GalleryItem;
    } catch (error) {
      handleError(error, 'fetch gallery item by id');
    }
  },

  async create(input: CreateGalleryInput) {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .insert({
          ...input,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
      if (error) throw error;
      return data as GalleryItem;
    } catch (error) {
      handleError(error, 'create gallery item');
    }
  },

  async update(input: UpdateGalleryInput) {
    try {
      const { id, ...rest } = input;
      const { data, error } = await supabase
        .from('gallery')
        .update({
          ...rest,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as GalleryItem;
    } catch (error) {
      handleError(error, 'update gallery item');
    }
  },

  async delete(id: string) {
    try {
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (error) {
      handleError(error, 'delete gallery item');
    }
  },
};

// Booking Operations
export const bookingService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Booking[];
    } catch (error) {
      handleError(error, 'fetch bookings');
    }
  },

  async getById(id: string) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as Booking;
    } catch (error) {
      handleError(error, 'fetch booking by id');
    }
  },

  async create(input: CreateBookingInput) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          ...input,
          status: 'new',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
      if (error) throw error;
      return data as Booking;
    } catch (error) {
      handleError(error, 'create booking');
    }
  },

  async updateStatus(id: string, status: string) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Booking;
    } catch (error) {
      handleError(error, 'update booking status');
    }
  },

  async delete(id: string) {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (error) {
      handleError(error, 'delete booking');
    }
  },
};

// Page Settings Operations
export const pageSettingsService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('page_settings')
        .select('*');
      if (error) throw error;
      return data as PageSettings[];
    } catch (error) {
      handleError(error, 'fetch page settings');
    }
  },

  async getByPageName(pageName: string) {
    try {
      const { data, error } = await supabase
        .from('page_settings')
        .select('*')
        .eq('page_name', pageName)
        .single();
      if (error) throw error;
      return data as PageSettings;
    } catch (error) {
      handleError(error, 'fetch page settings by name');
    }
  },

  async upsert(input: UpdatePageSettingsInput) {
    try {
      const { data, error } = await supabase
        .from('page_settings')
        .upsert({
          ...input,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'page_name',
        })
        .select()
        .single();
      if (error) throw error;
      return data as PageSettings;
    } catch (error) {
      handleError(error, 'upsert page settings');
    }
  },
};
