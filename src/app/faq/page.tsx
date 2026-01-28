import { Metadata } from "next";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about ComeInBooked.",
};

const faqCategories = [
  {
    title: "General",
    questions: [
      {
        q: "What is ComeInBooked?",
        a: "ComeInBooked is a booking platform that connects customers with local service providers in beauty, wellness, fashion, and creative services. You can discover businesses, view their services, and book appointments online 24/7.",
      },
      {
        q: "Is ComeInBooked free to use?",
        a: "Yes, ComeInBooked is completely free for customers. There are no signup fees or booking fees for users. Service providers pay a small commission only when they receive bookings through our platform.",
      },
      {
        q: "How do I create an account?",
        a: "Click the 'Get Started' button on our homepage, enter your email address and create a password, or sign up using your Google account. You can start booking services immediately after creating your account.",
      },
      {
        q: "Is my personal information secure?",
        a: "Yes, we take security seriously. All personal data is encrypted and stored securely. We never share your information with third parties without your consent. See our Privacy Policy for more details.",
      },
    ],
  },
  {
    title: "Booking",
    questions: [
      {
        q: "How do I book an appointment?",
        a: "Search for a service or business, select the service you want, choose your preferred staff member (if applicable), pick a date and time, and confirm your booking. You'll receive an email confirmation with all the details.",
      },
      {
        q: "Can I book appointments for someone else?",
        a: "Yes, you can book appointments for friends or family members. Simply add their information during the booking process, and the confirmation will be sent to both your email and theirs.",
      },
      {
        q: "How far in advance can I book?",
        a: "Booking availability varies by business. Most businesses allow bookings up to 30-90 days in advance. You can see available dates when selecting your appointment time.",
      },
      {
        q: "Will I receive a reminder before my appointment?",
        a: "Yes, we send email reminders 24 hours before your appointment. You can also opt-in to receive SMS reminders in your account settings.",
      },
    ],
  },
  {
    title: "Changes & Cancellations",
    questions: [
      {
        q: "How do I reschedule my booking?",
        a: "Go to 'My Bookings' in your account, find the appointment you want to change, and click 'Reschedule.' Select a new date and time from the available slots. Note that some businesses may have rescheduling deadlines.",
      },
      {
        q: "How do I cancel my booking?",
        a: "Go to 'My Bookings,' find the appointment, and click 'Cancel.' Please review the business's cancellation policy before canceling, as some may charge fees for late cancellations.",
      },
      {
        q: "What happens if a business cancels my appointment?",
        a: "If a business cancels your appointment, you'll receive an immediate notification with options to rebook or receive a full refund if you've already paid.",
      },
      {
        q: "Can I get a refund for a canceled appointment?",
        a: "Refund policies vary by business and are displayed during booking. If you cancel within the allowed timeframe or the business cancels, you'll typically receive a full refund within 5-7 business days.",
      },
    ],
  },
  {
    title: "Payments",
    questions: [
      {
        q: "What payment methods are accepted?",
        a: "We accept all major credit and debit cards (Visa, Mastercard, American Express, Discover), as well as Apple Pay and Google Pay. Some businesses may also accept payment at the time of service.",
      },
      {
        q: "When am I charged for my booking?",
        a: "This depends on the business's policy. Some require full payment at booking, others take a deposit, and some only charge at the time of service. The payment terms are clearly shown before you confirm your booking.",
      },
      {
        q: "Is my payment information secure?",
        a: "Absolutely. We use Stripe, a leading payment processor, to handle all transactions. Your payment details are encrypted and never stored on our servers. We're PCI DSS compliant.",
      },
      {
        q: "How do I get a receipt?",
        a: "Receipts are automatically sent to your email after payment. You can also view and download receipts from the 'My Bookings' section of your account.",
      },
    ],
  },
  {
    title: "For Businesses",
    questions: [
      {
        q: "How do I list my business on ComeInBooked?",
        a: "Click 'For Business' in the navigation, then 'Get Started Free.' Complete the signup process, verify your business information, add your services and availability, and connect your Stripe account to start accepting bookings.",
      },
      {
        q: "How much does it cost for businesses?",
        a: "We charge a small commission (2.9% + \u20A6100) on each successful booking. There are no monthly fees, setup fees, or hidden costs. You only pay when you get paid.",
      },
      {
        q: "How do I get paid?",
        a: "Payments are processed through Stripe Connect and deposited directly to your bank account. Standard payouts occur within 2-3 business days after the appointment is completed.",
      },
      {
        q: "Can I manage my own schedule?",
        a: "Yes, you have full control over your availability. Set your working hours, block off time for breaks or personal appointments, and manage staff schedules all from your dashboard.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-primary/10 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Frequently Asked Questions
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Find answers to common questions about ComeInBooked. Can&apos;t
              find what you&apos;re looking for? Contact our support team.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl space-y-12">
            {faqCategories.map((category) => (
              <div key={category.title}>
                <h2 className="mb-4 text-2xl font-bold">{category.title}</h2>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`${category.title}-${index}`}
                    >
                      <AccordionTrigger className="text-left">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-primary py-16 text-primary-foreground md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <MessageCircle className="mx-auto h-12 w-12" />
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Still Have Questions?
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/80">
              Our support team is ready to help. Reach out and we&apos;ll get
              back to you as soon as possible.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
                asChild
              >
                <Link href="/help">Visit Help Center</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
