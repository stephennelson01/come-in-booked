import { Metadata } from "next";
import Link from "next/link";
import { Handshake, TrendingUp, Users, Zap, ArrowRight, Building2, Globe, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Partners",
  description: "Partner with ComeInBooked to grow your business and reach new customers.",
};

const partnerTypes = [
  {
    icon: Building2,
    title: "Franchise Partners",
    description: "Bring ComeInBooked to your multi-location business. Get dedicated support, custom integrations, and volume pricing.",
    benefits: [
      "Centralized management dashboard",
      "Bulk onboarding assistance",
      "Custom branding options",
      "Dedicated account manager",
    ],
  },
  {
    icon: Globe,
    title: "Integration Partners",
    description: "Connect your software with ComeInBooked. Build integrations that help mutual customers succeed.",
    benefits: [
      "API access and documentation",
      "Technical support",
      "Co-marketing opportunities",
      "Partner directory listing",
    ],
  },
  {
    icon: Award,
    title: "Referral Partners",
    description: "Earn rewards by referring businesses to ComeInBooked. Perfect for consultants and industry professionals.",
    benefits: [
      "Competitive commission rates",
      "Marketing materials",
      "Partner portal access",
      "Performance bonuses",
    ],
  },
];

const benefits = [
  {
    icon: TrendingUp,
    title: "Grow Together",
    description: "Access new markets and customers through our platform and co-marketing initiatives.",
  },
  {
    icon: Users,
    title: "Dedicated Support",
    description: "Get a dedicated partner manager and priority access to our support team.",
  },
  {
    icon: Zap,
    title: "Early Access",
    description: "Be the first to know about new features and get early access to beta programs.",
  },
  {
    icon: Handshake,
    title: "Revenue Share",
    description: "Earn competitive commissions for every customer you bring to the platform.",
  },
];

const testimonials = [
  {
    quote: "Partnering with ComeInBooked has been transformative for our franchise. The centralized booking system has streamlined operations across all 15 of our locations.",
    author: "Jennifer Walsh",
    role: "VP Operations, StyleHouse Salons",
  },
  {
    quote: "The integration was seamless. Our POS system now syncs perfectly with ComeInBooked, giving our merchants a unified experience.",
    author: "Marcus Chen",
    role: "CTO, SalonPay",
  },
];

export default function PartnersPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-primary/10 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Partner with ComeInBooked
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              Join our partner ecosystem and grow your business alongside
              thousands of service providers. Together, we&apos;re transforming
              the local services industry.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="#partner-types">
                  Explore Partnerships
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Why Partner with Us?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join a growing ecosystem of businesses committed to excellence
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <Card key={benefit.title}>
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{benefit.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Types */}
      <section id="partner-types" className="bg-muted/50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Partnership Programs
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Choose the partnership model that fits your business
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {partnerTypes.map((type) => (
              <Card key={type.title} className="flex flex-col">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <type.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{type.title}</CardTitle>
                  <CardDescription>{type.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-2">
                    {type.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center gap-2 text-sm">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardContent className="pt-0">
                  <Button className="w-full" variant="outline" asChild>
                    <Link href="/contact">Learn More</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
            What Our Partners Say
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.author}>
                <CardContent className="p-6">
                  <blockquote className="text-lg italic text-muted-foreground">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                  <div className="mt-4">
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary py-16 text-primary-foreground md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-4xl font-bold">500+</p>
              <p className="mt-2 text-primary-foreground/80">Active Partners</p>
            </div>
            <div>
              <p className="text-4xl font-bold">10,000+</p>
              <p className="mt-2 text-primary-foreground/80">Businesses Served</p>
            </div>
            <div>
              <p className="text-4xl font-bold">₦10B+</p>
              <p className="mt-2 text-primary-foreground/80">Partner Revenue</p>
            </div>
            <div>
              <p className="text-4xl font-bold">50+</p>
              <p className="mt-2 text-primary-foreground/80">Integrations</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to Partner?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Let&apos;s discuss how we can work together to achieve mutual
              success. Our partnerships team is ready to help.
            </p>
            <div className="mt-8">
              <Button size="lg" asChild>
                <Link href="/contact">
                  Get in Touch
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
