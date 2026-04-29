import { motion } from 'motion/react';
import { Download, Music, Video, FileText, Mail, Phone, Globe, Music2, Play } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';

export default function EPK() {
  return (
    <div className="pt-32 pb-32 min-h-screen relative bg-aurora overflow-hidden">
      <div className="aurora-overlay"></div>
      <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-24 relative z-10">
          <div className="space-y-6 text-center lg:text-left">
            <Badge variant="outline" className="glass text-teal-400 uppercase tracking-widest px-4 py-1 border-white/10 shadow-[0_0_10px_rgba(45,212,191,0.2)]">
              Electronic Press Kit
            </Badge>
            <h1 className="text-6xl md:text-8xl font-display font-bold uppercase tracking-tighter leading-none text-white">
              Tweletu <br /> <span className="text-gradient">Band</span>
            </h1>
            <p className="text-zinc-300 text-xl font-light leading-relaxed max-w-xl glass-panel p-6 rounded-2xl">
              A professional vocal duo bringing soul, harmony, and elegance to every stage.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-gradient-to-r from-teal-400 to-purple-500 text-white border-0 shadow-[0_0_15px_rgba(45,212,191,0.3)] hover:shadow-[0_0_25px_rgba(45,212,191,0.5)] uppercase tracking-widest font-bold h-14 px-8 rounded-2xl transition-all duration-300">
              <Download size={18} className="mr-2" /> Download EPK
            </Button>
            <Button size="lg" variant="outline" className="glass border-white/20 hover:bg-white/10 text-white uppercase tracking-widest font-bold h-14 px-8 rounded-2xl transition-all duration-300">
              <Mail size={18} className="mr-2" /> Contact Management
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          {/* Left: Content */}
          <div className="lg:col-span-8 space-y-20 relative z-10">
            {/* Bio */}
            <section className="space-y-8 glass-card p-10 rounded-[40px]">
              <h2 className="text-3xl font-display font-bold uppercase tracking-tight border-b border-white/10 pb-4 text-white">The Story</h2>
              <div className="space-y-6 text-zinc-300 font-light leading-relaxed text-lg">
                <p>
                  Tweletu Band is a dynamic vocal duo based in Nairobi, Kenya, known for their seamless harmonies and versatile performance style. With over a decade of experience in the music industry, they have established themselves as one of the most sought-after vocal acts for high-end events and studio productions.
                </p>
                <p>
                  Their journey began in the local jazz scene, where they quickly gained recognition for their unique ability to blend contemporary pop, soul, and traditional African influences. Today, they perform at prestigious festivals, corporate galas, and intimate weddings across East Africa and beyond.
                </p>
                <p>
                  Beyond live performance, Tweletu Band is a powerhouse in the studio, providing professional backup vocals for leading artists and high-quality voice-over services for global brands.
                </p>
              </div>
            </section>

            {/* Notable Clients */}
            <section className="space-y-8 glass-card p-10 rounded-[40px]">
              <h2 className="text-3xl font-display font-bold uppercase tracking-tight border-b border-white/10 pb-4 text-white">Notable Clients</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {['Safaricom', 'KCB Bank', 'Nairobi Jazz Fest', 'Blankets & Wine', 'Coca-Cola', 'UNICEF', 'Serena Hotels', 'Kenya Airways'].map((client) => (
                  <div key={client} className="h-20 glass rounded-2xl flex items-center justify-center text-zinc-300 font-bold uppercase tracking-widest text-[10px] text-center px-4 hover:text-white hover:border-teal-500/30 transition-all duration-300">
                    {client}
                  </div>
                ))}
              </div>
            </section>

            {/* Performance Highlights */}
            <section className="space-y-8 glass-card p-10 rounded-[40px]">
              <h2 className="text-3xl font-display font-bold uppercase tracking-tight border-b border-white/10 pb-4 text-white">Performance Highlights</h2>
              <div className="space-y-6">
                {[
                  { year: '2023', event: 'Nairobi International Jazz Festival', role: 'Main Stage Performers' },
                  { year: '2022', event: 'Presidential Inauguration Gala', role: 'Featured Vocal Duo' },
                  { year: '2021', event: 'East African Music Awards', role: 'Opening Act' }
                ].map((item) => (
                  <div key={item.event} className="flex gap-8 items-center p-4 rounded-2xl hover:bg-white/5 transition-colors">
                    <div className="text-2xl font-display font-bold text-teal-500/80">{item.year}</div>
                    <div>
                      <div className="font-bold uppercase tracking-tight text-white">{item.event}</div>
                      <div className="text-sm text-zinc-400">{item.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right: Assets & Contact */}
          <div className="lg:col-span-4 space-y-12 relative z-10">
            <div className="glass-panel rounded-[40px] p-10 space-y-10">
              <div className="space-y-6">
                <h3 className="text-xl font-bold uppercase tracking-tight text-white">Press Assets</h3>
                <div className="space-y-4">
                  <Button variant="ghost" className="w-full justify-between text-zinc-300 hover:text-white hover:bg-white/10 h-14 glass border border-white/10 rounded-2xl px-6 transition-all">
                    <span className="flex items-center gap-3"><Music size={20} className="text-teal-400" /> High-Res Photos</span>
                    <Download size={18} />
                  </Button>
                  <Button variant="ghost" className="w-full justify-between text-zinc-300 hover:text-white hover:bg-white/10 h-14 glass border border-white/10 rounded-2xl px-6 transition-all">
                    <span className="flex items-center gap-3"><Music size={20} className="text-purple-400" /> Audio Samples</span>
                    <Download size={18} />
                  </Button>
                  <Button variant="ghost" className="w-full justify-between text-zinc-300 hover:text-white hover:bg-white/10 h-14 glass border border-white/10 rounded-2xl px-6 transition-all">
                    <span className="flex items-center gap-3"><Video size={20} className="text-cyan-400" /> Promo Videos</span>
                    <Download size={18} />
                  </Button>
                  <Button variant="ghost" className="w-full justify-between text-zinc-300 hover:text-white hover:bg-white/10 h-14 glass border border-white/10 rounded-2xl px-6 transition-all">
                    <span className="flex items-center gap-3"><FileText size={20} className="text-yellow-400" /> Technical Rider</span>
                    <Download size={18} />
                  </Button>
                </div>
              </div>

              <Separator className="bg-white/10" />

              <div className="space-y-6">
                <h3 className="text-xl font-bold uppercase tracking-tight text-white">Contact Info</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-zinc-300">
                    <div className="w-10 h-10 rounded-full glass flex items-center justify-center">
                      <Mail size={16} className="text-teal-400" />
                    </div>
                    <span className="text-sm">press@tweletuband.com</span>
                  </div>
                  <div className="flex items-center gap-4 text-zinc-300">
                    <div className="w-10 h-10 rounded-full glass flex items-center justify-center">
                      <Phone size={16} className="text-teal-400" />
                    </div>
                    <span className="text-sm">+254 700 000 000</span>
                  </div>
                  <div className="flex items-center gap-4 text-zinc-300">
                    <div className="w-10 h-10 rounded-full glass flex items-center justify-center">
                      <Globe size={16} className="text-teal-400" />
                    </div>
                    <span className="text-sm">www.tweletuband.com</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <a href="#" className="w-12 h-12 glass rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:scale-110 transition-all">
                  <Music2 size={20} />
                </a>
                <a href="#" className="w-12 h-12 glass rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:scale-110 transition-all">
                  <Play size={20} />
                </a>
              </div>
            </div>

            <div className="aspect-[3/4] rounded-[40px] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
              <img 
                src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800" 
                alt="Band Portrait" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
