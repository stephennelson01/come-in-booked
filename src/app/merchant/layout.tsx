import { Metadata } from "next";
import { MerchantSidebar } from "@/components/merchant/sidebar";
import { BusinessProvider } from "@/components/merchant/business-provider";

export const metadata: Metadata = {
  title: {
    default: "Merchant Dashboard",
    template: "%s | Merchant Dashboard",
  },
  description: "Manage your business, bookings, and staff",
};

export default function MerchantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/30">
      <MerchantSidebar />
      <main className="pt-14 md:ml-64 md:pt-0">
        <div className="p-4 md:p-8">
          <BusinessProvider>{children}</BusinessProvider>
        </div>
      </main>
    </div>
  );
}
