"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { format } from "date-fns";
import {
  LayoutDashboard,
  Calendar,
  ClipboardList,
  Scissors,
  Users,
  UserCircle,
  Settings,
  ChevronLeft,
  Menu,
  Bell,
  Check,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const sidebarLinks = [
  { href: "/merchant", label: "Dashboard", icon: LayoutDashboard },
  { href: "/merchant/calendar", label: "Calendar", icon: Calendar },
  { href: "/merchant/bookings", label: "Bookings", icon: ClipboardList },
  { href: "/merchant/services", label: "Services", icon: Scissors },
  { href: "/merchant/staff", label: "Staff", icon: Users },
  { href: "/merchant/clients", label: "Clients", icon: UserCircle },
  { href: "/merchant/reviews", label: "Reviews", icon: Star },
  { href: "/merchant/settings", label: "Settings", icon: Settings },
];

interface Notification {
  id: string;
  type: "booking" | "cancellation" | "reminder";
  title: string;
  message: string;
  time: Date;
  read: boolean;
}

// Mock notifications - in production, these would come from a database subscription
const initialNotifications: Notification[] = [
  {
    id: "1",
    type: "booking",
    title: "New Booking",
    message: "Sarah Johnson booked Haircut for tomorrow at 10:00 AM",
    time: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    read: false,
  },
  {
    id: "2",
    type: "booking",
    title: "New Booking",
    message: "Michael Chen booked Color & Highlights for Friday at 2:00 PM",
    time: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    read: false,
  },
  {
    id: "3",
    type: "cancellation",
    title: "Booking Cancelled",
    message: "Jennifer Lee cancelled their appointment for today",
    time: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: true,
  },
  {
    id: "4",
    type: "reminder",
    title: "Upcoming Appointment",
    message: "David Wilson's appointment starts in 30 minutes",
    time: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    read: true,
  },
];

function NotificationBell() {
  const [notifications, setNotifications] = React.useState(initialNotifications);
  const [isOpen, setIsOpen] = React.useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return format(date, "MMM d");
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b p-3">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground"
              onClick={markAllAsRead}
            >
              <Check className="mr-1 h-3 w-3" />
              Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="h-80">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  className={cn(
                    "w-full text-left p-3 hover:bg-muted/50 transition-colors",
                    !notification.read && "bg-primary/5"
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "mt-1 h-2 w-2 rounded-full shrink-0",
                        notification.type === "booking" && "bg-green-500",
                        notification.type === "cancellation" && "bg-red-500",
                        notification.type === "reminder" && "bg-blue-500"
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {getTimeAgo(notification.time)}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
        <div className="border-t p-2">
          <Button variant="ghost" size="sm" className="w-full text-xs" asChild>
            <Link href="/merchant/bookings">View all bookings</Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      {/* Logo & Notifications */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        <Link href="/merchant" className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">ComeIn</span>
          <span className="text-sm text-muted-foreground">Merchant</span>
        </Link>
        <NotificationBell />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {sidebarLinks.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== "/merchant" && pathname.startsWith(link.href));

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onLinkClick}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <link.icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Back to main site */}
      <div className="border-t p-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to main site
        </Link>
      </div>
    </div>
  );
}

export function MerchantSidebar() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      {/* Mobile header */}
      <div className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between border-b bg-card px-4 py-3 md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SidebarContent onLinkClick={() => setIsOpen(false)} />
          </SheetContent>
        </Sheet>
        <span className="text-lg font-bold text-primary">ComeIn</span>
        <NotificationBell />
      </div>

      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r bg-card md:block">
        <SidebarContent />
      </aside>
    </>
  );
}
