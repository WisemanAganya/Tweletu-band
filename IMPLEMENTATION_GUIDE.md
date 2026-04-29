# Implementation Guide - Completing Production Features

## Overview
This guide provides step-by-step instructions for implementing the remaining features needed for full production readiness.

## Phase 2: Complete Admin Modules

### AdminVideos Implementation

```typescript
// src/pages/admin/AdminVideos.tsx
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { videoService } from '../../lib/supabaseService';
import { toast } from 'sonner';

const videoSchema = z.object({
  title: z.string().min(2, 'Title required'),
  category: z.string().min(1, 'Category required'),
  video_url: z.string().url('Valid video URL required'),
  thumbnail_url: z.string().url().optional(),
  description: z.string().optional(),
  order: z.number().default(0),
});

export default function AdminVideos() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      title: '', category: 'Live', video_url: '',
      thumbnail_url: '', description: '', order: 0,
    },
  });

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const data = await videoService.getAll();
      setVideos(data || []);
    } catch (error) {
      toast.error('Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: any) => {
    try {
      if (editingId) {
        await videoService.update({ id: editingId, ...values });
        toast.success('Video updated');
      } else {
        await videoService.create(values);
        toast.success('Video added');
      }
      form.reset();
      setEditingId(null);
      setIsDialogOpen(false);
      await loadVideos();
    } catch (error) {
      toast.error('Failed to save video');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this video?')) return;
    try {
      await videoService.delete(id);
      toast.success('Video deleted');
      await loadVideos();
    } catch (error) {
      toast.error('Failed to delete video');
    }
  };

  // Render similar to AdminMusic with video-specific fields
  // ... (implementation follows same pattern as AdminMusic)
}
```

## Phase 3: File Upload System

### Setup Supabase Storage Bucket

```sql
-- Create storage bucket for media files
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);

-- Set up RLS policy for public read, authenticated write
CREATE POLICY "Public read, authenticated write"
ON storage.objects
FOR SELECT
USING (bucket_id = 'media');

CREATE POLICY "Authenticated write"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');
```

### File Upload Component

```typescript
// src/components/MediaUpload.tsx
import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from './ui/button';
import { supabase } from '../lib/supabase';
import { toast } from 'soner';

interface MediaUploadProps {
  bucket: string;
  onUpload: (url: string) => void;
  accept?: string;
  maxSize?: number;
}

export default function MediaUpload({
  bucket,
  onUpload,
  accept = 'image/*',
  maxSize = 10 * 1024 * 1024, // 10MB
}: MediaUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSize) {
      toast.error(`File too large. Max size: ${maxSize / 1024 / 1024}MB`);
      return;
    }

    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const filePath = `${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      onUpload(publicUrl);
      setPreview(publicUrl);
      toast.success('File uploaded');
    } catch (error) {
      toast.error('Upload failed');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-zinc-700 rounded-lg p-6 hover:border-zinc-500 transition-colors">
        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center cursor-pointer"
        >
          <Upload className="w-8 h-8 mb-2 text-zinc-400" />
          <span className="text-sm text-zinc-400">
            {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
          </span>
        </label>
      </div>
      {preview && (
        <div className="relative w-full">
          <img src={preview} alt="Preview" className="w-full rounded-lg" />
          <button
            onClick={() => setPreview(null)}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
```

## Phase 4: Email Notifications

### Setup Email Templates in Supabase

1. Go to Supabase Dashboard → Authentication → Email Templates
2. Customize templates for:
   - Booking confirmation
   - Admin notification
   - Password reset
   - Email verification

### Email Service Integration

```typescript
// src/lib/emailService.ts
import { supabase } from './supabase';

export const sendEmail = async (
  to: string,
  template: string,
  data: Record<string, any>
) => {
  try {
    // Use Supabase Function or external service
    // Example with Resend or SendGrid:
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'noreply@tweletu.band',
        to,
        subject: getSubject(template),
        html: renderTemplate(template, data),
      }),
    });

    if (!response.ok) throw new Error('Email send failed');
    return true;
  } catch (error) {
    console.error('Email service error:', error);
    throw error;
  }
};

const getSubject = (template: string): string => {
  const subjects: Record<string, string> = {
    booking_confirmation: 'Booking Confirmation - Tweletu Band',
    booking_update: 'Booking Status Update',
    admin_notification: 'New Booking Inquiry',
  };
  return subjects[template] || 'Notification';
};

const renderTemplate = (template: string, data: Record<string, any>): string => {
  // HTML templates for emails
  const templates: Record<string, (data: any) => string> = {
    booking_confirmation: (data) => `
      <h1>Booking Confirmation</h1>
      <p>Thank you for your booking inquiry, ${data.name}!</p>
      <p>We'll review your request and get back to you soon.</p>
    `,
  };
  return templates[template]?.(data) || '';
};
```

## Phase 5: CMS Page Editor

### Page Settings Admin Module

```typescript
// src/pages/admin/AdminSettings.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { pageSettingsService } from '../../lib/supabaseService';
import { toast } from 'sonner';

export default function AdminSettings() {
  const [pages, setPages] = useState<any[]>([]);
  const [editingPage, setEditingPage] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      const data = await pageSettingsService.getAll();
      setPages(data || []);
    } catch (error) {
      toast.error('Failed to load pages');
    } finally {
      setLoading(false);
    }
  };

  const savePageSettings = async () => {
    if (!editingPage) return;
    try {
      await pageSettingsService.upsert(editingPage);
      toast.success('Page settings saved');
      await loadPages();
      setEditingPage(null);
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Page Settings</h1>
        <p className="text-zinc-400 mt-1">Configure CMS pages</p>
      </div>

      <div className="grid gap-4">
        {pages.map((page) => (
          <Card key={page.id} className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{page.page_name}</h3>
                  <p className="text-sm text-zinc-400">{page.title}</p>
                </div>
                <Button onClick={() => setEditingPage(page)}>Edit</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingPage && (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>Edit: {editingPage.page_name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Page Name</label>
              <Input
                value={editingPage.page_name}
                disabled
                className="bg-zinc-950 border-zinc-800"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={editingPage.title}
                onChange={(e) => setEditingPage({
                  ...editingPage,
                  title: e.target.value
                })}
                className="bg-zinc-950 border-zinc-800"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Meta Description</label>
              <Textarea
                value={editingPage.meta_description || ''}
                onChange={(e) => setEditingPage({
                  ...editingPage,
                  meta_description: e.target.value
                })}
                className="bg-zinc-950 border-zinc-800"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={savePageSettings} className="bg-green-600">
                Save
              </Button>
              <Button
                onClick={() => setEditingPage(null)}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```

## Testing Strategy

### Unit Tests
```bash
npm install -D vitest @testing-library/react
```

### E2E Tests
```bash
npm install -D playwright
```

### Manual Testing Checklist
- [ ] All forms validate correctly
- [ ] CRUD operations work
- [ ] Search and filtering work
- [ ] Mobile responsive
- [ ] Error handling displays properly
- [ ] Authentication flows work
- [ ] Database operations persist

## Performance Monitoring

### Bundle Analysis
```bash
npm install -D @vite/plugin-visualizer
```

### Database Query Optimization
```sql
-- Analyze slow queries
EXPLAIN ANALYZE SELECT * FROM music WHERE category = 'Original';

-- Monitor connections
SELECT count(*) FROM pg_stat_activity;
```

## Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrations applied
- [ ] Admin user created
- [ ] Backups configured
- [ ] SSL certificate installed
- [ ] DNS configured
- [ ] Email notifications working
- [ ] Error tracking configured
- [ ] Analytics configured
- [ ] CDN configured
- [ ] Monitoring alerts set up

## Next Steps

1. Implement remaining admin modules using provided examples
2. Set up file upload system with storage
3. Configure email notifications
4. Build CMS page editor
5. Add analytics tracking
6. Set up error tracking (Sentry)
7. Configure CDN and caching
8. Performance testing and optimization
9. Security audit
10. Deploy to production

---

**For detailed information, refer to:**
- ARCHITECTURE.md
- PRODUCTION_DEPLOYMENT_GUIDE.md
- FEATURES_IMPLEMENTATION.md
