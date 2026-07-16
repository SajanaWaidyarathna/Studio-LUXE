"use client";

import { motion, Variants } from "framer-motion";
import { User, Mail, Phone, Calendar, Clock, Sparkles, ArrowRight } from "lucide-react";
import { createBooking } from "@/services/booking-api";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation"; // 👈 1. Import useRouter

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const inputVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  },
};

interface BookingFormProps {
  services: any[];
}

export default function BookingForm({ services }: BookingFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // 👈 2. Initialize router

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    serviceId: "",
    bookingDate: "",
    bookingTime: "",
    notes: ""
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await createBooking({
        ...formData,
        serviceId: Number(formData.serviceId)
      });
      
      toast.success("Appointment booked successfully!");
      
      // 3. Smart Redirect Logic 👇
      const token = localStorage.getItem("token");
      
      if (token) {
        // Logged-in user: Send them straight to their dashboard!
        router.push("/account");
      } else {
        // Guest user: Just clear the form and let them stay on the page
        setFormData({
          customerName: "",
          customerEmail: "",
          customerPhone: "",
          serviceId: "",
          bookingDate: "",
          bookingTime: "",
          notes: ""
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="mx-auto max-w-4xl rounded-[40px] border border-[#C9A227]/50 bg-[#C9A227] p-8 shadow-2xl shadow-[#C9A227]/30 md:p-12"
    >
      <motion.form 
        onSubmit={handleSubmit}
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid gap-6 md:grid-cols-2"
      >
        {/* Full Name */}
        <motion.div variants={inputVariants} className="relative flex items-center">
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            required
            placeholder="Full Name"
            className="peer w-full rounded-2xl border border-transparent bg-white p-5 pl-14 text-sm text-[#1C1C1C] outline-none transition-all focus:border-[#1C1C1C] focus:ring-4 focus:ring-[#1C1C1C]/10"
          />
          <User size={20} className="absolute left-5 text-gray-400 transition-colors peer-focus:text-[#1C1C1C]" />
        </motion.div>

        {/* Email */}
        <motion.div variants={inputVariants} className="relative flex items-center">
          <input
            type="email"
            name="customerEmail"
            value={formData.customerEmail}
            onChange={handleChange}
            required
            placeholder="Email Address"
            className="peer w-full rounded-2xl border border-transparent bg-white p-5 pl-14 text-sm text-[#1C1C1C] outline-none transition-all focus:border-[#1C1C1C] focus:ring-4 focus:ring-[#1C1C1C]/10"
          />
          <Mail size={20} className="absolute left-5 text-gray-400 transition-colors peer-focus:text-[#1C1C1C]" />
        </motion.div>

        {/* Phone */}
        <motion.div variants={inputVariants} className="relative flex items-center">
          <input
            type="tel"
            name="customerPhone"
            value={formData.customerPhone}
            onChange={handleChange}
            required
            placeholder="Phone Number"
            className="peer w-full rounded-2xl border border-transparent bg-white p-5 pl-14 text-sm text-[#1C1C1C] outline-none transition-all focus:border-[#1C1C1C] focus:ring-4 focus:ring-[#1C1C1C]/10"
          />
          <Phone size={20} className="absolute left-5 text-gray-400 transition-colors peer-focus:text-[#1C1C1C]" />
        </motion.div>

        {/* Service Select - Uses the passed-in services array */}
        <motion.div variants={inputVariants} className="relative flex items-center">
          <select
            name="serviceId"
            value={formData.serviceId}
            onChange={handleChange}
            required
            className="peer w-full appearance-none rounded-2xl border border-transparent bg-white p-5 pl-14 text-sm text-[#1C1C1C] outline-none transition-all focus:border-[#1C1C1C] focus:ring-4 focus:ring-[#1C1C1C]/10"
          >
            <option value="" disabled>Select a Service</option>
            {services.map((service: any) => (
              <option key={service.id} value={service.id}>
                {service.title}
              </option>
            ))}
          </select>
          <Sparkles size={20} className="absolute left-5 text-gray-400 transition-colors peer-focus:text-[#1C1C1C]" />
        </motion.div>

        {/* Date */}
        <motion.div variants={inputVariants} className="relative flex items-center">
          <input
            type="date"
            name="bookingDate"
            value={formData.bookingDate}
            onChange={handleChange}
            required
            className="peer w-full rounded-2xl border border-transparent bg-white p-5 pl-14 text-sm text-[#1C1C1C] outline-none transition-all focus:border-[#1C1C1C] focus:ring-4 focus:ring-[#1C1C1C]/10"
          />
          <Calendar size={20} className="absolute left-5 text-gray-400 transition-colors peer-focus:text-[#1C1C1C]" />
        </motion.div>

        {/* Time */}
        <motion.div variants={inputVariants} className="relative flex items-center">
          <input
            type="time"
            name="bookingTime"
            value={formData.bookingTime}
            onChange={handleChange}
            required
            className="peer w-full rounded-2xl border border-transparent bg-white p-5 pl-14 text-sm text-[#1C1C1C] outline-none transition-all focus:border-[#1C1C1C] focus:ring-4 focus:ring-[#1C1C1C]/10"
          />
          <Clock size={20} className="absolute left-5 text-gray-400 transition-colors peer-focus:text-[#1C1C1C]" />
        </motion.div>

        {/* Notes */}
        <motion.div variants={inputVariants} className="md:col-span-2">
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Any special requests or details we should know?"
            rows={4}
            className="w-full rounded-2xl border border-transparent bg-white p-5 text-sm text-[#1C1C1C] outline-none transition-all focus:border-[#1C1C1C] focus:ring-4 focus:ring-[#1C1C1C]/10"
          />
        </motion.div>

        {/* Submit Button */}
        <motion.div variants={inputVariants} className="md:col-span-2 mt-2">
          <button
            type="submit"
            disabled={loading}
            className="
              group
              flex
              w-full
              items-center
              justify-center
              gap-3
              rounded-2xl
              bg-[#1C1C1C]
              py-5
              text-sm
              font-medium
              tracking-wide
              text-white
              transition-all
              duration-300
              hover:bg-white
              hover:text-[#1C1C1C]
              hover:shadow-xl
              active:scale-[0.98]
              disabled:opacity-70
              disabled:cursor-not-allowed
            "
          >
            {loading ? "Confirming Booking..." : "Confirm Reservation"}
            {!loading && (
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            )}
          </button>
        </motion.div>

      </motion.form>
    </motion.div>
  );
}