-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable PostGIS for geographic queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE user_role AS ENUM ('customer', 'partner', 'admin');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled', 'no_show');
CREATE TYPE payment_status AS ENUM ('pending', 'succeeded', 'failed', 'refunded');

-- ============================================
-- PROFILES TABLE (extends auth.users)
-- ============================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  role user_role DEFAULT 'customer',
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BUSINESSES TABLE
-- ============================================

CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  logo_url TEXT,
  cover_image_url TEXT,
  category TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  website TEXT,
  stripe_account_id TEXT,
  stripe_onboarding_complete BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_businesses_slug ON businesses(slug);
CREATE INDEX idx_businesses_owner ON businesses(owner_id);
CREATE INDEX idx_businesses_category ON businesses(category);

-- ============================================
-- LOCATIONS TABLE (with PostGIS)
-- ============================================

CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Main Location',
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT DEFAULT 'US',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  geog GEOGRAPHY(POINT, 4326),
  phone TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_locations_business ON locations(business_id);
CREATE INDEX idx_locations_geog ON locations USING GIST(geog);

-- ============================================
-- SERVICES TABLE
-- ============================================

CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  category TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_services_business ON services(business_id);

-- ============================================
-- STAFF MEMBERS TABLE
-- ============================================

CREATE TABLE staff_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  title TEXT,
  bio TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_staff_members_business ON staff_members(business_id);

-- ============================================
-- STAFF SERVICES (Many-to-Many)
-- ============================================

CREATE TABLE staff_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_id UUID NOT NULL REFERENCES staff_members(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  custom_price DECIMAL(10, 2),
  custom_duration INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(staff_id, service_id)
);

-- ============================================
-- AVAILABILITY RULES TABLE
-- ============================================

CREATE TABLE availability_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_id UUID NOT NULL REFERENCES staff_members(id) ON DELETE CASCADE,
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_availability_staff ON availability_rules(staff_id);

-- ============================================
-- BLACKOUTS TABLE (Time Off)
-- ============================================

CREATE TABLE blackouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_id UUID NOT NULL REFERENCES staff_members(id) ON DELETE CASCADE,
  start_datetime TIMESTAMPTZ NOT NULL,
  end_datetime TIMESTAMPTZ NOT NULL,
  reason TEXT,
  is_all_day BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_blackouts_staff ON blackouts(staff_id);
CREATE INDEX idx_blackouts_dates ON blackouts(start_datetime, end_datetime);

-- ============================================
-- BOOKINGS TABLE
-- ============================================

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES locations(id),
  customer_id UUID NOT NULL REFERENCES profiles(id),
  staff_id UUID NOT NULL REFERENCES staff_members(id),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status booking_status DEFAULT 'pending',
  notes TEXT,
  cancellation_reason TEXT,
  cancelled_at TIMESTAMPTZ,
  cancelled_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bookings_business ON bookings(business_id);
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_staff ON bookings(staff_id);
CREATE INDEX idx_bookings_time ON bookings(start_time, end_time);
CREATE INDEX idx_bookings_status ON bookings(status);

-- ============================================
-- BOOKING ITEMS TABLE
-- ============================================

CREATE TABLE booking_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id),
  service_name TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_booking_items_booking ON booking_items(booking_id);

-- ============================================
-- PAYMENTS TABLE
-- ============================================

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT NOT NULL UNIQUE,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status payment_status DEFAULT 'pending',
  refund_amount DECIMAL(10, 2),
  refunded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_payments_stripe ON payments(stripe_payment_intent_id);

-- ============================================
-- CLIENTS TABLE (Business's Customer Directory)
-- ============================================

CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  total_bookings INTEGER DEFAULT 0,
  total_spent DECIMAL(10, 2) DEFAULT 0,
  last_booking_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(business_id, customer_id)
);

CREATE INDEX idx_clients_business ON clients(business_id);
CREATE INDEX idx_clients_customer ON clients(customer_id);

-- ============================================
-- REVIEWS TABLE
-- ============================================

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE UNIQUE,
  customer_id UUID NOT NULL REFERENCES profiles(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  response TEXT,
  responded_at TIMESTAMPTZ,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reviews_business ON reviews(business_id);
CREATE INDEX idx_reviews_customer ON reviews(customer_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update location geography from lat/lng
CREATE OR REPLACE FUNCTION update_location_geog()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
    NEW.geog := ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_location_upsert
  BEFORE INSERT OR UPDATE ON locations
  FOR EACH ROW EXECUTE FUNCTION update_location_geog();

-- Function to search businesses nearby
CREATE OR REPLACE FUNCTION search_businesses_nearby(
  search_lat DECIMAL,
  search_lng DECIMAL,
  radius_miles INTEGER DEFAULT 10,
  category_filter TEXT DEFAULT NULL,
  search_query TEXT DEFAULT NULL
)
RETURNS TABLE (
  business_id UUID,
  business_name TEXT,
  business_slug TEXT,
  business_description TEXT,
  business_category TEXT,
  business_logo_url TEXT,
  business_cover_image_url TEXT,
  location_id UUID,
  location_city TEXT,
  location_state TEXT,
  distance_miles DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    b.id,
    b.name,
    b.slug,
    b.description,
    b.category,
    b.logo_url,
    b.cover_image_url,
    l.id,
    l.city,
    l.state,
    (ST_Distance(
      l.geog,
      ST_SetSRID(ST_MakePoint(search_lng, search_lat), 4326)::geography
    ) / 1609.344)::DECIMAL(10, 2) AS distance_miles
  FROM businesses b
  JOIN locations l ON l.business_id = b.id AND l.is_primary = TRUE
  WHERE b.is_active = TRUE
    AND ST_DWithin(
      l.geog,
      ST_SetSRID(ST_MakePoint(search_lng, search_lat), 4326)::geography,
      radius_miles * 1609.344
    )
    AND (category_filter IS NULL OR b.category ILIKE '%' || category_filter || '%')
    AND (search_query IS NULL OR (
      b.name ILIKE '%' || search_query || '%'
      OR b.description ILIKE '%' || search_query || '%'
      OR b.category ILIKE '%' || search_query || '%'
    ))
  ORDER BY distance_miles;
END;
$$ LANGUAGE plpgsql;

-- Function to update client stats on booking completion
CREATE OR REPLACE FUNCTION update_client_stats()
RETURNS TRIGGER AS $$
DECLARE
  booking_total DECIMAL(10, 2);
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status <> 'completed') THEN
    -- Calculate booking total
    SELECT COALESCE(SUM(price), 0) INTO booking_total
    FROM booking_items WHERE booking_id = NEW.id;

    -- Upsert client record
    INSERT INTO clients (business_id, customer_id, total_bookings, total_spent, last_booking_at)
    VALUES (NEW.business_id, NEW.customer_id, 1, booking_total, NEW.start_time)
    ON CONFLICT (business_id, customer_id) DO UPDATE SET
      total_bookings = clients.total_bookings + 1,
      total_spent = clients.total_spent + booking_total,
      last_booking_at = NEW.start_time,
      updated_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_booking_status_change
  AFTER INSERT OR UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_client_stats();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON businesses FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_staff_members_updated_at BEFORE UPDATE ON staff_members FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_availability_rules_updated_at BEFORE UPDATE ON availability_rules FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE blackouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all profiles, update own
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Businesses: Public read, owners can manage
CREATE POLICY "Active businesses are viewable by everyone" ON businesses FOR SELECT USING (is_active = true);
CREATE POLICY "Owners can manage their businesses" ON businesses FOR ALL USING (auth.uid() = owner_id);

-- Locations: Public read for active businesses
CREATE POLICY "Locations are viewable by everyone" ON locations FOR SELECT USING (
  EXISTS (SELECT 1 FROM businesses WHERE id = locations.business_id AND is_active = true)
);
CREATE POLICY "Business owners can manage locations" ON locations FOR ALL USING (
  EXISTS (SELECT 1 FROM businesses WHERE id = locations.business_id AND owner_id = auth.uid())
);

-- Services: Public read for active businesses
CREATE POLICY "Services are viewable by everyone" ON services FOR SELECT USING (
  EXISTS (SELECT 1 FROM businesses WHERE id = services.business_id AND is_active = true)
);
CREATE POLICY "Business owners can manage services" ON services FOR ALL USING (
  EXISTS (SELECT 1 FROM businesses WHERE id = services.business_id AND owner_id = auth.uid())
);

-- Staff: Public read for active businesses
CREATE POLICY "Staff are viewable by everyone" ON staff_members FOR SELECT USING (
  EXISTS (SELECT 1 FROM businesses WHERE id = staff_members.business_id AND is_active = true)
);
CREATE POLICY "Business owners can manage staff" ON staff_members FOR ALL USING (
  EXISTS (SELECT 1 FROM businesses WHERE id = staff_members.business_id AND owner_id = auth.uid())
);

-- Staff Services: Public read
CREATE POLICY "Staff services are viewable by everyone" ON staff_services FOR SELECT USING (true);
CREATE POLICY "Business owners can manage staff services" ON staff_services FOR ALL USING (
  EXISTS (
    SELECT 1 FROM staff_members sm
    JOIN businesses b ON b.id = sm.business_id
    WHERE sm.id = staff_services.staff_id AND b.owner_id = auth.uid()
  )
);

-- Availability Rules: Public read
CREATE POLICY "Availability rules are viewable by everyone" ON availability_rules FOR SELECT USING (true);
CREATE POLICY "Business owners can manage availability" ON availability_rules FOR ALL USING (
  EXISTS (
    SELECT 1 FROM staff_members sm
    JOIN businesses b ON b.id = sm.business_id
    WHERE sm.id = availability_rules.staff_id AND b.owner_id = auth.uid()
  )
);

-- Blackouts: Staff can view own, owners can manage all
CREATE POLICY "Business owners can view blackouts" ON blackouts FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM staff_members sm
    JOIN businesses b ON b.id = sm.business_id
    WHERE sm.id = blackouts.staff_id AND b.owner_id = auth.uid()
  )
);
CREATE POLICY "Business owners can manage blackouts" ON blackouts FOR ALL USING (
  EXISTS (
    SELECT 1 FROM staff_members sm
    JOIN businesses b ON b.id = sm.business_id
    WHERE sm.id = blackouts.staff_id AND b.owner_id = auth.uid()
  )
);

-- Bookings: Customers see own, business owners see their business bookings
CREATE POLICY "Users can view own bookings" ON bookings FOR SELECT USING (customer_id = auth.uid());
CREATE POLICY "Business owners can view their bookings" ON bookings FOR SELECT USING (
  EXISTS (SELECT 1 FROM businesses WHERE id = bookings.business_id AND owner_id = auth.uid())
);
CREATE POLICY "Users can create bookings" ON bookings FOR INSERT WITH CHECK (customer_id = auth.uid());
CREATE POLICY "Users can update own bookings" ON bookings FOR UPDATE USING (customer_id = auth.uid());
CREATE POLICY "Business owners can update their bookings" ON bookings FOR UPDATE USING (
  EXISTS (SELECT 1 FROM businesses WHERE id = bookings.business_id AND owner_id = auth.uid())
);

-- Booking Items: Same as bookings
CREATE POLICY "Users can view own booking items" ON booking_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM bookings WHERE id = booking_items.booking_id AND customer_id = auth.uid())
);
CREATE POLICY "Business owners can view booking items" ON booking_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM bookings b
    JOIN businesses bus ON bus.id = b.business_id
    WHERE b.id = booking_items.booking_id AND bus.owner_id = auth.uid()
  )
);

-- Payments: Same access as bookings
CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM bookings WHERE id = payments.booking_id AND customer_id = auth.uid())
);
CREATE POLICY "Business owners can view payments" ON payments FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM bookings b
    JOIN businesses bus ON bus.id = b.business_id
    WHERE b.id = payments.booking_id AND bus.owner_id = auth.uid()
  )
);

-- Clients: Business owners only
CREATE POLICY "Business owners can view their clients" ON clients FOR SELECT USING (
  EXISTS (SELECT 1 FROM businesses WHERE id = clients.business_id AND owner_id = auth.uid())
);
CREATE POLICY "Business owners can manage clients" ON clients FOR ALL USING (
  EXISTS (SELECT 1 FROM businesses WHERE id = clients.business_id AND owner_id = auth.uid())
);

-- Reviews: Public read, customers can manage own
CREATE POLICY "Reviews are viewable by everyone" ON reviews FOR SELECT USING (is_visible = true);
CREATE POLICY "Customers can create reviews" ON reviews FOR INSERT WITH CHECK (customer_id = auth.uid());
CREATE POLICY "Customers can update own reviews" ON reviews FOR UPDATE USING (customer_id = auth.uid());
CREATE POLICY "Business owners can respond to reviews" ON reviews FOR UPDATE USING (
  EXISTS (SELECT 1 FROM businesses WHERE id = reviews.business_id AND owner_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM businesses WHERE id = reviews.business_id AND owner_id = auth.uid())
);
