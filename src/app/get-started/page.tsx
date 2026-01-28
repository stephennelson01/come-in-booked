import { Metadata } from "next";
import Link from "next/link";
import { User, Store, Calendar, Star, CreditCard, BarChart3, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Get Started",
  description: "Join ComeInBooked as a customer or list your business. Choose how you want to get started.",
};

const customerBenefits = [
  {
    icon: Calendar,
    title: "Easy Booking",
    description: "Book appointments 24/7 with just a few taps",
  },
  {
    icon: Star,
    title: "Trusted Reviews",
    description: "Read verified reviews from real customers",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description: "Pay securely online or in-person",
  },
];

const businessBenefits = [
  {
    icon: Calendar,
    title: "Online Booking",
    description: "Let customers book appointments anytime",
  },
  {
    icon: BarChart3,
    title: "Grow Your Business",
    description: "Reach new customers in your area",
  },
  {
    icon: CreditCard,
    title: "Get Paid Easily",
    description: "Secure payments deposited directly to you",
  },
];

export default function GetStartedPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-primary/10 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Get Started with ComeInBooked
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              Whether you&apos;re looking to book services or grow your business,
              we&apos;ve got you covered. Choose how you&apos;d like to join.
            </p>
          </div>
        </div>
      </section>

      {/* Options */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Customer Card */}
            <Card className="relative overflow-hidden border-2 transition-all hover:border-primary hover:shadow-lg">
              <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-primary/10" />
              <CardHeader className="relative">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <User className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-2xl">I want to book services</CardTitle>
                <CardDescription className="text-base">
                  Find and book beauty, wellness, and creative services from trusted local providers.
                </CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-6">
                <div className="space-y-4">
                  {customerBenefits.map((benefit) => (
                    <div key={benefit.title} className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <benefit.icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{benefit.title}</p>
                        <p className="text-sm text-muted-foreground">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full" size="lg" asChild>
                  <Link href="/sign-up?type=customer">
                    Sign Up as Customer
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/sign-in" className="font-medium text-primary hover:underline">
                    Sign in
                  </Link>
                </p>
              </CardContent>
            </Card>

            {/* Business Card */}
            <Card className="relative overflow-hidden border-2 transition-all hover:border-primary hover:shadow-lg">
              <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-primary/10" />
              <CardHeader className="relative">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <Store className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-2xl">I want to list my business</CardTitle>
                <CardDescription className="text-base">
                  Grow your business with online booking, client management, and marketing tools.
                </CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-6">
                <div className="space-y-4">
                  {businessBenefits.map((benefit) => (
                    <div key={benefit.title} className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <benefit.icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{benefit.title}</p>
                        <p className="text-sm text-muted-foreground">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full" size="lg" asChild>
                  <Link href="/sign-up?type=business">
                    Sign Up as Business
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/sign-in" className="font-medium text-primary hover:underline">
                    Sign in
                  </Link>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why ComeInBooked */}
      <section className="bg-muted/50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Why Choose ComeInBooked?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We&apos;re building the easiest way to connect local service providers
              with customers who love what they do.
            </p>
            <div className="mt-8 grid gap-4 text-left sm:grid-cols-2">
              <div className="rounded-lg border bg-background p-4">
                <p className="font-semibold">10,000+</p>
                <p className="text-sm text-muted-foreground">Service Providers</p>
              </div>
              <div className="rounded-lg border bg-background p-4">
                <p className="font-semibold">500,000+</p>
                <p className="text-sm text-muted-foreground">Bookings Made</p>
              </div>
              <div className="rounded-lg border bg-background p-4">
                <p className="font-semibold">50+</p>
                <p className="text-sm text-muted-foreground">Cities Served</p>
              </div>
              <div className="rounded-lg border bg-background p-4">
                <p className="font-semibold">4.8 Rating</p>
                <p className="text-sm text-muted-foreground">Average Review</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
