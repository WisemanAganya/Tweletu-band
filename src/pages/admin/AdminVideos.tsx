import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Play } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { videoService } from '../../lib/supabaseService';
import { Video as VideoType, CreateVideoInput, UpdateVideoInput } from '../../types';
import { Textarea } from '../../components/ui/textarea';

const videoSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  category: z.string().min(1, 'Category is required'),
  video_url: z.string().url('Valid video URL required'),
  thumbnail_url: z.string().optional(),
  description: z.string().optional(),
  order: z.number().default(0),
});

type VideoFormValues = z.infer<typeof videoSchema>;

export default function AdminVideos() {
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<VideoFormValues>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      title: '',
      category: 'Live',
      video_url: '',
      thumbnail_url: '',
      description: '',
      order: 0,
    },
  });

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const data = await videoService.getAll();
      setVideos(data || []);
    } catch (error) {
      toast.error('Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: VideoFormValues) => {
    try {
      if (editingId) {
        await videoService.update({ id: editingId, ...values } as UpdateVideoInput);
        toast.success('Video updated successfully');
      } else {
        await videoService.create(values as CreateVideoInput);
        toast.success('Video added successfully');
      }
      form.reset();
      setEditingId(null);
      setIsDialogOpen(false);
      await loadVideos();
    } catch (error) {
      toast.error('Failed to save video');
    }
  };

  const handleEdit = (video: VideoType) => {
    form.reset({
      title: video.title,
      category: video.category,
      video_url: video.video_url,
      thumbnail_url: video.thumbnail_url || '',
      description: video.description || '',
      order: video.order,
    });
    setEditingId(video.id);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;
    try {
      await videoService.delete(id);
      toast.success('Video deleted');
      await loadVideos();
    } catch (error) {
      toast.error('Failed to delete video');
    }
  };

  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Video Gallery</h1>
          <p className="text-zinc-400 mt-1">Manage your performance and promotional videos</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingId(null); form.reset(); }} className="bg-zinc-50 text-zinc-950 hover:bg-zinc-200">
              <Plus className="w-4 h-4 mr-2" />
              Add Video
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-50 max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Video' : 'Add New Video'}</DialogTitle>
              <DialogDescription>Fill in the details for your video</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Video title..." {...field} className="bg-zinc-950 border-zinc-800" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input placeholder="Live, Studio, Promo..." {...field} className="bg-zinc-950 border-zinc-800" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="video_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video URL (YouTube/Vimeo)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} className="bg-zinc-950 border-zinc-800" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="thumbnail_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thumbnail URL (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} className="bg-zinc-950 border-zinc-800" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Video description..." {...field} className="bg-zinc-950 border-zinc-800" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Order</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} className="bg-zinc-950 border-zinc-800" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-zinc-50 text-zinc-950 hover:bg-zinc-200">
                  {editingId ? 'Update' : 'Create'} Video
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
        <Input
          placeholder="Search videos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-zinc-900 border-zinc-800"
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-zinc-400">Loading videos...</div>
      ) : filteredVideos.length === 0 ? (
        <div className="text-center py-12 bg-zinc-900 rounded-lg border border-zinc-800 text-zinc-400">
          No videos found. Add your first video!
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredVideos.map((video) => (
            <Card key={video.id} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors overflow-hidden flex flex-col">
              <div className="aspect-video relative bg-zinc-950">
                {video.thumbnail_url ? (
                  <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-800">
                    <Play className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-zinc-950/80 px-2 py-1 rounded text-xs font-medium backdrop-blur-sm">
                  {video.category}
                </div>
              </div>
              <CardContent className="p-4 flex-1 flex flex-col justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-lg line-clamp-1">{video.title}</h3>
                  {video.description && <p className="text-sm text-zinc-500 mt-1 line-clamp-2">{video.description}</p>}
                </div>
                <div className="flex gap-2 justify-end pt-2 border-t border-zinc-800">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(video)}
                    className="text-zinc-400 hover:text-zinc-50"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(video.id)}
                    className="text-zinc-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
