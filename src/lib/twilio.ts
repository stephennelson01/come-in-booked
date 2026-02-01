import twilio from "twilio";

let twilioClient: twilio.Twilio | null = null;

export function getTwilioClient(): twilio.Twilio | null {
  if (twilioClient) return twilioClient;

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    console.warn("Twilio credentials not configured");
    return null;
  }

  twilioClient = twilio(accountSid, authToken);
  return twilioClient;
}

export function getTwilioFromNumber(): string | null {
  return process.env.TWILIO_FROM_NUMBER || null;
}

export async function sendSMS(to: string, message: string): Promise<{
  success: boolean;
  messageId?: string;
  error?: string;
}> {
  const client = getTwilioClient();
  const fromNumber = getTwilioFromNumber();

  if (!client || !fromNumber) {
    console.warn("Twilio not configured, skipping SMS");
    return { success: false, error: "SMS service not configured" };
  }

  // Ensure phone number is in E.164 format
  let formattedNumber = to.replace(/\s+/g, "").replace(/[^+\d]/g, "");

  // Add Nigeria country code if not present
  if (!formattedNumber.startsWith("+")) {
    if (formattedNumber.startsWith("0")) {
      formattedNumber = "+234" + formattedNumber.slice(1);
    } else if (formattedNumber.startsWith("234")) {
      formattedNumber = "+" + formattedNumber;
    } else {
      formattedNumber = "+234" + formattedNumber;
    }
  }

  try {
    const result = await client.messages.create({
      body: message,
      from: fromNumber,
      to: formattedNumber,
    });

    return { success: true, messageId: result.sid };
  } catch (error) {
    console.error("Failed to send SMS:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errorMessage };
  }
}
