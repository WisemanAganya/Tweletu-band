import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useSupabase } from '../lib/SupabaseProvider';
import { motion, AnimatePresence } from 'motion/react';
import AdminDashboard from './admin/AdminDashboard';
import AdminAnalytics from './admin/AdminAnalytics';
import AdminMusic from './admin/AdminMusic';
import AdminUsers from './admin/AdminUsers';
import {
  AdminVideos,
  AdminEvents,
  AdminTestimonials,
  AdminGallery,
  AdminServices,
  AdminBlog,
  AdminBookings,
  AdminSettings,
  AdminSearch
} from './admin/AdminModules';
import {
  LayoutDashboard,
  Music,
  Video,
  Users,
  Calendar,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  MessageSquare,
  Image,
  Briefcase,
  BarChart3,
  Search,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { name: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
  { name: 'Search', icon: Search, path: '/admin/search' },
  { name: 'Music', icon: Music, path: '/admin/music' },
  { name: 'Videos', icon: Video, path: '/admin/videos' },
  { name: 'Events', icon: Calendar, path: '/admin/events' },
  { name: 'Testimonials', icon: MessageSquare, path: '/admin/testimonials' },
  { name: 'Gallery', icon: Image, path: '/admin/gallery' },
  { name: 'Services', icon: Briefcase, path: '/admin/services' },
  { name: 'Blog', icon: FileText, path: '/admin/blog' },
  { name: 'Bookings', icon: Users, path: '/admin/bookings' },
  { name: 'Users', icon: Users, path: '/admin/users' },
  { name: 'Settings', icon: Settings, path: '/admin/settings' },
];

export default function Admin() {
  const { user, isAdmin, isLoading, signOut } = useSupabase();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Redirect if not admin
  useEffect(() => {
    if (!isLoading && !isAdmin) {
      toast.error('Access denied. Admin privileges required.');
      navigate('/');
    }
  }, [isLoading, isAdmin, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-zinc-700 border-t-zinc-50 rounded-full mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const currentPage = navItems.find((item) => item.path === location.pathname)?.name || 'Dashboard';

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 pt-20">
      <div className="flex h-full">
        {/* Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="fixed lg:static w-64 h-screen bg-zinc-900 border-r border-zinc-800 overflow-y-auto lg:overflow-visible z-40"
            >
              <div className="p-6 border-b border-zinc-800">
                <h1 className="text-xl font-bold text-zinc-50">Admin Panel</h1>
                <p className="text-sm text-zinc-400 mt-1">Tweletu Band</p>
              </div>

              <nav className="p-4 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-zinc-700 text-zinc-50'
                          : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-zinc-800 w-64 bg-zinc-900">
                <div className="flex items-center justify-between mb-4 p-3 bg-zinc-800 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-zinc-50">{user?.display_name || user?.email}</p>
                    <p className="text-xs text-zinc-400 capitalize">{user?.role}</p>
                  </div>
                </div>
                <Button
                  onClick={handleSignOut}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  size="sm"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <div className="bg-zinc-900 border-b border-zinc-800 p-4 flex items-center justify-between sticky top-20 z-30">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                {isSidebarOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
              <h2 className="text-xl font-semibold text-zinc-50">{currentPage}</h2>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            <Routes>
              <Route index element={<AdminDashboard />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="search" element={<AdminSearch />} />
              <Route path="music" element={<AdminMusic />} />
              <Route path="videos" element={<AdminVideos />} />
              <Route path="events" element={<AdminEvents />} />
              <Route path="testimonials" element={<AdminTestimonials />} />
              <Route path="gallery" element={<AdminGallery />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="blog" element={<AdminBlog />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="settings" element={<AdminSettings />} />
            </Routes>
          </div>
        </div>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-30 top-20"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
