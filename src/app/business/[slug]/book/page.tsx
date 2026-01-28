"use client";

import * as React from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { format, addDays, isSameDay } from "date-fns";
import { CalendarIcon, Clock, User, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { getBusinessBySlug } from "@/actions/business";
import { getAvailableSlots, createBooking } from "@/actions/bookings";
import { createPaymentIntent } from "@/actions/stripe";
import { CheckoutWrapper } from "@/components/checkout/checkout-wrapper";

type BookingStep = "service" | "staff" | "datetime" | "confirm" | "payment";

interface BusinessData {
  id: string;
  name: string;
  slug: string;
  services: Array<{
    id: string;
    name: string;
    description: string | null;
    duration_minutes: number;
    price: number;
    category: string | null;
    is_active: boolean;
  }>;
  staff: Array<{
    id: string;
    name: string;
    title: string | null;
    avatar_url: string | null;
    bio: string | null;
  }>;
  location?: {
    id: string;
  };
}


export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = React.useState<BookingStep>("service");
  const [selectedService, setSelectedService] = React.useState<string | null>(
    searchParams.get("service")
  );
  const [selectedStaff, setSelectedStaff] = React.useState<string | null>(null);
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [clientSecret, setClientSecret] = React.useState<string | null>(null);
  const [bookingId, setBookingId] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);
  const [business, setBusiness] = React.useState<BusinessData | null>(null);
  const [timeSlots, setTimeSlots] = React.useState<string[]>([]);
  const [isSlotsLoading, setIsSlotsLoading] = React.useState(false);

  const service = business?.services.find((s) => s.id === selectedService);
  const staff = business?.staff.find((s) => s.id === selectedStaff);

  // Generate next 14 days for date selection
  const dates = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i));

  // Load business data
  React.useEffect(() => {
    const loadBusiness = async () => {
      setIsLoading(true);
      const result = await getBusinessBySlug(params.slug as string);
      if (result.success && result.business) {
        setBusiness({
          id: result.business.id,
          name: result.business.name,
          slug: result.business.slug,
          services: result.business.services || [],
          staff: result.business.staff || [],
          location: result.business.location ? { id: result.business.location.id } : undefined,
        } as BusinessData);
      } else {
        setLoadError(result.error || "Business not found");
      }
      setIsLoading(false);
    };
    loadBusiness();
  }, [params.slug]);

  // Load time slots when date or staff changes
  React.useEffect(() => {
    if (step === "datetime" && service) {
      loadTimeSlots();
    }
  }, [selectedDate, selectedStaff, step]);

  const loadTimeSlots = async () => {
    if (!service || !business) return;

    setIsSlotsLoading(true);
    const result = await getAvailableSlots({
      business_id: business.id,
      staff_id: selectedStaff === "any" ? undefined : selectedStaff || undefined,
      date: selectedDate.toISOString(),
      duration_minutes: service.duration_minutes,
    });

    if (result.success && result.slots) {
      setTimeSlots(result.slots);
    } else {
      setTimeSlots([]);
    }
    setIsSlotsLoading(false);
  };

  const handleNext = () => {
    if (step === "service" && selectedService) setStep("staff");
    else if (step === "staff" && selectedStaff) setStep("datetime");
    else if (step === "datetime" && selectedTime) setStep("confirm");
  };

  const handleBack = () => {
    if (step === "staff") setStep("service");
    else if (step === "datetime") setStep("staff");
    else if (step === "confirm") setStep("datetime");
    else if (step === "payment") setStep("confirm");
  };

  const handleConfirm = async () => {
    if (!business || !service || !selectedTime || !selectedStaff) return;

    setIsSubmitting(true);

    // Build start time from date + time
    const [hours, minutes] = selectedTime.split(":").map(Number);
    const startTime = new Date(selectedDate);
    startTime.setHours(hours, minutes, 0, 0);

    // Determine staff_id
    let staffId = selectedStaff;
    if (staffId === "any" && business.staff.length > 0) {
      staffId = business.staff[0].id;
    }

    // Determine location_id
    const locationId = (business as BusinessData & { location?: { id: string } }).location?.id;

    if (!locationId) {
      toast.error("This business has not set up a location yet.");
      setIsSubmitting(false);
      return;
    }

    const result = await createBooking({
      business_id: business.id,
      location_id: locationId,
      staff_id: staffId,
      start_time: startTime.toISOString(),
      services: [
        {
          service_id: service.id,
          service_name: service.name,
          duration_minutes: service.duration_minutes,
          price: service.price,
        },
      ],
    });

    if (result.success && result.booking) {
      setBookingId(result.booking.id);

      // Create payment intent
      try {
        const amountInKobo = Number(service.price) * 100;
        const paymentResult = await createPaymentIntent({
          amount: amountInKobo,
          currency: "ngn",
          metadata: {
            booking_id: result.booking.id,
            business_id: business.id,
          },
        });

        if (paymentResult.clientSecret) {
          setClientSecret(paymentResult.clientSecret);
          setStep("payment");
        } else {
          // No payment required - go directly to success
          toast.success("Booking confirmed! Check your email for details.");
          router.push("/customer");
        }
      } catch {
        // Payment setup failed but booking was created
        toast.success("Booking created! Payment can be completed later.");
        router.push("/customer");
      }
    } else {
      toast.error(result.error || "Failed to create booking. Please try again.");
    }
    setIsSubmitting(false);
  };

  const canProceed = () => {
    switch (step) {
      case "service":
        return !!selectedService;
      case "staff":
        return !!selectedStaff;
      case "datetime":
        return !!selectedTime;
      default:
        return false;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (loadError || !business) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12 text-center">
        <h2 className="text-2xl font-bold">Unable to Load Business</h2>
        <p className="mt-2 text-muted-foreground">
          {loadError || "This business could not be found."}
        </p>
        <Button className="mt-6" onClick={() => router.push("/search")}>
          Browse Services
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/business/${params.slug}`)}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to {business.name}
        </Button>
        <h1 className="mt-4 text-2xl font-bold">Book an Appointment</h1>
        <p className="text-muted-foreground">at {business.name}</p>
      </div>

      {/* Progress steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {(["service", "staff", "datetime", "confirm", "payment"] as const).map(
            (s, index) => (
              <React.Fragment key={s}>
                <div className="flex items-center">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
                      step === s
                        ? "bg-primary text-primary-foreground"
                        : index <
                          ["service", "staff", "datetime", "confirm", "payment"].indexOf(step)
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {index + 1}
                  </div>
                  <span className="ml-2 hidden text-sm sm:inline">
                    {s === "service"
                      ? "Service"
                      : s === "staff"
                      ? "Staff"
                      : s === "datetime"
                      ? "Date & Time"
                      : s === "confirm"
                      ? "Confirm"
                      : "Payment"}
                  </span>
                </div>
                {index < 4 && (
                  <div className="mx-2 h-0.5 flex-1 bg-muted sm:mx-4" />
                )}
              </React.Fragment>
            )
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main content */}
        <div className="md:col-span-2">
          {/* Step 1: Select Service */}
          {step === "service" && (
            <Card>
              <CardHeader>
                <CardTitle>Select a Service</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {business.services.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedService(s.id)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg border p-4 text-left transition-colors",
                      selectedService === s.id
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary/50"
                    )}
                  >
                    <div>
                      <p className="font-medium">{s.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {s.duration_minutes} min
                      </p>
                    </div>
                    <p className="text-lg font-semibold">₦{Number(s.price).toLocaleString()}</p>
                  </button>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Step 2: Select Staff */}
          {step === "staff" && (
            <Card>
              <CardHeader>
                <CardTitle>Choose Your Stylist</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <button
                  onClick={() => setSelectedStaff("any")}
                  className={cn(
                    "flex w-full items-center gap-4 rounded-lg border p-4 text-left transition-colors",
                    selectedStaff === "any"
                      ? "border-primary bg-primary/5"
                      : "hover:border-primary/50"
                  )}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <User className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">No Preference</p>
                    <p className="text-sm text-muted-foreground">
                      Book with the first available stylist
                    </p>
                  </div>
                </button>

                {business.staff.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStaff(s.id)}
                    className={cn(
                      "flex w-full items-center gap-4 rounded-lg border p-4 text-left transition-colors",
                      selectedStaff === s.id
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary/50"
                    )}
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={s.avatar_url || undefined} />
                      <AvatarFallback>
                        {s.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{s.name}</p>
                      {s.title && (
                        <p className="text-sm text-muted-foreground">{s.title}</p>
                      )}
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Step 3: Select Date & Time */}
          {step === "datetime" && (
            <Card>
              <CardHeader>
                <CardTitle>Select Date & Time</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Date selector */}
                <div className="mb-6">
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-medium">
                    <CalendarIcon className="h-4 w-4" />
                    Select Date
                  </h4>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {dates.map((date) => (
                      <button
                        key={date.toISOString()}
                        onClick={() => {
                          setSelectedDate(date);
                          setSelectedTime(null);
                        }}
                        className={cn(
                          "flex min-w-[4.5rem] flex-col items-center rounded-lg border p-3 transition-colors",
                          isSameDay(selectedDate, date)
                            ? "border-primary bg-primary/5"
                            : "hover:border-primary/50"
                        )}
                      >
                        <span className="text-xs text-muted-foreground">
                          {format(date, "EEE")}
                        </span>
                        <span className="text-lg font-semibold">
                          {format(date, "d")}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {format(date, "MMM")}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time slots */}
                <div>
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-medium">
                    <Clock className="h-4 w-4" />
                    Available Times
                  </h4>
                  {isSlotsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : timeSlots.length === 0 ? (
                    <p className="py-8 text-center text-muted-foreground">
                      No available times on this date
                    </p>
                  ) : (
                    <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={cn(
                            "rounded-lg border px-3 py-2 text-sm transition-colors",
                            selectedTime === time
                              ? "border-primary bg-primary text-primary-foreground"
                              : "hover:border-primary/50"
                          )}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Confirm */}
          {step === "confirm" && (
            <Card>
              <CardHeader>
                <CardTitle>Confirm Your Booking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-muted/50 p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service</span>
                      <span className="font-medium">{service?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Stylist</span>
                      <span className="font-medium">
                        {selectedStaff === "any" ? "No Preference" : staff?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date</span>
                      <span className="font-medium">
                        {format(selectedDate, "EEEE, MMMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time</span>
                      <span className="font-medium">{selectedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-medium">
                        {service?.duration_minutes} minutes
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg">
                      <span className="font-semibold">Total</span>
                      <span className="font-semibold">₦{service ? Number(service.price).toLocaleString() : 0}</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">
                  By confirming this booking, you agree to our cancellation
                  policy. You can cancel or reschedule up to 24 hours before
                  your appointment.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Step 5: Payment */}
          {step === "payment" && clientSecret && service && (
            <Card>
              <CardHeader>
                <CardTitle>Complete Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <CheckoutWrapper
                  clientSecret={clientSecret}
                  amount={Number(service.price)}
                  onSuccess={() => {
                    toast.success("Payment successful! Booking confirmed.");
                    router.push("/customer");
                  }}
                  onError={(msg) => {
                    toast.error(msg);
                  }}
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - Booking Summary */}
        <div className="md:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="text-lg">Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {service ? (
                <>
                  <div>
                    <p className="font-medium">{service.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {service.duration_minutes} min · ₦{Number(service.price).toLocaleString()}
                    </p>
                  </div>
                  {staff && (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {staff.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{staff.name}</p>
                        {staff.title && (
                          <p className="text-xs text-muted-foreground">
                            {staff.title}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  {selectedStaff === "any" && (
                    <p className="text-sm text-muted-foreground">
                      First available stylist
                    </p>
                  )}
                  {selectedTime && (
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-sm font-medium">
                        {format(selectedDate, "EEEE, MMMM d")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedTime}
                      </p>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₦{Number(service.price).toLocaleString()}</span>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Select a service to get started
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation buttons */}
      {step !== "payment" && (
      <div className="mt-6 flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={step === "service"}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back
        </Button>

        {step === "confirm" ? (
          <Button onClick={handleConfirm} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm & Pay
          </Button>
        ) : (
          <Button onClick={handleNext} disabled={!canProceed()}>
            Continue
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>
      )}
    </div>
  );
}
