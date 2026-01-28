"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { format, isFuture } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  CreditCard,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  getBooking,
  updateBookingStatus,
  type BookingWithDetails,
} from "@/actions/bookings";

function getStatusBadge(status: string) {
  switch (status) {
    case "confirmed":
      return <Badge>Confirmed</Badge>;
    case "pending":
      return <Badge variant="secondary">Pending</Badge>;
    case "cancelled":
      return <Badge variant="destructive">Cancelled</Badge>;
    case "completed":
      return <Badge variant="outline">Completed</Badge>;
    case "no_show":
      return <Badge variant="destructive">No Show</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "confirmed":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "pending":
      return <Clock className="h-5 w-5 text-yellow-500" />;
    case "cancelled":
      return <XCircle className="h-5 w-5 text-destructive" />;
    case "completed":
      return <CheckCircle className="h-5 w-5 text-muted-foreground" />;
    case "no_show":
      return <AlertCircle className="h-5 w-5 text-destructive" />;
    default:
      return <Clock className="h-5 w-5 text-muted-foreground" />;
  }
}

export default function CustomerBookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;

  const [booking, setBooking] = React.useState<BookingWithDetails | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isCancelling, setIsCancelling] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (bookingId) {
      loadBooking();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  const loadBooking = async () => {
    setIsLoading(true);
    setError(null);
    const result = await getBooking(bookingId);
    if (result.success && result.booking) {
      setBooking(result.booking);
    } else {
      setError(result.error || "Failed to load booking");
    }
    setIsLoading(false);
  };

  const handleCancel = async () => {
    setIsCancelling(true);
    const result = await updateBookingStatus(bookingId, "cancelled");
    if (result.success) {
      toast.success("Booking cancelled successfully");
      loadBooking();
    } else {
      toast.error(result.error || "Failed to cancel booking");
    }
    setIsCancelling(false);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto flex items-center justify-center px-4 py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-2xl text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-2xl font-bold">Booking Not Found</h2>
          <p className="mt-2 text-muted-foreground">
            {error || "This booking could not be found."}
          </p>
          <Button className="mt-6" asChild>
            <Link href="/customer">Back to My Bookings</Link>
          </Button>
        </div>
      </div>
    );
  }

  const date = new Date(booking.start_time);
  const totalPrice =
    booking.items?.reduce((sum, item) => sum + Number(item.price), 0) || 0;
  const totalDuration =
    booking.items?.reduce((sum, item) => sum + item.duration_minutes, 0) || 0;
  const canCancel =
    booking.status !== "cancelled" &&
    booking.status !== "completed" &&
    booking.status !== "no_show" &&
    isFuture(date);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back link */}
      <Button variant="ghost" className="mb-6" asChild>
        <Link href="/customer">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to My Bookings
        </Link>
      </Button>

      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">Booking Details</h1>
              {getStatusBadge(booking.status)}
            </div>
            <p className="mt-1 text-muted-foreground">
              Booked on {format(new Date(booking.created_at), "MMMM d, yyyy")}
            </p>
          </div>
          {canCancel && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isCancelling}>
                  {isCancelling && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Cancel Booking
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will cancel your appointment. Please check the
                    business&apos;s cancellation policy regarding any potential
                    fees.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleCancel}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Yes, Cancel
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {/* Cancellation info */}
        {booking.status === "cancelled" && booking.cancellation_reason && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="flex items-start gap-3 pt-6">
              <XCircle className="mt-0.5 h-5 w-5 text-destructive" />
              <div>
                <p className="font-medium text-destructive">
                  Booking Cancelled
                </p>
                <p className="text-sm text-muted-foreground">
                  Reason: {booking.cancellation_reason}
                </p>
                {booking.cancelled_at && (
                  <p className="text-sm text-muted-foreground">
                    Cancelled on{" "}
                    {format(new Date(booking.cancelled_at), "MMMM d, yyyy 'at' h:mm a")}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Appointment Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Appointment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Date
                </p>
                <p className="text-lg font-semibold">
                  {format(date, "EEEE, MMMM d, yyyy")}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Time
                </p>
                <p className="text-lg font-semibold">
                  {format(date, "h:mm a")} - {format(new Date(booking.end_time), "h:mm a")}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Duration
              </p>
              <p>{totalDuration} minutes</p>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(booking.status)}
              <span className="text-sm capitalize">{booking.status.replace("_", " ")}</span>
            </div>
          </CardContent>
        </Card>

        {/* Services */}
        <Card>
          <CardHeader>
            <CardTitle>Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {booking.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{item.service_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.duration_minutes} min
                    </p>
                  </div>
                  <p className="font-semibold">
                    {"\u20A6"}
                    {Number(item.price).toLocaleString()}
                  </p>
                </div>
              ))}
              <Separator />
              <div className="flex items-center justify-between">
                <p className="font-semibold">Total</p>
                <p className="text-lg font-bold">
                  {"\u20A6"}
                  {totalPrice.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business & Staff */}
        <div className="grid gap-6 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Business
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold">{booking.business?.name}</p>
              {booking.location && (
                <div className="mt-2 text-sm text-muted-foreground">
                  <p>{booking.location.address_line1}</p>
                  <p>
                    {booking.location.city}
                    {booking.location.state
                      ? `, ${booking.location.state}`
                      : ""}
                  </p>
                </div>
              )}
              {booking.business?.slug && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  asChild
                >
                  <Link href={`/business/${booking.business.slug}`}>
                    View Business
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Staff
              </CardTitle>
            </CardHeader>
            <CardContent>
              {booking.staff ? (
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={booking.staff.avatar_url || undefined}
                    />
                    <AvatarFallback>
                      {booking.staff.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{booking.staff.name}</p>
                    {booking.staff.title && (
                      <p className="text-sm text-muted-foreground">
                        {booking.staff.title}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Any available staff member
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Payment */}
        {booking.payment && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">
                    {"\u20A6"}
                    {Number(booking.payment.amount).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {booking.payment.status}
                  </p>
                </div>
                <Badge
                  variant={
                    booking.payment.status === "succeeded"
                      ? "default"
                      : booking.payment.status === "failed"
                        ? "destructive"
                        : "secondary"
                  }
                >
                  {booking.payment.status === "succeeded"
                    ? "Paid"
                    : booking.payment.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notes */}
        {booking.notes && (
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{booking.notes}</p>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex justify-center gap-4">
          {booking.business?.slug && (
            <Button variant="outline" asChild>
              <Link href={`/business/${booking.business.slug}`}>
                Book Again
              </Link>
            </Button>
          )}
          <Button variant="ghost" asChild>
            <Link href="/customer">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
