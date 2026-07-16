"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/services/api"; // Make sure this path is correct

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // NOTE: Ensure this matches your NestJS registration endpoint!
      // Often it is '/auth/register' or '/users'
      await api.post("/auth/register", formData);
      
      toast.success("Account created successfully!");
      router.push("/login"); // Send them to login so they can use their new account
    } catch (error: any) {
      console.error(error);
      const message = error.response?.data?.message || "Registration failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF8F5] px-4 py-12">
      <div className="w-full max-w-md rounded-[32px] bg-white p-8 shadow-sm border border-[#E8E0D5] sm:p-10">
        
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-semibold text-[#1C1C1C]">Create Account</h1>
          <p className="mt-2 text-sm text-gray-500">
            Join LUXESTUDIO to manage your luxury appointments.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Name Input */}
          <div className="relative flex items-center">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Full Name"
              className="peer w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 pl-12 text-sm text-[#1C1C1C] outline-none transition-all focus:border-[#C9A227] focus:bg-white focus:ring-4 focus:ring-[#C9A227]/10"
            />
            <User size={18} className="absolute left-4 text-gray-400 transition-colors peer-focus:text-[#C9A227]" />
          </div>

          {/* Email Input */}
          <div className="relative flex items-center">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Email Address"
              className="peer w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 pl-12 text-sm text-[#1C1C1C] outline-none transition-all focus:border-[#C9A227] focus:bg-white focus:ring-4 focus:ring-[#C9A227]/10"
            />
            <Mail size={18} className="absolute left-4 text-gray-400 transition-colors peer-focus:text-[#C9A227]" />
          </div>

          {/* Password Input */}
          <div className="relative flex items-center">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="Password"
              className="peer w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 pl-12 text-sm text-[#1C1C1C] outline-none transition-all focus:border-[#C9A227] focus:bg-white focus:ring-4 focus:ring-[#C9A227]/10"
            />
            <Lock size={18} className="absolute left-4 text-gray-400 transition-colors peer-focus:text-[#C9A227]" />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="
              group
              mt-2
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-2xl
              bg-[#1C1C1C]
              py-4
              text-sm
              font-medium
              text-white
              transition
              hover:bg-[#C9A227]
              disabled:opacity-70
              disabled:cursor-not-allowed
            "
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                Sign Up
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#1C1C1C] hover:text-[#C9A227] transition"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}