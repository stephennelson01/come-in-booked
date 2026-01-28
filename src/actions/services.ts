"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createServiceSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  description: z.string().max(1000).optional(),
  duration_minutes: z.number().int().min(5, "Duration must be at least 5 minutes").max(480),
  price: z.number().min(0, "Price must be non-negative"),
  category: z.string().max(100).optional(),
});

const updateServiceSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  duration_minutes: z.number().int().min(5).max(480).optional(),
  price: z.number().min(0).optional(),
  category: z.string().max(100).optional(),
  is_active: z.boolean().optional(),
  sort_order: z.number().int().min(0).optional(),
});

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

// Get all services for the current user's business
export async function getMyServices(): Promise<{
  success: boolean;
  services?: Service[];
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

  const { data: services, error } = await supabase
    .from("services")
    .select("*")
    .eq("business_id", business.id)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, services: services || [] };
}

// Get services for a specific business (public)
export async function getBusinessServices(businessId: string): Promise<{
  success: boolean;
  services?: Service[];
  error?: string;
}> {
  const supabase = await createClient();
  if (!supabase) {
    return { success: false, error: "Database not configured" };
  }

  const { data: services, error } = await supabase
    .from("services")
    .select("*")
    .eq("business_id", businessId)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, services: services || [] };
}

// Create a new service
export async function createService(data: {
  name: string;
  description?: string;
  duration_minutes: number;
  price: number;
  category?: string;
}): Promise<{
  success: boolean;
  service?: Service;
  error?: string;
}> {
  const parsed = createServiceSchema.safeParse(data);
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

  // Get the user's business
  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  if (!business) {
    return { success: false, error: "No business found" };
  }

  // Get max sort_order
  const { data: maxSort } = await supabase
    .from("services")
    .select("sort_order")
    .eq("business_id", business.id)
    .order("sort_order", { ascending: false })
    .limit(1)
    .single();

  const { data: service, error } = await supabase
    .from("services")
    .insert({
      business_id: business.id,
      name: data.name,
      description: data.description,
      duration_minutes: data.duration_minutes,
      price: data.price,
      currency: "NGN",
      category: data.category,
      is_active: true,
      sort_order: (maxSort?.sort_order || 0) + 1,
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/merchant/services");
  return { success: true, service };
}

// Update a service
export async function updateService(
  serviceId: string,
  data: Partial<{
    name: string;
    description: string;
    duration_minutes: number;
    price: number;
    category: string;
    is_active: boolean;
    sort_order: number;
  }>
): Promise<{ success: boolean; error?: string }> {
  if (!z.string().uuid().safeParse(serviceId).success) {
    return { success: false, error: "Invalid service ID" };
  }
  const parsed = updateServiceSchema.safeParse(data);
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

  // Verify ownership via business
  const { data: service } = await supabase
    .from("services")
    .select("business_id, businesses(owner_id)")
    .eq("id", serviceId)
    .single();

  if (!service || (service.businesses as unknown as { owner_id: string } | null)?.owner_id !== user.id) {
    return { success: false, error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("services")
    .update(data)
    .eq("id", serviceId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/merchant/services");
  return { success: true };
}

// Delete a service
export async function deleteService(serviceId: string): Promise<{
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

  // Verify ownership via business
  const { data: service } = await supabase
    .from("services")
    .select("business_id, businesses(owner_id)")
    .eq("id", serviceId)
    .single();

  if (!service || (service.businesses as unknown as { owner_id: string } | null)?.owner_id !== user.id) {
    return { success: false, error: "Unauthorized" };
  }

  // Check if service has any active bookings
  const { count } = await supabase
    .from("booking_items")
    .select("*", { count: "exact", head: true })
    .eq("service_id", serviceId);

  if (count && count > 0) {
    // Soft delete by deactivating
    const { error } = await supabase
      .from("services")
      .update({ is_active: false })
      .eq("id", serviceId);

    if (error) {
      return { success: false, error: error.message };
    }
  } else {
    // Hard delete if no bookings
    const { error } = await supabase
      .from("services")
      .delete()
      .eq("id", serviceId);

    if (error) {
      return { success: false, error: error.message };
    }
  }

  revalidatePath("/merchant/services");
  return { success: true };
}

// Toggle service active status
export async function toggleServiceActive(serviceId: string): Promise<{
  success: boolean;
  is_active?: boolean;
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

  // Get current service
  const { data: service } = await supabase
    .from("services")
    .select("is_active, business_id, businesses(owner_id)")
    .eq("id", serviceId)
    .single();

  if (!service || (service.businesses as unknown as { owner_id: string } | null)?.owner_id !== user.id) {
    return { success: false, error: "Unauthorized" };
  }

  const newStatus = !service.is_active;

  const { error } = await supabase
    .from("services")
    .update({ is_active: newStatus })
    .eq("id", serviceId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/merchant/services");
  return { success: true, is_active: newStatus };
}
