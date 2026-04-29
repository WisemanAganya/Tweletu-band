import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Music, Calendar, Image, Briefcase, Mail, User, LayoutDashboard } from 'lucide-react';
import { Button } from './ui/button';
import { useSupabase } from '../lib/SupabaseProvider';
import { cn } from '../lib/utils';

const navLinks = [
  { name: 'Home', path: '/', icon: Music },
  { name: 'Music', path: '/music', icon: Music },
  { name: 'Gallery', path: '/gallery', icon: Image },
  { name: 'Services', path: '/services', icon: Briefcase },
  { name: 'Events', path: '/events', icon: Calendar },
  { name: 'EPK', path: '/epk', icon: User },
  { name: 'Blog', path: '/blog', icon: LayoutDashboard },
  { name: 'Contact', path: '/contact', icon: Mail },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isAdmin } = useSupabase();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b',
        scrolled 
          ? 'glass py-3 border-white/10' 
          : 'bg-transparent border-transparent py-5'
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-tr from-teal-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 shadow-lg shadow-teal-500/20 transition-all duration-300">
            T
          </div>
          <span className="font-display text-xl font-bold tracking-tight uppercase">
            Tweletu <span className="text-gradient-aurora">Band</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'relative text-sm font-medium tracking-wide uppercase transition-colors hover:text-teal-400 py-1 group',
                location.pathname === link.path ? 'text-teal-400' : 'text-zinc-300'
              )}
            >
              {link.name}
              <span className={cn(
                "absolute left-0 bottom-0 w-full h-[2px] bg-gradient-to-r from-teal-400 to-purple-500 transition-all duration-300",
                location.pathname === link.path ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
              )}></span>
            </Link>
          ))}
          {isAdmin && (
            <Link to="/admin">
              <Button variant="outline" size="sm" className="glass border-white/20 hover:bg-white/10 text-white">
                Dashboard
              </Button>
            </Link>
          )}
          <Link to="/contact">
            <Button size="sm" className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white shadow-[0_0_15px_rgba(45,212,191,0.2)] hover:shadow-[0_0_25px_rgba(45,212,191,0.4)] rounded-full px-6 transition-all duration-300">
              Book Now
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden text-zinc-50 p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-full left-0 right-0 glass-panel border-b border-white/10 p-6 space-y-4"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'flex items-center gap-3 text-lg font-medium uppercase tracking-wider transition-colors hover:text-teal-400',
                  location.pathname === link.path ? 'text-teal-400' : 'text-zinc-300'
                )}
              >
                <link.icon size={20} />
                {link.name}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-3 text-lg font-medium uppercase tracking-wider text-zinc-300 hover:text-teal-400 transition-colors"
              >
                <LayoutDashboard size={20} />
                Dashboard
              </Link>
            )}
            <div className="pt-4">
              <Link to="/contact">
                <Button className="w-full bg-gradient-to-r from-teal-400 to-purple-500 text-white border-0 shadow-[0_0_20px_rgba(45,212,191,0.3)] rounded-full hover:opacity-90">Book Now</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
