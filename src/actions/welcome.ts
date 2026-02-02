"use server";

import { sendWelcomeSMS, sendBusinessWelcomeSMS } from "@/lib/twilio";

// Send welcome SMS to new customer
export async function sendCustomerWelcome(phone: string, name: string): Promise<{
  success: boolean;
  error?: string;
}> {
  if (!phone) {
    return { success: false, error: "No phone number provided" };
  }

  return sendWelcomeSMS(phone, name);
}

// Send welcome SMS to new business owner
export async function sendBusinessOwnerWelcome(phone: string, businessName: string): Promise<{
  success: boolean;
  error?: string;
}> {
  if (!phone) {
    return { success: false, error: "No phone number provided" };
  }

  return sendBusinessWelcomeSMS(phone, businessName);
}
