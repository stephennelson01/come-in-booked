"use server";

import { z } from "zod";

const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export async function submitContactForm(data: ContactFormData): Promise<{
  success: boolean;
  error?: string;
}> {
  const parsed = contactSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { firstName, lastName, email, subject, message } = parsed.data;

  // Try sending via Resend if configured
  if (process.env.RESEND_API_KEY) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: "ComeInBooked <noreply@comeinbooked.com>",
        to: ["support@comeinbooked.com"],
        replyTo: email,
        subject: `[Contact Form] ${subject} - ${firstName} ${lastName}`,
        text: [
          `Name: ${firstName} ${lastName}`,
          `Email: ${email}`,
          `Subject: ${subject}`,
          "",
          "Message:",
          message,
        ].join("\n"),
      });

      return { success: true };
    } catch (error) {
      console.error("Failed to send contact email:", error);
      return { success: false, error: "Failed to send message. Please try again." };
    }
  }

  // If Resend is not configured, log and return success
  // (so the form still works during development)
  console.log("Contact form submission (Resend not configured):", {
    firstName,
    lastName,
    email,
    subject,
    message: message.substring(0, 100) + "...",
  });

  return { success: true };
}
