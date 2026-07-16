"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, Loader2, LogOut, Plus } from "lucide-react";
import api from "@/services/api";

interface Booking {
  id: number;
  bookingDate: string;
  bookingTime: string;
  status: string;
  service?: {
    title: string;
  };
}

export default function AccountPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMyBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await api.get("/bookings/my-bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBookings(response.data);
    } catch (error) {
      console.error("Failed to load bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyBookings();
  }, []);

 const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/"); // 👈 Changed from "/login"
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FAF8F5]">
        <Loader2 className="animate-spin text-[#C9A227]" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-20">
      {/* --- UPDATED: Top Header with Book Button --- */}
      <div className="bg-white px-8 py-6 shadow-sm mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-[#1C1C1C]">My Appointments</h1>
          <p className="mt-2 text-gray-500">Manage your upcoming luxury services.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* 👇 New Persistent Booking Button */}
          <button
            onClick={() => router.push("/#booking")}
            className="flex items-center gap-2 rounded-xl bg-[#1C1C1C] px-6 py-3 font-medium text-white transition hover:bg-[#C9A227]"
          >
            <Plus size={18} />
            Book Service
          </button>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl border border-[#E8E0D5] px-6 py-3 font-medium text-[#1C1C1C] transition hover:bg-gray-50"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
      {/* --------------------------------------------- */}

      <div className="mx-auto max-w-5xl px-6">
        {bookings.length === 0 ? (
          <div className="rounded-3xl border border-[#E8E0D5] bg-white p-12 text-center shadow-sm">
            <h3 className="text-xl font-medium text-[#1C1C1C] mb-2">No Appointments Yet</h3>
            <p className="text-gray-500 mb-6">You don't have any upcoming bookings with us.</p>
            {/* Kept this one here too just in case it's empty! */}
            <button
              onClick={() => router.push("/#booking")}
              className="rounded-xl bg-[#1C1C1C] px-8 py-4 text-white transition hover:bg-[#C9A227]"
            >
              Book a Service Now
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-3xl border border-[#E8E0D5] bg-white p-6 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold text-[#1C1C1C]">
                      {booking.service?.title || "Luxury Service"}
                    </h2>
                    <span
                      className={`rounded-full px-4 py-1.5 text-xs font-semibold tracking-wider uppercase ${
                        booking.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : booking.status === "CONFIRMED"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="space-y-3 text-[#4A4A4A]">
                    <div className="flex items-center gap-3">
                      <Calendar size={18} className="text-[#C9A227]" />
                      <span>
                        {booking.bookingDate.includes("T") 
                          ? booking.bookingDate.split("T")[0] 
                          : booking.bookingDate}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock size={18} className="text-[#C9A227]" />
                      <span>{booking.bookingTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}