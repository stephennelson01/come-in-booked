import Link from "next/link";
import { Check, ArrowRight, Calendar, CreditCard, Users, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description:
      "Let customers book 24/7 with real-time availability. Reduce no-shows with automated reminders.",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description:
      "Accept payments at booking or in-person. Funds deposited directly to your bank account.",
  },
  {
    icon: Users,
    title: "Client Management",
    description:
      "Build your customer directory, track visit history, and personalize the experience.",
  },
  {
    icon: BarChart3,
    title: "Business Insights",
    description:
      "Track bookings, revenue, and staff performance with easy-to-understand reports.",
  },
];

const benefits = [
  "No setup fees or monthly minimums",
  "Cancel anytime",
  "Dedicated support",
  "Free onboarding assistance",
  "Mobile app for you and your team",
  "Custom booking page with your branding",
];

export default function ForBusinessPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-primary/10 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Grow Your Business with{" "}
              <span className="text-primary">ComeInBooked</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              The all-in-one booking platform that helps you attract new
              customers, reduce no-shows, and get paid faster.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/sign-up?type=business">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything You Need to Run Your Business
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Powerful tools designed specifically for service businesses
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-muted/50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Simple, Transparent Pricing
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Only pay when you get paid. No hidden fees.
              </p>
            </div>

            <Card className="mt-12">
              <CardContent className="p-8">
                <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold">2.9%</span>
                      <span className="text-xl text-muted-foreground">
                        + ₦100
                      </span>
                    </div>
                    <p className="mt-2 text-muted-foreground">
                      per successful booking
                    </p>
                  </div>

                  <div className="w-full md:w-auto">
                    <ul className="grid gap-3 sm:grid-cols-2">
                      {benefits.map((benefit) => (
                        <li key={benefit} className="flex items-center gap-2">
                          <Check className="h-5 w-5 text-green-500" />
                          <span className="text-sm">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 flex justify-center">
                  <Button size="lg" asChild>
                    <Link href="/sign-up?type=business">
                      Start Your Free Trial
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to Grow Your Business?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join thousands of businesses already using ComeInBooked to
              streamline their operations and delight their customers.
            </p>
            <div className="mt-8">
              <Button size="lg" asChild>
                <Link href="/sign-up?type=business">
                  Get Started Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
