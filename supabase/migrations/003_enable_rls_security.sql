-- ============================================
-- SECURITY FIX: Enable RLS on all tables
-- Run this if your Supabase Security Advisor shows errors
-- ============================================

-- Enable RLS on all tables (safe to run even if already enabled)
ALTER TABLE IF EXISTS profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS services ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS staff_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS staff_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS availability_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS blackouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS booking_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS reviews ENABLE ROW LEVEL SECURITY;

-- ============================================
-- DROP EXISTING POLICIES (to avoid conflicts)
-- ============================================

DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

DROP POLICY IF EXISTS "Active businesses are viewable by everyone" ON businesses;
DROP POLICY IF EXISTS "Owners can manage their businesses" ON businesses;
DROP POLICY IF EXISTS "Users can create businesses" ON businesses;

DROP POLICY IF EXISTS "Locations are viewable by everyone" ON locations;
DROP POLICY IF EXISTS "Business owners can manage locations" ON locations;

DROP POLICY IF EXISTS "Services are viewable by everyone" ON services;
DROP POLICY IF EXISTS "Business owners can manage services" ON services;

DROP POLICY IF EXISTS "Staff are viewable by everyone" ON staff_members;
DROP POLICY IF EXISTS "Business owners can manage staff" ON staff_members;

DROP POLICY IF EXISTS "Staff services are viewable by everyone" ON staff_services;
DROP POLICY IF EXISTS "Business owners can manage staff services" ON staff_services;

DROP POLICY IF EXISTS "Availability rules are viewable by everyone" ON availability_rules;
DROP POLICY IF EXISTS "Business owners can manage availability" ON availability_rules;

DROP POLICY IF EXISTS "Business owners can view blackouts" ON blackouts;
DROP POLICY IF EXISTS "Business owners can manage blackouts" ON blackouts;

DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
DROP POLICY IF EXISTS "Business owners can view their bookings" ON bookings;
DROP POLICY IF EXISTS "Users can create bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON bookings;
DROP POLICY IF EXISTS "Business owners can update their bookings" ON bookings;

DROP POLICY IF EXISTS "Users can view own booking items" ON booking_items;
DROP POLICY IF EXISTS "Business owners can view booking items" ON booking_items;
DROP POLICY IF EXISTS "Users can create booking items" ON booking_items;

DROP POLICY IF EXISTS "Users can view own payments" ON payments;
DROP POLICY IF EXISTS "Business owners can view payments" ON payments;
DROP POLICY IF EXISTS "System can create payments" ON payments;
DROP POLICY IF EXISTS "System can update payments" ON payments;

DROP POLICY IF EXISTS "Business owners can view their clients" ON clients;
DROP POLICY IF EXISTS "Business owners can manage clients" ON clients;

DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON reviews;
DROP POLICY IF EXISTS "Customers can create reviews" ON reviews;
DROP POLICY IF EXISTS "Customers can update own reviews" ON reviews;
DROP POLICY IF EXISTS "Business owners can respond to reviews" ON reviews;

-- ============================================
-- PROFILES POLICIES
-- ============================================

-- Anyone can view profiles (for displaying names, avatars)
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Allow profile creation (handled by trigger, but backup policy)
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- BUSINESSES POLICIES
-- ============================================

-- Anyone can view active businesses
CREATE POLICY "Active businesses are viewable by everyone"
  ON businesses FOR SELECT
  USING (is_active = true OR owner_id = auth.uid());

-- Authenticated users can create businesses
CREATE POLICY "Users can create businesses"
  ON businesses FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- Owners can update/delete their businesses
CREATE POLICY "Owners can manage their businesses"
  ON businesses FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their businesses"
  ON businesses FOR DELETE
  USING (auth.uid() = owner_id);

-- ============================================
-- LOCATIONS POLICIES
-- ============================================

-- Anyone can view locations of active businesses
CREATE POLICY "Locations are viewable by everyone"
  ON locations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE id = locations.business_id
      AND (is_active = true OR owner_id = auth.uid())
    )
  );

-- Business owners can manage their locations
CREATE POLICY "Business owners can manage locations"
  ON locations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE id = locations.business_id
      AND owner_id = auth.uid()
    )
  );

-- ============================================
-- SERVICES POLICIES
-- ============================================

-- Anyone can view active services
CREATE POLICY "Services are viewable by everyone"
  ON services FOR SELECT
  USING (
    is_active = true AND EXISTS (
      SELECT 1 FROM businesses
      WHERE id = services.business_id
      AND is_active = true
    )
  );

-- Business owners can manage their services
CREATE POLICY "Business owners can manage services"
  ON services FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE id = services.business_id
      AND owner_id = auth.uid()
    )
  );

-- ============================================
-- STAFF MEMBERS POLICIES
-- ============================================

-- Anyone can view active staff
CREATE POLICY "Staff are viewable by everyone"
  ON staff_members FOR SELECT
  USING (
    is_active = true AND EXISTS (
      SELECT 1 FROM businesses
      WHERE id = staff_members.business_id
      AND is_active = true
    )
  );

-- Business owners can manage their staff
CREATE POLICY "Business owners can manage staff"
  ON staff_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE id = staff_members.business_id
      AND owner_id = auth.uid()
    )
  );

-- ============================================
-- STAFF SERVICES POLICIES
-- ============================================

-- Anyone can view staff services (for booking)
CREATE POLICY "Staff services are viewable by everyone"
  ON staff_services FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM staff_members sm
      JOIN businesses b ON b.id = sm.business_id
      WHERE sm.id = staff_services.staff_id
      AND sm.is_active = true
      AND b.is_active = true
    )
  );

-- Business owners can manage staff services
CREATE POLICY "Business owners can manage staff services"
  ON staff_services FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM staff_members sm
      JOIN businesses b ON b.id = sm.business_id
      WHERE sm.id = staff_services.staff_id
      AND b.owner_id = auth.uid()
    )
  );

-- ============================================
-- AVAILABILITY RULES POLICIES
-- ============================================

-- Anyone can view availability (for booking)
CREATE POLICY "Availability rules are viewable by everyone"
  ON availability_rules FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM staff_members sm
      JOIN businesses b ON b.id = sm.business_id
      WHERE sm.id = availability_rules.staff_id
      AND b.is_active = true
    )
  );

-- Business owners can manage availability
CREATE POLICY "Business owners can manage availability"
  ON availability_rules FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM staff_members sm
      JOIN businesses b ON b.id = sm.business_id
      WHERE sm.id = availability_rules.staff_id
      AND b.owner_id = auth.uid()
    )
  );

-- ============================================
-- BLACKOUTS POLICIES
-- ============================================

-- Business owners can view blackouts
CREATE POLICY "Business owners can view blackouts"
  ON blackouts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM staff_members sm
      JOIN businesses b ON b.id = sm.business_id
      WHERE sm.id = blackouts.staff_id
      AND b.owner_id = auth.uid()
    )
  );

-- Business owners can manage blackouts
CREATE POLICY "Business owners can manage blackouts"
  ON blackouts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM staff_members sm
      JOIN businesses b ON b.id = sm.business_id
      WHERE sm.id = blackouts.staff_id
      AND b.owner_id = auth.uid()
    )
  );

-- ============================================
-- BOOKINGS POLICIES
-- ============================================

-- Customers can view their own bookings
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  USING (customer_id = auth.uid());

-- Business owners can view their business bookings
CREATE POLICY "Business owners can view their bookings"
  ON bookings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE id = bookings.business_id
      AND owner_id = auth.uid()
    )
  );

-- Customers can create bookings
CREATE POLICY "Users can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (customer_id = auth.uid());

-- Customers can update their own bookings (e.g., cancel)
CREATE POLICY "Users can update own bookings"
  ON bookings FOR UPDATE
  USING (customer_id = auth.uid());

-- Business owners can update bookings
CREATE POLICY "Business owners can update their bookings"
  ON bookings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE id = bookings.business_id
      AND owner_id = auth.uid()
    )
  );

-- ============================================
-- BOOKING ITEMS POLICIES
-- ============================================

-- Customers can view their own booking items
CREATE POLICY "Users can view own booking items"
  ON booking_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE id = booking_items.booking_id
      AND customer_id = auth.uid()
    )
  );

-- Business owners can view booking items
CREATE POLICY "Business owners can view booking items"
  ON booking_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bookings b
      JOIN businesses bus ON bus.id = b.business_id
      WHERE b.id = booking_items.booking_id
      AND bus.owner_id = auth.uid()
    )
  );

-- Customers can create booking items when creating a booking
CREATE POLICY "Users can create booking items"
  ON booking_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE id = booking_items.booking_id
      AND customer_id = auth.uid()
    )
  );

-- ============================================
-- PAYMENTS POLICIES
-- ============================================

-- Customers can view their own payments
CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE id = payments.booking_id
      AND customer_id = auth.uid()
    )
  );

-- Business owners can view payments
CREATE POLICY "Business owners can view payments"
  ON payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bookings b
      JOIN businesses bus ON bus.id = b.business_id
      WHERE b.id = payments.booking_id
      AND bus.owner_id = auth.uid()
    )
  );

-- Note: Payments are created/updated by the server via service role key
-- No direct client INSERT/UPDATE policies needed

-- ============================================
-- CLIENTS POLICIES
-- ============================================

-- Business owners can view their clients
CREATE POLICY "Business owners can view their clients"
  ON clients FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE id = clients.business_id
      AND owner_id = auth.uid()
    )
  );

-- Business owners can manage clients
CREATE POLICY "Business owners can manage clients"
  ON clients FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE id = clients.business_id
      AND owner_id = auth.uid()
    )
  );

-- ============================================
-- REVIEWS POLICIES
-- ============================================

-- Anyone can view visible reviews
CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT
  USING (is_visible = true);

-- Business owners can view all their reviews
CREATE POLICY "Business owners can view all reviews"
  ON reviews FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE id = reviews.business_id
      AND owner_id = auth.uid()
    )
  );

-- Customers can create reviews for their completed bookings
CREATE POLICY "Customers can create reviews"
  ON reviews FOR INSERT
  WITH CHECK (
    customer_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM bookings
      WHERE id = reviews.booking_id
      AND customer_id = auth.uid()
      AND status = 'completed'
    )
  );

-- Customers can update their own reviews
CREATE POLICY "Customers can update own reviews"
  ON reviews FOR UPDATE
  USING (customer_id = auth.uid());

-- Business owners can respond to reviews (update response field only)
CREATE POLICY "Business owners can respond to reviews"
  ON reviews FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE id = reviews.business_id
      AND owner_id = auth.uid()
    )
  );
