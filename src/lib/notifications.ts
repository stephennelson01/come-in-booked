import { sendSMS } from "./twilio";
import { sendEmail } from "./resend";

interface BookingNotificationData {
  bookingId: string;
  // Customer info
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  // Business info
  businessName: string;
  businessEmail: string | null;
  businessPhone: string | null;
  // Booking details
  serviceName: string;
  staffName: string;
  startTime: Date;
  endTime: Date;
  totalAmount: number;
  currency: string;
  locationAddress: string;
}

function formatDateTime(date: Date): string {
  return date.toLocaleString("en-NG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: currency,
  }).format(amount);
}

// Send notification to customer when booking is confirmed
export async function sendCustomerBookingConfirmation(data: BookingNotificationData) {
  const formattedDate = formatDateTime(data.startTime);
  const formattedAmount = formatCurrency(data.totalAmount, data.currency);

  // Send SMS to customer
  if (data.customerPhone) {
    const smsMessage = `Hi ${data.customerName}! Your booking at ${data.businessName} is confirmed for ${formattedDate}. Service: ${data.serviceName}. Total: ${formattedAmount}. See you soon! - ComeInBooked`;

    await sendSMS(data.customerPhone, smsMessage);
  }

  // Send email to customer
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Booking Confirmed</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #3b82f6; margin: 0;">Booking Confirmed!</h1>
      </div>

      <p>Hi ${data.customerName},</p>

      <p>Great news! Your booking has been confirmed.</p>

      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="margin-top: 0; color: #1f2937;">Booking Details</h2>
        <p><strong>Business:</strong> ${data.businessName}</p>
        <p><strong>Service:</strong> ${data.serviceName}</p>
        <p><strong>Staff:</strong> ${data.staffName}</p>
        <p><strong>Date & Time:</strong> ${formattedDate}</p>
        <p><strong>Location:</strong> ${data.locationAddress}</p>
        <p><strong>Total:</strong> ${formattedAmount}</p>
      </div>

      <p>Please arrive 5-10 minutes before your appointment time.</p>

      <p>Need to make changes? <a href="https://comeinbooked.com/customer/bookings/${data.bookingId}" style="color: #3b82f6;">View your booking</a></p>

      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

      <p style="color: #6b7280; font-size: 14px;">
        Thank you for using ComeInBooked!<br>
        <a href="https://comeinbooked.com" style="color: #3b82f6;">www.comeinbooked.com</a>
      </p>
    </body>
    </html>
  `;

  const emailText = `
Hi ${data.customerName},

Great news! Your booking has been confirmed.

BOOKING DETAILS
---------------
Business: ${data.businessName}
Service: ${data.serviceName}
Staff: ${data.staffName}
Date & Time: ${formattedDate}
Location: ${data.locationAddress}
Total: ${formattedAmount}

Please arrive 5-10 minutes before your appointment time.

View your booking: https://comeinbooked.com/customer/bookings/${data.bookingId}

Thank you for using ComeInBooked!
www.comeinbooked.com
  `;

  await sendEmail({
    to: data.customerEmail,
    subject: `Booking Confirmed - ${data.businessName}`,
    html: emailHtml,
    text: emailText,
  });
}

// Send notification to business when they receive a new booking
export async function sendBusinessNewBookingNotification(data: BookingNotificationData) {
  const formattedDate = formatDateTime(data.startTime);
  const formattedAmount = formatCurrency(data.totalAmount, data.currency);

  // Send SMS to business
  if (data.businessPhone) {
    const smsMessage = `New booking! ${data.customerName} booked ${data.serviceName} for ${formattedDate}. Total: ${formattedAmount}. View details on ComeInBooked.`;

    await sendSMS(data.businessPhone, smsMessage);
  }

  // Send email to business
  if (data.businessEmail) {
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Booking Received</title>
      </head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #10b981; margin: 0;">New Booking!</h1>
        </div>

        <p>Hi ${data.businessName} Team,</p>

        <p>You have received a new booking!</p>

        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0; color: #1f2937;">Booking Details</h2>
          <p><strong>Customer:</strong> ${data.customerName}</p>
          <p><strong>Phone:</strong> ${data.customerPhone || "Not provided"}</p>
          <p><strong>Email:</strong> ${data.customerEmail}</p>
          <p><strong>Service:</strong> ${data.serviceName}</p>
          <p><strong>Staff:</strong> ${data.staffName}</p>
          <p><strong>Date & Time:</strong> ${formattedDate}</p>
          <p><strong>Total:</strong> ${formattedAmount}</p>
        </div>

        <p>
          <a href="https://comeinbooked.com/merchant/bookings/${data.bookingId}"
             style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
            View Booking
          </a>
        </p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

        <p style="color: #6b7280; font-size: 14px;">
          Manage your bookings at <a href="https://comeinbooked.com/merchant" style="color: #3b82f6;">ComeInBooked</a>
        </p>
      </body>
      </html>
    `;

    const emailText = `
Hi ${data.businessName} Team,

You have received a new booking!

BOOKING DETAILS
---------------
Customer: ${data.customerName}
Phone: ${data.customerPhone || "Not provided"}
Email: ${data.customerEmail}
Service: ${data.serviceName}
Staff: ${data.staffName}
Date & Time: ${formattedDate}
Total: ${formattedAmount}

View booking: https://comeinbooked.com/merchant/bookings/${data.bookingId}

Manage your bookings at https://comeinbooked.com/merchant
    `;

    await sendEmail({
      to: data.businessEmail,
      subject: `New Booking - ${data.customerName} for ${data.serviceName}`,
      html: emailHtml,
      text: emailText,
    });
  }
}

// Send both customer confirmation and business notification
export async function sendBookingNotifications(data: BookingNotificationData) {
  // Send notifications in parallel
  await Promise.all([
    sendCustomerBookingConfirmation(data),
    sendBusinessNewBookingNotification(data),
  ]);
}

// Send cancellation notification
export async function sendBookingCancellationNotification(
  data: BookingNotificationData,
  cancelledBy: "customer" | "business",
  reason?: string
) {
  const formattedDate = formatDateTime(data.startTime);

  // Notify customer if business cancelled
  if (cancelledBy === "business" && data.customerPhone) {
    const smsMessage = `Hi ${data.customerName}, your booking at ${data.businessName} for ${formattedDate} has been cancelled.${reason ? ` Reason: ${reason}` : ""} We apologize for any inconvenience.`;
    await sendSMS(data.customerPhone, smsMessage);
  }

  // Notify business if customer cancelled
  if (cancelledBy === "customer" && data.businessPhone) {
    const smsMessage = `Booking cancelled: ${data.customerName} cancelled their ${data.serviceName} appointment for ${formattedDate}.${reason ? ` Reason: ${reason}` : ""}`;
    await sendSMS(data.businessPhone, smsMessage);
  }
}
