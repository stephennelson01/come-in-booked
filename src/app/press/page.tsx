import { Metadata } from "next";
import Link from "next/link";
import { Download, Mail, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Press",
  description: "ComeInBooked press resources, media kit, and recent news coverage.",
};

const pressReleases = [
  {
    date: "January 15, 2025",
    title: "ComeInBooked Raises ₦15B Series A to Expand Booking Platform",
    description: "Funding will accelerate product development and market expansion across Nigeria.",
    link: "#",
  },
  {
    date: "November 8, 2024",
    title: "ComeInBooked Launches Mobile App for iOS and Android",
    description: "New mobile apps make it easier than ever for customers to book services on the go.",
    link: "#",
  },
  {
    date: "September 22, 2024",
    title: "ComeInBooked Partners with National Salon Association",
    description: "Partnership brings thousands of new service providers to the platform.",
    link: "#",
  },
  {
    date: "July 10, 2024",
    title: "ComeInBooked Introduces Stripe Connect for Merchant Payments",
    description: "New payment system enables faster payouts and simplified financial management.",
    link: "#",
  },
];

const coverage = [
  {
    publication: "TechCrunch",
    title: "ComeInBooked is making local service booking effortless",
    date: "January 2025",
    link: "#",
  },
  {
    publication: "Forbes",
    title: "The Startup Transforming How We Book Appointments",
    date: "December 2024",
    link: "#",
  },
  {
    publication: "Business Insider",
    title: "This booking app is a game-changer for small businesses",
    date: "November 2024",
    link: "#",
  },
  {
    publication: "The Verge",
    title: "ComeInBooked review: Finally, a booking app that works",
    date: "October 2024",
    link: "#",
  },
];

export default function PressPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-primary/10 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Press & Media
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              Get the latest news about ComeInBooked, download our media kit,
              or get in touch with our communications team.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <a href="#media-kit">
                  <Download className="mr-2 h-4 w-4" />
                  Download Media Kit
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="mailto:press@comeinbooked.com">
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Press Team
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Press Releases */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Press Releases
          </h2>
          <div className="mt-8 space-y-4">
            {pressReleases.map((release) => (
              <Card key={release.title} className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardDescription>{release.date}</CardDescription>
                  <CardTitle className="text-xl">
                    <Link href={release.link} className="hover:text-primary">
                      {release.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{release.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* News Coverage */}
      <section className="bg-muted/50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            In the News
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {coverage.map((item) => (
              <Card key={item.title} className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-primary">
                      {item.publication}
                    </span>
                    <span className="text-sm text-muted-foreground">{item.date}</span>
                  </div>
                  <CardTitle className="text-lg">
                    <Link
                      href={item.link}
                      className="flex items-center gap-2 hover:text-primary"
                    >
                      {item.title}
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Media Kit */}
      <section id="media-kit" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Media Kit
            </h2>
            <p className="mt-4 text-muted-foreground">
              Download our brand assets, logos, and company information for
              press coverage.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Brand Guidelines</CardTitle>
                  <CardDescription>
                    Logo usage, colors, and typography
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Logo Pack</CardTitle>
                  <CardDescription>
                    PNG, SVG, and EPS formats
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download ZIP
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Product Screenshots</CardTitle>
                  <CardDescription>
                    High-resolution app screenshots
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download ZIP
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Company Fact Sheet</CardTitle>
                  <CardDescription>
                    Key statistics and milestones
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-primary py-16 text-primary-foreground md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Media Inquiries
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/80">
              For press inquiries, interview requests, or additional information,
              please contact our communications team.
            </p>
            <div className="mt-8">
              <Button size="lg" variant="secondary" asChild>
                <Link href="mailto:press@comeinbooked.com">
                  press@comeinbooked.com
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
