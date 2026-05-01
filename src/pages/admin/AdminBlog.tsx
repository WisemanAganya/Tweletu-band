import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, FileText, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { blogService } from '../../lib/supabaseService';
import { useSupabase } from '../../lib/SupabaseProvider';
import { BlogPost as BlogPostType, CreateBlogPostInput, UpdateBlogPostInput } from '../../types';
import { Textarea } from '../../components/ui/textarea';

const blogSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  slug: z.string().min(2, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  content: z.string().min(10, 'Content is required'),
  excerpt: z.string().optional(),
  featured_image: z.string().url('Valid image URL required').optional().or(z.literal('')),
  status: z.enum(['draft', 'published', 'archived']),
});

type BlogFormValues = z.infer<typeof blogSchema>;

export default function AdminBlog() {
  const { user } = useSupabase();
  const [posts, setPosts] = useState<BlogPostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      featured_image: '',
      status: 'draft',
    },
  });

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await blogService.getAll();
      setPosts(data || []);
    } catch (error) {
      toast.error('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: BlogFormValues) => {
    try {
      if (!user) {
        toast.error('You must be logged in to create a post');
        return;
      }

      const input = {
        ...values,
        published_at: values.status === 'published' ? new Date().toISOString() : undefined,
      };

      if (editingId) {
        await blogService.update({ id: editingId, ...input } as UpdateBlogPostInput);
        toast.success('Post updated successfully');
      } else {
        await blogService.create(input as CreateBlogPostInput, user.id);
        toast.success('Post created successfully');
      }
      form.reset();
      setEditingId(null);
      setIsDialogOpen(false);
      await loadPosts();
    } catch (error) {
      toast.error('Failed to save post');
    }
  };

  const handleEdit = (post: BlogPostType) => {
    form.reset({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt || '',
      featured_image: post.featured_image || '',
      status: post.status,
    });
    setEditingId(post.id);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await blogService.delete(id);
      toast.success('Post deleted');
      await loadPosts();
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  // Auto-generate slug from title if slug is empty
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (...event: any[]) => void) => {
    onChange(e);
    const title = e.target.value;
    if (!form.getValues('slug') && !editingId) {
      form.setValue('slug', title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Blog Posts</h1>
          <p className="text-zinc-400 mt-1">Write and manage your articles</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingId(null); form.reset(); }} className="bg-zinc-50 text-zinc-950 hover:bg-zinc-200">
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-50 max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Post' : 'Create New Post'}</DialogTitle>
              <DialogDescription>Write your blog content below</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField<BlogFormValues>
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Post title..." {...field} onChange={(e) => handleTitleChange(e, field.onChange)} className="bg-zinc-950 border-zinc-800" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField<BlogFormValues>
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL Slug</FormLabel>
                        <FormControl>
                          <Input placeholder="my-awesome-post" {...field} className="bg-zinc-950 border-zinc-800" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField<BlogFormValues>
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Excerpt (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="A short summary of the post..." {...field} className="bg-zinc-950 border-zinc-800 h-20" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField<BlogFormValues>
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content (Markdown Supported)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Write your post content here..." {...field} className="bg-zinc-950 border-zinc-800 font-mono h-64" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField<BlogFormValues>
                    control={form.control}
                    name="featured_image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Featured Image URL (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} className="bg-zinc-950 border-zinc-800" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField<BlogFormValues>
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-zinc-950 border-zinc-800">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-50">
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full bg-zinc-50 text-zinc-950 hover:bg-zinc-200">
                  {editingId ? 'Update' : 'Create'} Post
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
        <Input
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-zinc-900 border-zinc-800"
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-zinc-400">Loading posts...</div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-12 bg-zinc-900 rounded-lg border border-zinc-800 text-zinc-400">
          No posts found. Start writing!
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                  <div className="flex gap-4 items-start flex-1">
                    <div className="w-12 h-12 rounded-xl bg-zinc-950 flex items-center justify-center text-zinc-500 shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-xl">{post.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wider border ${
                          post.status === 'published' ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' : 
                          post.status === 'draft' ? 'bg-zinc-800 text-zinc-400 border-zinc-700' :
                          'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                          {post.status}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 mt-1 font-mono">{post.slug}</p>
                      {post.excerpt && <p className="text-zinc-400 mt-2 line-clamp-2">{post.excerpt}</p>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(post)}
                      className="text-zinc-400 hover:text-zinc-50"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(post.id)}
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
