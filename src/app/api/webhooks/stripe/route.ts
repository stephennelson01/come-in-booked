import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/config";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import Stripe from "stripe";

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createAdminClient(url, serviceKey);
}

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not configured");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error(`Webhook signature verification failed: ${errorMessage}`);
    return NextResponse.json(
      { error: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    );
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.error("Supabase admin client not available for webhook processing");
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 500 }
    );
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const bookingId = paymentIntent.metadata?.booking_id;

        // Update payment record
        const { error: paymentError } = await supabase
          .from("payments")
          .update({ status: "succeeded" })
          .eq("stripe_payment_intent_id", paymentIntent.id);

        if (paymentError) {
          console.error("Failed to update payment status:", paymentError);
        }

        // Update booking to confirmed
        if (bookingId) {
          const { error: bookingError } = await supabase
            .from("bookings")
            .update({ status: "confirmed" })
            .eq("id", bookingId)
            .eq("status", "pending");

          if (bookingError) {
            console.error("Failed to update booking status:", bookingError);
          }
        }

        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const bookingId = paymentIntent.metadata?.booking_id;

        // Update payment record
        const { error: paymentError } = await supabase
          .from("payments")
          .update({ status: "failed" })
          .eq("stripe_payment_intent_id", paymentIntent.id);

        if (paymentError) {
          console.error("Failed to update payment status:", paymentError);
        }

        // Cancel the booking if payment failed
        if (bookingId) {
          const { error: bookingError } = await supabase
            .from("bookings")
            .update({
              status: "cancelled",
              cancellation_reason: "Payment failed",
              cancelled_at: new Date().toISOString(),
            })
            .eq("id", bookingId)
            .eq("status", "pending");

          if (bookingError) {
            console.error("Failed to cancel booking:", bookingError);
          }
        }

        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        const paymentIntentId = charge.payment_intent as string;

        if (paymentIntentId) {
          const refundAmount = charge.amount_refunded / 100; // Convert from cents

          const { error } = await supabase
            .from("payments")
            .update({
              status: "refunded",
              refund_amount: refundAmount,
              refunded_at: new Date().toISOString(),
            })
            .eq("stripe_payment_intent_id", paymentIntentId);

          if (error) {
            console.error("Failed to update payment refund:", error);
          }
        }

        break;
      }

      case "account.updated": {
        const account = event.data.object as Stripe.Account;

        const onboardingComplete =
          account.charges_enabled &&
          account.payouts_enabled &&
          account.details_submitted;

        const { error } = await supabase
          .from("businesses")
          .update({
            stripe_onboarding_complete: onboardingComplete,
          })
          .eq("stripe_account_id", account.id);

        if (error) {
          console.error("Failed to update business Stripe status:", error);
        }

        break;
      }

      case "account.application.deauthorized": {
        // When a connected account disconnects, clear their Stripe info
        // We use the account ID from the event's connected account context
        const connectedAccountId = event.account;
        if (connectedAccountId) {
          const { error } = await supabase
            .from("businesses")
            .update({
              stripe_account_id: null,
              stripe_onboarding_complete: false,
            })
            .eq("stripe_account_id", connectedAccountId);

          if (error) {
            console.error("Failed to handle account disconnection:", error);
          }
        }

        break;
      }

      default:
        // Unhandled event types are fine - just acknowledge receipt
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
