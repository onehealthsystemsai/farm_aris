# Farm Aris Grand Opening Website

## Project Overview
Premium event website for the Farm Aris Grand Opening in Grootfontein, Namibia. Features a safari-themed design with advanced interactive components and gamification elements.

## 1. Project Setup & Dependencies

### Core Setup
- **Framework**: Vite + React + TypeScript
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS with custom configuration
- **Icons**: Iconify React (Solar Bold Duotone icons)
- **Typography**: Rubik font (headers) + Montserrat font (body)

### Database & Backend
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime subscriptions
- **Storage**: Supabase Storage (for images/media)
- **API**: Auto-generated REST API from Supabase

## 2. Premium Features & Components

### Hero Section
- Animated 3D countdown with particle effects
- Video background with farm drone footage overlay
- Dynamic weather widget showing Grootfontein conditions
- Floating animation with safari animals silhouettes
- Interactive "Save the Date" calendar integration

### Navigation
- Glass-morphism sticky header with blur effect
- Progress indicator showing scroll position
- Quick action buttons (WhatsApp, Call, Share)
- Multi-language support (English/Afrikaans/German)

### Interactive Timeline
- 3D timeline with hover previews
- Live activity status indicators
- Photo galleries for each event
- Virtual tour mode with 360° images
- Animated path showing event flow

### RSVP System
- Multi-step form with progress animation
- Real-time availability counter
- QR code generation for tickets
- Email confirmation system
- Guest list management dashboard
- Dietary preferences with allergy alerts
- Accommodation booking integration
- Transportation coordination tool

### Premium Interactive Features
- **Virtual Farm Tour**: 360° panoramic views
- **Live Chat Support**: Floating chat widget
- **Social Wall**: Instagram feed integration #FarmAris
- **Weather Forecast**: 7-day forecast widget
- **Photo Booth**: Virtual safari-themed filters
- **Guest Book**: Digital signatures and messages
- **Live Stream**: Event streaming capability
- **Countdown Widgets**: Shareable countdown cards

### Gamification Elements
- Safari scavenger hunt (find hidden animals on site)
- Spin-to-win prizes wheel
- Early bird registration rewards
- Referral system with benefits
- Interactive farm trivia quiz

## 3. Advanced Technical Implementation

### Project Structure
```
src/
├── components/
│   ├── Hero/
│   │   ├── HeroSection.tsx
│   │   ├── CountdownTimer.tsx (3D animated)
│   │   ├── WeatherWidget.tsx
│   │   └── ParticleBackground.tsx
│   ├── Navigation/
│   │   ├── GlassNavbar.tsx
│   │   └── ScrollProgress.tsx
│   ├── Timeline/
│   │   ├── Timeline3D.tsx
│   │   ├── EventCard.tsx
│   │   └── PhotoGallery.tsx
│   ├── RSVP/
│   │   ├── MultiStepForm.tsx
│   │   ├── QRTicket.tsx
│   │   └── GuestDashboard.tsx
│   ├── Interactive/
│   │   ├── VirtualTour.tsx
│   │   ├── LiveChat.tsx
│   │   ├── SocialWall.tsx
│   │   └── PhotoBooth.tsx
│   ├── Location/
│   │   ├── MapBox3D.tsx
│   │   └── DirectionsPanel.tsx
│   └── Premium/
│       ├── SpinWheel.tsx
│       ├── ScavengerHunt.tsx
│       └── DigitalGuestBook.tsx
├── hooks/
│   ├── useCountdown.ts
│   ├── useWeather.ts
│   ├── useIntersectionObserver.ts
│   └── useLocalStorage.ts
├── lib/
│   └── supabase.ts
├── services/
│   ├── rsvpService.ts
│   ├── activitiesService.ts
│   ├── galleryService.ts
│   └── weatherService.ts
├── types/
│   └── database.types.ts
├── utils/
│   ├── animations.ts
│   ├── api.ts
│   └── helpers.ts
└── styles/
    ├── globals.css
    └── animations.css
```

## 4. Design System

### Color Palette
- **Primary**: Safari Khaki (#C19A6B)
- **Secondary**: Acacia Green (#4A5F3E)
- **Accent**: Sunset Orange (#FF6B35)
- **Earth**: Rich Brown (#8B4513)
- **Sky**: Namibian Blue (#87CEEB)
- **Gradients**: Sunrise/Sunset themes

### Typography
- **Headers**: Rubik (700, 500)
- **Body**: Montserrat (400, 500, 600)
- **Accents**: Custom safari-style decorative fonts

### Animations
- Parallax scrolling with depth layers
- Staggered fade-ins on scroll
- Smooth page transitions
- Hover effects with spring physics
- Loading animations with farm theme
- Cursor trail effects
- Text reveal animations

## 5. Premium UX Features
- Dark/Light mode with sunset transition
- Accessibility mode (high contrast, large text)
- Offline capability with service workers
- Progressive Web App (installable)
- Performance optimization (lazy loading, code splitting)
- SEO optimization with structured data
- Social media meta tags
- Analytics integration
- A/B testing capability

## 6. Special Safari Theme Elements
- Custom cursors (animal tracks)
- Decorative borders (African patterns)
- Background textures (subtle animal prints)
- Sound effects (optional ambient safari sounds)
- Easter eggs (hidden animal animations)

## 7. Mobile-First Premium Features
- Swipe gestures for navigation
- Pull-to-refresh functionality
- Bottom sheet modals
- Haptic feedback support
- Camera integration for photo uploads
- Native share functionality
- Push notifications support

## 8. Supabase Database Integration

### 🔧 Database Configuration
- **Project URL**: https://jyvgjcagmmtiqgexqgwa.supabase.co
- **Environment**: Production-ready with environment variables
- **Client**: TypeScript-first with auto-generated types

### 🗄️ Database Schema

#### Core Tables:
```sql
-- RSVPs Table
CREATE TABLE rsvps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  num_guests INTEGER DEFAULT 1,
  dietary_requirements TEXT,
  accommodation_needed BOOLEAN DEFAULT FALSE,
  transportation_needed BOOLEAN DEFAULT FALSE,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  qr_code TEXT,
  ticket_id TEXT
);

-- Activities Table
CREATE TABLE activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  capacity INTEGER,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  category TEXT NOT NULL
);

-- Gallery Table
CREATE TABLE gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  display_order INTEGER
);

-- Guest Messages Table
CREATE TABLE guest_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT,
  message TEXT NOT NULL,
  is_public BOOLEAN DEFAULT TRUE,
  is_approved BOOLEAN DEFAULT FALSE
);

-- Weather Data Table
CREATE TABLE weather_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  date DATE NOT NULL,
  temperature_high INTEGER NOT NULL,
  temperature_low INTEGER NOT NULL,
  condition TEXT NOT NULL,
  humidity INTEGER NOT NULL,
  wind_speed INTEGER NOT NULL,
  location TEXT DEFAULT 'Grootfontein, Namibia'
);
```

### 🔐 Security & Access
- **Row Level Security (RLS)**: Enabled on all tables
- **Public Access**: Read-only for activities, gallery, weather data
- **Protected Data**: RSVPs and guest messages require appropriate permissions
- **API Keys**: Environment variables for secure access

### 📡 Real-time Features
- **Live RSVP Updates**: Real-time counter and guest list updates
- **Activity Status**: Live activity status and capacity updates
- **Guest Messages**: Real-time guest book submissions
- **Weather Updates**: Live weather data for event planning

### 🛠️ Service Layer
```typescript
// RSVP Operations
import { rsvpService } from '@/services/rsvpService'

// Create RSVP
await rsvpService.create(rsvpData)

// Get RSVP statistics
const stats = await rsvpService.getStats()

// Activities Operations
import { activitiesService } from '@/services/activitiesService'

// Get featured activities
const featured = await activitiesService.getFeatured()
```

### 🔑 Environment Variables
```env
# Public (Frontend)
VITE_SUPABASE_URL=https://jyvgjcagmmtiqgexqgwa.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# Private (Server-side)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_SECRET_KEY=your_secret_key
```

### 📊 Integration Features
- **TypeScript Types**: Auto-generated from database schema
- **Error Handling**: Comprehensive error handling in service layer
- **Caching**: Optimized queries with proper indexing
- **Performance**: Connection pooling and query optimization
- **Monitoring**: Built-in logging and performance metrics

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Run type checking
npm run typecheck
```

## GitHub Repository
- **Owner**: onehealthsystemsai
- **Repository**: farm_aris
- **Account**: samboiki

## Project Status
This website represents the grand opening of Farm Aris in Grootfontein, Namibia, featuring premium interactive components and a comprehensive safari-themed user experience.