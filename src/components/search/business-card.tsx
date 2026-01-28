import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BusinessCardProps {
  business: {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    category: string;
    cover_image_url: string | null;
    rating?: number;
    review_count?: number;
    location?: {
      city: string;
      state: string;
    };
    distance?: number;
    price_range?: string;
    is_open?: boolean;
  };
  className?: string;
}

export function BusinessCard({ business, className }: BusinessCardProps) {
  return (
    <Link href={`/business/${business.slug}`}>
      <Card
        className={cn(
          "overflow-hidden transition-all hover:shadow-lg",
          className
        )}
      >
        <div className="relative aspect-[16/9] overflow-hidden">
          {business.cover_image_url ? (
            <Image
              src={business.cover_image_url}
              alt={business.name}
              fill
              className="object-cover transition-transform hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <span className="text-4xl font-bold text-muted-foreground/30">
                {business.name[0]}
              </span>
            </div>
          )}
          {business.is_open !== undefined && (
            <Badge
              variant={business.is_open ? "default" : "secondary"}
              className="absolute right-2 top-2"
            >
              {business.is_open ? "Open" : "Closed"}
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className="line-clamp-1 font-semibold">{business.name}</h3>
              <p className="text-sm text-muted-foreground">{business.category}</p>
            </div>
            {business.rating !== undefined && (
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{business.rating.toFixed(1)}</span>
                {business.review_count !== undefined && (
                  <span className="text-muted-foreground">
                    ({business.review_count})
                  </span>
                )}
              </div>
            )}
          </div>

          {business.description && (
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
              {business.description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {business.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                <span>
                  {business.location.city}, {business.location.state}
                </span>
              </div>
            )}
            {business.distance !== undefined && (
              <span>{business.distance.toFixed(1)} km away</span>
            )}
            {business.price_range && <span>{business.price_range}</span>}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
