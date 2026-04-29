import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Star, CheckCircle, XCircle, Clock } from 'lucide-react';
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
import { testimonialService } from '../../lib/supabaseService';
import { Testimonial as TestimonialType, CreateTestimonialInput, UpdateTestimonialInput } from '../../types';
import { Textarea } from '../../components/ui/textarea';

const testimonialSchema = z.object({
  client_name: z.string().min(2, 'Name is required'),
  client_role: z.string().min(2, 'Role/Event Type is required'),
  content: z.string().min(10, 'Testimonial content is required'),
  rating: z.number().min(1).max(5),
  image_url: z.string().url('Valid image URL required').optional().or(z.literal('')),
  status: z.enum(['pending', 'approved', 'rejected']),
});

type TestimonialFormValues = z.infer<typeof testimonialSchema>;

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<TestimonialType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      client_name: '',
      client_role: '',
      content: '',
      rating: 5,
      image_url: '',
      status: 'pending',
    },
  });

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const data = await testimonialService.getAll();
      setTestimonials(data || []);
    } catch (error) {
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: TestimonialFormValues) => {
    try {
      if (editingId) {
        await testimonialService.update({ id: editingId, ...values } as UpdateTestimonialInput);
        toast.success('Testimonial updated successfully');
      } else {
        await testimonialService.create(values as CreateTestimonialInput);
        toast.success('Testimonial added successfully');
      }
      form.reset();
      setEditingId(null);
      setIsDialogOpen(false);
      await loadTestimonials();
    } catch (error) {
      toast.error('Failed to save testimonial');
    }
  };

  const handleEdit = (testimonial: TestimonialType) => {
    form.reset({
      client_name: testimonial.client_name,
      client_role: testimonial.client_role,
      content: testimonial.content,
      rating: testimonial.rating,
      image_url: testimonial.image_url || '',
      status: testimonial.status,
    });
    setEditingId(testimonial.id);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      await testimonialService.delete(id);
      toast.success('Testimonial deleted');
      await loadTestimonials();
    } catch (error) {
      toast.error('Failed to delete testimonial');
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'pending' | 'approved' | 'rejected') => {
    try {
      await testimonialService.update({ id, status: newStatus });
      toast.success(`Testimonial marked as ${newStatus}`);
      await loadTestimonials();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredTestimonials = testimonials.filter((t) =>
    t.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-teal-500" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Testimonials</h1>
          <p className="text-zinc-400 mt-1">Manage client reviews and feedback</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingId(null); form.reset(); }} className="bg-zinc-50 text-zinc-950 hover:bg-zinc-200">
              <Plus className="w-4 h-4 mr-2" />
              Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-50 max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Testimonial' : 'Add New Testimonial'}</DialogTitle>
              <DialogDescription>Add a client review manually</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="client_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe..." {...field} className="bg-zinc-950 border-zinc-800" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="client_role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event / Role</FormLabel>
                        <FormControl>
                          <Input placeholder="Wedding Couple..." {...field} className="bg-zinc-950 border-zinc-800" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Review Content</FormLabel>
                      <FormControl>
                        <Textarea placeholder="They were amazing..." {...field} className="bg-zinc-950 border-zinc-800 min-h-[100px]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rating (1-5)</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} max={5} {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} className="bg-zinc-950 border-zinc-800" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
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
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Image URL (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} className="bg-zinc-950 border-zinc-800" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-zinc-50 text-zinc-950 hover:bg-zinc-200">
                  {editingId ? 'Update' : 'Create'} Testimonial
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
        <Input
          placeholder="Search testimonials..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-zinc-900 border-zinc-800"
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-zinc-400">Loading testimonials...</div>
      ) : filteredTestimonials.length === 0 ? (
        <div className="text-center py-12 bg-zinc-900 rounded-lg border border-zinc-800 text-zinc-400">
          No testimonials found.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredTestimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors flex flex-col">
              <CardContent className="p-6 flex-1 flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {testimonial.image_url ? (
                      <img src={testimonial.image_url} alt={testimonial.client_name} className="w-12 h-12 rounded-full object-cover bg-zinc-800" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold">
                        {testimonial.client_name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold">{testimonial.client_name}</h3>
                      <p className="text-xs text-zinc-400">{testimonial.client_role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-zinc-950 px-2 py-1 rounded-full border border-zinc-800">
                    <StatusIcon status={testimonial.status} />
                    <span className="text-xs capitalize ml-1">{testimonial.status}</span>
                  </div>
                </div>
                
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < testimonial.rating ? 'fill-yellow-500 text-yellow-500' : 'text-zinc-700'}`} />
                  ))}
                </div>

                <p className="text-sm text-zinc-300 flex-1 italic">"{testimonial.content}"</p>

                <div className="flex gap-2 justify-between items-center pt-4 border-t border-zinc-800">
                  <div className="flex gap-2">
                    {testimonial.status !== 'approved' && (
                      <Button size="sm" variant="outline" className="bg-transparent border-teal-500/50 text-teal-400 hover:bg-teal-500/10" onClick={() => handleStatusChange(testimonial.id, 'approved')}>
                        Approve
                      </Button>
                    )}
                    {testimonial.status !== 'rejected' && (
                      <Button size="sm" variant="outline" className="bg-transparent border-red-500/50 text-red-400 hover:bg-red-500/10" onClick={() => handleStatusChange(testimonial.id, 'rejected')}>
                        Reject
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(testimonial)}
                      className="text-zinc-400 hover:text-zinc-50"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(testimonial.id)}
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
