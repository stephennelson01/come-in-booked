"use client";

import * as React from "react";
import Link from "next/link";
import { format, startOfWeek, endOfWeek, subWeeks, isWithinInterval } from "date-fns";
import {
  Calendar,
  Users,
  TrendingUp,
  TrendingDown,
  Clock,
  ChevronRight,
  Loader2,
  Scissors,
  Star,
  DollarSign,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getBusinessBookings, type BookingWithDetails } from "@/actions/bookings";
import { getMyServices, type Service } from "@/actions/services";
import { getMyStaff } from "@/actions/staff";
import { getMyBusinessReviews } from "@/actions/reviews";

export default function MerchantDashboard() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [todayBookings, setTodayBookings] = React.useState<BookingWithDetails[]>([]);
  const [recentBookings, setRecentBookings] = React.useState<BookingWithDetails[]>([]);
  const [services, setServices] = React.useState<Service[]>([]);
  const [stats, setStats] = React.useState({
    todayCount: 0,
    monthRevenue: 0,
    lastMonthRevenue: 0,
    thisWeekBookings: 0,
    lastWeekBookings: 0,
    totalClients: 0,
    totalServices: 0,
    totalStaff: 0,
    averageRating: 0,
    totalReviews: 0,
    popularServices: [] as Array<{ name: string; count: number }>,
  });

  React.useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);

    // Fetch all data in parallel
    const [bookingsResult, servicesResult, staffResult, reviewsResult] = await Promise.all([
      getBusinessBookings(),
      getMyServices(),
      getMyStaff(),
      getMyBusinessReviews(),
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
      const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

      const monthBookings = allBookings.filter((b) => {
        const bookingDate = new Date(b.start_time);
        return bookingDate >= monthStart && (b.status === "completed" || b.status === "confirmed");
      });
      const monthRevenue = monthBookings.reduce(
        (sum, b) => sum + (b.items?.reduce((s, item) => s + Number(item.price), 0) || 0),
        0
      );

      const lastMonthBookings = allBookings.filter((b) => {
        const bookingDate = new Date(b.start_time);
        return bookingDate >= lastMonthStart && bookingDate <= lastMonthEnd && (b.status === "completed" || b.status === "confirmed");
      });
      const lastMonthRevenue = lastMonthBookings.reduce(
        (sum, b) => sum + (b.items?.reduce((s, item) => s + Number(item.price), 0) || 0),
        0
      );

      // This week vs last week bookings
      const thisWeekStart = startOfWeek(today, { weekStartsOn: 1 });
      const thisWeekEnd = endOfWeek(today, { weekStartsOn: 1 });
      const lastWeekStart = subWeeks(thisWeekStart, 1);
      const lastWeekEnd = subWeeks(thisWeekEnd, 1);

      const thisWeekBookings = allBookings.filter((b) => {
        const bookingDate = new Date(b.start_time);
        return isWithinInterval(bookingDate, { start: thisWeekStart, end: thisWeekEnd }) && b.status !== "cancelled";
      }).length;

      const lastWeekBookings = allBookings.filter((b) => {
        const bookingDate = new Date(b.start_time);
        return isWithinInterval(bookingDate, { start: lastWeekStart, end: lastWeekEnd }) && b.status !== "cancelled";
      }).length;

      // Unique customers
      const uniqueCustomers = new Set(allBookings.map((b) => b.customer_id));

      // Popular services
      const serviceCounts = new Map<string, number>();
      allBookings.forEach((b) => {
        b.items?.forEach((item) => {
          serviceCounts.set(item.service_name, (serviceCounts.get(item.service_name) || 0) + 1);
        });
      });
      const popularServices = Array.from(serviceCounts.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setStats((prev) => ({
        ...prev,
        todayCount: todaysBookings.length,
        monthRevenue,
        lastMonthRevenue,
        thisWeekBookings,
        lastWeekBookings,
        totalClients: uniqueCustomers.size,
        popularServices,
      }));
    }

    if (servicesResult.success && servicesResult.services) {
      setServices(servicesResult.services.filter((s) => s.is_active));
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

    if (reviewsResult.success) {
      setStats((prev) => ({
        ...prev,
        averageRating: reviewsResult.averageRating || 0,
        totalReviews: reviewsResult.totalCount || 0,
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

  const weekOverWeekChange = stats.lastWeekBookings > 0
    ? Math.round(((stats.thisWeekBookings - stats.lastWeekBookings) / stats.lastWeekBookings) * 100)
    : stats.thisWeekBookings > 0 ? 100 : 0;

  const monthOverMonthChange = stats.lastMonthRevenue > 0
    ? Math.round(((stats.monthRevenue - stats.lastMonthRevenue) / stats.lastMonthRevenue) * 100)
    : stats.monthRevenue > 0 ? 100 : 0;

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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Today&apos;s Bookings
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayCount}</div>
            <p className="text-xs text-muted-foreground">
              {stats.thisWeekBookings} this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              This Month&apos;s Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{stats.monthRevenue.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-xs">
              {monthOverMonthChange >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span className={monthOverMonthChange >= 0 ? "text-green-500" : "text-red-500"}>
                {monthOverMonthChange >= 0 ? "+" : ""}{monthOverMonthChange}%
              </span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Rating
            </CardTitle>
            <Star className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">
                {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : "—"}
              </span>
              {stats.averageRating > 0 && (
                <span className="text-sm text-muted-foreground">/ 5</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.totalReviews} {stats.totalReviews === 1 ? "review" : "reviews"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Clients
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClients}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalServices} services · {stats.totalStaff} staff
            </p>
          </CardContent>
        </Card>
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

      {/* Popular Services */}
      {stats.popularServices.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Popular Services</CardTitle>
            <CardDescription>Your most booked services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.popularServices.map((service, index) => {
                const maxCount = stats.popularServices[0].count;
                const percentage = (service.count / maxCount) * 100;
                return (
                  <div key={service.name} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <span className="text-muted-foreground">#{index + 1}</span>
                        <span className="font-medium">{service.name}</span>
                      </span>
                      <span className="text-muted-foreground">{service.count} bookings</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

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
              <Link href="/merchant/reviews">View Reviews</Link>
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
