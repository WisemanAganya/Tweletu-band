import { useState, useEffect } from 'react';
import { serviceService } from '../lib/supabaseService';
import { motion } from 'motion/react';
import { Music, Mic2, Play, Mic, Star, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

const iconMap: any = {
  Music: Music,
  Mic2: Mic2,
  Mic: Mic,
  Play: Play
};

export default function Services() {
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await serviceService.getAll();
        setServices(data);
      } catch (error) {
        console.error('Failed to fetch services:', error);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="pt-32 pb-32 min-h-screen relative bg-aurora overflow-hidden">
      <div className="aurora-overlay"></div>
      <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl space-y-8 mb-24 relative z-10">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-teal-400">Our Expertise</span>
          <h1 className="text-6xl md:text-8xl font-display font-bold uppercase tracking-tighter leading-none text-white">
            Professional <br /> <span className="text-gradient">Vocal Services</span>
          </h1>
          <p className="text-zinc-300 text-xl font-light leading-relaxed glass-panel p-6 rounded-2xl inline-block">
            From the stage to the studio, we provide high-end vocal solutions tailored to your specific needs.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12">
          {services.length === 0 ? (
            <div className="text-center py-20 text-zinc-600 italic">
              Loading services...
            </div>
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
                  className="group grid grid-cols-1 lg:grid-cols-12 gap-12 items-center p-8 md:p-12 glass-card rounded-[40px] relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-teal-500/5 via-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="lg:col-span-1 flex justify-center relative z-10">
                    <div className="w-20 h-20 glass rounded-3xl flex items-center justify-center text-teal-400 rotate-3 group-hover:rotate-0 group-hover:scale-110 shadow-inner transition-all duration-300">
                      <Icon size={40} />
                    </div>
                  </div>
                  <div className="lg:col-span-7 space-y-4 relative z-10">
                    <div className="flex items-center gap-4">
                      <h2 className="text-3xl font-display font-bold uppercase text-white">{service.name}</h2>
                      {service.startingPrice && (
                        <span className="text-xs font-bold uppercase tracking-widest text-zinc-300 glass px-3 py-1 rounded-full">
                          From {service.startingPrice}
                        </span>
                      )}
                    </div>
                    <p className="text-zinc-400 text-lg font-light leading-relaxed">
                      {service.description}
                    </p>
                    <div className="flex flex-wrap gap-4 pt-4">
                      {['Professional Audio', 'Custom Arrangements', 'Fast Turnaround'].map((tag) => (
                        <div key={tag} className="flex items-center gap-2 text-xs text-zinc-500 font-medium uppercase tracking-widest">
                          <CheckCircle2 size={14} className="text-zinc-700" /> {tag}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="lg:col-span-4 flex justify-end relative z-10">
                    <Link to="/contact">
                      <Button size="lg" className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white shadow-[0_0_15px_rgba(45,212,191,0.2)] hover:shadow-[0_0_25px_rgba(45,212,191,0.4)] px-8 h-14 uppercase tracking-widest font-bold rounded-2xl w-full lg:w-auto transition-all duration-300">
                        Request Quote <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* FAQ/Process Section */}
        <div className="mt-40 grid grid-cols-1 lg:grid-cols-2 gap-20 relative z-10">
          <div className="space-y-8">
            <h2 className="text-4xl font-display font-bold uppercase tracking-tight text-white">Why Choose Us?</h2>
            <div className="space-y-12">
              {[
                { title: 'Vocal Excellence', desc: 'Over a decade of experience in live performance and studio recording.' },
                { title: 'Versatile Style', desc: 'From Jazz and Soul to Contemporary Pop and Gospel.' },
                { title: 'Professional Gear', desc: 'We use industry-standard equipment for all our studio and voice-over work.' }
              ].map((item) => (
                <div key={item.title} className="flex gap-6 group">
                  <div className="w-12 h-12 glass rounded-full flex items-center justify-center text-teal-400 shrink-0 shadow-inner group-hover:scale-110 group-hover:text-purple-400 transition-all duration-300">
                    <Star size={20} fill="currentColor" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold uppercase tracking-tight">{item.title}</h3>
                    <p className="text-zinc-400 font-light leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-panel rounded-[40px] p-12 space-y-8 relative overflow-hidden">
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px]"></div>
            <h2 className="text-3xl font-display font-bold uppercase tracking-tight text-white relative z-10">Our Process</h2>
            <div className="space-y-8 relative z-10">
              {[
                { step: '01', title: 'Consultation', desc: 'We discuss your vision, event details, or project requirements.' },
                { step: '02', title: 'Proposal', desc: 'We provide a tailored quote and timeline for your approval.' },
                { step: '03', title: 'Execution', desc: 'We deliver a high-quality performance or recording.' }
              ].map((item) => (
                <div key={item.step} className="flex gap-8 relative group">
                  <div className="text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-teal-400/50 to-purple-500/50 group-hover:from-teal-400 group-hover:to-purple-500 transition-all duration-500">{item.step}</div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold uppercase tracking-tight text-white">{item.title}</h3>
                    <p className="text-zinc-400 font-light leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
