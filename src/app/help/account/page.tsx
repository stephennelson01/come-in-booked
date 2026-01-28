import { Metadata } from "next";
import Link from "next/link";
import { Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Account Settings - Help Center",
  description: "Manage your account and preferences on ComeInBooked.",
};

const articles = [
  {
    slug: "update-profile",
    title: "Updating your profile",
    description: "Change your name, photo, and contact information",
  },
  {
    slug: "change-password",
    title: "Changing your password",
    description: "Keep your account secure with a strong password",
  },
  {
    slug: "notifications",
    title: "Notification preferences",
    description: "Control how and when we contact you",
  },
  {
    slug: "delete-account",
    title: "Deleting your account",
    description: "How to permanently delete your ComeInBooked account",
  },
  {
    slug: "privacy-settings",
    title: "Privacy settings",
    description: "Control your data and privacy preferences",
  },
  {
    slug: "connected-accounts",
    title: "Connected accounts",
    description: "Manage Google and social media connections",
  },
];

export default function AccountHelpPage() {
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
              <Settings className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
              <p className="mt-1 text-muted-foreground">
                Manage your account and preferences
              </p>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {articles.map((article) => (
            <Link key={article.slug} href={`/help/account/${article.slug}`}>
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
