import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";

const articles: Record<string, { title: string; description: string; content: string }> = {
  "how-to-book": {
    title: "How to book an appointment",
    description: "Step-by-step guide to making your first booking",
    content: `
## How to Book an Appointment

Booking an appointment on ComeInBooked is simple and takes just a few minutes.

### Step 1: Find a Service Provider

Start by searching for the service you need:
- Use the search bar on the homepage
- Browse by category
- Use the map to find nearby providers

### Step 2: Select a Service

On the business profile page:
1. Browse the service menu
2. Click on the service you want
3. Review the price, duration, and description

### Step 3: Choose a Staff Member

If the business has multiple staff members:
- View their profiles and specialties
- Read customer reviews for each staff member
- Select your preferred person, or choose "No Preference"

### Step 4: Pick a Date and Time

The booking calendar shows:
- Available dates (highlighted)
- Available time slots for each day
- The duration of your selected service

Simply click on your preferred time slot.

### Step 5: Review and Confirm

Before confirming, review:
- Service details
- Date and time
- Price and any fees
- Cancellation policy

### Step 6: Complete Payment (if required)

Depending on the business:
- Some require full payment upfront
- Some require a deposit
- Some allow payment at the time of service

Enter your payment details securely through Stripe.

### Step 7: Confirmation

After booking, you'll receive:
- On-screen confirmation
- Email confirmation with all details
- Option to add to your calendar

That's it! Your appointment is booked.
    `,
  },
  "rescheduling": {
    title: "Rescheduling a booking",
    description: "Learn how to change your appointment time",
    content: `
## Rescheduling a Booking

Need to change your appointment time? Here's how to reschedule.

### How to Reschedule

1. Go to "My Bookings" in your account
2. Find the appointment you want to change
3. Click the "Reschedule" button
4. Select a new date and time from available slots
5. Confirm the change

### Rescheduling Deadlines

Each business sets their own rescheduling policy:
- **24-hour policy**: Must reschedule at least 24 hours before
- **48-hour policy**: Must reschedule at least 48 hours before
- **Flexible**: Can reschedule anytime before the appointment

Check the business's policy on their profile or in your booking confirmation.

### What Happens to Your Payment

When you reschedule:
- Prepaid bookings: Payment transfers to the new time
- Deposits: Your deposit applies to the new booking
- No additional fees for rescheduling within policy

### If You Miss the Deadline

If you try to reschedule after the deadline:
- You may not be able to reschedule online
- Contact the business directly to request a change
- Cancellation fees may apply

### Tips for Rescheduling

- Reschedule as soon as you know your plans changed
- Check the business's availability before canceling
- Save favorite time slots for quick rebooking
    `,
  },
  "cancellation-policy": {
    title: "Cancellation policy",
    description: "Understand cancellation rules and fees",
    content: `
## Cancellation Policy

Understanding cancellation policies helps you avoid unexpected fees.

### How Cancellation Works

Each business on ComeInBooked sets their own cancellation policy. Common policies include:

#### Free Cancellation
- Cancel anytime before the deadline at no charge
- Full refund for prepaid bookings
- Deadlines typically range from 24-48 hours

#### Partial Refund
- Cancel after the free cancellation window
- Receive a partial refund (e.g., 50%)
- Remainder may be kept as a cancellation fee

#### No Refund
- Very late cancellations (e.g., within 2 hours)
- No-shows without notice
- Full charge applies

### How to Cancel

1. Go to "My Bookings"
2. Find the appointment
3. Click "Cancel Booking"
4. Review the cancellation terms
5. Confirm cancellation

### Viewing Cancellation Policy

Before booking, you can find the cancellation policy:
- On the business profile page
- During the booking process (before confirmation)
- In your booking confirmation email

### Refund Processing

If you're entitled to a refund:
- Refunds are processed within 24 hours
- Funds return to your original payment method
- Bank processing may take 5-7 business days

### Disputing a Charge

If you believe you were charged incorrectly:
1. Contact the business first
2. If unresolved, contact ComeInBooked support
3. We'll review and mediate the dispute
    `,
  },
  "confirmations": {
    title: "Booking confirmations",
    description: "How confirmations and reminders work",
    content: `
## Booking Confirmations

Stay informed about your appointments with our confirmation and reminder system.

### Instant Confirmation

When you complete a booking, you'll see:
- On-screen confirmation with booking details
- Unique booking reference number
- Options to add to your calendar

### Email Confirmation

Within minutes, you'll receive an email containing:
- Business name and address
- Service booked
- Date, time, and duration
- Staff member (if selected)
- Price breakdown
- Cancellation policy
- Directions link

### SMS Confirmations

If you've enabled SMS notifications:
- Receive a text confirmation after booking
- Includes key details and booking reference

### Reminder Schedule

We send automatic reminders to help you prepare:

**24 Hours Before**
- Email reminder with full details
- Link to reschedule if needed

**2 Hours Before**
- SMS reminder (if enabled)
- Quick link to get directions

### Managing Notifications

Customize your reminders in account settings:
- Enable/disable email reminders
- Enable/disable SMS reminders
- Choose reminder timing preferences

### Confirmation Not Received?

If you didn't get a confirmation:
1. Check your spam/junk folder
2. Verify your email address in settings
3. Look up the booking in "My Bookings"
4. Contact support if still missing
    `,
  },
  "no-shows": {
    title: "No-show policy",
    description: "What happens if you miss an appointment",
    content: `
## No-Show Policy

Missing an appointment without notice affects both you and the service provider. Here's what you need to know.

### What Counts as a No-Show

A no-show occurs when you:
- Don't arrive for your appointment
- Don't cancel or reschedule beforehand
- Arrive significantly late (policies vary)

### Consequences of No-Shows

#### Immediate Consequences
- You may be charged the full service price
- Deposits are typically forfeited
- No refund for prepaid services

#### Account Impact
- No-shows are recorded on your account
- Repeated no-shows may result in:
  - Required prepayment for future bookings
  - Booking restrictions with certain providers
  - Account suspension in extreme cases

### Provider Policies

Each business handles no-shows differently:
- Some charge 50% of the service price
- Some charge 100% of the service price
- Some may ban customers after multiple no-shows

The policy is always shown before you book.

### If You Can't Make It

Life happens! If you can't attend:
1. Cancel or reschedule as soon as possible
2. Even last-minute notice is better than no-show
3. Contact the business directly if it's urgent

### Disputing a No-Show Charge

If you were charged but had a valid reason:
1. Contact the business to explain
2. Provide any documentation (e.g., emergency)
3. If unresolved, contact ComeInBooked support

### Tips to Avoid No-Shows

- Add appointments to your calendar immediately
- Set personal reminders
- Enable SMS reminders
- Review your upcoming bookings weekly
    `,
  },
  "booking-for-others": {
    title: "Booking for someone else",
    description: "How to book appointments for friends or family",
    content: `
## Booking for Someone Else

You can book appointments for friends, family members, or anyone else. Here's how it works.

### How to Book for Someone Else

1. Search and select a service as usual
2. During the booking process, look for "Booking for someone else?"
3. Enter their information:
   - Full name
   - Phone number
   - Email (optional)
4. Add any special notes for the provider
5. Complete the booking

### What They'll Receive

The person you're booking for will get:
- Email confirmation (if email provided)
- SMS reminders (if phone provided)
- All necessary appointment details

### What You'll Receive

As the booker, you'll get:
- Your own confirmation email
- Payment receipts
- Ability to manage the booking

### Managing Their Booking

From your account, you can:
- View the booking details
- Reschedule if needed
- Cancel the appointment
- Contact the provider

### Payment Responsibility

When booking for others:
- Payment comes from your account
- You're responsible for any fees
- Refunds go to your payment method

### Group Bookings

For multiple people:
- Some services allow group bookings
- Book back-to-back appointments
- Or contact the business for group rates

### Tips

- Make sure you have their correct contact info
- Let them know about the appointment
- Share the confirmation details with them
- Inform them of the cancellation policy
    `,
  },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = articles[slug];
  if (!article) return { title: "Article Not Found" };
  return {
    title: `${article.title} - Help Center`,
    description: article.description,
  };
}

export async function generateStaticParams() {
  return Object.keys(articles).map((slug) => ({ slug }));
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = articles[slug];

  if (!article) {
    notFound();
  }

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link
              href="/help/bookings"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to Bookings
            </Link>
          </div>

          {/* Article */}
          <article>
            <h1 className="text-3xl font-bold tracking-tight">{article.title}</h1>
            <p className="mt-2 text-lg text-muted-foreground">{article.description}</p>

            <div className="prose prose-gray mt-8 max-w-none dark:prose-invert">
              {article.content.split('\n').map((paragraph, index) => {
                if (paragraph.startsWith('## ')) {
                  return <h2 key={index}>{paragraph.replace('## ', '')}</h2>;
                }
                if (paragraph.startsWith('### ')) {
                  return <h3 key={index}>{paragraph.replace('### ', '')}</h3>;
                }
                if (paragraph.startsWith('#### ')) {
                  return <h4 key={index}>{paragraph.replace('#### ', '')}</h4>;
                }
                if (paragraph.startsWith('- ')) {
                  return <li key={index}>{paragraph.replace('- ', '')}</li>;
                }
                if (paragraph.trim()) {
                  return <p key={index}>{paragraph}</p>;
                }
                return null;
              })}
            </div>
          </article>

          {/* Help */}
          <div className="mt-12 rounded-lg bg-muted p-6">
            <h3 className="font-semibold">Still need help?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Can&apos;t find what you&apos;re looking for? Our support team is here to help.
            </p>
            <Link
              href="/contact"
              className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
