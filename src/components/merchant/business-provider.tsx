"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getMyBusiness, type Business, type Location } from "@/actions/business";

interface BusinessContextValue {
  business: (Business & { location?: Location }) | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

const BusinessContext = React.createContext<BusinessContextValue | undefined>(undefined);

export function useBusiness() {
  const context = React.useContext(BusinessContext);
  if (!context) {
    throw new Error("useBusiness must be used within a BusinessProvider");
  }
  return context;
}

export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [business, setBusiness] = React.useState<(Business & { location?: Location }) | null>(null);
  const [loading, setLoading] = React.useState(true);

  const loadBusiness = React.useCallback(async () => {
    setLoading(true);
    const result = await getMyBusiness();

    if (result.success && result.business) {
      setBusiness(result.business);
    } else {
      setBusiness(null);
    }

    setLoading(false);
    return result;
  }, []);

  React.useEffect(() => {
    const checkBusiness = async () => {
      const result = await loadBusiness();

      // If no business and not on onboarding page, redirect to onboarding
      if (!result.success || !result.business) {
        if (!pathname.includes("/merchant/onboarding")) {
          router.push("/merchant/onboarding");
        }
      }
    };

    checkBusiness();
  }, [loadBusiness, pathname, router]);

  const refresh = React.useCallback(async () => {
    await loadBusiness();
  }, [loadBusiness]);

  // Show loading only briefly while checking, allow onboarding page through
  if (loading && !pathname.includes("/merchant/onboarding")) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <BusinessContext.Provider value={{ business, loading, refresh }}>
      {children}
    </BusinessContext.Provider>
  );
}
