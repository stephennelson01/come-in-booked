"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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
}

// Get the current user's business
export async function getMyBusiness(): Promise<{
  success: boolean;
  business?: Business & { location?: Location };
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

  const { data: business, error } = await supabase
    .from("businesses")
    .select("*, locations(*)")
    .eq("owner_id", user.id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return { success: false, error: "No business found" };
    }
    return { success: false, error: error.message };
  }

  const primaryLocation = business.locations?.find((l: Location) => l.is_primary) || business.locations?.[0];

  return {
    success: true,
    business: {
      ...business,
      location: primaryLocation,
    },
  };
}

// Get a business by slug (public)
export async function getBusinessBySlug(slug: string): Promise<{
  success: boolean;
  business?: Business & {
    location?: Location;
    services?: Array<{
      id: string;
      name: string;
      description: string | null;
      duration_minutes: number;
      price: number;
      category: string | null;
      is_active: boolean;
    }>;
    staff?: Array<{
      id: string;
      name: string;
      title: string | null;
      avatar_url: string | null;
      bio: string | null;
    }>;
    reviews?: Array<{
      id: string;
      rating: number;
      comment: string | null;
      created_at: string;
      customer: { full_name: string | null };
    }>;
  };
  error?: string;
}> {
  const supabase = await createClient();
  if (!supabase) {
    return { success: false, error: "Database not configured" };
  }

  const { data: business, error } = await supabase
    .from("businesses")
    .select(`
      *,
      locations(*),
      services(id, name, description, duration_minutes, price, category, is_active, sort_order),
      staff_members(id, name, title, avatar_url, bio, is_active),
      reviews(id, rating, comment, created_at, customer:profiles(full_name))
    `)
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return { success: false, error: "Business not found" };
    }
    return { success: false, error: error.message };
  }

  const primaryLocation = business.locations?.find((l: Location) => l.is_primary) || business.locations?.[0];
  const activeServices = business.services?.filter((s: { is_active: boolean }) => s.is_active) || [];
  const activeStaff = business.staff_members?.filter((s: { is_active: boolean }) => s.is_active) || [];

  return {
    success: true,
    business: {
      ...business,
      location: primaryLocation,
      services: activeServices,
      staff: activeStaff,
      reviews: business.reviews || [],
    },
  };
}

// Create a new business
export async function createBusiness(data: {
  name: string;
  category: string;
  description?: string;
  phone?: string;
  email?: string;
  website?: string;
  address_line1: string;
  city: string;
  state: string;
  postal_code: string;
  country?: string;
}): Promise<{
  success: boolean;
  business?: Business;
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

  // Generate slug from name
  const baseSlug = data.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  // Check for existing slug and make unique if needed
  const { data: existingSlugs } = await supabase
    .from("businesses")
    .select("slug")
    .ilike("slug", `${baseSlug}%`);

  let slug = baseSlug;
  if (existingSlugs && existingSlugs.length > 0) {
    const slugSet = new Set(existingSlugs.map((b) => b.slug));
    let counter = 1;
    while (slugSet.has(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  // Create business
  const { data: business, error: businessError } = await supabase
    .from("businesses")
    .insert({
      owner_id: user.id,
      name: data.name,
      slug,
      description: data.description,
      category: data.category,
      phone: data.phone,
      email: data.email || user.email,
      website: data.website,
    })
    .select()
    .single();

  if (businessError) {
    return { success: false, error: businessError.message };
  }

  // Create primary location
  const { error: locationError } = await supabase.from("locations").insert({
    business_id: business.id,
    name: "Main Location",
    address_line1: data.address_line1,
    city: data.city,
    state: data.state,
    postal_code: data.postal_code,
    country: data.country || "NG",
    is_primary: true,
    phone: data.phone,
  });

  if (locationError) {
    // Rollback business creation
    await supabase.from("businesses").delete().eq("id", business.id);
    return { success: false, error: locationError.message };
  }

  revalidatePath("/merchant");
  return { success: true, business };
}

// Update business
export async function updateBusiness(
  businessId: string,
  data: Partial<{
    name: string;
    description: string;
    category: string;
    phone: string;
    email: string;
    website: string;
    logo_url: string;
    cover_image_url: string;
    stripe_account_id: string;
    stripe_onboarding_complete: boolean;
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
  const { data: business } = await supabase
    .from("businesses")
    .select("owner_id")
    .eq("id", businessId)
    .single();

  if (!business || business.owner_id !== user.id) {
    return { success: false, error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("businesses")
    .update(data)
    .eq("id", businessId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/merchant");
  revalidatePath("/merchant/settings");
  return { success: true };
}

// Update location
export async function updateLocation(
  locationId: string,
  data: Partial<{
    name: string;
    address_line1: string;
    address_line2: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    phone: string;
    latitude: number;
    longitude: number;
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

  // Verify ownership via business
  const { data: location } = await supabase
    .from("locations")
    .select("business_id, businesses(owner_id)")
    .eq("id", locationId)
    .single();

  if (!location || (location.businesses as unknown as { owner_id: string } | null)?.owner_id !== user.id) {
    return { success: false, error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("locations")
    .update(data)
    .eq("id", locationId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/merchant/settings");
  return { success: true };
}
