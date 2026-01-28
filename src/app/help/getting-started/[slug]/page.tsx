import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";

const articles: Record<string, { title: string; description: string; content: string }> = {
  "create-account": {
    title: "How to create an account",
    description: "Get started with ComeInBooked in just a few steps",
    content: `
## Creating Your ComeInBooked Account

Getting started with ComeInBooked is quick and easy. Follow these simple steps to create your account:

### Step 1: Visit the Sign Up Page
Click the "Get Started" button on our homepage or navigate directly to the sign-up page.

### Step 2: Choose Your Sign-Up Method
You can create an account using:
- **Email and Password**: Enter your email address and create a secure password
- **Google Account**: Click "Continue with Google" for quick registration

### Step 3: Verify Your Email
After signing up with email, you'll receive a verification email. Click the link in the email to verify your account.

### Step 4: Complete Your Profile
Once verified, you can add:
- Your full name
- Phone number (for booking confirmations)
- Profile photo (optional)

### Tips for Account Security
- Use a strong, unique password
- Enable two-factor authentication in your account settings
- Keep your email address up to date

That's it! You're now ready to start booking services on ComeInBooked.
    `,
  },
  "setup-profile": {
    title: "Setting up your profile",
    description: "Personalize your account for a better experience",
    content: `
## Setting Up Your Profile

A complete profile helps service providers deliver a better experience and makes booking smoother.

### Accessing Your Profile
1. Log in to your ComeInBooked account
2. Click on your avatar in the top right corner
3. Select "Settings" from the dropdown menu

### Profile Information You Can Add

#### Basic Information
- **Full Name**: Your name as you'd like service providers to see it
- **Phone Number**: Used for booking confirmations and reminders
- **Profile Photo**: Helps providers recognize you

#### Preferences
- **Default Location**: Set your home area for faster local searches
- **Notification Preferences**: Choose how you want to receive updates
- **Language**: Select your preferred language

### Privacy Settings
Control what information is visible to service providers:
- Name (always visible for bookings)
- Phone number (visible to booked providers only)
- Profile photo (optional)

### Keeping Your Profile Updated
We recommend reviewing your profile periodically to ensure:
- Your contact information is current
- Your preferences reflect your needs
- Your notification settings work for you
    `,
  },
  "finding-services": {
    title: "Finding and booking services",
    description: "Discover local service providers near you",
    content: `
## Finding and Booking Services

ComeInBooked makes it easy to discover and book local service providers. Here's how to find the perfect service for you.

### Searching for Services

#### Using the Search Bar
1. Enter a service type (e.g., "haircut", "massage", "nail salon")
2. Add your location or use "Near Me"
3. Press Enter or click the search button

#### Browse by Category
On the homepage, you can browse popular categories:
- Beauty & Hair
- Wellness & Spa
- Fitness & Health
- Creative Services
- And more...

### Filtering Results

Narrow down your search using filters:
- **Distance**: Set how far you're willing to travel
- **Price Range**: Find services within your budget
- **Availability**: Show only providers with open slots
- **Rating**: Filter by customer ratings
- **Amenities**: Parking, wheelchair access, etc.

### Viewing Business Profiles

Click on any business to see:
- Service menu with prices and durations
- Staff members and their specialties
- Customer reviews and ratings
- Business hours and location
- Photos of their work

### Making a Booking
1. Select the service you want
2. Choose a staff member (or select "No preference")
3. Pick an available date and time
4. Review your booking details
5. Confirm and pay (if required)

### Using the Map View
Toggle to map view to:
- See businesses on an interactive map
- Find providers closest to a specific address
- Explore new areas
    `,
  },
  "managing-bookings": {
    title: "Managing your bookings",
    description: "View, modify, and track your appointments",
    content: `
## Managing Your Bookings

Keep track of all your appointments in one place with ComeInBooked's booking management features.

### Viewing Your Bookings

#### From the Dashboard
1. Log in to your account
2. Click "My Bookings" in the navigation
3. View your upcoming and past appointments

#### Booking Status Types
- **Confirmed**: Your appointment is set
- **Pending**: Waiting for provider confirmation
- **Completed**: Past appointments
- **Cancelled**: Cancelled bookings

### Booking Details

Each booking shows:
- Service name and description
- Date, time, and duration
- Provider name and location
- Price breakdown
- Special instructions (if any)

### Getting Directions
Click "Get Directions" on any booking to:
- Open in Google Maps or Apple Maps
- View estimated travel time
- Plan your route

### Booking Reminders

You'll automatically receive reminders:
- **24 hours before**: Email reminder
- **2 hours before**: SMS reminder (if enabled)

Customize reminder settings in your account preferences.

### Adding to Calendar
After booking, you can:
- Add to Google Calendar
- Add to Apple Calendar
- Add to Outlook
- Download .ics file

### Rebooking Services
For completed appointments:
1. Find the booking in your history
2. Click "Book Again"
3. Select a new date and time
4. Confirm the booking

This saves time by pre-filling your preferences.
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
              href="/help/getting-started"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to Getting Started
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
