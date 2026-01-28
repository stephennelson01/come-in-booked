import { Metadata } from "next";
import Link from "next/link";
import { Search, Book, CreditCard, Calendar, Settings, MessageCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = {
  title: "Help Center",
  description: "Find answers to common questions and learn how to use ComeInBooked.",
};

const categories = [
  {
    icon: Book,
    title: "Getting Started",
    description: "Learn the basics of using ComeInBooked",
    articles: [
      { title: "How to create an account", slug: "create-account" },
      { title: "Setting up your profile", slug: "setup-profile" },
      { title: "Finding and booking services", slug: "finding-services" },
      { title: "Managing your bookings", slug: "managing-bookings" },
    ],
    href: "/help/getting-started",
  },
  {
    icon: Calendar,
    title: "Bookings",
    description: "Everything about appointments",
    articles: [
      { title: "How to book an appointment", slug: "how-to-book" },
      { title: "Rescheduling a booking", slug: "rescheduling" },
      { title: "Cancellation policy", slug: "cancellation-policy" },
      { title: "Booking confirmations", slug: "confirmations" },
    ],
    href: "/help/bookings",
  },
  {
    icon: CreditCard,
    title: "Payments",
    description: "Payment methods and billing",
    articles: [
      { title: "Accepted payment methods", slug: "payment-methods" },
      { title: "Refund policy", slug: "refund-policy" },
      { title: "Payment security", slug: "payment-security" },
      { title: "Receipts and invoices", slug: "receipts" },
    ],
    href: "/help/payments",
  },
  {
    icon: Settings,
    title: "Account Settings",
    description: "Manage your account and preferences",
    articles: [
      { title: "Updating your profile", slug: "update-profile" },
      { title: "Changing your password", slug: "change-password" },
      { title: "Notification preferences", slug: "notifications" },
      { title: "Deleting your account", slug: "delete-account" },
    ],
    href: "/help/account",
  },
];

const popularArticles = [
  { title: "How do I cancel or reschedule my booking?", href: "/help/bookings/rescheduling" },
  { title: "What happens if my service provider cancels?", href: "/help/bookings/cancellation-policy" },
  { title: "How do refunds work?", href: "/help/payments/refund-policy" },
  { title: "Can I book for someone else?", href: "/help/bookings/booking-for-others" },
  { title: "How do I leave a review?", href: "/help/getting-started/managing-bookings" },
  { title: "Is my payment information secure?", href: "/help/payments/payment-security" },
];

export default function HelpPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-primary/10 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              How can we help you?
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Search our knowledge base or browse categories below
            </p>
            <div className="relative mt-8">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for answers..."
                className="h-14 pl-12 pr-4 text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Browse by Category
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Card key={category.title} className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <category.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.articles.map((article) => (
                      <li key={article.slug}>
                        <Link
                          href={`${category.href}/${article.slug}`}
                          className="text-sm text-muted-foreground hover:text-primary"
                        >
                          {article.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={category.href}
                    className="mt-4 inline-flex items-center text-sm font-medium text-primary"
                  >
                    View all
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="bg-muted/50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Popular Articles
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {popularArticles.map((article) => (
              <Link
                key={article.title}
                href={article.href}
                className="rounded-lg border border-border bg-background p-4 transition-colors hover:border-primary"
              >
                <span className="font-medium">{article.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* For Businesses */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="rounded-lg bg-muted p-8 md:p-12">
            <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Are you a business owner?
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Visit our Merchant Help Center for guides on managing your
                  business, services, and bookings.
                </p>
              </div>
              <Button asChild>
                <Link href="/for-business">
                  For Business
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-primary py-16 text-primary-foreground md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <MessageCircle className="mx-auto h-12 w-12" />
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Still Need Help?
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/80">
              Our support team is available 7 days a week to assist you.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
              >
                Live Chat
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
