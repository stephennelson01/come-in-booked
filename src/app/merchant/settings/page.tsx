"use client";

import * as React from "react";
import { Loader2, Store, CreditCard, Bell, Clock, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { getMyBusiness, updateBusiness, updateLocation, type Business, type Location } from "@/actions/business";
import { createConnectAccount, createConnectAccountLink } from "@/actions/stripe";
import {
  getBusinessHours,
  updateBusinessHours,
  DEFAULT_BUSINESS_HOURS,
  DAY_NAMES,
  type BusinessHours,
} from "@/actions/hours";

// Generate time options for select dropdowns
const generateTimeOptions = () => {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    for (const minute of [0, 30]) {
      const timeStr = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      const displayStr = new Date(2000, 0, 1, hour, minute).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      options.push({ value: timeStr, label: displayStr });
    }
  }
  return options;
};

const TIME_OPTIONS = generateTimeOptions();

export default function SettingsPage() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [business, setBusiness] = React.useState<(Business & { location?: Location }) | null>(null);

  // Business fields
  const [name, setName] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [website, setWebsite] = React.useState("");

  // Location fields
  const [address, setAddress] = React.useState("");
  const [city, setCity] = React.useState("");
  const [state, setState] = React.useState("");
  const [postalCode, setPostalCode] = React.useState("");

  // Notification / booking settings (local state for now)
  const [autoConfirm, setAutoConfirm] = React.useState(true);
  const [emailReminders, setEmailReminders] = React.useState(true);
  const [smsReminders, setSmsReminders] = React.useState(true);
  const [isConnecting, setIsConnecting] = React.useState(false);

  // Business hours state
  const [businessHours, setBusinessHours] = React.useState<BusinessHours[]>(DEFAULT_BUSINESS_HOURS);
  const [isSavingHours, setIsSavingHours] = React.useState(false);

  const handleStripeConnect = async () => {
    if (!business) return;
    setIsConnecting(true);

    try {
      if (business.stripe_account_id) {
        // Already has an account - just create a new onboarding link
        const linkResult = await createConnectAccountLink(
          business.stripe_account_id,
          `${window.location.origin}/merchant/settings`,
          `${window.location.origin}/merchant/settings`
        );
        window.location.href = linkResult.url;
      } else {
        // Create new Connect account
        const accountResult = await createConnectAccount(
          email || "merchant@comeinbooked.com",
          name
        );

        // Update business with the new account ID
        await updateBusiness(business.id, { stripe_account_id: accountResult.accountId });

        // Create onboarding link
        const linkResult = await createConnectAccountLink(
          accountResult.accountId,
          `${window.location.origin}/merchant/settings`,
          `${window.location.origin}/merchant/settings`
        );
        window.location.href = linkResult.url;
      }
    } catch (error) {
      toast.error("Failed to connect Stripe. Please try again.");
      setIsConnecting(false);
    }
  };

  React.useEffect(() => {
    loadBusiness();
  }, []);

  const loadBusiness = async () => {
    setIsLoading(true);

    const [businessResult, hoursResult] = await Promise.all([
      getMyBusiness(),
      getBusinessHours(),
    ]);

    if (businessResult.success && businessResult.business) {
      const biz = businessResult.business;
      setBusiness(biz);
      setName(biz.name);
      setCategory(biz.category);
      setDescription(biz.description || "");
      setPhone(biz.phone || "");
      setEmail(biz.email || "");
      setWebsite(biz.website || "");

      if (biz.location) {
        setAddress(biz.location.address_line1);
        setCity(biz.location.city);
        setState(biz.location.state);
        setPostalCode(biz.location.postal_code);
      }
    }

    if (hoursResult.success && hoursResult.hours) {
      setBusinessHours(hoursResult.hours);
    }

    setIsLoading(false);
  };

  const handleSaveHours = async () => {
    setIsSavingHours(true);
    const result = await updateBusinessHours(businessHours);
    if (result.success) {
      toast.success("Business hours updated");
    } else {
      toast.error(result.error || "Failed to update business hours");
    }
    setIsSavingHours(false);
  };

  const updateDayHours = (
    dayOfWeek: number,
    field: keyof BusinessHours,
    value: boolean | string
  ) => {
    setBusinessHours((prev) =>
      prev.map((h) =>
        h.dayOfWeek === dayOfWeek ? { ...h, [field]: value } : h
      )
    );
  };

  const handleSave = async () => {
    if (!business) return;

    setIsSaving(true);

    // Update business details
    const bizResult = await updateBusiness(business.id, {
      name,
      category,
      description,
      phone,
      email,
      website,
    });

    if (!bizResult.success) {
      toast.error(bizResult.error || "Failed to update business");
      setIsSaving(false);
      return;
    }

    // Update location if exists
    if (business.location) {
      const locResult = await updateLocation(business.location.id, {
        address_line1: address,
        city,
        state,
        postal_code: postalCode,
      });

      if (!locResult.success) {
        toast.error(locResult.error || "Failed to update location");
        setIsSaving(false);
        return;
      }
    }

    toast.success("Settings saved");
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="py-12 text-center">
        <Store className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No business found</h3>
        <p className="text-muted-foreground">
          Please set up your business first.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your business settings and preferences
        </p>
      </div>

      <Tabs defaultValue="business" className="w-full">
        <TabsList className="mb-6 flex-wrap">
          <TabsTrigger value="business" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            Business
          </TabsTrigger>
          <TabsTrigger value="hours" className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4" />
            Hours
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="booking" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Booking
          </TabsTrigger>
        </TabsList>

        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>
                Update your business details visible to customers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+234 801 234 5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              <Separator />

              <h3 className="font-semibold">Location</h3>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">Postal Code</Label>
                  <Input
                    id="zip"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hours">
          <Card>
            <CardHeader>
              <CardTitle>Business Hours</CardTitle>
              <CardDescription>
                Set your operating hours for each day of the week. These hours apply to all staff members.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {businessHours.map((day) => (
                <div
                  key={day.dayOfWeek}
                  className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={day.isOpen}
                      onCheckedChange={(checked) =>
                        updateDayHours(day.dayOfWeek, "isOpen", checked)
                      }
                    />
                    <span className="w-24 font-medium">
                      {DAY_NAMES[day.dayOfWeek]}
                    </span>
                    {!day.isOpen && (
                      <span className="text-sm text-muted-foreground">
                        Closed
                      </span>
                    )}
                  </div>

                  {day.isOpen && (
                    <div className="flex items-center gap-2">
                      <Select
                        value={day.openTime}
                        onValueChange={(value) =>
                          updateDayHours(day.dayOfWeek, "openTime", value)
                        }
                      >
                        <SelectTrigger className="w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TIME_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <span className="text-muted-foreground">to</span>
                      <Select
                        value={day.closeTime}
                        onValueChange={(value) =>
                          updateDayHours(day.dayOfWeek, "closeTime", value)
                        }
                      >
                        <SelectTrigger className="w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TIME_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              ))}

              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveHours} disabled={isSavingHours}>
                  {isSavingHours && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Hours
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>
                Configure how you receive payments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-[#635BFF]">
                    <span className="text-lg font-bold text-white">S</span>
                  </div>
                  <div>
                    <p className="font-medium">Stripe Connect</p>
                    <p className="text-sm text-muted-foreground">
                      Accept payments and manage payouts
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    className={
                      business.stripe_onboarding_complete
                        ? "bg-green-500"
                        : undefined
                    }
                    variant={
                      business.stripe_onboarding_complete ? "default" : "secondary"
                    }
                  >
                    {business.stripe_onboarding_complete
                      ? "Connected"
                      : "Not Connected"}
                  </Badge>
                  <Button
                    size="sm"
                    variant={business.stripe_onboarding_complete ? "outline" : "default"}
                    onClick={handleStripeConnect}
                    disabled={isConnecting}
                  >
                    {isConnecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {business.stripe_onboarding_complete ? "Manage" : "Connect"}
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-semibold">Payment Options</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Require payment at booking</p>
                    <p className="text-sm text-muted-foreground">
                      Customers must pay when booking
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Accept tips</p>
                    <p className="text-sm text-muted-foreground">
                      Allow customers to add tips to payments
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how you and your customers receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Customer Notifications</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email reminders</p>
                    <p className="text-sm text-muted-foreground">
                      Send reminder emails 24 hours before appointments
                    </p>
                  </div>
                  <Switch
                    checked={emailReminders}
                    onCheckedChange={setEmailReminders}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SMS reminders</p>
                    <p className="text-sm text-muted-foreground">
                      Send text reminders 2 hours before appointments
                    </p>
                  </div>
                  <Switch
                    checked={smsReminders}
                    onCheckedChange={setSmsReminders}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-semibold">Your Notifications</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">New booking alerts</p>
                    <p className="text-sm text-muted-foreground">
                      Get notified when customers book appointments
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Cancellation alerts</p>
                    <p className="text-sm text-muted-foreground">
                      Get notified when appointments are cancelled
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="booking">
          <Card>
            <CardHeader>
              <CardTitle>Booking Settings</CardTitle>
              <CardDescription>
                Configure your booking preferences and availability
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto-confirm bookings</p>
                    <p className="text-sm text-muted-foreground">
                      Automatically confirm new bookings
                    </p>
                  </div>
                  <Switch
                    checked={autoConfirm}
                    onCheckedChange={setAutoConfirm}
                  />
                </div>

                <Separator />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="minNotice">Minimum notice (hours)</Label>
                    <Input id="minNotice" type="number" defaultValue="2" />
                    <p className="text-xs text-muted-foreground">
                      Minimum time before an appointment can be booked
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxAdvance">Max advance booking (days)</Label>
                    <Input id="maxAdvance" type="number" defaultValue="30" />
                    <p className="text-xs text-muted-foreground">
                      How far in advance customers can book
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cancellation">Cancellation policy (hours)</Label>
                  <Input id="cancellation" type="number" defaultValue="24" />
                  <p className="text-xs text-muted-foreground">
                    Customers must cancel this many hours before their appointment
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
