import { Metadata } from "next";
import { Calendar, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Blog",
  description: "Tips, insights, and updates from the ComeInBooked team.",
};

const featuredPost = {
  slug: "future-of-local-services",
  title: "The Future of Local Services: Trends to Watch in 2025",
  description: "From AI-powered scheduling to personalized experiences, discover what's shaping the local services industry this year.",
  category: "Industry Insights",
  date: "January 20, 2025",
  readTime: "8 min read",
  image: "/blog/featured.jpg",
};

const posts = [
  {
    slug: "reduce-no-shows",
    title: "5 Proven Strategies to Reduce No-Shows at Your Business",
    description: "No-shows cost service businesses thousands each year. Learn how to minimize them with these effective tactics.",
    category: "Business Tips",
    date: "January 15, 2025",
    readTime: "5 min read",
  },
  {
    slug: "customer-loyalty",
    title: "Building Customer Loyalty: A Guide for Service Providers",
    description: "Turn first-time visitors into lifelong clients with these relationship-building strategies.",
    category: "Business Tips",
    date: "January 10, 2025",
    readTime: "6 min read",
  },
  {
    slug: "online-booking-benefits",
    title: "Why Online Booking Is Essential for Modern Businesses",
    description: "Discover how online booking can increase revenue, save time, and improve customer satisfaction.",
    category: "Industry Insights",
    date: "January 5, 2025",
    readTime: "4 min read",
  },
  {
    slug: "pricing-strategies",
    title: "Pricing Strategies That Work: A Guide for Service Businesses",
    description: "Find the right pricing model for your services without undervaluing your work.",
    category: "Business Tips",
    date: "December 28, 2024",
    readTime: "7 min read",
  },
  {
    slug: "social-media-marketing",
    title: "Social Media Marketing for Beauty & Wellness Businesses",
    description: "Grow your following and attract new clients with these platform-specific tips.",
    category: "Marketing",
    date: "December 20, 2024",
    readTime: "6 min read",
  },
  {
    slug: "year-in-review-2024",
    title: "ComeInBooked 2024: A Year in Review",
    description: "Looking back at our biggest milestones, features, and community achievements.",
    category: "Company News",
    date: "December 15, 2024",
    readTime: "5 min read",
  },
];

const categories = [
  "All",
  "Business Tips",
  "Industry Insights",
  "Marketing",
  "Company News",
  "Product Updates",
];

export default function BlogPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-primary/10 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              ComeInBooked Blog
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Tips, insights, and updates to help you grow your business and
              stay ahead of the curve.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <Card className="overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="aspect-video bg-muted md:aspect-auto" />
              <div className="flex flex-col justify-center p-6 md:p-8">
                <Badge className="w-fit">{featuredPost.category}</Badge>
                <h2 className="mt-4 text-2xl font-bold md:text-3xl">
                  {featuredPost.title}
                </h2>
                <p className="mt-4 text-muted-foreground">
                  {featuredPost.description}
                </p>
                <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {featuredPost.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {featuredPost.readTime}
                  </span>
                </div>
                <div className="mt-6">
                  <Badge variant="outline">Coming Soon</Badge>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Categories */}
      <section className="border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-4">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "All" ? "default" : "ghost"}
                size="sm"
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Card key={post.slug} className="flex flex-col">
                <div className="aspect-video bg-muted" />
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{post.category}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {post.readTime}
                    </span>
                  </div>
                  <CardTitle className="text-xl">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <CardDescription>{post.description}</CardDescription>
                </CardContent>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {post.date}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-muted/50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Subscribe to Our Newsletter
            </h2>
            <p className="mt-4 text-muted-foreground">
              Get the latest articles, tips, and updates delivered straight to
              your inbox. No spam, unsubscribe anytime.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Newsletter coming soon. Follow us on social media for updates.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
