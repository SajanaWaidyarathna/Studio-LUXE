"use client";

import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

// Explicitly typing the variants fixes the type inference issue
const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: "easeOut" } 
  },
};

// Explicitly typing the container variants as well
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

export default function LuxeHero() {
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0px", "150px"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0px", "80px"]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen overflow-hidden bg-[#FAF8F5]"
    >
      {/* Background ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            top-20
            left-20
            h-96
            w-96
            rounded-full
            bg-[#C9A227]/20
            blur-3xl
          "
        />

        <motion.div
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="
            absolute
            bottom-20
            right-20
            h-80
            w-80
            rounded-full
            bg-[#D8B4A0]/20
            blur-3xl
          "
        />
      </div>

      <div
        className="
          relative
          z-10
          mx-auto
          flex
          min-h-screen
          max-w-7xl
          items-center
          px-6
        "
      >
        <div
          className="
            grid
            w-full
            grid-cols-1
            gap-12
            lg:grid-cols-2
          "
        >
          {/* Left Content */}
          <motion.div
            style={{ y: textY }}
            initial="hidden"
            animate="show"
            variants={containerVariants}
            className="
              flex
              flex-col
              justify-center
            "
          >
            <motion.div
              variants={fadeUpVariants}
              className="
                mb-6
                flex
                items-center
                gap-2
                text-sm
                uppercase
                tracking-[0.3em]
                text-[#C9A227]
              "
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles size={18} />
              </motion.div>
              Premium Salon Experience
            </motion.div>

            <motion.h1
              variants={fadeUpVariants}
              className="
                text-5xl
                font-semibold
                leading-tight
                text-[#1C1C1C]
                md:text-7xl
              "
            >
              Discover Your
              <span
                className="
                  block
                  italic
                  text-[#C9A227]
                "
              >
                Signature Style
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUpVariants}
              className="
                mt-6
                max-w-xl
                text-lg
                leading-relaxed
                text-gray-600
              "
            >
              Experience luxury hair styling, beauty treatments, and professional
              grooming services crafted by expert stylists.
            </motion.p>

            <motion.div
              variants={fadeUpVariants}
              className="
                mt-10
                flex
                flex-wrap
                gap-4
              "
            >
              <Link
                href="/booking"
                className="
                  group
                  flex
                  items-center
                  gap-2
                  rounded-full
                  bg-[#1C1C1C]
                  px-8
                  py-4
                  text-white
                  transition-all
                  duration-300
                  hover:scale-105
                  hover:bg-[#C9A227]
                  hover:shadow-lg
                  hover:shadow-[#C9A227]/20
                  active:scale-95
                "
              >
                Book Appointment
                <ArrowRight 
                  size={18} 
                  className="transition-transform duration-300 group-hover:translate-x-1" 
                />
              </Link>

              <Link
                href="/services"
                className="
                  rounded-full
                  border
                  border-[#1C1C1C]
                  px-8
                  py-4
                  transition-all
                  duration-300
                  hover:scale-105
                  hover:bg-black
                  hover:text-white
                  active:scale-95
                "
              >
                Explore Services
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            style={{ y: imageY }}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
            className="
              flex
              items-center
              justify-center
            "
          >
            <div
              className="
                relative
                h-[550px]
                w-full
                overflow-hidden
                rounded-[40px]
                shadow-2xl
              "
            >
              <motion.img
                animate={{ scale: [1, 1.08, 1] }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                src="https://images.unsplash.com/photo-1560066984-138dadb4c035"
                alt="Luxury salon"
                className="
                  h-full
                  w-full
                  object-cover
                "
              />

              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  type: "spring",
                  damping: 15,
                  stiffness: 100,
                  delay: 1,
                }}
                whileHover={{ y: -5 }}
                className="
                  absolute
                  bottom-6
                  left-6
                  cursor-default
                  rounded-2xl
                  bg-white/90
                  px-6
                  py-4
                  backdrop-blur
                  shadow-xl
                "
              >
                <p className="font-semibold text-[#1C1C1C]">500+ Happy Clients</p>
                <p className="text-sm text-gray-500">
                  Trusted beauty specialists
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}