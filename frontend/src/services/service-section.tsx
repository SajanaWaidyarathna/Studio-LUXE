import { getServices } from "@/services/service-api";
import ServiceCard from "./service-card";
import Link from "next/link";
import ScrollReveal from "@/components/ui/scroll-reveal"; // <-- Import the new wrapper



export default async function ServiceSection() {
  const services = await getServices();

  return (
    <section className="bg-[#FAF8F5] py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Animated Header */}
        <ScrollReveal>
          <div className="text-center mb-20">
            <p className="uppercase tracking-[0.4em] text-sm font-medium text-[#C9A227]">
              LUXE EXPERIENCES
            </p>

            <h2 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-[#1C1C1C]">
              Signature treatments
              <br />
              <span className="font-semibold italic text-[#C9A227]">crafted for your beauty</span>
            </h2>
          </div>
        </ScrollReveal>

        {/* Dynamic Grid (Cards already have their own staggered scroll animation inside them) */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service: any, index: number) => (
            <ServiceCard 
              key={service.id} 
              service={service} 
              index={index} 
            />
          ))}
        </div>

        {/* Animated Button with a slight delay */}
        <ScrollReveal delay={0.4}>
          <div className="mt-20 text-center">
            <Link
              href="/services"
              className="
                inline-flex
                rounded-full
                border
                border-[#1C1C1C]
                px-10
                py-4
                text-sm
                font-medium
                tracking-wide
                text-[#1C1C1C]
                transition-all
                duration-300
                hover:scale-105
                hover:bg-[#1C1C1C]
                hover:text-white
                active:scale-95
              "
            >
              View All Services
            </Link>
          </div>
        </ScrollReveal>
        
      </div>
    </section>
  );
}