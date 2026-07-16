import Navbar from "@/components/layout/Navbar/Navbar";
import Footer from "@/components/layout/Footer/Footer";
import LuxeHero from "@/components/ui/luxe-hero";
import ServiceSection from "@/services/service-section";
import AboutSection from "@/components/about/about-section";
import GallerySection from "@/components/gallery/gallery-section";
import BookingSection from "@/components/booking/booking-section";
import TestimonialSection from "@/components/testimonials/testimonial-section";
import { Suspense } from "react";

// A skeleton loader that perfectly matches the space of your ServiceSection
function ServiceSkeleton() {
  return (
    <section className="bg-[#FAF8F5] py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-[150px]">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[450px] w-full animate-pulse rounded-3xl bg-gray-200/60" />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Navbar />
      <LuxeHero />
      
      {/* Suspense handles the asynchronous data fetching smoothly */}
      <Suspense fallback={<ServiceSkeleton />}>
        <ServiceSection />
      </Suspense>
      
      <AboutSection />
      <GallerySection />
      <BookingSection />
      <TestimonialSection />
      <Footer />
    </>
  );
}