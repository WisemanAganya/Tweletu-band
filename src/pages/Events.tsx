import { useState, useEffect } from 'react';
import { eventService } from '../lib/supabaseService';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, MapPin, Ticket, ArrowRight, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

export default function Events() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventService.getAll();
        const now = new Date();
        const sorted = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setEvents(sorted.map(e => ({
          ...e,
          isPast: new Date(e.date) < now
        })));
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };
    fetchEvents();
  }, []);

  const upcomingEvents = events.filter(e => !e.isPast);
  const pastEvents = events.filter(e => e.isPast);

  return (
    <div className="pt-32 pb-32 min-h-screen relative bg-aurora overflow-hidden">
      <div className="aurora-overlay"></div>
      <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl space-y-8 mb-24 relative z-10">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-teal-400">On Stage</span>
          <h1 className="text-6xl md:text-8xl font-display font-bold uppercase tracking-tighter leading-none text-white">
            Upcoming <br /> <span className="text-gradient">Performances</span>
          </h1>
          <p className="text-zinc-300 text-xl font-light leading-relaxed glass-panel p-6 rounded-2xl inline-block">
            Catch us live at these upcoming events. We'd love to see you there!
          </p>
        </div>

        <div className="space-y-32">
          {/* Upcoming Events */}
          <section className="space-y-12">
            <div className="grid grid-cols-1 gap-6">
              {upcomingEvents.length === 0 ? (
                <div className="text-center py-20 bg-zinc-900/30 border border-dashed border-zinc-800 rounded-[40px] text-zinc-600">
                  No upcoming events scheduled at the moment. Check back soon!
                </div>
              ) : (
                upcomingEvents.map((event, index) => (
                  <motion.div 
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    viewport={{ once: true }}
                    className="group grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 md:p-10 glass-card rounded-[40px] relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-teal-500/5 via-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="lg:col-span-2 flex flex-col items-center justify-center text-center p-6 glass rounded-3xl group-hover:scale-105 transition-all duration-300 relative z-10 shadow-[0_0_15px_rgba(45,212,191,0.1)] group-hover:shadow-[0_0_25px_rgba(45,212,191,0.3)]">
                      <div className="text-xs font-bold uppercase tracking-widest text-teal-400 group-hover:text-white transition-colors">
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                      <div className="text-4xl font-display font-bold text-white">
                        {new Date(event.date).toLocaleDateString('en-US', { day: '2-digit' })}
                      </div>
                      <div className="text-xs font-bold uppercase tracking-widest text-zinc-400 group-hover:text-zinc-300 transition-colors">
                        {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric' })}
                      </div>
                    </div>

                    <div className="lg:col-span-6 space-y-4 relative z-10">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-white/10 text-teal-400 uppercase text-[10px] tracking-widest border border-white/10 backdrop-blur-md">Live Show</Badge>
                        <div className="flex items-center gap-2 text-xs text-zinc-300 font-medium uppercase tracking-widest">
                          <Clock size={14} className="text-purple-400" /> {new Date(event.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        </div>
                      </div>
                      <h2 className="text-3xl font-display font-bold uppercase tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-teal-400 group-hover:to-purple-500 transition-all duration-300">{event.title}</h2>
                      <div className="flex items-center gap-2 text-zinc-400 font-light">
                        <MapPin size={18} className="text-teal-500/70" />
                        {event.location}
                      </div>
                    </div>

                    <div className="lg:col-span-4 flex justify-end gap-4 relative z-10">
                      <Button variant="outline" className="glass border-white/20 hover:bg-white/10 text-white uppercase tracking-widest font-bold rounded-2xl h-14 px-8 flex-1 lg:flex-none transition-all duration-300">
                        Details
                      </Button>
                      {event.ticketUrl && (
                        <Button className="bg-gradient-to-r from-teal-400 to-purple-500 text-white border-0 shadow-[0_0_15px_rgba(45,212,191,0.3)] hover:shadow-[0_0_25px_rgba(45,212,191,0.5)] uppercase tracking-widest font-bold rounded-2xl h-14 px-8 flex-1 lg:flex-none transition-all duration-300">
                          Get Tickets <Ticket size={18} className="ml-2 group-hover:rotate-12 transition-transform" />
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </section>

          {/* Past Events */}
          <section className="space-y-12 relative z-10">
            <div className="flex items-center gap-6">
              <h2 className="text-3xl font-display font-bold uppercase tracking-tight text-white">Past Events</h2>
              <div className="h-px bg-gradient-to-r from-teal-500/50 to-transparent flex-1" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastEvents.length === 0 ? (
                <div className="col-span-full text-center py-10 text-zinc-500">
                  No past events recorded.
                </div>
              ) : (
                pastEvents.map((event) => (
                  <div key={event.id} className="p-8 glass-panel rounded-[32px] space-y-4 opacity-70 hover:opacity-100 hover:scale-[1.02] transition-all duration-300">
                    <div className="text-xs font-bold uppercase tracking-widest text-teal-500/70">
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </div>
                    <h3 className="text-xl font-bold uppercase tracking-tight text-white">{event.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <MapPin size={14} className="text-purple-400/70" /> {event.location}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
