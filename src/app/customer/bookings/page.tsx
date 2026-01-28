import { redirect } from "next/navigation";

export default function BookingsPage() {
  // Redirect to customer dashboard which shows bookings
  redirect("/customer");
}
