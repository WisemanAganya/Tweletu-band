import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Music, Mic2, Play, Calendar, Star, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/badge';
import { serviceService, testimonialService } from '../lib/supabaseService';

const iconMap: { [key: string]: any } = {
  Music,
  Mic2,
  Play,
  Calendar,
  Star
};

export default function Home() {
  const [services, setServices] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const servicesData = await serviceService.getAll();
        setServices(servicesData.slice(0, 3));

        const testimonialsData = await testimonialService.getAll();
        const approved = testimonialsData.filter(t => t.status === 'approved').slice(0, 3);
        setTestimonials(approved);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="overflow-hidden bg-zinc-950 relative">
      {/* Background Aurora Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-teal-500/20 blur-[120px] mix-blend-screen animate-pulse duration-1000"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-500/20 blur-[150px] mix-blend-screen animate-pulse duration-1000 delay-500"></div>
        <div className="absolute top-[40%] right-[20%] w-[30%] h-[40%] rounded-full bg-blue-500/10 blur-[100px] mix-blend-screen"></div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 z-10 bg-aurora">
        <div className="aurora-overlay"></div>
        <div className="absolute inset-0 bg-zinc-950/40 backdrop-blur-[2px]" />

        <div className="container mx-auto px-4 relative z-10 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6"
          >
            <Badge variant="outline" className="mb-4 glass border-white/20 text-zinc-200 uppercase tracking-widest px-6 py-2 rounded-full text-xs">
              <Sparkles className="w-3 h-3 mr-2 text-teal-400" />
              Vocal Duo | Performers | Voice Artists
            </Badge>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-bold tracking-tighter uppercase leading-[0.85]">
              Tweletu <br /> <span className="text-gradient-aurora">Band</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-zinc-300 text-lg md:text-2xl max-w-2xl mx-auto font-light leading-relaxed glass-panel px-6 py-4 rounded-3xl inline-block"
          >
            Elevating every moment through the power of harmony. From intimate weddings to global brands, we bring soul to your sound.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5, type: "spring" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
          >
            <Link to="/contact">
              <Button size="lg" className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white shadow-[0_0_20px_rgba(45,212,191,0.2)] hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] px-10 h-16 rounded-full text-base uppercase tracking-wider font-bold transition-all duration-300">
                Book Us Now
              </Button>
            </Link>
            <Link to="/music">
              <Button size="lg" variant="outline" className="glass hover:bg-white/10 text-white border-white/10 px-10 h-16 rounded-full text-base uppercase tracking-wider font-bold transition-all duration-300">
                Listen Now
              </Button>
            </Link>
          </motion.div>
        </div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-zinc-400"
        >
          <ArrowRight className="rotate-90" size={28} />
        </motion.div>
      </section>

      {/* Services Section */}
      <section className="py-32 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-teal-400">What We Do</span>
              <h2 className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tight">Our Services</h2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Link to="/services" className="group glass px-6 py-3 rounded-full flex items-center gap-2 text-zinc-200 hover:text-white hover:bg-white/10 transition-all uppercase tracking-widest text-sm font-bold">
                View All Services <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.length === 0 && !loading ? (
              <div className="col-span-3 text-center text-zinc-600 py-10 glass-panel rounded-3xl">No services found.</div>
            ) : (
              services.map((service, index) => {
                const Icon = iconMap[service.icon] || Music;
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    viewport={{ once: true }}
                    className="group glass-card rounded-3xl p-8 flex flex-col items-start gap-6 relative overflow-hidden"
                  >
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-teal-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-colors duration-500"></div>
                    
                    <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center text-teal-300 shadow-inner">
                      <Icon size={28} />
                    </div>
                    <div className="space-y-3 z-10">
                      <h3 className="text-2xl font-display font-bold uppercase">{service.name}</h3>
                      <p className="text-zinc-400 text-sm leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                    
                    <div className="mt-auto pt-6 z-10 w-full flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                       <ArrowRight className="text-teal-400 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Featured Performance */}
      <section className="py-32 relative z-10 border-y border-white/5 bg-zinc-950/50 backdrop-blur-3xl">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-video rounded-3xl overflow-hidden group cursor-pointer glass-border shadow-2xl order-2 lg:order-1"
            >
              <img 
                src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1200" 
                alt="Live Performance" 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/40 to-transparent mix-blend-overlay"></div>
              <div className="absolute inset-0 bg-zinc-950/20 flex items-center justify-center group-hover:bg-zinc-950/10 transition-all">
                <div className="w-24 h-24 glass rounded-full flex items-center justify-center text-white scale-100 group-hover:scale-110 shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all duration-300">
                  <Play fill="currentColor" size={40} className="ml-2 text-teal-400" />
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8 order-1 lg:order-2"
            >
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-purple-400">Featured</span>
              <h2 className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tight leading-none">
                Experience the <br /> <span className="text-gradient">Magic Live</span>
              </h2>
              <p className="text-zinc-400 text-lg font-light leading-relaxed glass-panel p-6 rounded-2xl">
                Watch our latest live performance at the Nairobi Jazz Festival. We bring a blend of soul, jazz, and contemporary harmonies that resonate with every audience.
              </p>
              <div className="flex items-center gap-12 pt-4">
                <div className="space-y-1">
                  <div className="text-4xl font-display font-bold text-white drop-shadow-md">500+</div>
                  <div className="text-xs uppercase tracking-widest text-teal-400">Events Performed</div>
                </div>
                <div className="space-y-1">
                  <div className="text-4xl font-display font-bold text-white drop-shadow-md">10+</div>
                  <div className="text-xs uppercase tracking-widest text-purple-400">Years Experience</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 relative z-10">
        <div className="container mx-auto px-4 text-center space-y-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-400">Testimonials</span>
            <h2 className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tight">What Clients Say</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.length === 0 && !loading ? (
              <div className="col-span-3 text-center text-zinc-600 py-10 glass-panel rounded-3xl">No testimonials yet.</div>
            ) : (
              testimonials.map((testimonial, index) => (
                <motion.div 
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="p-10 glass-card rounded-3xl space-y-6 text-left relative overflow-hidden group"
                >
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-colors"></div>
                  
                  <div className="flex gap-1 text-teal-400">
                    {[...Array(testimonial.rating || 5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                  </div>
                  <p className="text-zinc-300 italic font-light leading-relaxed text-lg relative z-10">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-4 relative z-10 pt-4 border-t border-white/5">
                    <div className="w-14 h-14 bg-zinc-800 rounded-full overflow-hidden ring-2 ring-white/10 p-0.5">
                      <img 
                        src={testimonial.imageUrl || `https://picsum.photos/seed/${testimonial.clientName}/100/100`} 
                        alt={testimonial.clientName} 
                        className="w-full h-full rounded-full object-cover"
                        referrerPolicy="no-referrer" 
                      />
                    </div>
                    <div>
                      <div className="font-bold text-white">{testimonial.clientName}</div>
                      <div className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">{testimonial.clientRole}</div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-teal-900/20 mix-blend-overlay"></div>
        <div className="container mx-auto px-4 text-center">
          <div className="glass-panel max-w-4xl mx-auto rounded-[3rem] p-16 md:p-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-aurora opacity-20 mix-blend-screen"></div>
            <div className="relative z-10 space-y-10">
              <h2 className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tighter leading-[0.9]">
                Ready to <br /> <span className="text-gradient">Collaborate?</span>
              </h2>
              <p className="text-zinc-300 text-lg md:text-xl max-w-xl mx-auto font-light leading-relaxed">
                Whether it's a live event, a studio session, or a voice-over project, we're ready to bring your vision to life.
              </p>
              <Link to="/contact" className="inline-block mt-8">
                <Button size="lg" className="bg-white text-zinc-950 hover:bg-zinc-200 px-12 h-16 text-lg uppercase tracking-widest font-bold rounded-full shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.5)] transition-all duration-300">
                  Get a Quote
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
