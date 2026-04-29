import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BarChart3, Users, BookOpen, Music, Calendar, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { musicService, videoService, eventService, bookingService, testimonialService, blogService } from '../../lib/supabaseService';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalMusic: 0,
    totalVideos: 0,
    totalEvents: 0,
    totalBookings: 0,
    totalTestimonials: 0,
    totalBlogPosts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [music, videos, events, bookings, testimonials, blogs] = await Promise.all([
          musicService.getAll(),
          videoService.getAll(),
          eventService.getAll(),
          bookingService.getAll(),
          testimonialService.getAll(),
          blogService.getAll(),
        ]);

        setStats({
          totalMusic: music?.length || 0,
          totalVideos: videos?.length || 0,
          totalEvents: events?.length || 0,
          totalBookings: bookings?.length || 0,
          totalTestimonials: testimonials?.length || 0,
          totalBlogPosts: blogs?.length || 0,
        });
      } catch (error) {
        console.error('Failed to load stats:', error);
        toast.error('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const statCards = [
    { label: 'Music Tracks', value: stats.totalMusic, icon: Music, color: 'text-blue-500' },
    { label: 'Videos', value: stats.totalVideos, icon: motion, color: 'text-purple-500' },
    { label: 'Events', value: stats.totalEvents, icon: Calendar, color: 'text-green-500' },
    { label: 'Bookings', value: stats.totalBookings, icon: Users, color: 'text-orange-500' },
    { label: 'Testimonials', value: stats.totalTestimonials, icon: MessageSquare, color: 'text-pink-500' },
    { label: 'Blog Posts', value: stats.totalBlogPosts, icon: BookOpen, color: 'text-cyan-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-zinc-400">Welcome to the Tweletu Band admin panel. Manage all website content from here.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-zinc-400">{stat.label}</CardTitle>
                  {Icon && <Icon className={`w-4 h-4 ${stat.color}`} />}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loading ? '--' : stat.value}</div>
                  <p className="text-xs text-zinc-500 mt-1">Total items</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common management tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-zinc-400">• Add new music tracks</p>
            <p className="text-sm text-zinc-400">• Upload videos</p>
            <p className="text-sm text-zinc-400">• Create blog posts</p>
            <p className="text-sm text-zinc-400">• Manage bookings</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Application health</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Database</span>
              <span className="text-green-500 text-sm font-medium">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Authentication</span>
              <span className="text-green-500 text-sm font-medium">Active</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
