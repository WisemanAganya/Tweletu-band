<div align="center">
<h1>🎵 Tweletu Band - Modern Artist Website</h1>
<p><strong>A production-ready, full-featured artist website with comprehensive admin dashboard</strong></p>

[![Status](https://img.shields.io/badge/status-production%20ready-brightgreen)](https://github.com)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org)
[![React](https://img.shields.io/badge/react-19-blue)](https://react.dev)
</div>

## 📋 Overview

Tweletu Band is a modern, production-ready website for musicians and artists. It features:

✨ **Modern Design** - Sleek, dark-themed UI with smooth animations  
🎯 **Comprehensive Admin Dashboard** - Manage all content from a professional interface  
🔐 **Secure Authentication** - Supabase auth with role-based access control  
📱 **Fully Responsive** - Works perfectly on all devices  
⚡ **High Performance** - Optimized for speed and search engines  
🛡️ **Production-Ready** - Enterprise-grade security and best practices  

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager
- Supabase account (https://supabase.com)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tweletu-band
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   VITE_GEMINI_API_KEY=your_gemini_key_here
   VITE_APP_URL=http://localhost:3000
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## 📦 What's Included

### Frontend Pages
- **Home** - Hero section with featured services and testimonials
- **Music** - Interactive music player with track library
- **Gallery** - Photo gallery with categories
- **Services** - Service offerings and pricing
- **EPK** - Electronic Press Kit for bookings
- **Events** - Upcoming performances and events
- **Blog** - Articles and news
- **Contact** - Contact form and booking inquiries

### Admin Dashboard
Complete content management system with:
- 📊 Dashboard with statistics
- 🎵 Music library management
- 🎬 Video content management
- 📅 Events scheduling
- 💬 Testimonial moderation
- 🖼️ Gallery management
- 📝 Blog post editor
- 💼 Service management
- 📋 Booking management
- 👥 User management
- ⚙️ Settings configuration

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern UI framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality components
- **React Router** - Client-side routing
- **React Hook Form** - Efficient forms
- **Zod** - Runtime validation
- **Motion** - Smooth animations

### Backend
- **Supabase** - PostgreSQL + Auth + Storage
- **Node.js** - Runtime environment

### DevOps
- **Vite** - Fast build tool
- **Docker** - Containerization
- **Vercel/Netlify** - Deployment

## 📚 Documentation

- **[PRODUCTION_DEPLOYMENT_GUIDE.md](PRODUCTION_DEPLOYMENT_GUIDE.md)** - Complete deployment instructions
- **[FEATURES_IMPLEMENTATION.md](FEATURES_IMPLEMENTATION.md)** - Feature checklist and status
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Technical architecture details

## 🔐 Authentication

### Supported Methods
- Email & Password
- Google OAuth
- GitHub OAuth

### User Roles
- **Admin** - Full access to all features
- **Editor** - Content creation and management
- **Viewer** - Read-only access

## 📊 Admin Dashboard

Access the admin panel at `/admin`

**Admin Authentication:**
```bash
# Sign in with admin credentials
# Default admin email: aganyateddy57@gmail.com (update as needed)
```

**Features:**
- Real-time statistics
- CRUD operations for all content
- Search and filtering
- Bulk operations
- Audit logs
- User management

## 🗄️ Database

### Tables
- `users` - User accounts and roles
- `music` - Music tracks and recordings
- `videos` - Video content
- `testimonials` - Client testimonials
- `events` - Events and performances
- `bookings` - Booking inquiries
- `gallery` - Photo galleries
- `blog_posts` - Blog articles
- `services` - Service offerings
- `page_settings` - CMS configuration
- `audit_logs` - Activity logs

### Migrations
Database migrations are provided in `database/migrations/001_initial_schema.sql`

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify
```bash
# Connect GitHub repo to Netlify
# Configure build settings:
# - Build command: npm run build
# - Publish directory: dist
```

### Docker
```bash
docker build -t tweletu-band .
docker run -p 3000:3000 tweletu-band
```

## 📝 Environment Variables

```bash
# Supabase
VITE_SUPABASE_URL=          # Your Supabase project URL
VITE_SUPABASE_ANON_KEY=     # Supabase anonymous key

# Application
VITE_APP_ENV=production     # Environment: development, production
VITE_APP_NAME=Tweletu Band  # Application name
VITE_APP_URL=https://...    # Your domain URL

# Optional
VITE_GEMINI_API_KEY=        # Google Gemini API key
VITE_ADMIN_EMAIL=           # Admin email for notifications
```

## 🔒 Security

### Implemented
- ✅ Row Level Security (RLS) on all database tables
- ✅ JWT-based authentication
- ✅ HTTPS encryption (in production)
- ✅ Input validation with Zod
- ✅ CORS configuration
- ✅ SQL injection prevention
- ✅ XSS protection

### Best Practices
- Never commit `.env` files
- Rotate API keys regularly
- Keep dependencies updated
- Monitor error logs
- Regular security audits

## 📈 Performance

### Optimizations
- Code splitting with Vite
- Image lazy loading
- Database query caching
- CDN integration
- Compression (gzip/brotli)
- Lighthouse score: 85+

### Monitoring
- Error tracking (optional Sentry)
- Analytics (Google Analytics)
- Performance monitoring
- Database metrics

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🆘 Support

For issues and questions:
- Check the [documentation](ARCHITECTURE.md)
- Review [deployment guide](PRODUCTION_DEPLOYMENT_GUIDE.md)
- Check [implementation checklist](FEATURES_IMPLEMENTATION.md)

## 📞 Contact

For inquiries about the Tweletu Band:
- Email: contact@tweletu.band
- Website: https://tweletu.band

## 🎯 Roadmap

### Completed ✅
- Core website structure
- Admin dashboard
- Database setup
- Authentication system
- Music player

### In Progress 🔄
- CMS page editor
- Media upload system
- Email notifications
- Advanced analytics

### Coming Soon 🚀
- AI content generation
- Payment processing
- Mobile app
- Advanced search

---

<div align="center">

**[View Live Site](https://tweletu.band)** • **[Admin Panel](/admin)** • **[Documentation](ARCHITECTURE.md)**

Built with ❤️ using React, TypeScript, and Supabase

</div>

