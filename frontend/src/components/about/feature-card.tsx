// src/components/about/feature-card.tsx
import { ReactNode } from "react";
import { motion, Variants } from "framer-motion";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  variants?: Variants; // Accept animation variants from the parent
}

export default function FeatureCard({
  icon,
  title,
  description,
  variants
}: FeatureCardProps) {
  return (
    <motion.div 
      variants={variants}
      className="group flex flex-col items-start gap-4"
    >
      {/* Delicate, borderless icon treatment */}
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FAF8F5] text-[#C9A227] transition-all duration-500 group-hover:-translate-y-1 group-hover:bg-[#C9A227] group-hover:text-white">
        {icon}
      </div>

      <div>
        <h3 className="font-medium text-[#1C1C1C] transition-colors duration-300 group-hover:text-[#C9A227]">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-gray-500">
          {description}
        </p>
      </div>
    </motion.div>
  );
}