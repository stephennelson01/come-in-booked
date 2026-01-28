import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";

const articles: Record<string, { title: string; description: string; content: string }> = {
  "update-profile": {
    title: "Updating your profile",
    description: "Change your name, photo, and contact information",
    content: `
## Updating Your Profile

Keep your profile up to date for the best experience on ComeInBooked.

### Accessing Profile Settings

1. Click on your avatar in the top right corner
2. Select "Settings" from the dropdown
3. Navigate to "Profile" tab

### Changing Your Name

To update your display name:
1. Click the "Edit" button next to your name
2. Enter your new name
3. Click "Save Changes"

Your name is visible to service providers when you book.

### Updating Your Profile Photo

To add or change your photo:
1. Click on your current photo or the placeholder
2. Upload an image from your device
3. Crop if needed
4. Click "Save"

Photo requirements:
- JPG, PNG, or GIF format
- Maximum 5MB file size
- Minimum 200x200 pixels

### Changing Your Email

To update your email address:
1. Click "Change Email"
2. Enter your new email
3. Enter your password to confirm
4. Verify the new email address

You'll need to verify your new email before it becomes active.

### Updating Phone Number

To change your phone number:
1. Click "Edit" next to your phone number
2. Enter your new number
3. Verify with SMS code
4. Click "Save"

### Updating Your Location

To set your default location:
1. Go to "Preferences" section
2. Enter your city or zip code
3. This helps show relevant businesses

### Profile Visibility

Control what others see:
- Name: Always visible to booked providers
- Photo: Optional, shown to providers
- Phone: Only visible after you book
    `,
  },
  "change-password": {
    title: "Changing your password",
    description: "Keep your account secure with a strong password",
    content: `
## Changing Your Password

Regularly updating your password helps keep your account secure.

### How to Change Your Password

1. Go to Account Settings
2. Click on "Security" tab
3. Select "Change Password"
4. Enter your current password
5. Enter your new password
6. Confirm your new password
7. Click "Update Password"

### Password Requirements

Your new password must:
- Be at least 8 characters long
- Include at least one uppercase letter
- Include at least one lowercase letter
- Include at least one number
- Include at least one special character

### Tips for a Strong Password

- Don't reuse passwords from other sites
- Avoid personal information (birthdays, names)
- Consider using a password manager
- Use a passphrase (multiple random words)

### Forgot Your Password?

If you can't remember your current password:
1. Go to the sign-in page
2. Click "Forgot Password?"
3. Enter your email address
4. Check your email for reset link
5. Click the link within 24 hours
6. Create a new password

### Password Reset Not Working?

If you don't receive the reset email:
- Check your spam/junk folder
- Verify you're using the right email
- Wait a few minutes and try again
- Contact support if still not working

### Two-Factor Authentication

For extra security, enable 2FA:
1. Go to Security settings
2. Enable "Two-Factor Authentication"
3. Choose SMS or authenticator app
4. Follow setup instructions
    `,
  },
  "notifications": {
    title: "Notification preferences",
    description: "Control how and when we contact you",
    content: `
## Notification Preferences

Customize how you receive updates from ComeInBooked.

### Types of Notifications

#### Booking Notifications
- Booking confirmations
- Appointment reminders
- Cancellation notices
- Rescheduling alerts

#### Account Notifications
- Security alerts
- Password changes
- Account updates

#### Marketing (Optional)
- Special offers
- New features
- Newsletter

### Email Notifications

Control which emails you receive:
1. Go to Settings > Notifications
2. Find "Email Preferences"
3. Toggle each notification type on/off
4. Save your preferences

### SMS Notifications

Manage text message alerts:
1. Go to Settings > Notifications
2. Find "SMS Preferences"
3. Toggle each notification type
4. Verify your phone number is correct

### Push Notifications (Mobile App)

If using our mobile app:
1. Open app settings
2. Go to Notifications
3. Enable/disable push notifications
4. Customize notification sounds

### Reminder Timing

Customize when you receive reminders:
- 24 hours before appointment
- 2 hours before appointment
- 1 hour before appointment
- Or turn off reminders entirely

### Unsubscribing from Marketing

To stop promotional emails:
1. Click "Unsubscribe" in any marketing email
2. Or go to Settings > Notifications
3. Disable "Promotional Emails"

Note: You'll still receive essential booking communications.

### Do Not Disturb

Set quiet hours:
1. Go to Notification settings
2. Enable "Do Not Disturb"
3. Set start and end times
4. Non-urgent notifications will be delayed
    `,
  },
  "delete-account": {
    title: "Deleting your account",
    description: "How to permanently delete your ComeInBooked account",
    content: `
## Deleting Your Account

We're sorry to see you go. Here's how to delete your account permanently.

### Before You Delete

Please note that deleting your account:
- Is permanent and cannot be undone
- Removes all your booking history
- Cancels any upcoming appointments
- Deletes your reviews and ratings
- Removes saved payment methods

### Outstanding Bookings

Before deleting, you must:
- Cancel or complete all upcoming bookings
- Resolve any pending payments
- Wait for any refunds to process

### How to Delete Your Account

1. Go to Account Settings
2. Scroll to "Danger Zone" at the bottom
3. Click "Delete Account"
4. Read the confirmation message
5. Enter your password
6. Type "DELETE" to confirm
7. Click "Permanently Delete Account"

### What Gets Deleted

When you delete your account:
- Profile information
- Booking history
- Reviews you've written
- Saved preferences
- Payment methods

### What We Retain

For legal and business purposes, we may retain:
- Transaction records (required by law)
- Anonymized analytics data
- Communications for support records

See our Privacy Policy for details.

### Alternatives to Deletion

Before deleting, consider:
- **Taking a break**: You can stop using the app without deleting
- **Updating notifications**: Turn off all marketing emails
- **Contacting support**: We may be able to address your concerns

### Reactivating After Deletion

Once deleted, your account cannot be recovered. If you want to use ComeInBooked again, you'll need to:
- Create a new account
- Start fresh with no history
    `,
  },
  "privacy-settings": {
    title: "Privacy settings",
    description: "Control your data and privacy preferences",
    content: `
## Privacy Settings

Control how your information is used and shared on ComeInBooked.

### Accessing Privacy Settings

1. Go to Account Settings
2. Click on "Privacy" tab
3. Review and adjust your preferences

### Profile Visibility

Control what service providers see:

**Always Visible (required for booking)**
- Your name
- Booking details

**Optional**
- Profile photo
- Phone number (after booking)

### Data Sharing

Control how we use your data:

**Personalization**
- Use booking history to improve recommendations
- Show relevant businesses based on location
- Remember your preferences

**Analytics**
- Help us improve the platform
- Anonymized usage data only

### Marketing Preferences

**Targeted Advertising**
- Allow personalized ads
- Share data with advertising partners

**Third-Party Marketing**
- Receive offers from partners
- Fully optional

### Communication Preferences

- Who can contact you through the platform
- Whether businesses can send follow-up messages
- Review request preferences

### Downloading Your Data

You have the right to your data:
1. Go to Privacy settings
2. Click "Download My Data"
3. Choose data types to include
4. Receive download link via email

### Data Retention

Learn how long we keep your data:
- Active account: Data retained while using service
- Inactive account: See privacy policy
- After deletion: Most data removed within 30 days
    `,
  },
  "connected-accounts": {
    title: "Connected accounts",
    description: "Manage Google and social media connections",
    content: `
## Connected Accounts

Link external accounts for easier sign-in and enhanced features.

### Available Connections

You can connect:
- Google account
- Apple ID (iOS app)

### Benefits of Connecting

**Google Account**
- One-click sign in
- Import profile photo
- Sync with Google Calendar

### Connecting an Account

To link a new account:
1. Go to Settings > Connected Accounts
2. Click "Connect" next to the service
3. Sign in to that service
4. Authorize the connection
5. Connection complete

### What We Access

When you connect Google:
- Email address
- Profile name
- Profile photo (optional)
- Calendar (if enabled)

We never access:
- Your emails
- Your files
- Your contacts
- Your passwords

### Calendar Sync

With Google Calendar connected:
- Bookings automatically added to calendar
- See availability across calendars
- Get calendar reminders

To enable:
1. Connect your Google account
2. Enable "Calendar Sync"
3. Choose which calendar to use

### Disconnecting an Account

To remove a connection:
1. Go to Connected Accounts
2. Find the connected service
3. Click "Disconnect"
4. Confirm disconnection

Note: You'll need another sign-in method if disconnecting your only login option.

### Troubleshooting

**Can't connect account?**
- Try signing out and back in
- Check if you have pop-ups blocked
- Try a different browser

**Connection not working?**
- Disconnect and reconnect
- Revoke access from the third-party service and re-authorize
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
              href="/help/account"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to Account Settings
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
