import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { bookingService } from '../lib/supabaseService';

import { TestimonialForm } from '../components/TestimonialForm';

const formSchema = z.object({
  clientName: z.string().min(2, 'Name must be at least 2 characters'),
  clientEmail: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  eventType: z.string().min(1, 'Please select an event type'),
  eventDate: z.string().min(1, 'Please select a date'),
  location: z.string().min(2, 'Location is required'),
  budgetRange: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: '',
      clientEmail: '',
      phone: '',
      eventType: '',
      eventDate: '',
      location: '',
      budgetRange: '',
      message: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      await bookingService.create({
        name: values.clientName,
        email: values.clientEmail,
        phone: values.phone,
        event_date: values.eventDate,
        location: values.location,
        budget: values.budgetRange,
        message: values.message,
      });
      setIsSubmitted(true);
      toast.success('Booking request sent successfully!');
    } catch (error) {
      console.error('Failed to send booking request:', error);
      toast.error('Failed to send booking request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 pb-32">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-8 p-12 bg-zinc-900 border border-zinc-800 rounded-3xl"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-zinc-50 text-zinc-950">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-4xl font-display font-bold uppercase tracking-tight">Thank You!</h1>
          <p className="text-zinc-400 leading-relaxed">
            Your booking request has been received. We'll review the details and get back to you within 24-48 hours.
          </p>
          <Button 
            onClick={() => setIsSubmitted(false)}
            className="w-full bg-zinc-50 text-zinc-950 hover:bg-zinc-200"
          >
            Send Another Request
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-32 min-h-screen relative bg-aurora overflow-hidden">
      <div className="aurora-overlay"></div>
      <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Contact Info */}
          <div className="space-y-12">
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-teal-400">Get in Touch</span>
              <h1 className="text-6xl md:text-8xl font-display font-bold uppercase tracking-tighter leading-none text-white">
                Let's Make <br /> <span className="text-gradient">Music</span>
              </h1>
              <p className="text-zinc-300 text-lg font-light leading-relaxed max-w-md glass-panel p-6 rounded-2xl">
                Have a project in mind? Whether it's a grand wedding or a studio session, we'd love to hear from you.
              </p>
            </div>

            <div className="space-y-8 relative z-10">
              <div className="flex items-start gap-6 group cursor-pointer glass p-4 rounded-3xl hover:bg-white/10 transition-all duration-300">
                <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-teal-400 shadow-inner group-hover:scale-110 transition-all duration-300">
                  <Mail size={24} />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-teal-400 mb-1">Email Us</div>
                  <div className="text-xl font-medium text-white">bookings@tweletuband.com</div>
                </div>
              </div>

              <div className="flex items-start gap-6 group cursor-pointer glass p-4 rounded-3xl hover:bg-white/10 transition-all duration-300">
                <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-purple-400 shadow-inner group-hover:scale-110 transition-all duration-300">
                  <Phone size={24} />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-1">Call Us</div>
                  <div className="text-xl font-medium text-white">+254 700 000 000</div>
                </div>
              </div>

              <div className="flex items-start gap-6 group cursor-pointer glass p-4 rounded-3xl hover:bg-white/10 transition-all duration-300">
                <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-cyan-400 shadow-inner group-hover:scale-110 transition-all duration-300">
                  <MapPin size={24} />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-1">Location</div>
                  <div className="text-xl font-medium text-white">Nairobi, Kenya</div>
                </div>
              </div>
            </div>

            <div className="pt-12 border-t border-zinc-900">
              <div className="text-xs font-bold uppercase tracking-widest text-zinc-600 mb-6">Follow Our Journey</div>
              <div className="flex gap-4">
                {['Instagram', 'YouTube', 'Spotify', 'TikTok'].map((social) => (
                  <a key={social} href="#" className="text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-50 transition-colors">
                    {social}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="glass-panel rounded-[40px] p-8 md:p-12 relative overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-500/10 rounded-full blur-[100px]"></div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="clientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-widest text-zinc-400">Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} className="glass border-white/10 focus:border-teal-400 focus:ring-teal-400/20 text-white placeholder:text-zinc-500 h-12 rounded-xl transition-all" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="clientEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-widest text-zinc-400">Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="john@example.com" {...field} className="glass border-white/10 focus:border-teal-400 focus:ring-teal-400/20 text-white placeholder:text-zinc-500 h-12 rounded-xl transition-all" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-widest text-zinc-400">Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+254 ..." {...field} className="glass border-white/10 focus:border-teal-400 focus:ring-teal-400/20 text-white placeholder:text-zinc-500 h-12 rounded-xl transition-all" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="eventType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-widest text-zinc-400">Event Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="glass border-white/10 focus:border-teal-400 focus:ring-teal-400/20 text-white h-12 rounded-xl transition-all">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="glass-panel border-white/10 text-zinc-50 rounded-xl">
                            <SelectItem value="Wedding">Wedding</SelectItem>
                            <SelectItem value="Corporate">Corporate Event</SelectItem>
                            <SelectItem value="Private">Private Party</SelectItem>
                            <SelectItem value="Studio">Studio Session</SelectItem>
                            <SelectItem value="Voice-Over">Voice-Over</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="eventDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-widest text-zinc-400">Event Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} className="glass border-white/10 focus:border-teal-400 focus:ring-teal-400/20 text-white h-12 rounded-xl transition-all style-color-scheme-dark" style={{ colorScheme: 'dark' }} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-widest text-zinc-400">Location</FormLabel>
                        <FormControl>
                          <Input placeholder="City, Venue" {...field} className="glass border-white/10 focus:border-teal-400 focus:ring-teal-400/20 text-white placeholder:text-zinc-500 h-12 rounded-xl transition-all" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="budgetRange"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-widest text-zinc-400">Budget Range (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. $500 - $1000" {...field} className="glass border-white/10 focus:border-teal-400 focus:ring-teal-400/20 text-white placeholder:text-zinc-500 h-12 rounded-xl transition-all" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-widest text-zinc-400">Tell us about your event</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Share some details about what you're looking for..." 
                          className="glass border-white/10 focus:border-teal-400 focus:ring-teal-400/20 text-white placeholder:text-zinc-500 min-h-[150px] rounded-xl transition-all" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-teal-400 to-purple-500 text-white border-0 shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:shadow-[0_0_30px_rgba(45,212,191,0.5)] h-14 text-base uppercase tracking-widest font-bold rounded-xl transition-all duration-300"
                >
                  {isSubmitting ? 'Sending...' : (
                    <span className="flex items-center gap-2">
                      Send Booking Request <Send size={18} />
                    </span>
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>

        {/* Testimonial Form Section */}
        <div className="mt-40 max-w-4xl mx-auto">
          <TestimonialForm />
        </div>
      </div>
    </div>
  );
}
