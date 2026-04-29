import AdminVideos from './AdminVideos';
import AdminEvents from './AdminEvents';
import AdminTestimonials from './AdminTestimonials';
import AdminGallery from './AdminGallery';
import AdminServices from './AdminServices';
import AdminBlog from './AdminBlog';
import AdminBookings from './AdminBookings';
import AdminSettings from './AdminSettings';
import React from 'react';
import { Card, CardContent } from '../../components/ui/card';

// AdminSearch is the only one remaining as a placeholder since it's typically a global search overlay,
// not a standalone management page. We'll leave it as a placeholder for now.
const AdminSearch = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold">Search</h1>
      <p className="text-zinc-400 mt-1">Search system content</p>
    </div>
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="p-6 text-center text-zinc-400">
        Search management module coming soon
      </CardContent>
    </Card>
  </div>
);

export {
  AdminVideos,
  AdminEvents,
  AdminTestimonials,
  AdminGallery,
  AdminServices,
  AdminBlog,
  AdminBookings,
  AdminSettings,
  AdminSearch,
};
