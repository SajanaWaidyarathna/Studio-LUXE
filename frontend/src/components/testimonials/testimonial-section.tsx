"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sophia Williams",
    role: "Regular Client",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    review: "Absolutely the best salon experience I've had. The attention to detail and luxurious atmosphere keep me coming back.",
  },
  {
    name: "Emma Brown",
    role: "Bride",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    review: "My bridal hairstyle was perfect. The team listened to exactly what I wanted and exceeded every expectation.",
  },
  {
    name: "Olivia Smith",
    role: "Hair Color Client",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
    review: "Professional, welcoming, and incredibly talented. My hair has never looked healthier.",
  },
];

// Staggered animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: "easeOut" } 
  },
};

export default function TestimonialSection() {
  return (
    <section className="overflow-hidden bg-[#FAF8F5] py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Animated Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          <p className="flex items-center justify-center gap-4 text-sm font-medium uppercase tracking-[0.4em] text-[#C9A227]">
            <span className="h-px w-8 bg-[#C9A227]"></span>
            Testimonials
            <span className="h-px w-8 bg-[#C9A227]"></span>
          </p>

          <h2 className="mt-6 text-4xl font-light tracking-tight text-[#1C1C1C] md:text-5xl lg:text-6xl">
            Loved by Our <br className="md:hidden" />
            <span className="font-semibold italic text-[#C9A227]">Clients</span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500">
            Every visit is crafted to leave you looking and feeling your absolute best. 
            Here is what our guests have to say.
          </p>
        </motion.div>

        {/* Staggered Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="mt-20 grid gap-8 md:grid-cols-3"
        >
          {testimonials.map((item, index) => (
            <motion.div
              key={item.name}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              // Push the middle card down on desktop for an asymmetric editorial layout
              className={`
                group relative overflow-hidden rounded-[32px] bg-white p-10 
                shadow-xl shadow-[#C9A227]/5 transition-all duration-500 
                hover:shadow-2xl hover:shadow-[#C9A227]/10 
                ${index === 1 ? "md:mt-12 md:-mb-12" : ""}
              `}
            >
              {/* Decorative Background Quote */}
              <Quote 
                size={120} 
                className="absolute -right-6 -top-6 -z-10 rotate-12 text-[#FAF8F5] transition-transform duration-500 group-hover:rotate-0 group-hover:scale-110" 
              />

              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="fill-[#C9A227] text-[#C9A227]"
                  />
                ))}
              </div>

              <p className="mt-8 text-lg leading-relaxed text-gray-600">
                "{item.review}"
              </p>

              <div className="mt-10 flex items-center gap-4 border-t border-[#FAF8F5] pt-6">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-[#FAF8F5] transition-all group-hover:ring-[#C9A227]/30">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>

                <div>
                  <h4 className="font-semibold tracking-tight text-[#1C1C1C]">
                    {item.name}
                  </h4>
                  <p className="mt-0.5 text-sm text-[#C9A227]">
                    {item.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}