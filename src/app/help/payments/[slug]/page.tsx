import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";

const articles: Record<string, { title: string; description: string; content: string }> = {
  "payment-methods": {
    title: "Accepted payment methods",
    description: "Learn about the payment options available",
    content: `
## Accepted Payment Methods

ComeInBooked offers multiple secure payment options for your convenience.

### Credit and Debit Cards

We accept all major cards:
- Visa
- Mastercard
- American Express
- Discover

### Digital Wallets

For faster checkout:
- Apple Pay
- Google Pay

### How to Add a Payment Method

1. Go to your account settings
2. Select "Payment Methods"
3. Click "Add Payment Method"
4. Enter your card details or connect your digital wallet
5. Save your payment method

### Managing Payment Methods

You can:
- Add multiple cards
- Set a default payment method
- Remove saved cards
- Update expiration dates

### Pay at Service

Some businesses allow payment at the time of service:
- Look for "Pay Later" option during booking
- Payment is collected by the business directly
- Cash may be accepted (check with business)

### Currency

All prices are displayed in USD. International cards are accepted, but currency conversion fees may apply from your bank.
    `,
  },
  "refund-policy": {
    title: "Refund policy",
    description: "How refunds work on ComeInBooked",
    content: `
## Refund Policy

Understanding how refunds work helps you know what to expect.

### When You're Eligible for a Refund

You may receive a refund when:
- You cancel within the free cancellation period
- The business cancels your appointment
- The service was not provided as described
- You were double-charged in error

### Refund Amounts

Refund amounts depend on when you cancel:

**Within Free Cancellation Period**
- Full refund of amount paid

**After Free Cancellation Period**
- Partial refund based on business policy
- Some portion may be retained as fee

**No-Show**
- Typically no refund
- Depends on business policy

### How Refunds Are Processed

1. Refund is initiated within 24 hours
2. Funds return to original payment method
3. Processing time: 5-7 business days
4. You'll receive email confirmation

### Where to See Refund Status

Check refund status in:
- Your booking details
- Payment history in account settings
- Email notifications

### Disputes

If you disagree with a refund decision:
1. Contact the business first
2. If unresolved, contact ComeInBooked support
3. Provide booking details and explanation
4. We'll review and mediate
    `,
  },
  "payment-security": {
    title: "Payment security",
    description: "How we keep your payment information safe",
    content: `
## Payment Security

Your financial security is our top priority. Here's how we protect your payment information.

### Secure Payment Processing

We partner with Stripe, a leading payment processor:
- PCI DSS Level 1 certified
- Bank-level encryption
- Fraud detection systems

### What We Don't Store

ComeInBooked never stores:
- Full credit card numbers
- CVV/security codes
- Card PINs

We only store a token reference to process future payments.

### Encryption

All payment data is protected by:
- 256-bit SSL encryption
- TLS 1.3 protocol
- End-to-end encryption

### Fraud Protection

Our systems monitor for:
- Unusual transaction patterns
- Suspicious login attempts
- Unauthorized access attempts

### What You Can Do

Protect yourself by:
- Using strong, unique passwords
- Enabling two-factor authentication
- Monitoring your account activity
- Reporting suspicious activity immediately

### Safe Checkout Indicators

Look for these signs of a secure checkout:
- Lock icon in your browser
- URL starting with "https://"
- Stripe checkout badge

### Reporting Security Issues

If you notice anything suspicious:
- Contact support immediately
- Change your password
- Review recent transactions
- Contact your bank if needed
    `,
  },
  "receipts": {
    title: "Receipts and invoices",
    description: "Access and download your payment records",
    content: `
## Receipts and Invoices

Keep track of all your payments with easy access to receipts.

### Automatic Receipts

After every payment, you automatically receive:
- Email receipt within minutes
- In-app receipt in your booking details

### What's Included on Receipts

Each receipt shows:
- Business name and address
- Service description
- Date and time of service
- Payment amount
- Payment method (last 4 digits)
- Transaction ID
- Any applicable taxes

### Accessing Past Receipts

To find older receipts:
1. Go to "My Bookings"
2. Find the completed booking
3. Click "View Receipt"
4. Download or print as needed

### Downloading Receipts

Receipts can be downloaded as:
- PDF format
- Printable version

### For Business Expenses

If you need receipts for expense reports:
- All receipts include business details
- Download PDF version for records
- Contact support for custom invoices

### Receipt Not Received?

If you didn't get a receipt:
1. Check spam/junk folder
2. Verify email address in settings
3. Access from "My Bookings"
4. Contact support if still missing

### Bulk Receipt Downloads

Need multiple receipts?
- Contact support for bulk export
- Available for tax purposes
- Includes specified date range
    `,
  },
  "payment-issues": {
    title: "Payment issues",
    description: "Troubleshoot common payment problems",
    content: `
## Payment Issues

Having trouble with a payment? Here's how to resolve common issues.

### Payment Declined

If your payment is declined:

**Check Card Details**
- Verify card number is correct
- Check expiration date
- Ensure CVV is correct

**Check with Your Bank**
- Sufficient funds available
- No holds or restrictions
- International transactions enabled

**Try Another Method**
- Use a different card
- Try a digital wallet
- Contact your bank

### Double Charged

If you see duplicate charges:
1. Wait 24 hours (pending charges may clear)
2. Check if both are completed transactions
3. Contact support with transaction IDs
4. We'll investigate and refund if needed

### Payment Pending

Payments may show as pending when:
- Processing is in progress
- Bank is verifying the transaction
- Usually clears within 24 hours

### Refund Not Received

If you're waiting for a refund:
1. Check it's been more than 7 business days
2. Verify the correct payment method
3. Check with your bank
4. Contact support with booking details

### Unknown Charge

If you don't recognize a charge:
1. Check your booking history
2. Look for business name variations
3. Check if family members booked
4. Contact support to investigate

### Getting Help

For payment issues, contact support with:
- Booking reference number
- Transaction ID (if available)
- Screenshot of the charge
- Description of the issue
    `,
  },
  "tipping": {
    title: "Tipping service providers",
    description: "How to leave tips through the app",
    content: `
## Tipping Service Providers

Show your appreciation for great service by leaving a tip.

### When to Tip

Tipping is always optional but appreciated:
- After receiving excellent service
- When a provider goes above and beyond
- As a thank you for their time and skill

### How to Leave a Tip

**After Your Appointment**
1. You'll receive a prompt to rate and tip
2. Select a tip amount or enter custom amount
3. Confirm the tip

**From Completed Bookings**
1. Go to "My Bookings"
2. Find the completed appointment
3. Click "Leave a Tip"
4. Enter amount and confirm

### Tip Amounts

Choose from suggested amounts:
- 15% of service cost
- 20% of service cost
- 25% of service cost
- Custom amount

### Where Tips Go

100% of your tip goes directly to the service provider:
- ComeInBooked takes no cut
- Tips are included in their next payout

### Tipping Multiple Staff

If multiple staff helped you:
- Contact the business to split tips
- Or leave separate tips if the option is available

### Tip Receipts

Tips appear on your receipt:
- Listed separately from service cost
- Included in payment total
- Shown in booking history
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
              href="/help/payments"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to Payments
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
