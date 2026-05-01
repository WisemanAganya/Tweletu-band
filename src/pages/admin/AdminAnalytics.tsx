import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BarChart3, Users, Music, Video, Calendar, MessageSquare, Eye, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { musicService, videoService, eventService, testimonialService, blogService, bookingService } from '../../lib/supabaseService';

export default function AdminAnalytics() {
  const [stats, setStats] = useState({
    totalMusic: 0,
    totalVideos: 0,
    totalEvents: 0,
    totalTestimonials: 0,
    totalBlogPosts: 0,
    totalBookings: 0,
    publishedBlogPosts: 0,
    approvedTestimonials: 0,
    upcomingEvents: 0,
    pendingBookings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [
        music,
        videos,
        events,
        testimonials,
        blogPosts,
        bookings
      ] = await Promise.all([
        musicService.getAll(),
        videoService.getAll(),
        eventService.getAll(),
        testimonialService.getAll(),
        blogService.getAll(),
        bookingService.getAll(),
      ]);

      const now = new Date();

      setStats({
        totalMusic: music.length,
        totalVideos: videos.length,
        totalEvents: events.length,
        totalTestimonials: testimonials.length,
        totalBlogPosts: blogPosts.length,
        totalBookings: bookings.length,
        publishedBlogPosts: blogPosts.filter(p => p.status === 'published').length,
        approvedTestimonials: testimonials.filter(t => t.status === 'approved').length,
        upcomingEvents: events.filter(e => !e.is_past && new Date(e.date) > now).length,
        pendingBookings: bookings.filter(b => b.status === 'new').length,
      });
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Music',
      value: stats.totalMusic,
      icon: Music,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Total Videos',
      value: stats.totalVideos,
      icon: Video,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
    },
    {
      title: 'Upcoming Events',
      value: stats.upcomingEvents,
      icon: Calendar,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Approved Testimonials',
      value: stats.approvedTestimonials,
      icon: MessageSquare,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      title: 'Published Posts',
      value: stats.publishedBlogPosts,
      icon: Eye,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Pending Bookings',
      value: stats.pendingBookings,
      icon: Users,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-zinc-700 border-t-zinc-50 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tight">Analytics</h1>
          <p className="text-zinc-600 mt-1">Overview of your content and engagement</p>
        </div>
        <button
          onClick={fetchAnalytics}
          className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-colors"
        >
          Refresh Data
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-600">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content Stats</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Music Tracks</span>
                    <span className="font-semibold">{stats.totalMusic}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Video Content</span>
                    <span className="font-semibold">{stats.totalVideos}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Blog Posts</span>
                    <span className="font-semibold">{stats.totalBlogPosts}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Events</span>
                    <span className="font-semibold">{stats.totalEvents}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Published Content</span>
                    <span className="font-semibold text-green-500">
                      {stats.publishedBlogPosts + stats.approvedTestimonials}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pending Reviews</span>
                    <span className="font-semibold text-yellow-500">
                      {stats.pendingBookings + (stats.totalTestimonials - stats.approvedTestimonials)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active Events</span>
                    <span className="font-semibold text-blue-500">{stats.upcomingEvents}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-zinc-500">
                Detailed content analytics coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-zinc-500">
                Engagement metrics coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}