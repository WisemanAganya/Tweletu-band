import { useState, useEffect } from 'react';
import { videoService } from '../lib/supabaseService';
import { motion, AnimatePresence } from 'motion/react';
import { Play, X, Image as ImageIcon, Video as VideoIcon } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';

export default function Gallery() {
  const [videos, setVideos] = useState<any[]>([]);
  const [filter, setFilter] = useState('All');
  const [selectedVideo, setSelectedVideo] = useState<any>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await videoService.getAll();
        setVideos(data);
      } catch (error) {
        console.error('Failed to fetch videos:', error);
      }
    };
    fetchVideos();
  }, []);

  const filteredVideos = filter === 'All' ? videos : videos.filter(v => v.category === filter);

  return (
    <div className="pt-32 pb-32 min-h-screen relative bg-aurora overflow-hidden">
      <div className="aurora-overlay"></div>
      <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-teal-400">Visual Journey</span>
            <h1 className="text-6xl md:text-8xl font-display font-bold uppercase tracking-tighter leading-none text-white">
              Performance <br /> <span className="text-gradient">Gallery</span>
            </h1>
          </div>
          
          <Tabs defaultValue="All" onValueChange={setFilter} className="w-full md:w-auto z-10 relative">
            <TabsList className="glass-panel border-white/10 p-1 h-auto rounded-full">
              {['All', 'Live', 'Studio', 'Promo'].map((cat) => (
                <TabsTrigger 
                  key={cat} 
                  value={cat}
                  className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-zinc-400 uppercase tracking-widest text-[10px] font-bold py-2 px-6 rounded-full transition-all"
                >
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVideos.length === 0 ? (
            <div className="col-span-full text-center py-20 text-zinc-600 italic">
              No media found in this category.
            </div>
          ) : (
            filteredVideos.map((video, index) => (
              <motion.div
                key={video.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="group relative aspect-video rounded-3xl overflow-hidden glass-card cursor-pointer"
                onClick={() => setSelectedVideo(video)}
              >
                <img 
                  src={video.thumbnailUrl || `https://images.unsplash.com/photo-1514525253361-bee8718a7439?auto=format&fit=crop&q=80&w=800`} 
                  alt={video.title} 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/40 to-transparent mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-zinc-950/40 flex items-center justify-center group-hover:bg-zinc-950/20 transition-all">
                  <div className="w-16 h-16 glass rounded-full flex items-center justify-center text-white scale-90 group-hover:scale-100 shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all duration-300">
                    <Play fill="currentColor" size={24} className="ml-1 text-teal-400" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent">
                  <div className="text-[10px] uppercase tracking-widest text-teal-400 mb-1">{video.category}</div>
                  <h3 className="text-lg font-bold uppercase tracking-tight text-white">{video.title}</h3>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Video Modal */}
        <AnimatePresence>
          {selectedVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/95 p-4 md:p-10"
            >
              <button 
                onClick={() => setSelectedVideo(null)}
                className="absolute top-10 right-10 text-zinc-500 hover:text-zinc-50 transition-colors"
              >
                <X size={40} />
              </button>
              <div className="w-full max-w-6xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl">
                <iframe 
                  src={selectedVideo.videoUrl.replace('watch?v=', 'embed/')} 
                  className="w-full h-full"
                  title={selectedVideo.title}
                  allowFullScreen
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
