import React, { useState, useEffect, useRef } from 'react';
import { musicService } from '../lib/supabaseService';
import { motion } from 'motion/react';
import { Play, Pause, Music as MusicIcon, Download, Share2, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';
import { cn } from '../lib/utils';

export default function Music() {
  const [tracks, setTracks] = useState<any[]>([]);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const data = await musicService.getAll();
        setTracks(data);
        if (data.length > 0 && !currentTrack) {
          setCurrentTrack(data[0]);
        }
      } catch (error) {
        console.error('Failed to fetch music:', error);
      }
    };
    fetchTracks();
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const playTrack = (track: any) => {
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      // Audio will play automatically due to useEffect on currentTrack
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      setCurrentTime(current);
      setProgress((current / total) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const seekTime = (parseFloat(e.target.value) / 100) * audioRef.current.duration;
      audioRef.current.currentTime = seekTime;
      setProgress(parseFloat(e.target.value));
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const skip = (direction: 'next' | 'prev') => {
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    let nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    
    if (nextIndex >= tracks.length) nextIndex = 0;
    if (nextIndex < 0) nextIndex = tracks.length - 1;
    
    playTrack(tracks[nextIndex]);
  };

  return (
    <div className="pt-32 pb-32 min-h-screen relative bg-aurora overflow-hidden">
      <div className="aurora-overlay"></div>
      <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"></div>
      <div className="container mx-auto px-4 relative z-10">
        <audio 
          ref={audioRef}
          src={currentTrack?.audio_url}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => skip('next')}
          autoPlay={isPlaying}
        />
        
        <div className="flex flex-col lg:flex-row gap-20">
          {/* Left: Player & Info */}
          <div className="lg:w-1/2 space-y-12">
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-teal-400">Our Sound</span>
              <h1 className="text-6xl md:text-8xl font-display font-bold uppercase tracking-tighter leading-none text-white">
                Music & <br /> <span className="text-gradient">Audio</span>
              </h1>
              <p className="text-zinc-400 text-lg font-light leading-relaxed max-w-md">
                Explore our collection of original tracks, covers, and professional voice-over samples.
              </p>
            </div>

            {currentTrack && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel rounded-[40px] p-8 md:p-12 space-y-10 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-[80px]"></div>
                <div className="aspect-square glass rounded-3xl flex items-center justify-center text-white overflow-hidden relative group shadow-inner">
                  <MusicIcon size={120} strokeWidth={0.5} className={cn("transition-all duration-1000", isPlaying ? "scale-110 text-teal-400" : "scale-100 text-zinc-500")} />
                  <div className="absolute inset-0 bg-zinc-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      onClick={togglePlay}
                      className="w-24 h-24 rounded-full bg-zinc-50 text-zinc-950 hover:bg-zinc-200 shadow-xl"
                    >
                      {isPlaying ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-2" />}
                    </Button>
                  </div>
                  
                  {/* Visualizer bars (decorative) */}
                  {isPlaying && (
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-1 items-end h-12">
                      {[...Array(12)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{ height: [10, 40, 10] }}
                          transition={{ repeat: Infinity, duration: 0.5 + Math.random() * 0.5, delay: i * 0.05 }}
                          className="w-1.5 bg-zinc-50/20 rounded-full"
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-4 text-center">
                  <div className="flex justify-center">
                    <Badge variant="outline" className="border-zinc-800 text-zinc-500 uppercase tracking-widest text-[10px] px-4 py-1">
                      {currentTrack.category}
                    </Badge>
                  </div>
                  <h2 className="text-4xl font-display font-bold uppercase tracking-tight">{currentTrack.title}</h2>
                  <p className="text-zinc-500 text-sm font-light">{currentTrack.description || 'Tweletu Band Original Production'}</p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="relative h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden group">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={progress}
                      onChange={handleSeek}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div 
                      className="absolute top-0 left-0 h-full bg-zinc-50 transition-all duration-100"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-8">
                  <div className="flex items-center justify-center gap-8">
                    <Button variant="ghost" size="icon" onClick={() => skip('prev')} className="text-zinc-500 hover:text-zinc-50">
                      <SkipBack size={24} />
                    </Button>
                    <Button 
                      onClick={togglePlay}
                      className="w-20 h-20 rounded-full bg-zinc-50 text-zinc-950 hover:bg-zinc-200 shadow-xl"
                    >
                      {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => skip('next')} className="text-zinc-500 hover:text-zinc-50">
                      <SkipForward size={24} />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                    <div className="flex items-center gap-4 w-1/3">
                      <button onClick={() => setIsMuted(!isMuted)} className="text-zinc-500 hover:text-zinc-50">
                        {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-20 h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-zinc-50"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-zinc-50 rounded-xl bg-zinc-800/50">
                        <Share2 size={18} />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-zinc-50 rounded-xl bg-zinc-800/50">
                        <Download size={18} />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right: Track List */}
          <div className="lg:w-1/2 relative z-10">
            <div className="glass-panel rounded-[40px] overflow-hidden">
              <div className="p-8 border-b border-white/10 flex items-center justify-between glass">
                <div className="space-y-1">
                  <h3 className="font-bold uppercase tracking-widest text-sm">Tracklist</h3>
                  <p className="text-[10px] text-zinc-600 uppercase tracking-[0.2em]">Selected Works</p>
                </div>
                <span className="text-xs font-mono text-zinc-600 bg-zinc-950 px-3 py-1 rounded-full border border-zinc-800">{tracks.length} Tracks</span>
              </div>
              <ScrollArea className="h-[700px]">
                <div className="p-4 space-y-2">
                  {tracks.length === 0 ? (
                    <div className="p-20 text-center text-zinc-600 italic">
                      No tracks uploaded yet.
                    </div>
                  ) : (
                    tracks.map((track, index) => (
                      <div 
                        key={track.id}
                        onClick={() => playTrack(track)}
                        className={cn(
                          "flex items-center gap-6 p-6 rounded-3xl cursor-pointer transition-all duration-300 group relative overflow-hidden",
                          currentTrack?.id === track.id ? "bg-gradient-to-r from-teal-500/20 to-purple-500/20 border border-white/20 text-white shadow-[0_0_15px_rgba(45,212,191,0.2)]" : "glass hover:bg-white/10 text-zinc-300"
                        )}
                      >
                        <div className={cn(
                          "w-8 text-xs font-mono transition-colors",
                          currentTrack?.id === track.id ? "text-zinc-950/50" : "text-zinc-700 group-hover:text-zinc-500"
                        )}>
                          {(index + 1).toString().padStart(2, '0')}
                        </div>
                        
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                          currentTrack?.id === track.id ? "bg-teal-500 text-white shadow-[0_0_15px_rgba(45,212,191,0.5)]" : "bg-white/5 text-zinc-500 group-hover:text-teal-400 group-hover:bg-white/10"
                        )}>
                          {currentTrack?.id === track.id && isPlaying ? (
                            <div className="flex gap-0.5 items-end h-3">
                              <motion.div animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-current" />
                              <motion.div animate={{ height: [8, 4, 8] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1 bg-current" />
                              <motion.div animate={{ height: [4, 10, 4] }} transition={{ repeat: Infinity, duration: 0.4 }} className="w-1 bg-current" />
                            </div>
                          ) : (
                            <Play size={18} fill="currentColor" className={cn("transition-opacity", currentTrack?.id === track.id ? "opacity-100" : "opacity-0 group-hover:opacity-100")} />
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="font-bold text-base uppercase tracking-tight">
                            {track.title}
                          </div>
                          <div className={cn(
                            "text-[10px] uppercase tracking-widest",
                            currentTrack?.id === track.id ? "text-zinc-950/60" : "text-zinc-600"
                          )}>
                            {track.category}
                          </div>
                        </div>

                        <div className={cn(
                          "text-xs font-mono",
                          currentTrack?.id === track.id ? "text-zinc-950/50" : "text-zinc-700"
                        )}>
                          {track.duration || '3:45'}
                        </div>
                        
                        {currentTrack?.id === track.id && (
                          <motion.div 
                            layoutId="active-track-indicator"
                            className="absolute left-0 w-1 h-8 bg-zinc-950 rounded-full"
                          />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
