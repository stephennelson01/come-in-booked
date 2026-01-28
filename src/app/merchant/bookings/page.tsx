"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  Search,
  MoreHorizontal,
  Calendar,
  Clock,
  User,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  getBusinessBookings,
  updateBookingStatus,
  type BookingWithDetails,
  type BookingStatus,
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

export default function BookingsPage() {
  const [bookings, setBookings] = React.useState<BookingWithDetails[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");

  React.useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setIsLoading(true);
    const result = await getBusinessBookings();
    if (result.success && result.bookings) {
      setBookings(result.bookings);
    } else if (result.error) {
      toast.error(result.error);
    }
    setIsLoading(false);
  };

  const handleStatusUpdate = async (bookingId: string, status: BookingStatus) => {
    const result = await updateBookingStatus(bookingId, status);
    if (result.success) {
      toast.success(`Booking ${status}`);
      loadBookings();
    } else {
      toast.error(result.error || "Failed to update booking");
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const customerName = booking.customer?.full_name || "";
    const serviceName = booking.items?.[0]?.service_name || "";
    const matchesSearch =
      customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      serviceName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bookings</h1>
          <p className="text-muted-foreground">
            Manage and track all your appointments
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredBookings.length === 0 ? (
              <div className="py-12 text-center">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No bookings found</h3>
                <p className="text-muted-foreground">
                  {searchQuery
                    ? "Try adjusting your search"
                    : "Your bookings will appear here"}
                </p>
              </div>
            ) : (
              filteredBookings.map((booking) => {
                const totalPrice = booking.items?.reduce((sum, item) => sum + Number(item.price), 0) || 0;
                const totalDuration = booking.items?.reduce((sum, item) => sum + item.duration_minutes, 0) || 0;
                const serviceName = booking.items?.[0]?.service_name || "Unknown Service";
                const customerName = booking.customer?.full_name || "Unknown Customer";

                return (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>
                          {customerName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {customerName}
                          </span>
                          {getStatusBadge(booking.status)}
                        </div>
                        <p className="text-sm text-primary">{serviceName}</p>
                        <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(booking.start_time), "MMM d, yyyy")}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {format(new Date(booking.start_time), "h:mm a")} ({totalDuration} min)
                          </span>
                          {booking.staff && (
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {booking.staff.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold">₦{totalPrice.toLocaleString()}</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {booking.status === "pending" && (
                            <DropdownMenuItem
                              onClick={() => handleStatusUpdate(booking.id, "confirmed")}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Confirm
                            </DropdownMenuItem>
                          )}
                          {(booking.status === "confirmed" || booking.status === "pending") && (
                            <DropdownMenuItem
                              onClick={() => handleStatusUpdate(booking.id, "completed")}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Mark Completed
                            </DropdownMenuItem>
                          )}
                          {booking.status === "confirmed" && (
                            <DropdownMenuItem
                              onClick={() => handleStatusUpdate(booking.id, "no_show")}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Mark No Show
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          {booking.status !== "cancelled" && booking.status !== "completed" && (
                            <DropdownMenuItem
                              onClick={() => handleStatusUpdate(booking.id, "cancelled")}
                              className="text-destructive"
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Cancel Booking
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
