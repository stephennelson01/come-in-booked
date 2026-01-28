import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Phone, Globe, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getBusinessBySlug } from "@/actions/business";

// Fallback data used when database is not connected
const fallbackBusiness = {
  id: "1",
  slug: "luxe-hair-studio",
  name: "Luxe Hair Studio",
  description:
    "Premier hair salon offering cutting-edge styles, color treatments, and personalized consultations. Our expert stylists are dedicated to helping you look and feel your best.",
  category: "Hair Salon",
  cover_image_url: null,
  logo_url: null,
  phone: "+234 812 345 6789",
  website: "https://luxehairstudio.ng",
  location: {
    address_line1: "15 Admiralty Way, Lekki Phase 1",
    city: "Lagos",
    state: "Lagos",
    postal_code: "106104",
  },
  hours: [
    { day: "Monday", open: "9:00 AM", close: "7:00 PM" },
    { day: "Tuesday", open: "9:00 AM", close: "7:00 PM" },
    { day: "Wednesday", open: "9:00 AM", close: "7:00 PM" },
    { day: "Thursday", open: "9:00 AM", close: "8:00 PM" },
    { day: "Friday", open: "9:00 AM", close: "8:00 PM" },
    { day: "Saturday", open: "10:00 AM", close: "6:00 PM" },
    { day: "Sunday", open: "Closed", close: "" },
  ],
  services: [
    {
      id: "s1",
      name: "Haircut",
      description: "Precision cut with consultation and styling",
      duration_minutes: 45,
      price: 5000,
      category: "Cuts",
    },
    {
      id: "s2",
      name: "Color & Highlights",
      description: "Full color service with premium products",
      duration_minutes: 120,
      price: 15000,
      category: "Color",
    },
    {
      id: "s3",
      name: "Blowout",
      description: "Professional wash and style",
      duration_minutes: 30,
      price: 3500,
      category: "Styling",
    },
    {
      id: "s4",
      name: "Deep Conditioning",
      description: "Intensive treatment for damaged hair",
      duration_minutes: 30,
      price: 4000,
      category: "Treatments",
    },
  ],
  staff: [
    {
      id: "st1",
      name: "Sarah Johnson",
      title: "Senior Stylist",
      avatar_url: null,
      bio: "15 years experience specializing in color and cuts",
    },
    {
      id: "st2",
      name: "Michael Chen",
      title: "Color Specialist",
      avatar_url: null,
      bio: "Expert in balayage and creative color",
    },
    {
      id: "st3",
      name: "Emily Rodriguez",
      title: "Stylist",
      avatar_url: null,
      bio: "Specializing in modern cuts and styling",
    },
  ],
  reviews: [] as Array<{
    id: string;
    rating: number;
    comment: string | null;
    created_at: string;
    customer: { full_name: string | null };
  }>,
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const result = await getBusinessBySlug(slug);

  const name = result.success && result.business ? result.business.name : "Business";
  const description = result.success && result.business ? result.business.description : undefined;

  return {
    title: `${name} - Book Appointment`,
    description: description || `Book an appointment at ${name}`,
  };
}

export default async function BusinessPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getBusinessBySlug(slug);

  // Use real data if available, otherwise use fallback
  const business = result.success && result.business ? {
    ...result.business,
    location: result.business.location || fallbackBusiness.location,
    hours: fallbackBusiness.hours, // Hours aren't in DB schema yet
    services: (result.business.services || []).map((s) => ({
      ...s,
      category: s.category || "Services",
    })),
    staff: result.business.staff || [],
    reviews: result.business.reviews || [],
  } : fallbackBusiness;

  const serviceCategories = [...new Set(business.services.map((s) => s.category))];

  // Calculate average rating from reviews
  const avgRating = business.reviews.length > 0
    ? (business.reviews.reduce((sum, r) => sum + r.rating, 0) / business.reviews.length).toFixed(1)
    : null;

  return (
    <div className="min-h-screen">
      {/* Cover Image */}
      <div className="relative h-48 bg-gradient-to-r from-primary/20 to-primary/40 md:h-64">
        {business.cover_image_url && (
          <Image
            src={business.cover_image_url}
            alt={business.name}
            fill
            className="object-cover"
          />
        )}
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Business Header */}
            <div className="-mt-16 mb-6 flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="relative h-24 w-24 overflow-hidden rounded-xl border-4 border-background bg-muted shadow-md sm:h-32 sm:w-32">
                {business.logo_url ? (
                  <Image
                    src={business.logo_url}
                    alt={business.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-muted-foreground">
                    {business.name[0]}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <Badge>{business.category}</Badge>
                <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                  {business.name}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  {avgRating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-foreground">
                        {avgRating}
                      </span>
                      <span>({business.reviews.length} reviews)</span>
                    </div>
                  )}
                  {business.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {business.location.city}, {business.location.state}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="services" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="services" className="mt-6">
                <div className="space-y-6">
                  {serviceCategories.map((category) => (
                    <div key={category}>
                      <h3 className="mb-3 text-lg font-semibold">{category}</h3>
                      <div className="space-y-3">
                        {business.services
                          .filter((s) => s.category === category)
                          .map((service) => (
                            <Card key={service.id}>
                              <CardContent className="flex items-center justify-between p-4">
                                <div className="flex-1">
                                  <h4 className="font-medium">{service.name}</h4>
                                  {service.description && (
                                    <p className="text-sm text-muted-foreground">
                                      {service.description}
                                    </p>
                                  )}
                                  <p className="mt-1 text-sm text-muted-foreground">
                                    {service.duration_minutes} min
                                  </p>
                                </div>
                                <div className="ml-4 text-right">
                                  <p className="text-lg font-semibold">
                                    ₦{Number(service.price).toLocaleString()}
                                  </p>
                                  <Button size="sm" className="mt-2" asChild>
                                    <Link
                                      href={`/business/${slug}/book?service=${service.id}`}
                                    >
                                      Book
                                    </Link>
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </div>
                  ))}
                  {business.services.length === 0 && (
                    <p className="py-8 text-center text-muted-foreground">
                      No services listed yet
                    </p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="about" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground">{business.description}</p>

                    <Separator className="my-6" />

                    <div className="space-y-4">
                      {business.location && (
                        <div className="flex items-start gap-3">
                          <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Address</p>
                            <p className="text-sm text-muted-foreground">
                              {business.location.address_line1}
                              <br />
                              {business.location.city}, {business.location.state}{" "}
                              {business.location.postal_code}
                            </p>
                          </div>
                        </div>
                      )}

                      {business.phone && (
                        <div className="flex items-start gap-3">
                          <Phone className="mt-0.5 h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Phone</p>
                            <p className="text-sm text-muted-foreground">
                              {business.phone}
                            </p>
                          </div>
                        </div>
                      )}

                      {business.website && (
                        <div className="flex items-start gap-3">
                          <Globe className="mt-0.5 h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Website</p>
                            <a
                              href={business.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline"
                            >
                              {business.website}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="team" className="mt-6">
                {business.staff.length === 0 ? (
                  <p className="py-8 text-center text-muted-foreground">
                    No team members listed yet
                  </p>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {business.staff.map((member) => (
                      <Card key={member.id}>
                        <CardContent className="flex items-center gap-4 p-4">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={member.avatar_url || undefined} />
                            <AvatarFallback>
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold">{member.name}</h4>
                            {member.title && (
                              <p className="text-sm text-muted-foreground">
                                {member.title}
                              </p>
                            )}
                            {member.bio && (
                              <p className="mt-1 text-sm text-muted-foreground">
                                {member.bio}
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                {business.reviews.length === 0 ? (
                  <p className="py-8 text-center text-muted-foreground">
                    No reviews yet
                  </p>
                ) : (
                  <div className="space-y-4">
                    {business.reviews.map((review) => (
                      <Card key={review.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">
                              {review.customer?.full_name || "Anonymous"}
                            </span>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: review.rating }).map((_, i) => (
                                <Star
                                  key={i}
                                  className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                />
                              ))}
                            </div>
                          </div>
                          {review.comment && (
                            <p className="mt-2 text-muted-foreground">
                              {review.comment}
                            </p>
                          )}
                          <p className="mt-2 text-xs text-muted-foreground">
                            {new Date(review.created_at).toLocaleDateString()}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Book an Appointment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" size="lg" asChild>
                  <Link href={`/business/${slug}/book`}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Book Now
                  </Link>
                </Button>

                <Separator />

                <div>
                  <h4 className="mb-2 flex items-center gap-2 font-medium">
                    <Clock className="h-4 w-4" />
                    Hours
                  </h4>
                  <div className="space-y-1 text-sm">
                    {business.hours.map((h) => (
                      <div key={h.day} className="flex justify-between">
                        <span className="text-muted-foreground">{h.day}</span>
                        <span>
                          {h.open === "Closed"
                            ? "Closed"
                            : `${h.open} - ${h.close}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
