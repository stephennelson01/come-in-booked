import { Metadata } from "next";
import Image from "next/image";
import { Users, Target, Heart, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about ComeInBooked's mission to connect customers with local service providers.",
};

const values = [
  {
    icon: Users,
    title: "Community First",
    description: "We believe in empowering local businesses and building stronger communities through meaningful connections.",
  },
  {
    icon: Target,
    title: "Simplicity",
    description: "We make booking appointments effortless, removing friction between customers and service providers.",
  },
  {
    icon: Heart,
    title: "Trust & Transparency",
    description: "We foster honest relationships through verified reviews, clear pricing, and reliable service.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We continuously improve our platform to deliver the best experience for everyone.",
  },
];

const team = [
  {
    name: "Stephen Nelson",
    role: "CEO & Head of Engineering",
    image: "/team/stephen.jpg",
  },
  // Additional team members - hidden for now
  // {
  //   name: "Emily Rodriguez",
  //   role: "Head of Product",
  //   image: "/team/emily.jpg",
  // },
  // {
  //   name: "Michael Thompson",
  //   role: "Head of Operations",
  //   image: "/team/michael.jpg",
  // },
  // {
  //   name: "David Chen",
  //   role: "Head of Engineering",
  //   image: "/team/david.jpg",
  // },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-primary/10 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              About ComeInBooked
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              We&apos;re on a mission to make booking local services as easy as
              a few taps. Founded in 2024, ComeInBooked connects thousands of
              customers with trusted beauty, wellness, and creative professionals
              in their communities.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Our Story
            </h2>
            <div className="mt-6 space-y-4 text-muted-foreground">
              <p>
                ComeInBooked was born from a simple frustration: why is it so hard
                to book an appointment with your favorite local salon or spa? Phone
                tag, limited hours, and outdated booking systems were holding back
                both customers and businesses.
              </p>
              <p>
                Our founder, Stephen, experienced this firsthand. As someone who
                valued both great service and efficiency, he spent countless hours
                trying to coordinate appointments around his schedule while also
                seeing how local businesses struggled with phone calls, no-shows,
                and outdated booking systems.
              </p>
              <p>
                Stephen built ComeInBooked—a platform that empowers local service
                providers with modern booking tools while giving customers the
                convenience of booking anytime, anywhere. Today, we serve thousands
                of businesses across the country, from independent stylists to
                multi-location spas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="bg-muted/50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Our Values
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              The principles that guide everything we do
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <Card key={value.title}>
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{value.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Leadership Team
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Meet the people building the future of local services
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-full bg-muted">
                  <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-muted-foreground">
                    {member.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                </div>
                <h3 className="mt-4 text-lg font-semibold">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary py-16 text-primary-foreground md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-4xl font-bold">10,000+</p>
              <p className="mt-2 text-primary-foreground/80">Service Providers</p>
            </div>
            <div>
              <p className="text-4xl font-bold">500,000+</p>
              <p className="mt-2 text-primary-foreground/80">Bookings Made</p>
            </div>
            <div>
              <p className="text-4xl font-bold">50+</p>
              <p className="mt-2 text-primary-foreground/80">Cities Served</p>
            </div>
            <div>
              <p className="text-4xl font-bold">4.8</p>
              <p className="mt-2 text-primary-foreground/80">Average Rating</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
