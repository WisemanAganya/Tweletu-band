import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { musicService } from '../../lib/supabaseService';
import { Music as MusicType, CreateMusicInput, UpdateMusicInput } from '../../types';
import { Textarea } from '../../components/ui/textarea';

const musicSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  category: z.string().min(1, 'Category is required'),
  audio_url: z.string().url('Valid audio URL required'),
  description: z.string().optional(),
  cover_url: z.string().optional(),
  order: z.number(),
});

type MusicFormValues = z.infer<typeof musicSchema>;

export default function AdminMusic() {
  const [music, setMusic] = useState<MusicType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<MusicFormValues>({
    resolver: zodResolver(musicSchema),
    defaultValues: {
      title: '',
      category: 'Original',
      audio_url: '',
      description: '',
      cover_url: '',
      order: 0,
    },
  });

  useEffect(() => {
    loadMusic();
  }, []);

  const loadMusic = async () => {
    try {
      setLoading(true);
      const data = await musicService.getAll();
      setMusic(data || []);
    } catch (error) {
      toast.error('Failed to load music');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: MusicFormValues) => {
    try {
      if (editingId) {
        await musicService.update({ id: editingId, ...values } as UpdateMusicInput);
        toast.success('Music updated successfully');
      } else {
        await musicService.create(values as CreateMusicInput);
        toast.success('Music added successfully');
      }
      form.reset();
      setEditingId(null);
      setIsDialogOpen(false);
      await loadMusic();
    } catch (error) {
      toast.error('Failed to save music');
    }
  };

  const handleEdit = (track: MusicType) => {
    form.reset({
      title: track.title,
      category: track.category,
      audio_url: track.audio_url,
      description: track.description || '',
      cover_url: track.cover_url || '',
      order: track.order,
    });
    setEditingId(track.id);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this music?')) return;
    try {
      await musicService.delete(id);
      toast.success('Music deleted');
      await loadMusic();
    } catch (error) {
      toast.error('Failed to delete music');
    }
  };

  const filteredMusic = music.filter((track) =>
    track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    track.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Music Library</h1>
          <p className="text-zinc-400 mt-1">Manage your music tracks and recordings</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingId(null); form.reset(); }} className="bg-zinc-50 text-zinc-950 hover:bg-zinc-200">
              <Plus className="w-4 h-4 mr-2" />
              Add Music
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-50 max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Music' : 'Add New Music'}</DialogTitle>
              <DialogDescription>Fill in the details for your music track</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField<MusicFormValues>
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Song title..." {...field} className="bg-zinc-950 border-zinc-800" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField<MusicFormValues>
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input placeholder="Original, Cover, etc..." {...field} className="bg-zinc-950 border-zinc-800" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField<MusicFormValues>
                  control={form.control}
                  name="audio_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Audio URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} className="bg-zinc-950 border-zinc-800" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField<MusicFormValues>
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Song description..." {...field} className="bg-zinc-950 border-zinc-800" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField<MusicFormValues>
                  control={form.control}
                  name="cover_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cover Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} className="bg-zinc-950 border-zinc-800" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField<MusicFormValues>
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
                  {editingId ? 'Update' : 'Create'} Music
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
        <Input
          placeholder="Search music..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-zinc-900 border-zinc-800"
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-zinc-400">Loading music...</div>
      ) : filteredMusic.length === 0 ? (
        <div className="text-center py-12 bg-zinc-900 rounded-lg border border-zinc-800 text-zinc-400">
          No music found. Create your first track!
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredMusic.map((track) => (
            <Card key={track.id} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{track.title}</h3>
                    <p className="text-sm text-zinc-400">{track.category}</p>
                    {track.description && <p className="text-sm text-zinc-500 mt-2">{track.description}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(track)}
                      className="text-zinc-400 hover:text-zinc-50"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(track.id)}
                      className="text-zinc-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
