"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Scissors,
  Sparkles,
  Heart,
  Camera,
  Palette,
  Shirt,
  Dumbbell,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  {
    name: "Hair Braiding",
    slug: "hair-braiding",
    icon: Scissors,
    description: "Braids, weaves, locs",
    color: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
  },
  {
    name: "Makeup Artist",
    slug: "makeup-artist",
    icon: Sparkles,
    description: "Bridal, events, glam",
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
  {
    name: "Barber",
    slug: "barber",
    icon: User,
    description: "Cuts, beards, grooming",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    name: "Gele & Aso-Oke",
    slug: "gele-aso-oke",
    icon: Heart,
    description: "Traditional styling",
    color: "bg-red-500/10 text-red-600 dark:text-red-400",
  },
  {
    name: "Nail Technician",
    slug: "nail-technician",
    icon: Palette,
    description: "Acrylics, gel, art",
    color: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  },
  {
    name: "Tailoring",
    slug: "tailoring",
    icon: Shirt,
    description: "Custom outfits, alterations",
    color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  },
  {
    name: "Photography",
    slug: "photography",
    icon: Camera,
    description: "Portraits, events",
    color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  },
  {
    name: "Fitness",
    slug: "fitness",
    icon: Dumbbell,
    description: "Personal training",
    color: "bg-green-500/10 text-green-600 dark:text-green-400",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function CategoryGrid() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Browse by Category
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Find exactly what you need from our curated service categories
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6"
        >
          {categories.map((category) => (
            <motion.div key={category.slug} variants={item}>
              <Link
                href={`/search?category=${category.slug}`}
                className="group flex flex-col items-center rounded-xl border border-border bg-card p-6 text-center transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <div
                  className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-full transition-transform group-hover:scale-110",
                    category.color
                  )}
                >
                  <category.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-4 font-semibold">{category.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {category.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
