"use server";

import { createClient } from "@/lib/supabase/server";

export interface SearchResult {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  category: string;
  cover_image_url: string | null;
  rating: number | null;
  review_count: number;
  location: {
    city: string;
    state: string;
  } | null;
  latitude: number | null;
  longitude: number | null;
}

export async function searchBusinesses(params: {
  query?: string;
  category?: string;
  sort?: string;
}): Promise<{
  success: boolean;
  businesses?: SearchResult[];
  error?: string;
}> {
  const supabase = await createClient();
  if (!supabase) {
    return { success: false, error: "Database not configured" };
  }

  let query = supabase
    .from("businesses")
    .select(`
      id,
      slug,
      name,
      description,
      category,
      cover_image_url,
      locations!inner(city, state, latitude, longitude, is_primary),
      reviews(rating)
    `)
    .eq("is_active", true)
    .eq("locations.is_primary", true);

  // Text search
  if (params.query) {
    query = query.or(
      `name.ilike.%${params.query}%,description.ilike.%${params.query}%,category.ilike.%${params.query}%`
    );
  }

  // Category filter
  if (params.category) {
    const categoryLabel = params.category.replace(/-/g, " ");
    query = query.ilike("category", `%${categoryLabel}%`);
  }

  const { data: businesses, error } = await query;

  if (error) {
    return { success: false, error: error.message };
  }

  // Transform results
  const results: SearchResult[] = (businesses || []).map((b) => {
    const primaryLocation = Array.isArray(b.locations) ? b.locations[0] : b.locations;
    const reviews = b.reviews || [];
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / reviews.length
        : null;

    return {
      id: b.id,
      slug: b.slug,
      name: b.name,
      description: b.description,
      category: b.category,
      cover_image_url: b.cover_image_url,
      rating: avgRating ? Math.round(avgRating * 10) / 10 : null,
      review_count: reviews.length,
      location: primaryLocation
        ? { city: primaryLocation.city, state: primaryLocation.state }
        : null,
      latitude: primaryLocation?.latitude ?? null,
      longitude: primaryLocation?.longitude ?? null,
    };
  });

  // Sort results
  switch (params.sort) {
    case "rating":
      results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    case "reviews":
      results.sort((a, b) => b.review_count - a.review_count);
      break;
    default:
      // Default sort by name
      results.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }

  return { success: true, businesses: results };
}
