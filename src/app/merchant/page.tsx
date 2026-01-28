"use client";

import * as React from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  Calendar,
  Users,
  TrendingUp,
  Clock,
  ChevronRight,
  Loader2,
  Scissors,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getBusinessBookings, type BookingWithDetails } from "@/actions/bookings";
import { getMyServices } from "@/actions/services";
import { getMyStaff } from "@/actions/staff";

export default function MerchantDashboard() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [todayBookings, setTodayBookings] = React.useState<BookingWithDetails[]>([]);
  const [recentBookings, setRecentBookings] = React.useState<BookingWithDetails[]>([]);
  const [stats, setStats] = React.useState({
    todayCount: 0,
    monthRevenue: 0,
    totalClients: 0,
    totalServices: 0,
    totalStaff: 0,
  });

  React.useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);

    // Fetch all data in parallel
    const [bookingsResult, servicesResult, staffResult] = await Promise.all([
      getBusinessBookings(),
      getMyServices(),
      getMyStaff(),
    ]);

    if (bookingsResult.success && bookingsResult.bookings) {
      const allBookings = bookingsResult.bookings;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Today's bookings
      const todaysBookings = allBookings.filter((b) => {
        const bookingDate = new Date(b.start_time);
        return bookingDate >= today && bookingDate < tomorrow && b.status !== "cancelled";
      });
      setTodayBookings(todaysBookings);

      // Recent bookings (last 5)
      setRecentBookings(allBookings.slice(0, 5));

      // Calculate month's revenue
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const monthBookings = allBookings.filter((b) => {
        const bookingDate = new Date(b.start_time);
        return bookingDate >= monthStart && (b.status === "completed" || b.status === "confirmed");
      });
      const monthRevenue = monthBookings.reduce(
        (sum, b) => sum + (b.items?.reduce((s, item) => s + Number(item.price), 0) || 0),
        0
      );

      // Unique customers
      const uniqueCustomers = new Set(allBookings.map((b) => b.customer_id));

      setStats((prev) => ({
        ...prev,
        todayCount: todaysBookings.length,
        monthRevenue,
        totalClients: uniqueCustomers.size,
      }));
    }

    if (servicesResult.success && servicesResult.services) {
      setStats((prev) => ({
        ...prev,
        totalServices: servicesResult.services!.filter((s) => s.is_active).length,
      }));
    }

    if (staffResult.success && staffResult.staff) {
      setStats((prev) => ({
        ...prev,
        totalStaff: staffResult.staff!.filter((s) => s.is_active).length,
      }));
    }

    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const statCards = [
    {
      title: "Today's Bookings",
      value: stats.todayCount.toString(),
      icon: Calendar,
    },
    {
      title: "This Month's Revenue",
      value: `₦${stats.monthRevenue.toLocaleString()}`,
      icon: TrendingUp,
    },
    {
      title: "Total Clients",
      value: stats.totalClients.toString(),
      icon: Users,
    },
    {
      title: "Active Services",
      value: stats.totalServices.toString(),
      icon: Scissors,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s what&apos;s happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's Schedule */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Today&apos;s Schedule</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/merchant/calendar">
                View Calendar
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {todayBookings.length === 0 ? (
              <div className="py-8 text-center">
                <Calendar className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  No bookings scheduled for today
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {todayBookings.map((booking) => {
                  const customerName = booking.customer?.full_name || "Unknown";
                  const serviceName = booking.items?.[0]?.service_name || "Service";
                  const staffName = booking.staff?.name || "";

                  return (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-16 flex-col items-center justify-center rounded bg-primary/10 text-primary">
                          <Clock className="h-3 w-3" />
                          <span className="text-xs font-medium">
                            {format(new Date(booking.start_time), "h:mm a")}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {customerName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">
                              {customerName}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {serviceName}{staffName ? ` with ${staffName}` : ""}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          booking.status === "confirmed" ? "default" : "secondary"
                        }
                      >
                        {booking.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Bookings</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/merchant/bookings">
                View All
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentBookings.length === 0 ? (
              <div className="py-8 text-center">
                <Calendar className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  No bookings yet
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentBookings.map((booking) => {
                  const customerName = booking.customer?.full_name || "Unknown";
                  const serviceName = booking.items?.[0]?.service_name || "Service";
                  const totalPrice = booking.items?.reduce(
                    (sum, item) => sum + Number(item.price),
                    0
                  ) || 0;

                  return (
                    <div
                      key={booking.id}
                      className="flex items-start justify-between"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-1 h-2 w-2 rounded-full ${
                            booking.status === "confirmed"
                              ? "bg-green-500"
                              : booking.status === "pending"
                              ? "bg-yellow-500"
                              : booking.status === "cancelled"
                              ? "bg-red-500"
                              : "bg-blue-500"
                          }`}
                        />
                        <div>
                          <p className="text-sm">
                            {customerName} - {serviceName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(booking.start_time), "MMM d, h:mm a")}
                            {" "}· ₦{totalPrice.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          booking.status === "confirmed"
                            ? "default"
                            : booking.status === "cancelled"
                            ? "destructive"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {booking.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" asChild>
              <Link href="/merchant/services">Add Service</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/merchant/staff">Add Staff Member</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/merchant/calendar">View Calendar</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/merchant/settings">Settings</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
