import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/customer";

  if (code) {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.redirect(`${origin}/sign-in?error=supabase_not_configured`);
    }
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data?.user) {
      // Determine redirect based on user role
      let shouldRedirectToMerchant = false;

      // First check user metadata (set at signup time) - most reliable
      const userMetadataRole = data.user.user_metadata?.role;
      if (userMetadataRole === "partner" || userMetadataRole === "admin") {
        shouldRedirectToMerchant = true;
      } else {
        // Then try to get role from profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

        if (profile?.role === "partner" || profile?.role === "admin") {
          shouldRedirectToMerchant = true;
        }
      }

      // Redirect business users to merchant dashboard
      if (shouldRedirectToMerchant) {
        return NextResponse.redirect(`${origin}/merchant`);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/sign-in?error=auth_callback_error`);
}
