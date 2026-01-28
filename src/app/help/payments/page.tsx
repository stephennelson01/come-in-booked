import { Metadata } from "next";
import Link from "next/link";
import { CreditCard, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Payments - Help Center",
  description: "Payment methods and billing on ComeInBooked.",
};

const articles = [
  {
    slug: "payment-methods",
    title: "Accepted payment methods",
    description: "Learn about the payment options available",
  },
  {
    slug: "refund-policy",
    title: "Refund policy",
    description: "How refunds work on ComeInBooked",
  },
  {
    slug: "payment-security",
    title: "Payment security",
    description: "How we keep your payment information safe",
  },
  {
    slug: "receipts",
    title: "Receipts and invoices",
    description: "Access and download your payment records",
  },
  {
    slug: "payment-issues",
    title: "Payment issues",
    description: "Troubleshoot common payment problems",
  },
  {
    slug: "tipping",
    title: "Tipping service providers",
    description: "How to leave tips through the app",
  },
];

export default function PaymentsHelpPage() {
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
              <CreditCard className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
              <p className="mt-1 text-muted-foreground">
                Payment methods and billing
              </p>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {articles.map((article) => (
            <Link key={article.slug} href={`/help/payments/${article.slug}`}>
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
