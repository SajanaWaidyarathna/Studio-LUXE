"use client";

import Image from "next/image";
import { Award, Sparkles, HeartHandshake, Scissors } from "lucide-react";
import { motion, Variants } from "framer-motion"; // <-- Import Variants here
import FeatureCard from "./feature-card";

// Explicitly type as Variants so TypeScript knows "easeOut" is an Easing type, not a standard string
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: "easeOut" } 
  },
};

export default function AboutSection() {
  return (
    <section className="overflow-hidden bg-white py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6">
        {/* Asymmetric Grid: 5 columns left, 6 columns right, 1 column gap */}
        <div className="grid gap-16 lg:grid-cols-12 lg:items-center lg:gap-8">
          
          {/* LEFT CONTENT */}
          <motion.div 
            className="lg:col-span-5"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.p 
              variants={itemVariants}
              className="flex items-center gap-4 text-sm uppercase tracking-[0.4em] text-[#C9A227]"
            >
              <span className="h-px w-8 bg-[#C9A227]"></span>
              The Luxe Ethos
            </motion.p>

            <motion.h2 
              variants={itemVariants}
              className="mt-6 text-4xl font-light leading-tight text-[#1C1C1C] md:text-5xl lg:text-6xl"
            >
              Beauty begins <br />
              <span className="font-semibold italic text-[#C9A227]">with confidence.</span>
            </motion.h2>

            <motion.p 
              variants={itemVariants}
              className="mt-8 text-lg leading-relaxed text-gray-500"
            >
              At Luxe Studio, we combine creativity, premium products,
              and personalized care to create hairstyles and beauty
              experiences tailored uniquely for every client.
            </motion.p>

            <motion.div 
              variants={containerVariants}
              className="mt-14 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2"
            >
              <FeatureCard
                icon={<Award strokeWidth={1.5} size={24} />}
                title="Certified Stylists"
                description="Experienced professionals committed to exceptional results."
                variants={itemVariants}
              />
              <FeatureCard
                icon={<Sparkles strokeWidth={1.5} size={24} />}
                title="Premium Products"
                description="Only trusted professional brands for healthier hair."
                variants={itemVariants}
              />
              <FeatureCard
                icon={<HeartHandshake strokeWidth={1.5} size={24} />}
                title="Personalized Care"
                description="Every consultation is tailored to your style and needs."
                variants={itemVariants}
              />
              <FeatureCard
                icon={<Scissors strokeWidth={1.5} size={24} />}
                title="Modern Techniques"
                description="Latest styling trends combined with timeless elegance."
                variants={itemVariants}
              />
            </motion.div>
          </motion.div>

          {/* RIGHT IMAGE - Offset by 1 column for editorial spacing */}
          <motion.div 
            className="relative lg:col-span-6 lg:col-start-7"
            initial={{ opacity: 0, scale: 0.95, x: 20 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Decorative background block to make the image feel anchored */}
            <div className="absolute -inset-4 -z-10 hidden rounded-[40px] bg-[#FAF8F5] lg:block"></div>
            
            <Image
              src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f"
              alt="Luxury salon interior"
              width={800}
              height={1000}
              className="rounded-[32px] object-cover shadow-2xl transition-transform duration-700 hover:scale-[1.02]"
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}