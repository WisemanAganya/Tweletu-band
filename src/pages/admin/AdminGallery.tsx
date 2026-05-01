import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Image as ImageIcon } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { galleryService } from '../../lib/supabaseService';
import { GalleryItem as GalleryType, CreateGalleryInput, UpdateGalleryInput } from '../../types';
import { Textarea } from '../../components/ui/textarea';

const gallerySchema = z.object({
  title: z.string().min(2, 'Title is required'),
  category: z.string().min(1, 'Category is required'),
  image_url: z.string().url('Valid image URL required'),
  description: z.string().optional(),
  order: z.number(),
});

type GalleryFormValues = z.infer<typeof gallerySchema>;

export default function AdminGallery() {
  const [items, setItems] = useState<GalleryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<GalleryFormValues>({
    resolver: zodResolver(gallerySchema),
    defaultValues: {
      title: '',
      category: 'Live',
      image_url: '',
      description: '',
      order: 0,
    },
  });

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      setLoading(true);
      const data = await galleryService.getAll();
      setItems(data || []);
    } catch (error) {
      toast.error('Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: GalleryFormValues) => {
    try {
      if (editingId) {
        await galleryService.update({ id: editingId, ...values } as UpdateGalleryInput);
        toast.success('Gallery item updated successfully');
      } else {
        await galleryService.create(values as CreateGalleryInput);
        toast.success('Gallery item added successfully');
      }
      form.reset();
      setEditingId(null);
      setIsDialogOpen(false);
      await loadGallery();
    } catch (error) {
      toast.error('Failed to save gallery item');
    }
  };

  const handleEdit = (item: GalleryType) => {
    form.reset({
      title: item.title,
      category: item.category,
      image_url: item.image_url,
      description: item.description || '',
      order: item.order,
    });
    setEditingId(item.id);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    try {
      await galleryService.delete(id);
      toast.success('Gallery item deleted');
      await loadGallery();
    } catch (error) {
      toast.error('Failed to delete gallery item');
    }
  };

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Image Gallery</h1>
          <p className="text-zinc-400 mt-1">Manage photos for the gallery section</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingId(null); form.reset(); }} className="bg-zinc-50 text-zinc-950 hover:bg-zinc-200">
              <Plus className="w-4 h-4 mr-2" />
              Add Image
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-50 max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Image' : 'Add New Image'}</DialogTitle>
              <DialogDescription>Fill in the details for your gallery image</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField<GalleryFormValues>
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Image title..." {...field} className="bg-zinc-950 border-zinc-800" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField<GalleryFormValues>
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
                <FormField<GalleryFormValues>
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} className="bg-zinc-950 border-zinc-800" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField<GalleryFormValues>
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Image description..." {...field} className="bg-zinc-950 border-zinc-800" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField<GalleryFormValues>
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
                  {editingId ? 'Update' : 'Create'} Image
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
        <Input
          placeholder="Search images..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-zinc-900 border-zinc-800"
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-zinc-400">Loading gallery...</div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-zinc-900 rounded-lg border border-zinc-800 text-zinc-400">
          No images found. Add your first image!
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filteredItems.map((item) => (
            <Card key={item.id} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors overflow-hidden flex flex-col group">
              <div className="aspect-square relative bg-zinc-950 overflow-hidden">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-800">
                    <ImageIcon className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-zinc-950/80 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                  {item.category}
                </div>
              </div>
              <CardContent className="p-4 flex-1 flex flex-col justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-sm line-clamp-1">{item.title}</h3>
                </div>
                <div className="flex gap-2 justify-end pt-2 border-t border-zinc-800">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(item)}
                    className="text-zinc-400 hover:text-zinc-50 h-8 px-2"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(item.id)}
                    className="text-zinc-400 hover:text-red-500 h-8 px-2"
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
