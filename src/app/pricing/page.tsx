import { Metadata } from "next";
import Link from "next/link";
import { Check, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, transparent pricing for businesses of all sizes.",
};

const features = [
  {
    name: "Online booking",
    description: "Let customers book appointments 24/7 through your booking page",
    included: true,
  },
  {
    name: "Booking management",
    description: "View, edit, and manage all appointments in one place",
    included: true,
  },
  {
    name: "Automated reminders",
    description: "Reduce no-shows with email and SMS reminders",
    included: true,
  },
  {
    name: "Client directory",
    description: "Build your customer database with visit history and notes",
    included: true,
  },
  {
    name: "Staff management",
    description: "Add team members with their own schedules and services",
    included: true,
  },
  {
    name: "Service catalog",
    description: "Unlimited services with custom pricing and durations",
    included: true,
  },
  {
    name: "Payment processing",
    description: "Accept card payments online or in-person via Stripe",
    included: true,
  },
  {
    name: "Business analytics",
    description: "Track bookings, revenue, and business performance",
    included: true,
  },
  {
    name: "Custom booking page",
    description: "Branded booking page with your logo and colors",
    included: true,
  },
  {
    name: "Calendar sync",
    description: "Two-way sync with Google Calendar and Outlook",
    included: true,
  },
  {
    name: "Mobile app access",
    description: "Manage your business on the go with our mobile app",
    included: true,
  },
  {
    name: "Priority support",
    description: "Get help when you need it from our support team",
    included: true,
  },
];

const faqs = [
  {
    q: "Are there any hidden fees?",
    a: "No hidden fees whatsoever. The 2.9% + ₦100 per transaction is all you pay. This includes payment processing, platform access, and all features.",
  },
  {
    q: "When do I get paid?",
    a: "Funds are deposited directly to your bank account within 2-3 business days after each completed appointment through Stripe Connect.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes, there are no contracts or commitments. You can stop using ComeInBooked at any time with no cancellation fees.",
  },
  {
    q: "Do customers pay any fees?",
    a: "No, customers don't pay any additional fees for booking through ComeInBooked. The price they see is the price they pay.",
  },
  {
    q: "What if a customer doesn't show up?",
    a: "You can set up deposit requirements or cancellation policies to protect against no-shows. Many businesses require a deposit for certain services.",
  },
  {
    q: "Is there a free trial?",
    a: "You don't need a trial because there are no upfront costs. Start using ComeInBooked immediately and only pay when you receive bookings.",
  },
];

export default function PricingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-primary/10 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Simple, Transparent Pricing
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              No monthly fees. No setup costs. Only pay when you get paid.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Card */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-lg">
            <Card className="border-2 border-primary">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Pay As You Go</CardTitle>
                <CardDescription>
                  Perfect for businesses of all sizes
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold">2.9%</span>
                  <span className="text-2xl text-muted-foreground">+ ₦100</span>
                </div>
                <p className="mt-2 text-muted-foreground">per successful booking</p>

                <div className="my-8 border-t border-border" />

                <ul className="space-y-3 text-left">
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>No monthly fees</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>No setup costs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>No minimum commitments</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Cancel anytime</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>All features included</span>
                  </li>
                </ul>

                <Button size="lg" className="mt-8 w-full" asChild>
                  <Link href="/sign-up?type=business">Get Started Free</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted/50 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">
            Everything Included
          </h2>
          <p className="mt-4 text-center text-muted-foreground">
            All the tools you need to run your business, included at no extra cost
          </p>

          <TooltipProvider>
            <div className="mx-auto mt-8 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.name}
                  className="flex items-start gap-3 rounded-lg border border-border bg-background p-4"
                >
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{feature.name}</span>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{feature.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TooltipProvider>
        </div>
      </section>

      {/* Calculator */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              See How Much You&apos;ll Pay
            </h2>
            <p className="mt-4 text-muted-foreground">
              Example: For a ₦10,000 service, you&apos;ll pay ₦390 (2.9% + ₦100),
              keeping ₦9,610.
            </p>
            <div className="mt-8 rounded-lg bg-muted p-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">Service Price</p>
                  <p className="text-2xl font-bold">₦10,000</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Platform Fee</p>
                  <p className="text-2xl font-bold">₦390</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">You Keep</p>
                  <p className="text-2xl font-bold text-green-600">₦9,610</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-muted/50 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">
            Pricing FAQ
          </h2>
          <div className="mx-auto mt-8 grid max-w-4xl gap-6 md:grid-cols-2">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-lg bg-background p-6">
                <h3 className="font-semibold">{faq.q}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16 text-primary-foreground md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to Grow Your Business?
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/80">
              Join thousands of businesses already using ComeInBooked. Start
              accepting bookings today.
            </p>
            <div className="mt-8">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/sign-up?type=business">Get Started Free</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
