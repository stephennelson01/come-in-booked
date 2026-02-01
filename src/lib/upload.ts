import { createClient } from "@/lib/supabase/client";

export async function uploadServiceImage(
  file: File,
  businessId: string
): Promise<{ url: string | null; error: string | null }> {
  const supabase = createClient();
  if (!supabase) {
    return { url: null, error: "Storage not configured" };
  }

  // Validate file type
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    return { url: null, error: "Invalid file type. Please upload a JPG, PNG, WebP, or GIF image." };
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return { url: null, error: "File too large. Maximum size is 5MB." };
  }

  // Generate unique filename
  const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const fileName = `${businessId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from("service-images")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    console.error("Upload error:", uploadError);
    return { url: null, error: uploadError.message };
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from("service-images")
    .getPublicUrl(fileName);

  return { url: publicUrl, error: null };
}

export async function deleteServiceImage(imageUrl: string): Promise<{ error: string | null }> {
  const supabase = createClient();
  if (!supabase) {
    return { error: "Storage not configured" };
  }

  // Extract file path from URL
  const urlParts = imageUrl.split("/service-images/");
  if (urlParts.length !== 2) {
    return { error: "Invalid image URL" };
  }

  const filePath = urlParts[1];

  const { error } = await supabase.storage
    .from("service-images")
    .remove([filePath]);

  if (error) {
    console.error("Delete error:", error);
    return { error: error.message };
  }

  return { error: null };
}
