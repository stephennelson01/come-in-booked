export type UserRole = "customer" | "partner" | "admin";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Business {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  category: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  stripe_account_id: string | null;
  stripe_onboarding_complete: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Location {
  id: string;
  business_id: string;
  name: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  business_id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  price: number;
  currency: string;
  category: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface StaffMember {
  id: string;
  business_id: string;
  user_id: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  title: string | null;
  bio: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface StaffService {
  id: string;
  staff_id: string;
  service_id: string;
  custom_price: number | null;
  custom_duration: number | null;
  created_at: string;
}

export interface AvailabilityRule {
  id: string;
  staff_id: string;
  location_id: string | null;
  day_of_week: number; // 0-6, Sunday-Saturday
  start_time: string; // HH:MM format
  end_time: string; // HH:MM format
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Blackout {
  id: string;
  staff_id: string;
  start_datetime: string;
  end_datetime: string;
  reason: string | null;
  is_all_day: boolean;
  created_at: string;
}

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show";

export interface Booking {
  id: string;
  business_id: string;
  location_id: string;
  customer_id: string;
  staff_id: string;
  start_time: string;
  end_time: string;
  status: BookingStatus;
  notes: string | null;
  cancellation_reason: string | null;
  cancelled_at: string | null;
  cancelled_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface BookingItem {
  id: string;
  booking_id: string;
  service_id: string;
  service_name: string;
  duration_minutes: number;
  price: number;
  created_at: string;
}

export type PaymentStatus = "pending" | "succeeded" | "failed" | "refunded";

export interface Payment {
  id: string;
  booking_id: string;
  stripe_payment_intent_id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  refund_amount: number | null;
  refunded_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  business_id: string;
  customer_id: string;
  notes: string | null;
  tags: string[];
  total_bookings: number;
  total_spent: number;
  last_booking_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  business_id: string;
  booking_id: string;
  customer_id: string;
  rating: number; // 1-5
  comment: string | null;
  response: string | null;
  responded_at: string | null;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

// Extended types with relations
export interface BusinessWithLocation extends Business {
  locations: Location[];
}

export interface ServiceWithStaff extends Service {
  staff_services: (StaffService & { staff_member: StaffMember })[];
}

export interface BookingWithDetails extends Booking {
  business: Business;
  location: Location;
  staff_member: StaffMember;
  booking_items: BookingItem[];
  payment?: Payment;
}

export interface StaffMemberWithServices extends StaffMember {
  staff_services: (StaffService & { service: Service })[];
  availability_rules: AvailabilityRule[];
}

// Category type
export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description?: string;
}

// Time slot for booking
export interface TimeSlot {
  time: string; // HH:MM format
  available: boolean;
  staffId?: string;
}
