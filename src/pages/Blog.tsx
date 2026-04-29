import { useState, useEffect } from 'react';
import { blogService } from '../lib/supabaseService';
import { motion } from 'motion/react';
import { Calendar, User, ArrowRight, Search } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';

export default function Blog() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await blogService.getAll();
        const published = data.filter(post => post.status === 'published');
        setPosts(published.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
      } catch (error) {
        console.error('Failed to fetch blog posts:', error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="pt-32 pb-32 min-h-screen relative bg-aurora overflow-hidden">
      <div className="aurora-overlay"></div>
      <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-24 relative z-10">
          <div className="max-w-4xl space-y-8">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-teal-400">News & Updates</span>
            <h1 className="text-6xl md:text-8xl font-display font-bold uppercase tracking-tighter leading-none text-white">
              Behind the <br /> <span className="text-gradient">Scenes</span>
            </h1>
            <p className="text-zinc-300 text-xl font-light leading-relaxed glass-panel p-6 rounded-2xl inline-block">
              Stay updated with our latest releases, tour announcements, and industry insights.
            </p>
          </div>
          
          <div className="relative w-full lg:w-96 glass-panel rounded-2xl p-2 flex items-center shadow-[0_0_15px_rgba(45,212,191,0.1)] focus-within:shadow-[0_0_25px_rgba(45,212,191,0.3)] transition-all duration-300">
            <Search className="absolute left-6 text-teal-400" size={20} />
            <Input 
              placeholder="Search articles..." 
              className="bg-transparent border-0 h-12 pl-12 focus-visible:ring-0 text-white placeholder:text-zinc-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 relative z-10">
          {posts.length === 0 ? (
            <div className="col-span-full text-center py-20 text-zinc-500 glass-card rounded-[40px]">
              No blog posts published yet. Stay tuned!
            </div>
          ) : (
            posts.map((post, index) => (
              <motion.article 
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="group space-y-6 cursor-pointer glass-card p-6 rounded-[40px] hover:scale-[1.02] transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(45,212,191,0.2)]"
              >
                <div className="aspect-[16/10] rounded-[32px] overflow-hidden bg-zinc-950 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <img 
                    src={post.featured_image || `https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800`} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="space-y-4 px-2">
                  <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-teal-500/70">
                    <span className="flex items-center gap-1.5"><Calendar size={12} className="text-purple-400" /> {new Date(post.created_at).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1.5"><User size={12} className="text-cyan-400" /> {post.author || 'Tweletu Band'}</span>
                  </div>
                  <h2 className="text-2xl font-display font-bold uppercase tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-teal-400 group-hover:to-purple-500 transition-all duration-300 leading-tight">
                    {post.title}
                  </h2>
                  <p className="text-zinc-400 font-light line-clamp-3 leading-relaxed">
                    {post.excerpt || post.content}
                  </p>
                  <Button variant="ghost" className="p-0 h-auto text-teal-400 hover:bg-transparent hover:text-white uppercase tracking-widest text-xs font-bold group-hover:translate-x-1 transition-all">
                    Read More <ArrowRight size={16} className="ml-2 group-hover:rotate-[-45deg] transition-transform" />
                  </Button>
                </div>
              </motion.article>
            ))
          )}
        </div>

        {/* Newsletter */}
        <div className="mt-40 p-12 md:p-20 glass-panel border border-teal-500/20 rounded-[40px] text-white text-center space-y-10 relative z-10 shadow-[0_0_50px_rgba(45,212,191,0.1)] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-teal-500/5 to-transparent pointer-events-none"></div>
          <div className="space-y-4 relative z-10">
            <h2 className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tight text-gradient">Join the Inner Circle</h2>
            <p className="text-zinc-300 text-lg max-w-xl mx-auto font-light">
              Subscribe to our newsletter for early access to new music, exclusive behind-the-scenes content, and tour updates.
            </p>
          </div>
          <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-4 relative z-10">
            <Input 
              placeholder="Your email address" 
              className="bg-zinc-950/50 border border-white/10 h-14 rounded-2xl text-white backdrop-blur-md focus-visible:ring-teal-500 placeholder:text-zinc-500"
            />
            <Button className="bg-gradient-to-r from-teal-400 to-purple-500 text-white border-0 shadow-[0_0_15px_rgba(45,212,191,0.3)] hover:shadow-[0_0_25px_rgba(45,212,191,0.5)] h-14 px-8 rounded-2xl uppercase tracking-widest font-bold transition-all duration-300">
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
