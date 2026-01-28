"use client";

import { motion } from "framer-motion";
import { Search, Calendar, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Find a Service",
    description:
      "Search for services near you or browse by category. Read reviews and compare providers.",
  },
  {
    icon: Calendar,
    title: "Book Online",
    description:
      "Choose your preferred date, time, and service provider. Book instantly without phone calls.",
  },
  {
    icon: CheckCircle,
    title: "Enjoy Your Service",
    description:
      "Show up at your appointment time and enjoy. Pay securely through our platform.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-muted/50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Booking your next appointment has never been easier
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.1 }}
              className="relative text-center"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-10 hidden h-0.5 w-full bg-border md:block" />
              )}

              <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <step.icon className="h-10 w-10" />
                <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-background text-sm font-bold text-primary shadow-md">
                  {index + 1}
                </span>
              </div>

              <h3 className="mt-6 text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
