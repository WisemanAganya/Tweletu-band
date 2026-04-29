# Tweletu Band - Production Deployment Guide

## Overview
This document provides comprehensive instructions for deploying the Tweletu Band website to production with Supabase as the primary database solution.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Supabase Setup](#supabase-setup)
3. [Database Configuration](#database-configuration)
4. [Environment Variables](#environment-variables)
5. [Authentication Setup](#authentication-setup)
6. [Deployment Options](#deployment-options)
7. [Security Checklist](#security-checklist)
8. [Performance Optimization](#performance-optimization)
9. [Monitoring and Maintenance](#monitoring-and-maintenance)

## Prerequisites

### Required Services
- **Supabase Account** (Free or Pro): https://supabase.com
- **Node.js 18+**: For building and development
- **Git**: For version control
- **Domain Name**: For production deployment

### Required Tools
- Supabase CLI (for database management)
- npm or yarn (for package management)

## Supabase Setup

### 1. Create Supabase Project
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Fill in project details:
   - Project name: "Tweletu Band"
   - Database password: (secure password)
   - Region: Choose closest to your users
4. Wait for project initialization (~3 minutes)

### 2. Get Project Credentials
1. Go to Project Settings → API
2. Copy:
   - Project URL → `VITE_SUPABASE_URL`
   - Anon Key → `VITE_SUPABASE_ANON_KEY`
3. Store these securely

### 3. Enable Required Extensions
In Supabase SQL Editor, run:
```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

## Database Configuration

### 1. Run Database Migrations
1. Copy the SQL migration file from `database/migrations/001_initial_schema.sql`
2. Go to Supabase Dashboard → SQL Editor
3. Create new query and paste the entire migration SQL
4. Execute the migration

### 2. Verify Tables
After migration, verify all tables were created:
- users
- music
- videos
- events
- bookings
- testimonials
- gallery
- blog_posts
- services
- page_settings
- audit_logs

### 3. Configure Row Level Security
All tables should have RLS enabled with appropriate policies. Verify in Table Editor for each table.

## Environment Variables

### Create `.env` File
```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Application Configuration
VITE_APP_ENV=production
VITE_APP_NAME=Tweletu Band
VITE_APP_URL=https://yourdomain.com

# Admin Email
VITE_ADMIN_EMAIL=admin@yourdomain.com

# Optional: Gemini API
VITE_GEMINI_API_KEY=your_gemini_key_here
```

### Production Environment Variables
Set these in your hosting platform (Vercel, Netlify, etc.):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_APP_URL`
- `VITE_APP_ENV=production`

## Authentication Setup

### 1. Configure OAuth Providers (Optional)

#### Google OAuth
1. Go to Supabase Dashboard → Authentication → Providers
2. Enable Google
3. Add OAuth credentials from Google Cloud Console
4. Authorized redirect URIs: `https://yourdomain.com/auth/callback`

#### GitHub OAuth
1. Go to Supabase Dashboard → Authentication → Providers
2. Enable GitHub
3. Add OAuth credentials from GitHub
4. Authorized redirect URIs: `https://yourdomain.com/auth/callback`

### 2. Configure Email Templates
In Supabase Dashboard → Authentication → Email Templates, customize:
- Confirm Signup Email
- Magic Link Email
- Change Email Email
- Reset Password Email

### 3. Set Admin Users
Initially, admin users are set via the email check in `lib/SupabaseProvider.tsx`. 

To add admin users:
1. User logs in
2. Add them to `users` table via Supabase Dashboard
3. Set their `role` to 'admin'

Or update the code to use a roles management page.

## Deployment Options

### Option 1: Vercel (Recommended)
1. Push code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import project from GitHub
4. Add environment variables in Settings → Environment Variables
5. Deploy

```bash
# Build command
npm run build

# Output directory
dist
```

### Option 2: Netlify
1. Connect GitHub repository
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Add environment variables in Site Settings → Build & Deploy
4. Deploy

### Option 3: Docker (Self-Hosted)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

```bash
docker build -t tweletu-band .
docker run -p 3000:3000 -e VITE_SUPABASE_URL=... tweletu-band
```

## Security Checklist

### Database Security
- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Policies restrict unauthorized access
- ✅ Regular backups configured in Supabase
- ✅ SQL injection prevention via parameterized queries

### Application Security
- ✅ Environment variables not committed to Git
- ✅ HTTPS enforced on production
- ✅ CORS properly configured
- ✅ Input validation on all forms (Zod schemas)
- ✅ Authentication required for admin panel
- ✅ Role-based access control implemented

### Production Hardening
```bash
# Remove sensitive files
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
echo "dist/" >> .gitignore
echo "node_modules/" >> .gitignore
```

### Content Security Policy
Add to your server configuration or HTML header:
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' https:;
  connect-src 'self' https://*.supabase.co;
">
```

## Performance Optimization

### 1. Image Optimization
- Use Supabase Storage for images
- Implement image resizing/compression
- Use WebP format when possible
- Lazy load images

### 2. Database Optimization
```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_blog_published_status ON blog_posts(status, published_at);
CREATE INDEX idx_testimonials_approved ON testimonials(status) WHERE status = 'approved';
CREATE INDEX idx_events_upcoming ON events(is_past, date);
```

### 3. Caching Strategy
- Enable browser caching in CDN
- Use HTTP cache headers
- Implement service worker for offline support
- Cache Supabase query results in state

### 4. Code Splitting
The Vite build already handles code splitting. Monitor bundle size:
```bash
npm run build
# Check dist/ folder size
```

### 5. CDN Configuration
Vercel/Netlify automatically uses CDN. For self-hosted:
- Configure CloudFlare for DNS and caching
- Enable HTTP/2
- Enable Brotli compression

## Monitoring and Maintenance

### 1. Error Tracking
Add error tracking service (optional):
```typescript
// Example: Sentry integration
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: "production"
});
```

### 2. Analytics
Implement analytics to track:
- User engagement
- Page performance
- Booking conversion
- Content popularity

```typescript
// Example: Google Analytics
import { Analytics } from '@vercel/analytics/react';
```

### 3. Database Backups
- Supabase automatically backs up daily
- Export backups weekly via Supabase CLI:
```bash
supabase db pull > backup-$(date +%Y%m%d).sql
```

### 4. Monitoring Queries
```sql
-- Monitor database size
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Monitor slow queries
SELECT
  mean_exec_time,
  calls,
  query
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

### 5. Regular Maintenance Tasks

**Weekly:**
- Check admin dashboard for new bookings
- Monitor error logs
- Verify all pages load correctly

**Monthly:**
- Review analytics data
- Update content as needed
- Check for Supabase usage warnings
- Review security audit logs

**Quarterly:**
- Update dependencies: `npm update`
- Review and optimize database queries
- Backup configuration and settings

## Troubleshooting

### Common Issues

**Issue: "VITE_SUPABASE_URL is missing"**
- Solution: Check `.env` file exists and has correct variables
- Ensure variables are prefixed with `VITE_` for client-side access

**Issue: Database connection error**
- Solution: Verify Supabase URL and anon key in environment variables
- Check network connectivity to Supabase
- Ensure IP is not blocked (if using firewall)

**Issue: Authentication failing**
- Solution: Clear browser cookies/cache
- Verify email provider configuration
- Check user exists in `users` table

**Issue: Slow page loads**
- Solution: Check database query performance
- Enable caching
- Optimize images
- Check CDN configuration

## Support and Resources

- **Supabase Documentation**: https://supabase.com/docs
- **Vite Documentation**: https://vitejs.dev
- **React Documentation**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com/docs

## Next Steps

1. ✅ Set up Supabase project
2. ✅ Run database migrations
3. ✅ Configure environment variables
4. ✅ Test authentication locally
5. ✅ Deploy to production
6. ✅ Monitor and maintain

---

**Last Updated**: April 18, 2026
**Version**: 1.0
