"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Adaeze O.",
    role: "Regular Customer",
    content:
      "ComeInBooked has completely changed how I book my salon appointments. No more playing phone tag - I can see availability and book in seconds!",
    rating: 5,
  },
  {
    name: "Hauwa M.",
    role: "Salon Owner",
    content:
      "Since joining ComeInBooked, my no-show rate has dropped significantly. The automated reminders and easy rescheduling make a huge difference.",
    rating: 5,
  },
  {
    name: "Funke A.",
    role: "Regular Customer",
    content:
      "I love being able to browse different providers and read real reviews before booking. Found my new favourite stylist through this app!",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            What People Are Saying
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join thousands of happy customers and businesses
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="flex h-full flex-col p-6">
                  <Quote className="h-8 w-8 text-primary/20" />

                  <div className="mt-4 flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>

                  <p className="mt-4 flex-1 text-muted-foreground">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>

                  <div className="mt-6 flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
