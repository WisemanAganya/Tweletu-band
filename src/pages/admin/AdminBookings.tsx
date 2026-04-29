import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Mail, Phone, MapPin, Calendar, Users, DollarSign } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { bookingService } from '../../lib/supabaseService';
import { Booking as BookingType, CreateBookingInput } from '../../types';
import { Textarea } from '../../components/ui/textarea';

const bookingSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(5, 'Phone number is required'),
  event_date: z.string().min(1, 'Event date is required'),
  location: z.string().min(2, 'Location is required'),
  budget: z.string().optional(),
  message: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export default function AdminBookings() {
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      event_date: '',
      location: '',
      budget: '',
      message: '',
    },
  });

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getAll();
      setBookings(data || []);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: BookingFormValues) => {
    try {
      await bookingService.create(values as CreateBookingInput);
      toast.success('Booking added successfully');
      form.reset();
      setIsDialogOpen(false);
      await loadBookings();
    } catch (error) {
      toast.error('Failed to save booking');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    try {
      await bookingService.delete(id);
      toast.success('Booking deleted');
      await loadBookings();
    } catch (error) {
      toast.error('Failed to delete booking');
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await bookingService.updateStatus(id, newStatus);
      toast.success(`Booking marked as ${newStatus}`);
      await loadBookings();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredBookings = bookings.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'contacted': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'confirmed': return 'bg-teal-500/10 text-teal-400 border-teal-500/20';
      case 'rejected': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bookings</h1>
          <p className="text-zinc-400 mt-1">Manage performance inquiries and bookings</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => form.reset()} className="bg-zinc-50 text-zinc-950 hover:bg-zinc-200">
              <Plus className="w-4 h-4 mr-2" />
              Manual Booking
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-50 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Manual Booking</DialogTitle>
              <DialogDescription>Manually enter a booking request</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="john@example.com..." {...field} className="bg-zinc-950 border-zinc-800" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+1..." {...field} className="bg-zinc-950 border-zinc-800" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="event_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} className="bg-zinc-950 border-zinc-800 style-color-scheme-dark" style={{ colorScheme: 'dark' }} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Venue, City..." {...field} className="bg-zinc-950 border-zinc-800" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Budget (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="$..." {...field} className="bg-zinc-950 border-zinc-800" />
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
                      <FormLabel>Message (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Details about the event..." {...field} className="bg-zinc-950 border-zinc-800" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-zinc-50 text-zinc-950 hover:bg-zinc-200">
                  Create Booking
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
        <Input
          placeholder="Search bookings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-zinc-900 border-zinc-800"
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-zinc-400">Loading bookings...</div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-12 bg-zinc-900 rounded-lg border border-zinc-800 text-zinc-400">
          No bookings found.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {filteredBookings.map((booking) => (
            <Card key={booking.id} className="bg-zinc-900 border-zinc-800 flex flex-col">
              <CardHeader className="pb-4 border-b border-zinc-800">
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg font-bold">{booking.name}</CardTitle>
                  <Select
                    value={booking.status}
                    onValueChange={(value) => handleStatusChange(booking.id, value)}
                  >
                    <SelectTrigger className={`w-[130px] h-8 text-xs font-bold uppercase tracking-wider ${getStatusColor(booking.status)}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-50">
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-xs text-zinc-500">
                  Received {new Date(booking.created_at).toLocaleDateString()}
                </div>
              </CardHeader>
              <CardContent className="p-6 flex-1 flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-xs text-zinc-500 uppercase font-bold tracking-widest flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Event Date
                    </div>
                    <div className="text-sm">{new Date(booking.event_date).toLocaleDateString()}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-zinc-500 uppercase font-bold tracking-widest flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> Location
                    </div>
                    <div className="text-sm line-clamp-1">{booking.location}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-zinc-500 uppercase font-bold tracking-widest flex items-center gap-1">
                      <Phone className="w-3 h-3" /> Phone
                    </div>
                    <div className="text-sm">{booking.phone}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-zinc-500 uppercase font-bold tracking-widest flex items-center gap-1">
                      <DollarSign className="w-3 h-3" /> Budget
                    </div>
                    <div className="text-sm">{booking.budget || 'Not specified'}</div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-zinc-500 uppercase font-bold tracking-widest flex items-center gap-1">
                    <Mail className="w-3 h-3" /> Email
                  </div>
                  <a href={`mailto:${booking.email}`} className="text-sm text-teal-400 hover:underline">{booking.email}</a>
                </div>

                {booking.message && (
                  <div className="flex-1 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                    <p className="text-sm text-zinc-400 whitespace-pre-wrap">{booking.message}</p>
                  </div>
                )}

                <div className="flex justify-end pt-4 border-t border-zinc-800">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(booking.id)}
                    className="text-red-400 hover:text-red-500 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
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
