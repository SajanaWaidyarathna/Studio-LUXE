"use client";

import { useEffect, useState } from "react";
import { getBookings, updateBookingStatus, cancelBooking } from "@/services/admin-api";
import { toast } from "sonner";
import { Check, CheckCircle, XCircle, Search, Filter, AlertTriangle } from "lucide-react";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // States for Search and Status Filter
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // NEW: States for the Custom Cancellation Modal
  const [cancelModal, setCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<number | null>(null);

  const loadBookings = async () => {
    try {
      const data = await getBookings();
      setBookings(data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const changeStatus = async (id: number, status: string) => {
    try {
      await updateBookingStatus(id, { status });
      toast.success(`Booking status updated to ${status.toLowerCase()}`);
      loadBookings();
    } catch (error) {
      console.error(error);
      toast.error("Update failed");
    }
  };

  // NEW: Handles the final confirmation from the custom modal
  const confirmCancel = async () => {
    if (!bookingToCancel) return;
    
    try {
      await cancelBooking(bookingToCancel);
      toast.success("Booking cancelled successfully");
      loadBookings();
    } catch (error) {
      console.error(error);
      toast.error("Cancellation failed");
    } finally {
      setCancelModal(false);
      setBookingToCancel(null);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const sortedBookings = [...bookings].sort((a, b) => {
    const dateA = new Date(a.createdAt || a.bookingDate).getTime();
    const dateB = new Date(b.createdAt || b.bookingDate).getTime();
    return dateB - dateA;
  });

  const filteredBookings = sortedBookings.filter((booking) => {
    const matchesSearch = 
      booking.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      booking.customerEmail?.toLowerCase().includes(search.toLowerCase()) ||
      booking.customerPhone?.includes(search);
      
    const matchesStatus = statusFilter === "ALL" || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#C9A227]/20 border-t-[#C9A227]"></div>
        <p className="text-sm font-medium text-gray-500">Loading master bookings record...</p>
      </div>
    );
  }

  return (
    <div className="pb-16">
      <h1 className="text-3xl font-semibold text-[#1C1C1C]">Bookings</h1>
      <p className="mt-2 text-gray-500">Manage, confirm, or review your appointment history logs.</p>

      {/* Search and Filter Bar Layout */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex max-w-md flex-1 items-center">
          <Search size={18} className="absolute left-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-11 pr-4 text-sm text-[#1C1C1C] outline-none transition focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]"
          />
        </div>

        <div className="relative flex items-center">
          <Filter size={16} className="absolute left-4 text-gray-400 pointer-events-none" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-10 text-sm font-medium text-[#1C1C1C] outline-none transition focus:border-[#C9A227]"
          >
            <option value="ALL">All Bookings</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <div className="absolute right-3 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-[#1C1C1C] h-0 w-0"></div>
        </div>
      </div>

      {/* Table Data View */}
      <div className="mt-6 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#1C1C1C] text-sm font-medium tracking-wide text-white">
              <tr>
                <th className="p-5 font-semibold">Customer</th>
                <th className="p-5 font-semibold">Service</th>
                <th className="p-5 font-semibold">Date</th>
                <th className="p-5 font-semibold">Time</th>
                <th className="p-5 font-semibold">Status</th>
                <th className="p-5 font-semibold text-right pr-8">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-[#4A4A4A]">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="transition hover:bg-gray-50/50">
                  <td className="p-5">
                    <p className="font-semibold text-[#1C1C1C]">{booking.customerName}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{booking.customerEmail}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{booking.customerPhone}</p>
                  </td>

                  <td className="p-5 font-medium text-[#1C1C1C]">
                    {booking.service?.title || "Service"}
                  </td>

                  <td className="p-5 font-medium">
                    {formatDate(booking.bookingDate)}
                  </td>

                  <td className="p-5 font-medium">{booking.bookingTime}</td>

                  <td className="p-5">
                    <StatusBadge status={booking.status} />
                  </td>

                  <td className="p-5">
                    <div className="flex justify-end gap-2">
                      {booking.status === "PENDING" && (
                        <button
                          onClick={() => changeStatus(booking.id, "CONFIRMED")}
                          title="Confirm Appointment"
                          className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 text-green-700 border border-green-200/40 transition hover:bg-green-600 hover:text-white"
                        >
                          <Check size={16} />
                        </button>
                      )}

                      {booking.status === "CONFIRMED" && (
                        <button
                          onClick={() => changeStatus(booking.id, "COMPLETED")}
                          title="Mark Complete"
                          className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700 border border-blue-200/40 transition hover:bg-blue-600 hover:text-white"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}

                      {booking.status !== "CANCELLED" && booking.status !== "COMPLETED" && (
                        <button
                          // NEW: Open custom modal instead of window.confirm
                          onClick={() => {
                            setBookingToCancel(booking.id);
                            setCancelModal(true);
                          }}
                          title="Cancel Booking"
                          className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-200/40 transition hover:bg-red-500 hover:text-white"
                        >
                          <XCircle size={16} />
                        </button>
                      )}
                      
                      {(booking.status === "CANCELLED" || booking.status === "COMPLETED") && (
                        <span className="text-xs text-gray-400 italic px-3 py-2">Archived</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBookings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FAF8F5] text-[#C9A227] mb-4">
              <Search size={22} />
            </div>
            <h3 className="text-lg font-medium text-[#1C1C1C]">No bookings found</h3>
            <p className="mt-1 max-w-xs text-sm text-gray-400">
              No appointments match your active search filter requirements.
            </p>
          </div>
        )}
      </div>

      {/* NEW: Custom Cancellation Modal */}
      {cancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-all duration-300">
          <div className="w-full max-w-md animate-in zoom-in-95 rounded-3xl bg-white p-8 text-center shadow-2xl duration-200">
            
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
              <AlertTriangle size={32} />
            </div>
            
            <h2 className="mb-2 text-2xl font-semibold text-[#1C1C1C]">Cancel Booking?</h2>
            
            <p className="mb-8 text-gray-500">
              Are you sure you want to cancel this appointment? This action cannot be undone.
            </p>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setCancelModal(false);
                  setBookingToCancel(null);
                }}
                className="rounded-xl border border-gray-200 px-6 py-3 font-medium text-[#1C1C1C] transition hover:bg-gray-50"
              >
                No, Keep it
              </button>
              
              <button
                onClick={confirmCancel}
                className="rounded-xl bg-red-500 px-6 py-3 font-medium text-white transition hover:bg-red-600 shadow-lg shadow-red-500/20"
              >
                Yes, Cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

// Status Badge Component
function StatusBadge({ status }: { status: string }) {
  const styles = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-green-100 text-green-700",
    COMPLETED: "bg-blue-100 text-blue-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${
        styles[status as keyof typeof styles] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}