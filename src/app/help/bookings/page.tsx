import { Metadata } from "next";
import Link from "next/link";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Bookings - Help Center",
  description: "Everything about appointments on ComeInBooked.",
};

const articles = [
  {
    slug: "how-to-book",
    title: "How to book an appointment",
    description: "Step-by-step guide to making your first booking",
  },
  {
    slug: "rescheduling",
    title: "Rescheduling a booking",
    description: "Learn how to change your appointment time",
  },
  {
    slug: "cancellation-policy",
    title: "Cancellation policy",
    description: "Understand cancellation rules and fees",
  },
  {
    slug: "confirmations",
    title: "Booking confirmations",
    description: "How confirmations and reminders work",
  },
  {
    slug: "no-shows",
    title: "No-show policy",
    description: "What happens if you miss an appointment",
  },
  {
    slug: "booking-for-others",
    title: "Booking for someone else",
    description: "How to book appointments for friends or family",
  },
];

export default function BookingsHelpPage() {
  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/help"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Help Center
          </Link>
        </div>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10">
              <Calendar className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
              <p className="mt-1 text-muted-foreground">
                Everything about appointments
              </p>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {articles.map((article) => (
            <Link key={article.slug} href={`/help/bookings/${article.slug}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl">{article.title}</CardTitle>
                  <CardDescription>{article.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="inline-flex items-center text-sm font-medium text-primary">
                    Read article
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
