"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export interface Review {
  id: string;
  business_id: string;
  booking_id: string;
  customer_id: string;
  rating: number;
  comment: string | null;
  response: string | null;
  responded_at: string | null;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReviewWithDetails extends Review {
  customer: {
    full_name: string | null;
    avatar_url: string | null;
  };
  booking: {
    id: string;
    start_time: string;
    items: Array<{ service_name: string }>;
  };
}

const createReviewSchema = z.object({
  booking_id: z.string().uuid("Invalid booking ID"),
  rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
  comment: z.string().max(2000, "Comment too long").optional(),
});

const respondToReviewSchema = z.object({
  review_id: z.string().uuid("Invalid review ID"),
  response: z.string().min(1, "Response is required").max(2000, "Response too long"),
});

// Create a review for a completed booking
export async function createReview(data: {
  booking_id: string;
  rating: number;
  comment?: string;
}): Promise<{
  success: boolean;
  review?: Review;
  error?: string;
}> {
  const parsed = createReviewSchema.safeParse(data);
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

  // Verify the booking belongs to this user and is completed
  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .select("id, business_id, customer_id, status")
    .eq("id", data.booking_id)
    .single();

  if (bookingError || !booking) {
    return { success: false, error: "Booking not found" };
  }

  if (booking.customer_id !== user.id) {
    return { success: false, error: "You can only review your own bookings" };
  }

  if (booking.status !== "completed") {
    return { success: false, error: "You can only review completed bookings" };
  }

  // Check if a review already exists for this booking
  const { data: existingReview } = await supabase
    .from("reviews")
    .select("id")
    .eq("booking_id", data.booking_id)
    .single();

  if (existingReview) {
    return { success: false, error: "You have already reviewed this booking" };
  }

  // Create the review using admin client to bypass RLS
  const adminClient = createAdminClient();
  if (!adminClient) {
    return { success: false, error: "Database not configured" };
  }

  const { data: review, error } = await adminClient
    .from("reviews")
    .insert({
      business_id: booking.business_id,
      booking_id: data.booking_id,
      customer_id: user.id,
      rating: data.rating,
      comment: data.comment || null,
      is_visible: true,
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/customer");
  revalidatePath("/customer/bookings");
  revalidatePath("/merchant/reviews");

  return { success: true, review };
}

// Update a review (customer can update their own)
export async function updateReview(
  reviewId: string,
  data: {
    rating?: number;
    comment?: string;
  }
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
  const { data: review } = await supabase
    .from("reviews")
    .select("customer_id")
    .eq("id", reviewId)
    .single();

  if (!review || review.customer_id !== user.id) {
    return { success: false, error: "Unauthorized" };
  }

  const updateData: Record<string, unknown> = {};
  if (data.rating !== undefined) {
    if (data.rating < 1 || data.rating > 5) {
      return { success: false, error: "Rating must be between 1 and 5" };
    }
    updateData.rating = data.rating;
  }
  if (data.comment !== undefined) {
    updateData.comment = data.comment;
  }

  const adminClient = createAdminClient();
  if (!adminClient) {
    return { success: false, error: "Database not configured" };
  }

  const { error } = await adminClient
    .from("reviews")
    .update(updateData)
    .eq("id", reviewId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/customer");
  revalidatePath("/merchant/reviews");

  return { success: true };
}

// Business owner responds to a review
export async function respondToReview(data: {
  review_id: string;
  response: string;
}): Promise<{ success: boolean; error?: string }> {
  const parsed = respondToReviewSchema.safeParse(data);
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

  // Verify the user owns the business
  const { data: review } = await supabase
    .from("reviews")
    .select("business_id, businesses(owner_id)")
    .eq("id", data.review_id)
    .single();

  if (!review) {
    return { success: false, error: "Review not found" };
  }

  const business = review.businesses as unknown as { owner_id: string } | null;
  if (!business || business.owner_id !== user.id) {
    return { success: false, error: "Unauthorized" };
  }

  const adminClient = createAdminClient();
  if (!adminClient) {
    return { success: false, error: "Database not configured" };
  }

  const { error } = await adminClient
    .from("reviews")
    .update({
      response: data.response,
      responded_at: new Date().toISOString(),
    })
    .eq("id", data.review_id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/merchant/reviews");

  return { success: true };
}

// Get reviews for a business (public)
export async function getBusinessReviews(businessId: string): Promise<{
  success: boolean;
  reviews?: ReviewWithDetails[];
  averageRating?: number;
  totalCount?: number;
  error?: string;
}> {
  const supabase = await createClient();
  if (!supabase) {
    return { success: false, error: "Database not configured" };
  }

  const { data: reviews, error } = await supabase
    .from("reviews")
    .select(`
      *,
      customer:profiles(full_name, avatar_url),
      booking:bookings(id, start_time, items:booking_items(service_name))
    `)
    .eq("business_id", businessId)
    .eq("is_visible", true)
    .order("created_at", { ascending: false });

  if (error) {
    return { success: false, error: error.message };
  }

  const totalCount = reviews?.length || 0;
  const averageRating =
    totalCount > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalCount
      : 0;

  return {
    success: true,
    reviews: reviews as ReviewWithDetails[],
    averageRating: Math.round(averageRating * 10) / 10,
    totalCount,
  };
}

// Get reviews for merchant's business
export async function getMyBusinessReviews(): Promise<{
  success: boolean;
  reviews?: ReviewWithDetails[];
  averageRating?: number;
  totalCount?: number;
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

  const { data: reviews, error } = await supabase
    .from("reviews")
    .select(`
      *,
      customer:profiles(full_name, avatar_url),
      booking:bookings(id, start_time, items:booking_items(service_name))
    `)
    .eq("business_id", business.id)
    .order("created_at", { ascending: false });

  if (error) {
    return { success: false, error: error.message };
  }

  const totalCount = reviews?.length || 0;
  const averageRating =
    totalCount > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalCount
      : 0;

  return {
    success: true,
    reviews: reviews as ReviewWithDetails[],
    averageRating: Math.round(averageRating * 10) / 10,
    totalCount,
  };
}

// Check if user can review a booking
export async function canReviewBooking(bookingId: string): Promise<{
  success: boolean;
  canReview: boolean;
  existingReview?: Review;
  error?: string;
}> {
  const supabase = await createClient();
  if (!supabase) {
    return { success: false, canReview: false, error: "Database not configured" };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, canReview: false, error: "Not authenticated" };
  }

  // Check the booking
  const { data: booking } = await supabase
    .from("bookings")
    .select("id, customer_id, status")
    .eq("id", bookingId)
    .single();

  if (!booking) {
    return { success: false, canReview: false, error: "Booking not found" };
  }

  if (booking.customer_id !== user.id) {
    return { success: false, canReview: false, error: "Not your booking" };
  }

  if (booking.status !== "completed") {
    return { success: true, canReview: false };
  }

  // Check if review already exists
  const { data: existingReview } = await supabase
    .from("reviews")
    .select("*")
    .eq("booking_id", bookingId)
    .single();

  if (existingReview) {
    return {
      success: true,
      canReview: false,
      existingReview: existingReview as Review,
    };
  }

  return { success: true, canReview: true };
}

// Delete a review (customer can delete their own)
export async function deleteReview(reviewId: string): Promise<{
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
  const { data: review } = await supabase
    .from("reviews")
    .select("customer_id")
    .eq("id", reviewId)
    .single();

  if (!review || review.customer_id !== user.id) {
    return { success: false, error: "Unauthorized" };
  }

  const adminClient = createAdminClient();
  if (!adminClient) {
    return { success: false, error: "Database not configured" };
  }

  const { error } = await adminClient
    .from("reviews")
    .delete()
    .eq("id", reviewId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/customer");
  revalidatePath("/merchant/reviews");

  return { success: true };
}
