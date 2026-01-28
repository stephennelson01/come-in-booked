"use client";

import * as React from "react";
import Link from "next/link";
import { format, isPast, isToday, isFuture } from "date-fns";
import {
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  CalendarDays,
  History,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMyBookings, updateBookingStatus, type BookingWithDetails } from "@/actions/bookings";
import { toast } from "sonner";

function getStatusBadge(status: string, startTime: string) {
  const date = new Date(startTime);

  if (status === "cancelled") {
    return <Badge variant="destructive">Cancelled</Badge>;
  }

  if (status === "completed" || (status !== "cancelled" && isPast(date))) {
    return <Badge variant="secondary">Completed</Badge>;
  }

  if (isToday(date)) {
    return <Badge className="bg-green-500">Today</Badge>;
  }

  return <Badge>Upcoming</Badge>;
}

function BookingCard({
  booking,
  onCancel,
}: {
  booking: BookingWithDetails;
  onCancel: (id: string) => void;
}) {
  const date = new Date(booking.start_time);
  const totalPrice =
    booking.items?.reduce((sum, item) => sum + Number(item.price), 0) || 0;
  const totalDuration =
    booking.items?.reduce((sum, item) => sum + item.duration_minutes, 0) || 0;
  const serviceName =
    booking.items?.map((item) => item.service_name).join(", ") || "Service";
  const staffName = booking.staff?.name || "";
  const businessName = booking.business?.name || "Business";
  const locationCity = booking.location?.city || "";
  const locationState = booking.location?.state || "";
  const canCancel =
    booking.status !== "cancelled" &&
    booking.status !== "completed" &&
    isFuture(date);

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardContent className="p-0">
        <div className="flex">
          {/* Date column */}
          <div className="flex w-20 flex-col items-center justify-center bg-primary/5 p-4 text-center">
            <span className="text-sm font-medium text-muted-foreground">
              {format(date, "MMM")}
            </span>
            <span className="text-2xl font-bold">{format(date, "d")}</span>
            <span className="text-sm text-muted-foreground">
              {format(date, "EEE")}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{businessName}</h3>
                  {getStatusBadge(booking.status, booking.start_time)}
                </div>
                <p className="mt-1 text-sm font-medium text-primary">
                  {serviceName}
                </p>
              </div>
              <p className="text-lg font-semibold">
                {"\u20A6"}{totalPrice.toLocaleString()}
              </p>
            </div>

            <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>
                  {format(date, "h:mm a")} ({totalDuration} min)
                </span>
              </div>
              {locationCity && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {locationCity}
                    {locationState ? `, ${locationState}` : ""}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {staffName && (
                  <>
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={booking.staff?.avatar_url || undefined} />
                      <AvatarFallback className="text-xs">
                        {staffName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">
                      {staffName}
                    </span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                {canCancel && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => onCancel(booking.id)}
                  >
                    Cancel
                  </Button>
                )}
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/customer/bookings/${booking.id}`}>
                    Details
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CustomerDashboard() {
  const [bookings, setBookings] = React.useState<BookingWithDetails[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setIsLoading(true);
    const result = await getMyBookings();
    if (result.success && result.bookings) {
      setBookings(result.bookings);
    }
    setIsLoading(false);
  };

  const handleCancel = async (bookingId: string) => {
    const result = await updateBookingStatus(bookingId, "cancelled");
    if (result.success) {
      toast.success("Booking cancelled");
      loadBookings();
    } else {
      toast.error(result.error || "Failed to cancel booking");
    }
  };

  const upcomingBookings = bookings.filter(
    (b) =>
      b.status !== "cancelled" &&
      b.status !== "completed" &&
      isFuture(new Date(b.start_time))
  );

  const pastBookings = bookings.filter(
    (b) =>
      b.status === "completed" ||
      b.status === "cancelled" ||
      isPast(new Date(b.start_time))
  );

  if (isLoading) {
    return (
      <div className="container mx-auto flex items-center justify-center px-4 py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <p className="text-muted-foreground">
            Manage your upcoming and past appointments
          </p>
        </div>
        <Button asChild>
          <Link href="/search">
            <Calendar className="mr-2 h-4 w-4" />
            Book New
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList>
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Upcoming
            {upcomingBookings.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {upcomingBookings.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="past" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Past
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          {upcomingBookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">
                  No Upcoming Bookings
                </h3>
                <p className="mt-2 text-center text-muted-foreground">
                  You don&apos;t have any upcoming appointments.
                  <br />
                  Browse services and book your next appointment!
                </p>
                <Button className="mt-4" asChild>
                  <Link href="/search">Browse Services</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {upcomingBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onCancel={handleCancel}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          {pastBookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <History className="h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No Past Bookings</h3>
                <p className="mt-2 text-center text-muted-foreground">
                  You haven&apos;t completed any bookings yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pastBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onCancel={handleCancel}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
