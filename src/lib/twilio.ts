import twilio from "twilio";

let twilioClient: twilio.Twilio | null = null;

// Alphanumeric Sender ID - shows "ComeInBooked" instead of phone number
const SENDER_ID = "ComeInBooked";

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

// Format phone number to E.164 format (Nigeria)
function formatPhoneNumber(phone: string): string {
  let formattedNumber = phone.replace(/\s+/g, "").replace(/[^+\d]/g, "");

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

  return formattedNumber;
}

export async function sendSMS(to: string, message: string): Promise<{
  success: boolean;
  messageId?: string;
  error?: string;
}> {
  const client = getTwilioClient();

  if (!client) {
    console.warn("Twilio not configured, skipping SMS");
    return { success: false, error: "SMS service not configured" };
  }

  const formattedNumber = formatPhoneNumber(to);

  try {
    const result = await client.messages.create({
      body: message,
      from: SENDER_ID,
      to: formattedNumber,
    });

    return { success: true, messageId: result.sid };
  } catch (error) {
    console.error("Failed to send SMS:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errorMessage };
  }
}

// Send welcome SMS to new users
export async function sendWelcomeSMS(to: string, name: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const message = `Welcome to ComeInBooked, ${name}! 🎉 Book appointments with top service providers near you. Visit comeinbooked.com to get started.`;

  return sendSMS(to, message);
}

// Send welcome SMS to new business owners
export async function sendBusinessWelcomeSMS(to: string, businessName: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const message = `Welcome to ComeInBooked, ${businessName}! 🎉 Your business is now live. Add services and start accepting bookings at comeinbooked.com/merchant`;

  return sendSMS(to, message);
}
