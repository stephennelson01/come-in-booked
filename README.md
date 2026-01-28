# ComeInBooked

A modern booking platform connecting customers with local service providers (beauty, wellness, fashion, creative services). Built with Next.js 14+, Supabase, and Stripe.

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Database & Auth**: Supabase (PostgreSQL, Auth, Realtime, Storage)
- **Styling**: Tailwind CSS with shadcn/ui components
- **Animations**: Framer Motion
- **Payments**: Stripe (Payment Intents + Connect)
- **Maps**: Mapbox GL
- **Email**: Resend
- **SMS**: Twilio
- **Language**: TypeScript

## Features

### For Customers
- Browse and search local service providers
- View business profiles, services, and reviews
- Book appointments online 24/7
- Manage bookings from dashboard
- Receive reminders via email/SMS

### For Merchants
- Complete business dashboard
- Service and staff management
- Calendar and booking management
- Client directory with visit history
- Stripe Connect for payments
- Business analytics

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Stripe account
- Mapbox account (for maps)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd comeinbooked
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   ```

   Fill in your credentials in `.env.local`:
   - Supabase URL and keys
   - Stripe keys
   - Mapbox token
   - Resend API key
   - Twilio credentials

4. Set up the database:
   - Create a new Supabase project
   - Run the migration in `supabase/migrations/001_initial_schema.sql`

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── api/               # API routes
│   ├── business/[slug]/   # Business profile & booking
│   ├── customer/          # Customer dashboard
│   ├── merchant/          # Merchant dashboard
│   └── search/            # Business discovery
├── components/
│   ├── ui/                # shadcn/ui base components
│   ├── layout/            # Navbar, Footer, Sidebar
│   ├── marketing/         # Hero, CategoryGrid, etc.
│   ├── search/            # SearchBar, BusinessCard, MapView
│   ├── booking/           # Booking flow components
│   ├── merchant/          # Dashboard components
│   └── providers/         # Theme, Auth providers
├── lib/
│   ├── supabase/          # Supabase clients
│   ├── stripe/            # Stripe utilities
│   └── utils.ts           # Helpers
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript types
├── actions/               # Server actions
└── middleware.ts          # Auth middleware
```

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=

# Resend (Email)
RESEND_API_KEY=

# Twilio (SMS)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM_NUMBER=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Database Schema

The database includes the following main tables:
- `profiles` - User profiles (extends Supabase auth)
- `businesses` - Business profiles
- `locations` - Business locations (with PostGIS)
- `services` - Service catalog
- `staff_members` - Team members
- `availability_rules` - Weekly schedules
- `bookings` - Appointments
- `payments` - Stripe transactions
- `clients` - Customer directory
- `reviews` - Customer reviews

See `supabase/migrations/001_initial_schema.sql` for full schema.

## License

MIT
