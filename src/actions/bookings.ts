"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { sendBookingNotifications, sendBookingCancellationNotification } from "@/lib/notifications";

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled" | "no_show";

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
}

export interface BookingWithDetails extends Booking {
  business: {
    id: string;
    name: string;
    slug: string;
  };
  location: {
    id: string;
    name: string;
    address_line1: string;
    city: string;
    state: string;
  };
  staff: {
    id: string;
    name: string;
    avatar_url: string | null;
    title: string | null;
  };
  customer: {
    id: string;
    full_name: string | null;
    email: string;
    phone: string | null;
  };
  items: BookingItem[];
  payment?: {
    id: string;
    amount: number;
    status: string;
  };
}

// Get bookings for customer
export async function getMyBookings(): Promise<{
  success: boolean;
  bookings?: BookingWithDetails[];
  error?: string;
}> {
  const supabase = await createClient();
  if (!supabase) {
    return { success: false, error: "Database not configured" };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const { data: bookings, error } = await supabase
    .from("bookings")
    .select(`
      *,
      business:businesses(id, name, slug),
      location:locations(id, name, address_line1, city, state),
      staff:staff_members(id, name, avatar_url, title),
      customer:profiles!bookings_customer_id_fkey(id, full_name, email, phone),
      items:booking_items(id, service_id, service_name, duration_minutes, price),
      payment:payments(id, amount, status)
    `)
    .eq("customer_id", user.id)
    .order("start_time", { ascending: false });

  if (error) {
    return { success: false, error: error.message };
  }

  return {
    success: true,
    bookings: (bookings || []).map((b) => ({
      ...b,
      payment: b.payment?.[0] || undefined,
    })),
  };
}

// Get bookings for merchant's business
export async function getBusinessBookings(options?: {
  status?: BookingStatus;
  from_date?: string;
  to_date?: string;
  staff_id?: string;
}): Promise<{
  success: boolean;
  bookings?: BookingWithDetails[];
  error?: string;
}> {
  const supabase = await createClient();
  if (!supabase) {
    return { success: false, error: "Database not configured" };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // Get the user's business
  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  if (!business) {
    return { success: false, error: "No business found" };
  }

  let query = supabase
    .from("bookings")
    .select(`
      *,
      business:businesses(id, name, slug),
      location:locations(id, name, address_line1, city, state),
      staff:staff_members(id, name, avatar_url, title),
      customer:profiles!bookings_customer_id_fkey(id, full_name, email, phone),
      items:booking_items(id, service_id, service_name, duration_minutes, price),
      payment:payments(id, amount, status)
    `)
    .eq("business_id", business.id);

  if (options?.status) {
    query = query.eq("status", options.status);
  }

  if (options?.from_date) {
    query = query.gte("start_time", options.from_date);
  }

  if (options?.to_date) {
    query = query.lte("start_time", options.to_date);
  }

  if (options?.staff_id) {
    query = query.eq("staff_id", options.staff_id);
  }

  const { data: bookings, error } = await query.order("start_time", { ascending: true });

  if (error) {
    return { success: false, error: error.message };
  }

  return {
    success: true,
    bookings: (bookings || []).map((b) => ({
      ...b,
      payment: b.payment?.[0] || undefined,
    })),
  };
}

// Get single booking
export async function getBooking(bookingId: string): Promise<{
  success: boolean;
  booking?: BookingWithDetails;
  error?: string;
}> {
  const supabase = await createClient();
  if (!supabase) {
    return { success: false, error: "Database not configured" };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const { data: booking, error } = await supabase
    .from("bookings")
    .select(`
      *,
      business:businesses(id, name, slug),
      location:locations(id, name, address_line1, city, state),
      staff:staff_members(id, name, avatar_url, title),
      customer:profiles!bookings_customer_id_fkey(id, full_name, email, phone),
      items:booking_items(id, service_id, service_name, duration_minutes, price),
      payment:payments(id, amount, status)
    `)
    .eq("id", bookingId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return { success: false, error: "Booking not found" };
    }
    return { success: false, error: error.message };
  }

  // Verify access (customer or business owner)
  const { data: business } = await supabase
    .from("businesses")
    .select("owner_id")
    .eq("id", booking.business_id)
    .single();

  if (booking.customer_id !== user.id && business?.owner_id !== user.id) {
    return { success: false, error: "Unauthorized" };
  }

  return {
    success: true,
    booking: {
      ...booking,
      payment: booking.payment?.[0] || undefined,
    },
  };
}

// Validation schemas
const createBookingSchema = z.object({
  business_id: z.string().uuid("Invalid business ID"),
  location_id: z.string().uuid("Invalid location ID"),
  staff_id: z.string().uuid("Invalid staff ID"),
  start_time: z.string().datetime({ message: "Invalid date/time format" }),
  services: z.array(z.object({
    service_id: z.string().uuid("Invalid service ID"),
    service_name: z.string().min(1).max(200),
    duration_minutes: z.number().int().min(5).max(480),
    price: z.number().min(0),
  })).min(1, "At least one service is required"),
  notes: z.string().max(1000).optional(),
});

const updateBookingStatusSchema = z.object({
  bookingId: z.string().uuid("Invalid booking ID"),
  status: z.enum(["pending", "confirmed", "completed", "cancelled", "no_show"]),
  reason: z.string().max(500).optional(),
});

// Create a new booking
export async function createBooking(data: {
  business_id: string;
  location_id: string;
  staff_id: string;
  start_time: string;
  services: Array<{
    service_id: string;
    service_name: string;
    duration_minutes: number;
    price: number;
  }>;
  notes?: string;
}): Promise<{
  success: boolean;
  booking?: Booking;
  error?: string;
}> {
  const parsed = createBookingSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  if (!supabase) {
    return { success: false, error: "Database not configured" };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // Calculate end time based on total duration
  const totalDuration = data.services.reduce((sum, s) => sum + s.duration_minutes, 0);
  const startTime = new Date(data.start_time);
  const endTime = new Date(startTime.getTime() + totalDuration * 60 * 1000);

  // Check for conflicting bookings
  const { data: conflicts } = await supabase
    .from("bookings")
    .select("id")
    .eq("staff_id", data.staff_id)
    .not("status", "in", "(cancelled,no_show)")
    .or(`and(start_time.lt.${endTime.toISOString()},end_time.gt.${startTime.toISOString()})`);

  if (conflicts && conflicts.length > 0) {
    return { success: false, error: "This time slot is no longer available" };
  }

  // Create booking
  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .insert({
      business_id: data.business_id,
      location_id: data.location_id,
      customer_id: user.id,
      staff_id: data.staff_id,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      status: "pending",
      notes: data.notes,
    })
    .select()
    .single();

  if (bookingError) {
    return { success: false, error: bookingError.message };
  }

  // Create booking items
  const bookingItems = data.services.map((service) => ({
    booking_id: booking.id,
    service_id: service.service_id,
    service_name: service.service_name,
    duration_minutes: service.duration_minutes,
    price: service.price,
  }));

  const { error: itemsError } = await supabase
    .from("booking_items")
    .insert(bookingItems);

  if (itemsError) {
    // Rollback booking
    await supabase.from("bookings").delete().eq("id", booking.id);
    return { success: false, error: itemsError.message };
  }

  // Send notifications (don't block on this)
  try {
    // Fetch all the data needed for notifications
    const [businessResult, staffResult, locationResult, customerResult] = await Promise.all([
      supabase
        .from("businesses")
        .select("name, email, phone, owner_id, profiles!businesses_owner_id_fkey(email, phone)")
        .eq("id", data.business_id)
        .single(),
      supabase
        .from("staff_members")
        .select("name")
        .eq("id", data.staff_id)
        .single(),
      supabase
        .from("locations")
        .select("address_line1, city, state")
        .eq("id", data.location_id)
        .single(),
      supabase
        .from("profiles")
        .select("full_name, email, phone")
        .eq("id", user.id)
        .single(),
    ]);

    const business = businessResult.data;
    const staff = staffResult.data;
    const location = locationResult.data;
    const customer = customerResult.data;

    if (business && staff && location && customer) {
      const ownerProfile = business.profiles as unknown as { email: string; phone: string | null } | null;
      const totalAmount = data.services.reduce((sum, s) => sum + s.price, 0);
      const serviceNames = data.services.map(s => s.service_name).join(", ");

      // Send notifications in background (don't await)
      sendBookingNotifications({
        bookingId: booking.id,
        customerName: customer.full_name || customer.email.split("@")[0],
        customerEmail: customer.email,
        customerPhone: customer.phone,
        businessName: business.name,
        businessEmail: business.email || ownerProfile?.email || null,
        businessPhone: business.phone || ownerProfile?.phone || null,
        serviceName: serviceNames,
        staffName: staff.name,
        startTime: startTime,
        endTime: endTime,
        totalAmount: totalAmount,
        currency: "NGN",
        locationAddress: `${location.address_line1}, ${location.city}, ${location.state}`,
      }).catch(err => console.error("Failed to send booking notifications:", err));
    }
  } catch (notificationError) {
    // Log but don't fail the booking if notifications fail
    console.error("Error preparing booking notifications:", notificationError);
  }

  revalidatePath("/customer");
  revalidatePath("/customer/bookings");
  revalidatePath("/merchant/bookings");
  revalidatePath("/merchant/calendar");

  return { success: true, booking };
}

// Update booking status
export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  const parsed = updateBookingStatusSchema.safeParse({ bookingId, status, reason });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  if (!supabase) {
    return { success: false, error: "Database not configured" };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // Get booking and verify access
  const { data: booking } = await supabase
    .from("bookings")
    .select("customer_id, business_id, businesses(owner_id)")
    .eq("id", bookingId)
    .single();

  if (!booking) {
    return { success: false, error: "Booking not found" };
  }

  const isCustomer = booking.customer_id === user.id;
  const biz = booking.businesses as unknown as { owner_id: string } | null;
  const isOwner = biz?.owner_id === user.id;

  if (!isCustomer && !isOwner) {
    return { success: false, error: "Unauthorized" };
  }

  // Customers can only cancel
  if (isCustomer && !isOwner && status !== "cancelled") {
    return { success: false, error: "Customers can only cancel bookings" };
  }

  const updateData: Record<string, unknown> = { status };

  if (status === "cancelled") {
    updateData.cancellation_reason = reason;
    updateData.cancelled_at = new Date().toISOString();
    updateData.cancelled_by = user.id;
  }

  const { error } = await supabase
    .from("bookings")
    .update(updateData)
    .eq("id", bookingId);

  if (error) {
    return { success: false, error: error.message };
  }

  // Send cancellation notifications
  if (status === "cancelled") {
    try {
      // Fetch booking details for notification
      const { data: bookingDetails } = await supabase
        .from("bookings")
        .select(`
          id,
          start_time,
          end_time,
          business:businesses(name, email, phone, owner_id, profiles!businesses_owner_id_fkey(email, phone)),
          staff:staff_members(name),
          location:locations(address_line1, city, state),
          customer:profiles!bookings_customer_id_fkey(full_name, email, phone),
          items:booking_items(service_name, price)
        `)
        .eq("id", bookingId)
        .single();

      if (bookingDetails) {
        const business = bookingDetails.business as unknown as {
          name: string;
          email: string | null;
          phone: string | null;
          profiles: { email: string; phone: string | null } | null;
        };
        const staff = bookingDetails.staff as unknown as { name: string };
        const location = bookingDetails.location as unknown as {
          address_line1: string;
          city: string;
          state: string;
        };
        const customer = bookingDetails.customer as unknown as {
          full_name: string | null;
          email: string;
          phone: string | null;
        };
        const items = bookingDetails.items as unknown as Array<{ service_name: string; price: number }>;

        const totalAmount = items.reduce((sum, item) => sum + item.price, 0);
        const serviceNames = items.map(item => item.service_name).join(", ");

        sendBookingCancellationNotification(
          {
            bookingId: bookingDetails.id,
            customerName: customer.full_name || customer.email.split("@")[0],
            customerEmail: customer.email,
            customerPhone: customer.phone,
            businessName: business.name,
            businessEmail: business.email || business.profiles?.email || null,
            businessPhone: business.phone || business.profiles?.phone || null,
            serviceName: serviceNames,
            staffName: staff.name,
            startTime: new Date(bookingDetails.start_time),
            endTime: new Date(bookingDetails.end_time),
            totalAmount: totalAmount,
            currency: "NGN",
            locationAddress: `${location.address_line1}, ${location.city}, ${location.state}`,
          },
          isCustomer ? "customer" : "business",
          reason
        ).catch(err => console.error("Failed to send cancellation notification:", err));
      }
    } catch (notificationError) {
      console.error("Error preparing cancellation notification:", notificationError);
    }
  }

  revalidatePath("/customer");
  revalidatePath("/customer/bookings");
  revalidatePath("/merchant/bookings");
  revalidatePath("/merchant/calendar");

  return { success: true };
}

// Get available time slots for a business
export async function getAvailableSlots(data: {
  business_id: string;
  staff_id?: string;
  date: string;
  duration_minutes: number;
}): Promise<{
  success: boolean;
  slots?: string[];
  error?: string;
}> {
  const supabase = await createClient();
  if (!supabase) {
    return { success: false, error: "Database not configured" };
  }

  const targetDate = new Date(data.date);
  const dayOfWeek = targetDate.getDay();

  // Get staff to check availability for
  let staffQuery = supabase
    .from("staff_members")
    .select("id")
    .eq("business_id", data.business_id)
    .eq("is_active", true);

  if (data.staff_id && data.staff_id !== "any") {
    staffQuery = staffQuery.eq("id", data.staff_id);
  }

  const { data: staffMembers } = await staffQuery;

  if (!staffMembers || staffMembers.length === 0) {
    return { success: false, error: "No staff available" };
  }

  const staffIds = staffMembers.map((s) => s.id);

  // Get availability rules for the day
  const { data: availabilityRules } = await supabase
    .from("availability_rules")
    .select("*")
    .in("staff_id", staffIds)
    .eq("day_of_week", dayOfWeek)
    .eq("is_active", true);

  if (!availabilityRules || availabilityRules.length === 0) {
    return { success: true, slots: [] };
  }

  // Get existing bookings for the day
  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999);

  const { data: existingBookings } = await supabase
    .from("bookings")
    .select("staff_id, start_time, end_time")
    .in("staff_id", staffIds)
    .gte("start_time", startOfDay.toISOString())
    .lte("start_time", endOfDay.toISOString())
    .not("status", "in", "(cancelled,no_show)");

  // Get blackouts
  const { data: blackouts } = await supabase
    .from("blackouts")
    .select("staff_id, start_datetime, end_datetime")
    .in("staff_id", staffIds)
    .lte("start_datetime", endOfDay.toISOString())
    .gte("end_datetime", startOfDay.toISOString());

  // Generate available slots
  const slots = new Set<string>();
  const now = new Date();

  for (const rule of availabilityRules) {
    const [startHour, startMin] = rule.start_time.split(":").map(Number);
    const [endHour, endMin] = rule.end_time.split(":").map(Number);

    // Generate 30-minute slots
    for (let hour = startHour; hour < endHour || (hour === endHour && 0 < endMin); hour++) {
      for (const minute of [0, 30]) {
        if (hour === endHour && minute >= endMin) continue;

        const slotStart = new Date(targetDate);
        slotStart.setHours(hour, minute, 0, 0);

        const slotEnd = new Date(slotStart.getTime() + data.duration_minutes * 60 * 1000);

        // Skip if slot is in the past
        if (slotStart <= now) continue;

        // Skip if slot ends after availability
        const availEnd = new Date(targetDate);
        availEnd.setHours(endHour, endMin, 0, 0);
        if (slotEnd > availEnd) continue;

        // Check for conflicts with existing bookings
        const hasConflict = existingBookings?.some((booking) => {
          if (booking.staff_id !== rule.staff_id) return false;
          const bookingStart = new Date(booking.start_time);
          const bookingEnd = new Date(booking.end_time);
          return slotStart < bookingEnd && slotEnd > bookingStart;
        });

        if (hasConflict) continue;

        // Check for blackouts
        const isBlackedOut = blackouts?.some((blackout) => {
          if (blackout.staff_id !== rule.staff_id) return false;
          const blackoutStart = new Date(blackout.start_datetime);
          const blackoutEnd = new Date(blackout.end_datetime);
          return slotStart < blackoutEnd && slotEnd > blackoutStart;
        });

        if (isBlackedOut) continue;

        // Add the slot
        const timeStr = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        slots.add(timeStr);
      }
    }
  }

  return {
    success: true,
    slots: Array.from(slots).sort(),
  };
}

// Get recent bookings count for notifications
export async function getRecentBookingsCount(): Promise<{
  success: boolean;
  count?: number;
  error?: string;
}> {
  const supabase = await createClient();
  if (!supabase) {
    return { success: false, error: "Database not configured" };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  if (!business) {
    return { success: false, error: "No business found" };
  }

  // Count bookings from the last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { count, error } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("business_id", business.id)
    .gte("created_at", sevenDaysAgo.toISOString());

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, count: count || 0 };
}
