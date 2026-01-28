"use client";

import * as React from "react";
import { format, startOfWeek, addDays, isSameDay, parseISO, startOfDay, endOfDay, addWeeks, getHours } from "date-fns";
import { ChevronLeft, ChevronRight, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";

interface CalendarBooking {
  id: string;
  customer_name: string;
  service_name: string;
  staff_name: string;
  start_time: Date;
  end_time: Date;
  duration_hours: number;
  status: string;
  color: string;
}

// Color palette for bookings
const bookingColors = [
  "bg-blue-500",
  "bg-purple-500",
  "bg-green-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-cyan-500",
  "bg-indigo-500",
  "bg-teal-500",
];

const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [view, setView] = React.useState<"week" | "day">("week");
  const [bookings, setBookings] = React.useState<CalendarBooking[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [businessId, setBusinessId] = React.useState<string | null>(null);
  const { user } = useAuth();

  // Fetch business for the current user
  React.useEffect(() => {
    const fetchBusiness = async () => {
      if (!user) return;

      const supabase = createClient();
      if (!supabase) return;

      const { data: business } = await supabase
        .from("businesses")
        .select("id")
        .eq("owner_id", user.id)
        .single();

      if (business) {
        setBusinessId(business.id);
      }
    };

    fetchBusiness();
  }, [user]);

  // Fetch bookings for the current week
  React.useEffect(() => {
    const fetchBookings = async () => {
      if (!businessId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const supabase = createClient();
      if (!supabase) {
        setLoading(false);
        return;
      }

      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      const weekEnd = addWeeks(weekStart, 1);

      const { data: bookingsData, error } = await supabase
        .from("bookings")
        .select(`
          id,
          start_time,
          end_time,
          status,
          customer_id,
          staff_id,
          booking_items (
            service_name,
            duration_minutes
          ),
          profiles:customer_id (
            full_name
          ),
          staff_members:staff_id (
            name
          )
        `)
        .eq("business_id", businessId)
        .gte("start_time", startOfDay(weekStart).toISOString())
        .lt("start_time", endOfDay(weekEnd).toISOString())
        .in("status", ["pending", "confirmed"]);

      if (error) {
        console.error("Error fetching bookings:", error);
        setLoading(false);
        return;
      }

      // Transform bookings data
      const customerColorMap = new Map<string, string>();
      let colorIndex = 0;

      const transformedBookings: CalendarBooking[] = (bookingsData || []).map((booking: {
        id: string;
        start_time: string;
        end_time: string;
        status: string;
        customer_id: string;
        staff_id: string;
        booking_items: { service_name: string; duration_minutes: number }[];
        profiles: { full_name: string | null }[] | { full_name: string | null } | null;
        staff_members: { name: string }[] | { name: string } | null;
      }) => {
        // Assign consistent color per customer
        if (!customerColorMap.has(booking.customer_id)) {
          customerColorMap.set(booking.customer_id, bookingColors[colorIndex % bookingColors.length]);
          colorIndex++;
        }

        const startTime = parseISO(booking.start_time);
        const endTime = parseISO(booking.end_time);
        const durationMs = endTime.getTime() - startTime.getTime();
        const durationHours = durationMs / (1000 * 60 * 60);

        const profile = Array.isArray(booking.profiles) ? booking.profiles[0] : booking.profiles;
        const staffMember = Array.isArray(booking.staff_members) ? booking.staff_members[0] : booking.staff_members;

        return {
          id: booking.id,
          customer_name: profile?.full_name || "Guest",
          service_name: booking.booking_items?.[0]?.service_name || "Service",
          staff_name: staffMember?.name || "Staff",
          start_time: startTime,
          end_time: endTime,
          duration_hours: durationHours,
          status: booking.status,
          color: customerColorMap.get(booking.customer_id) || bookingColors[0],
        };
      });

      setBookings(transformedBookings);
      setLoading(false);
    };

    fetchBookings();
  }, [businessId, currentDate]);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getBookingsForDayAndHour = (date: Date, hour: number) => {
    return bookings.filter((b) => {
      const bookingDate = b.start_time;
      return isSameDay(bookingDate, date) && getHours(bookingDate) === hour;
    });
  };

  const navigateWeek = (direction: number) => {
    setCurrentDate(addDays(currentDate, direction * 7));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">
            Manage your schedule and appointments
          </p>
        </div>
        <Button asChild>
          <Link href="/merchant/bookings?action=new">
            <Plus className="mr-2 h-4 w-4" />
            Add Booking
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateWeek(-1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <CardTitle>{format(currentDate, "MMMM yyyy")}</CardTitle>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateWeek(1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant={view === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("week")}
            >
              Week
            </Button>
            <Button
              variant={view === "day" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("day")}
            >
              Day
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
              Today
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Week view */}
              <div className="min-w-[800px]">
                {/* Day headers */}
                <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b">
                  <div className="p-2" />
                  {weekDays.map((day) => (
                    <div
                      key={day.toISOString()}
                      className={cn(
                        "border-l p-2 text-center",
                        isSameDay(day, new Date()) && "bg-primary/5"
                      )}
                    >
                      <div className="text-sm text-muted-foreground">
                        {format(day, "EEE")}
                      </div>
                      <div
                        className={cn(
                          "mx-auto mt-1 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
                          isSameDay(day, new Date()) &&
                            "bg-primary text-primary-foreground"
                        )}
                      >
                        {format(day, "d")}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Time grid */}
                <div className="relative">
                  {hours.map((hour) => (
                    <div
                      key={hour}
                      className="grid grid-cols-[60px_repeat(7,1fr)] border-b"
                    >
                      <div className="p-2 text-right text-xs text-muted-foreground">
                        {format(new Date().setHours(hour, 0, 0, 0), "h a")}
                      </div>
                      {weekDays.map((day) => {
                        const dayBookings = getBookingsForDayAndHour(day, hour);
                        return (
                          <div
                            key={day.toISOString()}
                            className={cn(
                              "relative h-16 border-l",
                              isSameDay(day, new Date()) && "bg-primary/5"
                            )}
                          >
                            {dayBookings.map((booking) => (
                              <Link
                                key={booking.id}
                                href={`/merchant/bookings/${booking.id}`}
                                className={cn(
                                  "absolute inset-x-1 rounded p-1 text-xs text-white cursor-pointer hover:opacity-90 transition-opacity",
                                  booking.color
                                )}
                                style={{
                                  height: `${Math.max(booking.duration_hours, 0.5) * 64 - 4}px`,
                                }}
                              >
                                <div className="font-medium truncate">
                                  {booking.customer_name}
                                </div>
                                <div className="truncate opacity-90">
                                  {booking.service_name}
                                </div>
                              </Link>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>

                {/* Empty state */}
                {bookings.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-muted-foreground">No bookings this week</p>
                    <Button variant="link" asChild className="mt-2">
                      <Link href="/merchant/bookings?action=new">
                        Create your first booking
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
