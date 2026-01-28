"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Map, List, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/search/search-bar";
import { SearchFilters } from "@/components/search/search-filters";
import { BusinessCard } from "@/components/search/business-card";
import { MapView } from "@/components/search/map-view";
import { searchBusinesses, type SearchResult } from "@/actions/search";

function SearchContent() {
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = React.useState<"list" | "map">("list");
  const [isLoading, setIsLoading] = React.useState(true);
  const [businesses, setBusinesses] = React.useState<SearchResult[]>([]);

  const query = searchParams.get("q");
  const category = searchParams.get("category");
  const sort = searchParams.get("sort") || "relevance";

  React.useEffect(() => {
    loadBusinesses();
  }, [query, category, sort]);

  const loadBusinesses = async () => {
    setIsLoading(true);

    const result = await searchBusinesses({
      query: query || undefined,
      category: category || undefined,
      sort: sort || undefined,
    });

    if (result.success && result.businesses) {
      setBusinesses(result.businesses);
    } else {
      setBusinesses([]);
    }

    setIsLoading(false);
  };

  const mapMarkers = businesses
    .filter((b) => b.latitude && b.longitude)
    .map((b) => ({
      id: b.id,
      name: b.name,
      latitude: b.latitude!,
      longitude: b.longitude!,
    }));

  // Default center on Lagos
  const defaultCenter: [number, number] = [3.4226, 6.4474];

  return (
    <>
      {/* Search bar */}
      <div className="mb-6">
        <SearchBar />
      </div>

      {/* Filters and view toggle */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <SearchFilters />

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {businesses.length} results
          </span>
          <div className="flex rounded-md border">
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              className="rounded-r-none"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "map" ? "secondary" : "ghost"}
              size="sm"
              className="rounded-l-none"
              onClick={() => setViewMode("map")}
            >
              <Map className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : businesses.length === 0 ? (
        <div className="py-20 text-center">
          <h3 className="text-lg font-semibold">No results found</h3>
          <p className="mt-2 text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      ) : viewMode === "list" ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {businesses.map((business) => (
            <BusinessCard
              key={business.id}
              business={{
                ...business,
                rating: business.rating ?? undefined,
                review_count: business.review_count,
                location: business.location ?? undefined,
              }}
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-[500px] overflow-hidden rounded-lg border lg:h-[calc(100vh-300px)]">
            <MapView
              markers={mapMarkers}
              center={defaultCenter}
              zoom={12}
            />
          </div>
          <div className="space-y-4 overflow-auto lg:h-[calc(100vh-300px)]">
            {businesses.map((business) => (
              <BusinessCard
                key={business.id}
                business={{
                  ...business,
                  rating: business.rating ?? undefined,
                  review_count: business.review_count,
                  location: business.location ?? undefined,
                }}
                className="flex-row"
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <React.Suspense
        fallback={
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }
      >
        <SearchContent />
      </React.Suspense>
    </div>
  );
}
