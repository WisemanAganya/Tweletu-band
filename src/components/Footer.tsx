import { Link } from 'react-router-dom';
import { Music, Play, Music2, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-zinc-950/80 backdrop-blur-xl border-t border-white/5 pt-20 pb-10 relative z-10 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"></div>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gradient-to-tr from-teal-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold group-hover:scale-110 shadow-lg shadow-teal-500/20 transition-all duration-300">
                T
              </div>
              <span className="font-display text-lg font-bold tracking-tight uppercase">
                Tweletu <span className="text-gradient-aurora">Band</span>
              </span>
            </Link>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
              Vocal Duo, Performers, and Voice Artists dedicated to creating unforgettable musical experiences for every occasion.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="p-2 glass hover:bg-white/10 rounded-full text-zinc-400 hover:text-teal-400 transition-all">
                <Music size={18} />
              </a>
              <a href="#" className="p-2 glass hover:bg-white/10 rounded-full text-zinc-400 hover:text-purple-400 transition-all">
                <Play size={18} />
              </a>
              <a href="#" className="p-2 glass hover:bg-white/10 rounded-full text-zinc-400 hover:text-cyan-400 transition-all">
                <Music2 size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold uppercase tracking-widest text-xs text-zinc-500 mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {['Music', 'Gallery', 'Services', 'Events', 'EPK', 'Blog'].map((item) => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase()}`} className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold uppercase tracking-widest text-xs text-zinc-500 mb-6">Services</h4>
            <ul className="space-y-4">
              {['Live Performances', 'Backup Singing', 'Voice-Over', 'Studio Work'].map((item) => (
                <li key={item} className="text-sm text-zinc-400">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold uppercase tracking-widest text-xs text-zinc-500 mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-zinc-400">
                <Mail size={18} className="text-zinc-600 shrink-0" />
                <span>bookings@tweletuband.com</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-zinc-400">
                <Phone size={18} className="text-zinc-600 shrink-0" />
                <span>+254 700 000 000</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-zinc-400">
                <MapPin size={18} className="text-zinc-600 shrink-0" />
                <span>Nairobi, Kenya</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-zinc-500">
            © {new Date().getFullYear()} Tweletu Band. All rights reserved.
          </p>
          <div className="flex items-center gap-8">
            <Link to="/privacy" className="text-xs text-zinc-500 hover:text-zinc-400">Privacy Policy</Link>
            <Link to="/terms" className="text-xs text-zinc-500 hover:text-zinc-400">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
