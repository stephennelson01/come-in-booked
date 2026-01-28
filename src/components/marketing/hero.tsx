"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Hero collage images — swap any src with your own photos for a more authentic Nigerian feel.
// Tip: upload your own to /public/hero/ and use "/hero/filename.jpg" as the src.
const COLLAGE_IMAGES = [
  { src: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=75", alt: "Hair & beauty" },
  { src: "https://images.unsplash.com/photo-1622288432450-277d0fef5ed6?auto=format&fit=crop&w=800&q=75", alt: "Braiding" },
  { src: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=75", alt: "Nails" },
  { src: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=800&q=75", alt: "Style & fashion" },
  { src: "https://images.unsplash.com/photo-1457972729786-0411a3b2b626?auto=format&fit=crop&w=800&q=75", alt: "Nail tech" },
  { src: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=75", alt: "Massage" },
  { src: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=800&q=75", alt: "Makeup" },
  { src: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=75", alt: "Barber" },
];

export function Hero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [location, setLocation] = React.useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (location) params.set("location", location);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[600px] overflow-hidden md:min-h-[700px]">
      {/* Collage grid background */}
      <div className="absolute inset-0 animate-hero-zoom">
        <div className="grid h-full w-full grid-cols-4 grid-rows-2">
          {COLLAGE_IMAGES.map((img) => (
            <div key={img.alt} className="relative overflow-hidden">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                priority
                className="object-cover"
                sizes="25vw"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dark overlay + gradient for text readability */}
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/50" />

      {/* Content */}
      <div className="relative z-10 flex min-h-[600px] items-center md:min-h-[700px]">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl"
            >
              Book Local Services{" "}
              <span className="text-primary">Instantly</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-6 text-lg text-white/80 md:text-xl"
            >
              Discover and book beauty, wellness, and creative services from the
              best local providers. No phone calls, no waiting.
            </motion.p>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onSubmit={handleSearch}
              className="mt-10"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search services (e.g., haircut, massage)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-12 border-white/20 bg-white/95 pl-10 text-base shadow-lg backdrop-blur-sm placeholder:text-muted-foreground"
                  />
                </div>
                <div className="relative flex-1 sm:max-w-[200px]">
                  <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="h-12 border-white/20 bg-white/95 pl-10 text-base shadow-lg backdrop-blur-sm placeholder:text-muted-foreground"
                  />
                </div>
                <Button type="submit" size="lg" className="h-12 px-8 shadow-lg">
                  Search
                </Button>
              </div>
            </motion.form>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm text-white/70"
            >
              <span>Popular:</span>
              {["Hair Braiding", "Makeup Artist", "Barber", "Gele", "Nails"].map(
                (item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setSearchQuery(item);
                      router.push(`/search?q=${encodeURIComponent(item)}`);
                    }}
                    className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-white/90 backdrop-blur-sm transition-colors hover:border-primary hover:bg-white/20 hover:text-white"
                  >
                    {item}
                  </button>
                )
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
