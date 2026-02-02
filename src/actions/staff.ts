"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createStaffSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().max(20).optional(),
  title: z.string().max(100).optional(),
  bio: z.string().max(1000).optional(),
  service_ids: z.array(z.string().uuid()).optional(),
});

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

export interface AvailabilityRule {
  id: string;
  staff_id: string;
  location_id: string | null;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
}

// Get all staff for the current user's business
export async function getMyStaff(): Promise<{
  success: boolean;
  staff?: StaffMember[];
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

  // Get the user's business first
  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  if (!business) {
    return { success: false, error: "No business found" };
  }

  const { data: staff, error } = await supabase
    .from("staff_members")
    .select("*")
    .eq("business_id", business.id)
    .order("created_at", { ascending: true });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, staff: staff || [] };
}

// Get staff with their services
export async function getMyStaffWithServices(): Promise<{
  success: boolean;
  staff?: (StaffMember & { services: string[] })[];
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

  const { data: staff, error } = await supabase
    .from("staff_members")
    .select(`
      *,
      staff_services(service_id)
    `)
    .eq("business_id", business.id)
    .order("created_at", { ascending: true });

  if (error) {
    return { success: false, error: error.message };
  }

  const staffWithServices = staff?.map((s) => ({
    ...s,
    services: s.staff_services?.map((ss: { service_id: string }) => ss.service_id) || [],
  }));

  return { success: true, staff: staffWithServices || [] };
}

// Create a new staff member
export async function createStaffMember(data: {
  name: string;
  email?: string;
  phone?: string;
  title?: string;
  bio?: string;
  service_ids?: string[];
}): Promise<{
  success: boolean;
  staff?: StaffMember;
  error?: string;
}> {
  const parsed = createStaffSchema.safeParse(data);
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

  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  if (!business) {
    return { success: false, error: "No business found" };
  }

  // Use admin client to bypass RLS (ownership verified above)
  const adminClient = createAdminClient();
  if (!adminClient) {
    return { success: false, error: "Database not configured" };
  }

  const { data: staff, error } = await adminClient
    .from("staff_members")
    .insert({
      business_id: business.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      title: data.title,
      bio: data.bio,
      is_active: true,
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  // Add staff-service relationships
  if (data.service_ids && data.service_ids.length > 0) {
    const staffServices = data.service_ids.map((service_id) => ({
      staff_id: staff.id,
      service_id,
    }));

    await adminClient.from("staff_services").insert(staffServices);
  }

  // Create default availability (Mon-Fri 9-17, Sat 10-16)
  const defaultAvailability = [
    { day_of_week: 1, start_time: "09:00", end_time: "17:00" },
    { day_of_week: 2, start_time: "09:00", end_time: "17:00" },
    { day_of_week: 3, start_time: "09:00", end_time: "17:00" },
    { day_of_week: 4, start_time: "09:00", end_time: "17:00" },
    { day_of_week: 5, start_time: "09:00", end_time: "17:00" },
    { day_of_week: 6, start_time: "10:00", end_time: "16:00" },
  ];

  await adminClient.from("availability_rules").insert(
    defaultAvailability.map((rule) => ({
      staff_id: staff.id,
      ...rule,
      is_active: true,
    }))
  );

  revalidatePath("/merchant/staff");
  return { success: true, staff };
}

// Update a staff member
export async function updateStaffMember(
  staffId: string,
  data: Partial<{
    name: string;
    email: string;
    phone: string;
    title: string;
    bio: string;
    avatar_url: string;
    is_active: boolean;
    service_ids: string[];
  }>
): Promise<{ success: boolean; error?: string }> {
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

  // Verify ownership
  const { data: staff } = await supabase
    .from("staff_members")
    .select("business_id, businesses(owner_id)")
    .eq("id", staffId)
    .single();

  if (!staff || (staff.businesses as unknown as { owner_id: string } | null)?.owner_id !== user.id) {
    return { success: false, error: "Unauthorized" };
  }

  // Use admin client to bypass RLS (ownership verified above)
  const adminClient = createAdminClient();
  if (!adminClient) {
    return { success: false, error: "Database not configured" };
  }

  // Extract service_ids from data
  const { service_ids, ...staffData } = data;

  if (Object.keys(staffData).length > 0) {
    const { error } = await adminClient
      .from("staff_members")
      .update(staffData)
      .eq("id", staffId);

    if (error) {
      return { success: false, error: error.message };
    }
  }

  // Update service relationships if provided
  if (service_ids !== undefined) {
    // Remove existing relationships
    await adminClient.from("staff_services").delete().eq("staff_id", staffId);

    // Add new relationships
    if (service_ids.length > 0) {
      const staffServices = service_ids.map((service_id) => ({
        staff_id: staffId,
        service_id,
      }));

      await adminClient.from("staff_services").insert(staffServices);
    }
  }

  revalidatePath("/merchant/staff");
  return { success: true };
}

// Delete a staff member
export async function deleteStaffMember(staffId: string): Promise<{
  success: boolean;
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

  // Verify ownership
  const { data: staff } = await supabase
    .from("staff_members")
    .select("business_id, businesses(owner_id)")
    .eq("id", staffId)
    .single();

  if (!staff || (staff.businesses as unknown as { owner_id: string } | null)?.owner_id !== user.id) {
    return { success: false, error: "Unauthorized" };
  }

  // Use admin client to bypass RLS (ownership verified above)
  const adminClient = createAdminClient();
  if (!adminClient) {
    return { success: false, error: "Database not configured" };
  }

  // Check if staff has any bookings
  const { count } = await adminClient
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("staff_id", staffId);

  if (count && count > 0) {
    // Soft delete by deactivating
    const { error } = await adminClient
      .from("staff_members")
      .update({ is_active: false })
      .eq("id", staffId);

    if (error) {
      return { success: false, error: error.message };
    }
  } else {
    // Hard delete if no bookings
    const { error } = await adminClient
      .from("staff_members")
      .delete()
      .eq("id", staffId);

    if (error) {
      return { success: false, error: error.message };
    }
  }

  revalidatePath("/merchant/staff");
  return { success: true };
}

// Get availability for a staff member
export async function getStaffAvailability(staffId: string): Promise<{
  success: boolean;
  availability?: AvailabilityRule[];
  error?: string;
}> {
  const supabase = await createClient();
  if (!supabase) {
    return { success: false, error: "Database not configured" };
  }

  const { data, error } = await supabase
    .from("availability_rules")
    .select("*")
    .eq("staff_id", staffId)
    .eq("is_active", true)
    .order("day_of_week", { ascending: true });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, availability: data || [] };
}

// Update availability for a staff member
export async function updateStaffAvailability(
  staffId: string,
  availability: Array<{
    day_of_week: number;
    start_time: string;
    end_time: string;
    is_active: boolean;
  }>
): Promise<{ success: boolean; error?: string }> {
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

  // Verify ownership
  const { data: staff } = await supabase
    .from("staff_members")
    .select("business_id, businesses(owner_id)")
    .eq("id", staffId)
    .single();

  if (!staff || (staff.businesses as unknown as { owner_id: string } | null)?.owner_id !== user.id) {
    return { success: false, error: "Unauthorized" };
  }

  // Use admin client to bypass RLS (ownership verified above)
  const adminClient = createAdminClient();
  if (!adminClient) {
    return { success: false, error: "Database not configured" };
  }

  // Delete existing availability
  await adminClient.from("availability_rules").delete().eq("staff_id", staffId);

  // Insert new availability
  const rules = availability.map((rule) => ({
    staff_id: staffId,
    day_of_week: rule.day_of_week,
    start_time: rule.start_time,
    end_time: rule.end_time,
    is_active: rule.is_active,
  }));

  const { error } = await adminClient.from("availability_rules").insert(rules);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/merchant/staff");
  return { success: true };
}
