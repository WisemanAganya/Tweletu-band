import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { testimonialService } from '../lib/supabaseService';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Star } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

const testimonialSchema = z.object({
  clientName: z.string().min(2, 'Name is required'),
  clientRole: z.string().min(2, 'Role is required'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  rating: z.number().min(1).max(5),
});

export function TestimonialForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof testimonialSchema>>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: { clientName: '', clientRole: '', content: '', rating: 5 },
  });

  const onSubmit = async (values: z.infer<typeof testimonialSchema>) => {
    setIsSubmitting(true);
    try {
      await testimonialService.create({
        client_name: values.clientName,
        client_role: values.clientRole,
        content: values.content,
        rating: values.rating,
        status: 'pending' // Admin can approve later
      });
      toast.success('Thank you! Your testimonial has been submitted for review.');
      form.reset();
    } catch (error) {
      console.error('Failed to submit testimonial:', error);
      toast.error('Failed to submit testimonial. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 p-8 md:p-12 rounded-[40px] space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-display font-bold uppercase tracking-tight">Leave a Testimonial</h2>
        <p className="text-zinc-500 font-light">Share your experience working with Tweletu Band.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={form.control} name="clientName" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs uppercase tracking-widest text-zinc-500">Your Name</FormLabel>
                <FormControl><Input placeholder="John Doe" {...field} className="bg-zinc-950 border-zinc-800 h-12 rounded-xl" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="clientRole" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs uppercase tracking-widest text-zinc-500">Your Role / Event</FormLabel>
                <FormControl><Input placeholder="Event Planner / Wedding" {...field} className="bg-zinc-950 border-zinc-800 h-12 rounded-xl" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <FormField control={form.control} name="content" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs uppercase tracking-widest text-zinc-500">Your Feedback</FormLabel>
              <FormControl><Textarea placeholder="Tell us what you liked..." {...field} className="bg-zinc-950 border-zinc-800 min-h-[120px] rounded-xl" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="rating" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs uppercase tracking-widest text-zinc-500">Rating</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => field.onChange(star)}
                      className={`p-2 rounded-lg transition-colors ${field.value >= star ? 'text-yellow-500' : 'text-zinc-700'}`}
                    >
                      <Star size={24} fill={field.value >= star ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <Button type="submit" disabled={isSubmitting} className="w-full bg-zinc-50 text-zinc-950 hover:bg-zinc-200 h-14 uppercase tracking-widest font-bold rounded-2xl">
            {isSubmitting ? 'Submitting...' : 'Submit Testimonial'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
