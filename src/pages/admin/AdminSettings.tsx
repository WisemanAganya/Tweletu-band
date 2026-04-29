import React, { useState, useEffect } from 'react';
import { Save, Settings, Globe, Mail, Phone, MapPin, Link as LinkIcon } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { pageSettingsService } from '../../lib/supabaseService';
import { Textarea } from '../../components/ui/textarea';

const settingsSchema = z.object({
  contact_email: z.string().email('Invalid email address'),
  contact_phone: z.string().min(5, 'Phone number is required'),
  contact_address: z.string().min(2, 'Address is required'),
  instagram_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  youtube_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  spotify_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  tiktok_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  site_title: z.string().min(2, 'Site title is required'),
  site_description: z.string().min(10, 'Site description is required'),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      contact_email: 'bookings@tweletuband.com',
      contact_phone: '+254 700 000 000',
      contact_address: 'Nairobi, Kenya',
      instagram_url: '',
      youtube_url: '',
      spotify_url: '',
      tiktok_url: '',
      site_title: 'Tweletu Band',
      site_description: 'Professional live band from Nairobi, Kenya.',
    },
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await pageSettingsService.getByPageName('global');
      if (data && data.content) {
        form.reset({
          contact_email: data.content.contact_email || 'bookings@tweletuband.com',
          contact_phone: data.content.contact_phone || '+254 700 000 000',
          contact_address: data.content.contact_address || 'Nairobi, Kenya',
          instagram_url: data.content.instagram_url || '',
          youtube_url: data.content.youtube_url || '',
          spotify_url: data.content.spotify_url || '',
          tiktok_url: data.content.tiktok_url || '',
          site_title: data.title || 'Tweletu Band',
          site_description: data.meta_description || 'Professional live band from Nairobi, Kenya.',
        });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      // It's okay if settings don't exist yet, we'll create them on save
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: SettingsFormValues) => {
    try {
      setSaving(true);
      
      const { site_title, site_description, ...contentObj } = values;

      await pageSettingsService.upsert({
        page_name: 'global',
        title: site_title,
        meta_description: site_description,
        content: contentObj,
        published: true,
      });

      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-zinc-400">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Global Settings</h1>
          <p className="text-zinc-400 mt-1">Configure your website's core details</p>
        </div>
        <Button 
          onClick={form.handleSubmit(onSubmit)} 
          disabled={saving}
          className="bg-teal-500 hover:bg-teal-600 text-white border-0 shadow-[0_0_15px_rgba(20,184,166,0.3)]"
        >
          {saving ? 'Saving...' : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Form {...form}>
        <form className="space-y-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="border-b border-zinc-800 pb-4">
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-zinc-400" />
                SEO & Site Identity
              </CardTitle>
              <CardDescription className="text-zinc-400">
                These details appear in search engine results and browser tabs.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <FormField
                control={form.control}
                name="site_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Tweletu Band" {...field} className="bg-zinc-950 border-zinc-800" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="site_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Professional live band..." {...field} className="bg-zinc-950 border-zinc-800" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="border-b border-zinc-800 pb-4">
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-zinc-400" />
                Contact Information
              </CardTitle>
              <CardDescription className="text-zinc-400">
                This information is displayed on the Contact page and Footer.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="contact_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-zinc-500" /> Email Address
                    </FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="hello@example.com" {...field} className="bg-zinc-950 border-zinc-800" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contact_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-zinc-500" /> Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="+254..." {...field} className="bg-zinc-950 border-zinc-800" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contact_address"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-zinc-500" /> Physical Location
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Nairobi, Kenya" {...field} className="bg-zinc-950 border-zinc-800" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="border-b border-zinc-800 pb-4">
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-zinc-400" />
                Social Media Links
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Used for social icons across the site. Leave blank to hide the icon.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="instagram_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://instagram.com/..." {...field} className="bg-zinc-950 border-zinc-800" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="youtube_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>YouTube URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://youtube.com/..." {...field} className="bg-zinc-950 border-zinc-800" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="spotify_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Spotify URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://spotify.com/..." {...field} className="bg-zinc-950 border-zinc-800" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tiktok_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>TikTok URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://tiktok.com/..." {...field} className="bg-zinc-950 border-zinc-800" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
