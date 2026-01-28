import { Metadata } from "next";
import Link from "next/link";
import { MapPin, Clock, ArrowRight, Briefcase, Heart, Zap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join the ComeInBooked team and help us transform how people book local services.",
};

const benefits = [
  {
    icon: Heart,
    title: "Health & Wellness",
    description: "Comprehensive health, dental, and vision insurance for you and your family.",
  },
  {
    icon: Zap,
    title: "Flexible Work",
    description: "Remote-first culture with flexible hours and unlimited PTO.",
  },
  {
    icon: Briefcase,
    title: "Growth",
    description: "Learning budget, mentorship programs, and clear career progression.",
  },
  {
    icon: Users,
    title: "Team Culture",
    description: "Quarterly offsites, team events, and a collaborative environment.",
  },
];

const openings = [
  {
    title: "Senior Full-Stack Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description: "Build and scale our booking platform using Next.js, TypeScript, and PostgreSQL.",
    accepting: false,
  },
  {
    title: "Product Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
    description: "Shape the user experience for thousands of businesses and customers.",
    accepting: false,
  },
  {
    title: "Customer Success Manager",
    department: "Operations",
    location: "Remote",
    type: "Full-time",
    description: "Help our merchant partners succeed and grow their businesses.",
    accepting: false,
  },
  {
    title: "Marketing Manager",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
    description: "Drive growth through creative campaigns and strategic partnerships.",
    accepting: false,
  },
  {
    title: "Mobile Engineer (iOS/Android)",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description: "Build native mobile experiences using React Native.",
    accepting: false,
  },
  {
    title: "Data Analyst",
    department: "Analytics",
    location: "Remote",
    type: "Full-time",
    description: "Turn data into insights that drive product and business decisions.",
    accepting: false,
  },
];

export default function CareersPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-primary/10 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Join Our Team
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              Help us build the future of local services. We&apos;re looking for
              passionate people who want to make a real impact.
            </p>
            <div className="mt-8">
              <Button size="lg" asChild>
                <a href="#openings">
                  View Open Positions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Why Join ComeInBooked?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We offer more than just a job—we offer a chance to grow
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

      {/* Culture */}
      <section className="bg-muted/50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Our Culture
            </h2>
            <div className="mt-6 space-y-4 text-muted-foreground">
              <p>
                At ComeInBooked, we believe that great products are built by
                diverse teams who feel empowered to do their best work. We value
                transparency, collaboration, and continuous learning.
              </p>
              <p>
                We&apos;re a remote-first company with team members across the
                country. We use asynchronous communication to respect everyone&apos;s
                time and schedules, while still maintaining strong connections
                through regular video calls and quarterly in-person gatherings.
              </p>
              <p>
                Whether you&apos;re an early-career professional or a seasoned
                expert, you&apos;ll find opportunities to grow, mentor others, and
                make a meaningful impact on millions of users.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="openings" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Open Positions
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Find your next opportunity
            </p>
          </div>

          <div className="mt-12 space-y-4">
            {openings.map((job) => (
              <Card key={job.title} className="transition-shadow hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <CardTitle className="text-xl">{job.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {job.description}
                      </CardDescription>
                    </div>
                    {job.accepting ? (
                      <Button asChild>
                        <Link href={`/careers/${job.title.toLowerCase().replace(/\s+/g, "-")}`}>
                          Apply Now
                        </Link>
                      </Button>
                    ) : (
                      <Badge variant="secondary" className="h-10 px-4 text-sm">
                        Not Accepting Applications
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="secondary">{job.department}</Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {job.location}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {job.type}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16 text-primary-foreground md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Don&apos;t See the Right Role?
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/80">
              We&apos;re always looking for talented people. Send us your resume
              and we&apos;ll keep you in mind for future opportunities.
            </p>
            <div className="mt-8">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/contact">Get in Touch</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
