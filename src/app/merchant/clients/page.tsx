"use client";

import * as React from "react";
import { format } from "date-fns";
import { Search, MoreHorizontal, Mail, Calendar, Loader2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface Client {
  id: string;
  customer_id: string;
  notes: string | null;
  tags: string[];
  total_bookings: number;
  total_spent: number;
  last_booking_at: string | null;
  customer: {
    full_name: string | null;
    email: string;
    phone: string | null;
  };
}

export default function ClientsPage() {
  const [clients, setClients] = React.useState<Client[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setIsLoading(true);
    const supabase = createClient();
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setIsLoading(false);
      return;
    }

    // Get business
    const { data: business } = await supabase
      .from("businesses")
      .select("id")
      .eq("owner_id", user.id)
      .single();

    if (!business) {
      setIsLoading(false);
      return;
    }

    // Get clients with customer profiles
    const { data, error } = await supabase
      .from("clients")
      .select(`
        *,
        customer:profiles!clients_customer_id_fkey(full_name, email, phone)
      `)
      .eq("business_id", business.id)
      .order("last_booking_at", { ascending: false, nullsFirst: false });

    if (error) {
      toast.error("Failed to load clients");
    } else {
      setClients(data || []);
    }

    setIsLoading(false);
  };

  const filteredClients = clients.filter(
    (client) => {
      const name = client.customer?.full_name || "";
      const email = client.customer?.email || "";
      return (
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  );

  const totalRevenue = clients.reduce((sum, c) => sum + Number(c.total_spent), 0);
  const totalBookings = clients.reduce((sum, c) => sum + c.total_bookings, 0);
  const avgBookings = clients.length > 0 ? Math.round(totalBookings / clients.length) : 0;

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
          <h1 className="text-3xl font-bold">Clients</h1>
          <p className="text-muted-foreground">
            View and manage your customer directory
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{clients.length}</div>
            <p className="text-sm text-muted-foreground">Total Clients</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">
              ₦{totalRevenue.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Total Revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{avgBookings}</div>
            <p className="text-sm text-muted-foreground">Avg. Bookings per Client</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Clients</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredClients.length === 0 ? (
            <div className="py-12 text-center">
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No clients yet</h3>
              <p className="text-muted-foreground">
                {searchQuery
                  ? "No clients match your search"
                  : "Clients will appear here after they book with you"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredClients.map((client) => {
                const name = client.customer?.full_name || "Unknown";
                const email = client.customer?.email || "";

                return (
                  <div
                    key={client.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>
                          {name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{name}</span>
                          {client.tags?.map((tag) => (
                            <Badge
                              key={tag}
                              variant={tag === "VIP" ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span>{client.total_bookings} visits</span>
                        </div>
                        {client.last_booking_at && (
                          <p className="text-xs text-muted-foreground">
                            Last: {format(new Date(client.last_booking_at), "MMM d, yyyy")}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          ₦{Number(client.total_spent).toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">Total spent</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          {email && (
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              Send Email
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>Add Note</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
