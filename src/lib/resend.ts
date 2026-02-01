import { Resend } from "resend";

let resendClient: Resend | null = null;

export function getResendClient(): Resend | null {
  if (resendClient) return resendClient;

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn("Resend API key not configured");
    return null;
  }

  resendClient = new Resend(apiKey);
  return resendClient;
}

export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<{
  success: boolean;
  emailId?: string;
  error?: string;
}> {
  const client = getResendClient();

  if (!client) {
    console.warn("Resend not configured, skipping email");
    return { success: false, error: "Email service not configured" };
  }

  try {
    const result = await client.emails.send({
      from: "ComeInBooked <bookings@comeinbooked.com>",
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text,
    });

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    return { success: true, emailId: result.data?.id };
  } catch (error) {
    console.error("Failed to send email:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errorMessage };
  }
}
