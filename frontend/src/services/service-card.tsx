"use client";

import { Service } from "@/types/service";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

interface Props {
  service: Service;
  index: number;
}

export default function ServiceCard({ service, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.15, ease: "easeOut" }}
      whileHover={{ y: -8 }}
      className="
        group 
        flex 
        flex-col 
        overflow-hidden 
        rounded-3xl 
        bg-white 
        border 
        border-[#E8E0D5]
        shadow-sm 
        transition-all 
        duration-500 
        hover:border-transparent 
        hover:shadow-2xl 
        hover:shadow-[#C9A227]/10
      "
    >
      {/* Premium Image Layout with Overlay */}
      <div className="relative h-64 w-full overflow-hidden bg-gray-100">
        <div className="absolute inset-0 z-10 bg-[#1C1C1C]/0 transition-colors duration-500 group-hover:bg-[#1C1C1C]/10" />
        
        <Image
          src={service.image || "https://images.unsplash.com/photo-1562322140-8baeececf3df"}
          alt={service.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-8">
        <h3 className="text-2xl font-semibold tracking-tight text-[#1C1C1C] transition-colors duration-300 group-hover:text-[#C9A227]">
          {service.title}
        </h3>

        <p className="mt-3 flex-1 text-sm leading-relaxed text-[#4A4A4A]">
          {service.description}
        </p>

        <div className="mt-6 mb-8 flex items-center justify-between text-sm">
          <span className="font-medium text-gray-500">{service.duration} mins</span>
          <span className="text-lg font-semibold text-[#C9A227]">
            Rs. {service.price}
          </span>
        </div>

        <Link
          href="/booking"
          className="
            mt-auto
            block
            w-full
            rounded-full
            bg-[#1C1C1C]
            py-3.5
            text-center
            text-sm
            font-medium
            text-white
            transition-all
            duration-300
            hover:scale-[1.02]
            hover:bg-[#C9A227]
            hover:shadow-lg
            hover:shadow-[#C9A227]/20
            active:scale-[0.98]
          "
        >
          Book Now
        </Link>
      </div>
    </motion.div>
  );
}