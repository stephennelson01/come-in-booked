"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export interface BusinessHours {
  dayOfWeek: number;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

// Default business hours (Mon-Sat 8am-8pm, Sun closed)
export const DEFAULT_BUSINESS_HOURS: BusinessHours[] = [
  { dayOfWeek: 0, isOpen: false, openTime: "08:00", closeTime: "20:00" }, // Sunday
  { dayOfWeek: 1, isOpen: true, openTime: "08:00", closeTime: "20:00" }, // Monday
  { dayOfWeek: 2, isOpen: true, openTime: "08:00", closeTime: "20:00" }, // Tuesday
  { dayOfWeek: 3, isOpen: true, openTime: "08:00", closeTime: "20:00" }, // Wednesday
  { dayOfWeek: 4, isOpen: true, openTime: "08:00", closeTime: "20:00" }, // Thursday
  { dayOfWeek: 5, isOpen: true, openTime: "08:00", closeTime: "20:00" }, // Friday
  { dayOfWeek: 6, isOpen: true, openTime: "08:00", closeTime: "20:00" }, // Saturday
];

export const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Get business hours from staff availability (aggregated from all staff)
export async function getBusinessHours(): Promise<{
  success: boolean;
  hours?: BusinessHours[];
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

  // Get all staff members
  const { data: staff } = await supabase
    .from("staff_members")
    .select("id")
    .eq("business_id", business.id)
    .eq("is_active", true);

  if (!staff || staff.length === 0) {
    // No staff, return default hours
    return { success: true, hours: DEFAULT_BUSINESS_HOURS };
  }

  const staffIds = staff.map((s) => s.id);

  // Get availability rules for all staff
  const { data: rules } = await supabase
    .from("availability_rules")
    .select("day_of_week, start_time, end_time, is_active")
    .in("staff_id", staffIds)
    .eq("is_active", true);

  if (!rules || rules.length === 0) {
    return { success: true, hours: DEFAULT_BUSINESS_HOURS };
  }

  // Aggregate hours by day - find earliest start and latest end for each day
  const hoursByDay = new Map<number, { start: string; end: string }>();

  for (const rule of rules) {
    const existing = hoursByDay.get(rule.day_of_week);
    if (!existing) {
      hoursByDay.set(rule.day_of_week, {
        start: rule.start_time,
        end: rule.end_time,
      });
    } else {
      // Keep earliest start and latest end
      if (rule.start_time < existing.start) {
        existing.start = rule.start_time;
      }
      if (rule.end_time > existing.end) {
        existing.end = rule.end_time;
      }
    }
  }

  // Build the hours array
  const hours: BusinessHours[] = [];
  for (let day = 0; day < 7; day++) {
    const dayHours = hoursByDay.get(day);
    if (dayHours) {
      hours.push({
        dayOfWeek: day,
        isOpen: true,
        openTime: dayHours.start.slice(0, 5), // "HH:MM"
        closeTime: dayHours.end.slice(0, 5),
      });
    } else {
      hours.push({
        dayOfWeek: day,
        isOpen: false,
        openTime: "08:00",
        closeTime: "20:00",
      });
    }
  }

  return { success: true, hours };
}

// Update business hours (updates all staff availability)
export async function updateBusinessHours(
  hours: BusinessHours[]
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

  // Get the user's business
  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  if (!business) {
    return { success: false, error: "No business found" };
  }

  // Get all active staff members
  const { data: staff } = await supabase
    .from("staff_members")
    .select("id")
    .eq("business_id", business.id)
    .eq("is_active", true);

  if (!staff || staff.length === 0) {
    return { success: false, error: "No staff members found. Add staff first." };
  }

  const adminClient = createAdminClient();
  if (!adminClient) {
    return { success: false, error: "Database not configured" };
  }

  // Update availability for each staff member
  for (const staffMember of staff) {
    // Delete existing rules for this staff member
    await adminClient
      .from("availability_rules")
      .delete()
      .eq("staff_id", staffMember.id);

    // Insert new rules for days that are open
    const newRules = hours
      .filter((h) => h.isOpen)
      .map((h) => ({
        staff_id: staffMember.id,
        day_of_week: h.dayOfWeek,
        start_time: h.openTime,
        end_time: h.closeTime,
        is_active: true,
      }));

    if (newRules.length > 0) {
      const { error } = await adminClient
        .from("availability_rules")
        .insert(newRules);

      if (error) {
        return { success: false, error: error.message };
      }
    }
  }

  revalidatePath("/merchant/settings");
  return { success: true };
}
