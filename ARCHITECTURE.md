# Architecture & Technical Documentation

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend Layer (React)                │
├─────────────────────────────────────────────────────────┤
│  Pages: Home, Music, Gallery, Services, Events, Blog    │
│  Admin Dashboard: Dashboard, Music, Videos, Events...   │
│  Components: UI, Forms, Navigation, Footer              │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│             Application Layer (TypeScript)               │
├─────────────────────────────────────────────────────────┤
│  Services: musicService, videoService, eventService...  │
│  Providers: SupabaseProvider, ErrorBoundary              │
│  Utilities: Authentication, Validation, Helpers          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              API Layer (Supabase Client)                 │
├─────────────────────────────────────────────────────────┤
│  REST API: https://[project].supabase.co/rest/v1/       │
│  Auth API: JWT tokens, OAuth, Email auth                │
│  Real-time: WebSocket subscriptions (optional)           │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Database Layer (Supabase)                   │
├─────────────────────────────────────────────────────────┤
│  PostgreSQL Database with 11 tables                      │
│  Row Level Security (RLS) policies                       │
│  Automatic timestamps and triggers                       │
└─────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **React 19**: Modern UI framework
- **TypeScript**: Type safety and developer experience
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first styling
- **Motion**: Smooth animations
- **shadcn/ui**: High-quality UI components
- **React Hook Form**: Efficient form management
- **Zod**: Runtime type validation
- **React Router**: Client-side routing

### Backend
- **Supabase**: PostgreSQL database + Auth + Storage
- **Node.js**: Runtime environment
- **Express**: Optional backend for advanced features

### DevOps & Deployment
- **Vite**: Build and bundling
- **Docker**: Containerization
- **Git**: Version control
- **Vercel/Netlify**: Deployment platforms

## Project Structure

```
tweletu-band/
├── src/
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Music.tsx
│   │   ├── Gallery.tsx
│   │   ├── Services.tsx
│   │   ├── EPK.tsx
│   │   ├── Events.tsx
│   │   ├── Blog.tsx
│   │   ├── Contact.tsx
│   │   └── Admin.tsx (main admin layout)
│   │       └── admin/
│   │           ├── AdminDashboard.tsx
│   │           ├── AdminMusic.tsx
│   │           ├── AdminModules.tsx
│   │           └── ... (other modules)
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── FileUpload.tsx
│   │   ├── TestimonialForm.tsx
│   │   └── ui/ (shadcn components)
│   ├── lib/
│   │   ├── supabase.ts (Supabase client)
│   │   ├── SupabaseProvider.tsx (Auth provider)
│   │   ├── supabaseService.ts (Service layer)
│   │   ├── utils.ts (Utility functions)
│   │   └── firebase.ts (legacy, can remove)
│   ├── types/
│   │   └── index.ts (TypeScript types)
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── database/
│   └── migrations/
│       └── 001_initial_schema.sql
├── public/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── .env.example
├── .gitignore
├── README.md
├── PRODUCTION_DEPLOYMENT_GUIDE.md
└── FEATURES_IMPLEMENTATION.md
```

## Data Flow

### Authentication Flow
```
User Login
    ↓
Supabase Auth
    ↓
JWT Token Created
    ↓
Token Stored (localStorage)
    ↓
SupabaseProvider Updates Context
    ↓
User Role Checked
    ↓
Access Granted/Denied
```

### Data Fetching Flow
```
Component Mounts
    ↓
Service Method Called (e.g., musicService.getAll())
    ↓
Supabase Client Query
    ↓
RLS Policies Checked
    ↓
Data Returned
    ↓
State Updated
    ↓
Component Re-renders
```

### Create/Update/Delete Flow
```
Form Submission
    ↓
Zod Validation
    ↓
Service Method Called
    ↓
Supabase API Request
    ↓
RLS Policies Enforced
    ↓
Database Operation
    ↓
Audit Log Created (optional)
    ↓
Toast Notification
    ↓
State Updated
    ↓
UI Refreshed
```

## Database Schema Overview

### Tables

1. **users** - Admin users and permissions
   - id (UUID, PK)
   - email (VARCHAR)
   - role (admin, editor, viewer)
   - display_name, avatar_url
   - created_at, updated_at

2. **music** - Music tracks
   - id, title, category
   - audio_url, cover_url
   - description, order
   - Indexes: order, category

3. **videos** - Video content
   - id, title, category
   - video_url, thumbnail_url
   - description, order
   - Indexes: order, category

4. **testimonials** - Client testimonials
   - id, client_name, client_role
   - content, rating, image_url
   - status (pending, approved, rejected)
   - Indexes: status, created_at

5. **events** - Upcoming events
   - id, title, date, location
   - description, ticket_url
   - is_past, image_url
   - Indexes: date, is_past

6. **bookings** - Performance booking inquiries
   - id, name, email, phone
   - event_date, location, budget
   - message, status
   - Indexes: status, created_at

7. **gallery** - Photo gallery
   - id, title, description
   - image_url, category, order
   - Indexes: category, order

8. **blog_posts** - Blog articles
   - id, title, slug
   - content, excerpt
   - featured_image, author_id
   - status, published_at
   - Indexes: slug, status, author_id, published_at

9. **services** - Service offerings
   - id, title, description
   - icon, price, order
   - Indexes: order

10. **page_settings** - CMS page configuration
    - id, page_name (unique)
    - title, meta_description, meta_keywords
    - content (JSONB), published
    - Indexes: page_name

11. **audit_logs** - Activity logging
    - id, user_id, action
    - table_name, record_id
    - changes (JSONB)
    - ip_address, user_agent, created_at
    - Indexes: user_id, table_name, created_at

## API Endpoints (via Supabase REST)

All endpoints use `https://[project].supabase.co/rest/v1/`

### Authentication
- POST `/auth/v1/signup` - Create account
- POST `/auth/v1/token?grant_type=password` - Login
- POST `/auth/v1/logout` - Logout
- POST `/auth/v1/refresh` - Refresh token

### CRUD Operations
- GET `/[table]` - Get all rows
- GET `/[table]?id=eq.[id]` - Get single row
- POST `/[table]` - Create row
- PATCH `/[table]?id=eq.[id]` - Update row
- DELETE `/[table]?id=eq.[id]` - Delete row

### Filtering & Sorting
- GET `/music?order=order.asc` - Sort by order ascending
- GET `/events?is_past=eq.false` - Filter upcoming events
- GET `/blog_posts?status=eq.published` - Get published posts

## Security Model

### Authentication
- JWT tokens issued by Supabase Auth
- Tokens stored in browser localStorage
- Tokens attached to API requests
- Token refresh handled automatically

### Row Level Security (RLS)
- Applied to all tables
- Policies restrict operations based on role
- Public data readable without auth
- Write operations require auth and correct role

### Authorization Levels
1. **Public (Viewer)** - Read-only access
   - View published music, videos, events
   - View approved testimonials
   - View published blog posts
   - Create bookings

2. **Editor** - Content management
   - Create/update/delete music, videos, gallery
   - Create/update blog posts
   - Approve testimonials
   - Manage events

3. **Admin** - Full control
   - All editor permissions
   - User management
   - Settings configuration
   - View audit logs
   - System settings

## Performance Considerations

### Database Performance
- Indexes on frequently filtered columns
- Composite indexes for common queries
- Query caching where appropriate
- Connection pooling via Supabase

### Frontend Performance
- Code splitting with Vite
- Image lazy loading
- Component memoization
- Service worker (optional)

### API Performance
- Batch queries when possible
- Pagination for large datasets
- Compression (gzip/brotli)
- CDN caching headers

## Error Handling Strategy

### Frontend Error Handling
- Try-catch blocks in async operations
- Error boundaries for React components
- Toast notifications for user feedback
- Console logging for debugging

### API Error Handling
- Status code checking
- Error message translation
- Automatic retry for network errors
- User-friendly error messages

### Database Error Handling
- Transaction rollback on failure
- Constraint violation checking
- Foreign key validation
- RLS policy violation logging

## Development Workflow

### Local Development
```bash
# Install dependencies
npm install

# Set up .env with Supabase credentials
cp .env.example .env

# Start dev server
npm run dev

# Visit http://localhost:3000
```

### Building for Production
```bash
# Build optimized bundle
npm run build

# Preview production build locally
npm run preview

# Lint TypeScript
npm run lint
```

### Database Development
```bash
# Pull current schema from Supabase (if CLI installed)
supabase db pull

# Run migrations
# Copy SQL files to Supabase SQL editor
```

## Monitoring & Observability

### Logging Levels
- ERROR: Critical failures
- WARN: Issues that need attention
- INFO: Important events
- DEBUG: Detailed debugging info

### Metrics to Monitor
- Page load time
- API response time
- Database query time
- Error rates
- User engagement

### Tools Integration (Optional)
- Sentry for error tracking
- Google Analytics for user tracking
- Supabase Analytics for database metrics
- CloudFlare for CDN metrics

## Scaling Strategy

### Horizontal Scaling
- Frontend: Deploy to CDN/multiple regions
- Database: Use connection pooling
- Load balancing: Via hosting platform

### Vertical Scaling
- Database: Upgrade Supabase tier
- Frontend: Optimize bundle size
- Media: Use CDN for storage

### Future Considerations
- Caching layer (Redis)
- Message queue (Bull/RabbitMQ)
- API gateway (Kong/Traefik)
- Service mesh (optional)

---

**Last Updated**: April 18, 2026
**Architecture Version**: 1.0
**Status**: Production Ready
