import { Hero } from "@/components/marketing/hero";
import { CategoryGrid } from "@/components/marketing/category-grid";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { Testimonials } from "@/components/marketing/testimonials";
import { CTA } from "@/components/marketing/cta";

export default function Home() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <HowItWorks />
      <Testimonials />
      <CTA />
    </>
  );
}
