"use client";

import { useEffect, useState } from "react";
// 👇 1. Import useRouter
import { useRouter } from "next/navigation"; 
import { 
  getBookings, 
  updateBookingStatus, 
  cancelBooking,
  getAdminServices,
  createService,
  updateService,
  deleteService 
} from "@/services/admin-api";
import { toast } from "sonner";
import { 
  Check, 
  CheckCircle, 
  XCircle, 
  Search, 
  Filter, 
  AlertTriangle, 
  Calendar, 
  Sparkles, 
  Plus,
  Loader2,
  LogOut // 👇 2. Import the LogOut icon
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter(); // 👇 3. Initialize router

  // Master Active Tab Control: 'bookings' or 'services'
  const [activeTab, setActiveTab] = useState<"bookings" | "services">("bookings");
  const [loading, setLoading] = useState(true);

  // --- Data States ---
  const [bookings, setBookings] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);

  // --- Booking Filter States ---
  const [bookingSearch, setBookingSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // --- Service Modals & Form States ---
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [serviceImage, setServiceImage] = useState<File | null>(null);
  const [serviceFormData, setServiceFormData] = useState({
    title: "", description: "", duration: "", price: "",
  });

  // --- Global Destruction Confirmation Modal States ---
  const [deleteModal, setDeleteModal] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const [itemIdTarget, setItemIdTarget] = useState<number | null>(null);

  // Combined Master Data Loader
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [bookingsData, servicesData] = await Promise.all([
        getBookings(),
        getAdminServices()
      ]);
      setBookings(bookingsData || []);
      setServices(servicesData || []);
    } catch (error) {
      console.error("Dashboard engine failure:", error);
      toast.error("Failed to compile dashboard metrics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // 👇 4. Add the Logout Function
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/"); // Send admin back to the homepage
  };

  // --- Booking Mutation Logic ---
  const changeBookingStatus = async (id: number, status: string) => {
    try {
      await updateBookingStatus(id, { status });
      toast.success(`Booking marked as ${status.toLowerCase()}`);
      loadDashboardData();
    } catch (error) {
      toast.error("Status update execution error");
    }
  };

  const confirmCancelBooking = async () => {
    if (!itemIdTarget) return;
    try {
      await cancelBooking(itemIdTarget);
      toast.success("Appointment successfully cancelled");
      loadDashboardData();
    } catch (error) {
      toast.error("Cancellation pipeline failed");
    } finally {
      setCancelModal(false);
      setItemIdTarget(null);
    }
  };

  // --- Service Mutation Logic ---
  const confirmDeleteService = async () => {
    if (!itemIdTarget) return;
    try {
      await deleteService(itemIdTarget);
      toast.success("Service purged successfully");
      loadDashboardData();
    } catch (error) {
      toast.error("Purge operations failed");
    } finally {
      setDeleteModal(false);
      setItemIdTarget(null);
    }
  };

  const handleServiceSubmit = async () => {
    try {
      const submitData = new FormData();
      submitData.append("title", serviceFormData.title);
      submitData.append("description", serviceFormData.description);
      submitData.append("duration", String(serviceFormData.duration));
      submitData.append("price", String(serviceFormData.price));
      if (serviceImage) submitData.append("image", serviceImage);

      if (editingService) {
        await updateService(editingService.id, submitData);
        toast.success("Service definitions updated");
      } else {
        await createService(submitData);
        toast.success("New catalogue service established");
      }
      
      setShowServiceModal(false);
      loadDashboardData();
    } catch (error) {
      toast.error("Transaction processing error");
    }
  };

  // Helper Date Formatter
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-GB", {
        day: "numeric", month: "short", year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Filter and Sort Engine Configurations
  const filteredBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt || b.bookingDate).getTime() - new Date(a.createdAt || a.bookingDate).getTime())
    .filter((booking) => {
      const matchText = 
        booking.customerName?.toLowerCase().includes(bookingSearch.toLowerCase()) ||
        booking.customerEmail?.toLowerCase().includes(bookingSearch.toLowerCase()) ||
        booking.customerPhone?.includes(bookingSearch);
      const matchStatus = statusFilter === "ALL" || booking.status === statusFilter;
      return matchText && matchStatus;
    });

  if (loading) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-[#C9A227]" />
        <p className="text-sm font-medium text-gray-500">Compiling executive management hub...</p>
      </div>
    );
  }

  return (
    <div className="pb-16 min-h-screen bg-[#FAF8F5] px-8 pt-8 rounded-[32px]">
      
      {/* Executive Overview Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200/60 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1C1C1C]">Studio Management Hub</h1>
          <p className="mt-2 text-sm text-gray-500">Monitor consumer appointments, track pipeline revenues, and manage catalogue services.</p>
        </div>

        {/* 👇 5. Updated Action Buttons (Add Service & Logout) */}
        <div className="flex items-center gap-3">
          {activeTab === "services" && (
            <button
              onClick={() => {
                setEditingService(null);
                setServiceImage(null);
                setServiceFormData({ title: "", description: "", duration: "", price: "" });
                setShowServiceModal(true);
              }}
              className="flex items-center gap-2 rounded-xl bg-[#1C1C1C] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#C9A227] shadow-md"
            >
              <Plus size={16} />
              Add New Service
            </button>
          )}
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50 hover:text-red-600 shadow-sm"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      {/* Luxury Style Nav Tabs */}
      <div className="mt-6 flex gap-2 rounded-xl bg-gray-200/60 p-1.5 w-fit">
        <button
          onClick={() => setActiveTab("bookings")}
          className={`flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium transition-all ${
            activeTab === "bookings" ? "bg-white text-[#1C1C1C] shadow-sm" : "text-gray-500 hover:text-black"
          }`}
        >
          <Calendar size={16} />
          Reservations Panel ({bookings.length})
        </button>
        <button
          onClick={() => setActiveTab("services")}
          className={`flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium transition-all ${
            activeTab === "services" ? "bg-white text-[#1C1C1C] shadow-sm" : "text-gray-500 hover:text-black"
          }`}
        >
          <Sparkles size={16} />
          Services Portfolio ({services.length})
        </button>
      </div>

      {/* --- PANEL VIEWPORTS --- */}
      {activeTab === "bookings" ? (
        <div className="mt-8 animate-in fade-in duration-200">
          {/* Filtering Engine Bar */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex max-w-md flex-1 items-center">
              <Search size={18} className="absolute left-4 text-gray-400" />
              <input
                type="text"
                placeholder="Filter parameters by name, email, or telephone..."
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-11 pr-4 text-sm text-[#1C1C1C] outline-none transition focus:border-[#C9A227]"
              />
            </div>
            <div className="relative flex items-center">
              <Filter size={16} className="absolute left-4 text-gray-400 pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-10 text-sm font-medium text-[#1C1C1C] outline-none transition focus:border-[#C9A227]"
              >
                <option value="ALL">All Ledger Entries</option>
                <option value="PENDING">Pending Action</option>
                <option value="CONFIRMED">Confirmed Slots</option>
                <option value="COMPLETED">Completed History</option>
                <option value="CANCELLED">System Cancelled</option>
              </select>
            </div>
          </div>

          {/* Table Data Viewport */}
          <div className="mt-6 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#1C1C1C] text-sm font-medium text-white">
                  <tr>
                    <th className="p-5 font-semibold">Client Identity</th>
                    <th className="p-5 font-semibold">Selected Allocation</th>
                    <th className="p-5 font-semibold">Target Date</th>
                    <th className="p-5 font-semibold">Arrival Time</th>
                    <th className="p-5 font-semibold">Pipeline Status</th>
                    <th className="p-5 font-semibold text-right pr-8">System Mutators</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-[#4A4A4A]">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="transition hover:bg-gray-50/40">
                      <td className="p-5">
                        <p className="font-semibold text-[#1C1C1C]">{booking.customerName}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{booking.customerEmail}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{booking.customerPhone}</p>
                      </td>
                      <td className="p-5 font-medium text-[#1C1C1C]">
                        {booking.service?.title || "Luxury Suite"}
                      </td>
                      <td className="p-5 font-medium">{formatDate(booking.bookingDate)}</td>
                      <td className="p-5 font-medium">{booking.bookingTime}</td>
                      <td className="p-5"><StatusBadge status={booking.status} /></td>
                      <td className="p-5">
                        <div className="flex justify-end gap-2">
                          {booking.status === "PENDING" && (
                            <button
                              onClick={() => changeBookingStatus(booking.id, "CONFIRMED")}
                              title="Authorize Confirmation"
                              className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 text-green-700 border border-green-200/40 transition hover:bg-green-600 hover:text-white"
                            >
                              <Check size={16} />
                            </button>
                          )}
                          {booking.status === "CONFIRMED" && (
                            <button
                              onClick={() => changeBookingStatus(booking.id, "COMPLETED")}
                              title="Finalize Completion"
                              className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700 border border-blue-200/40 transition hover:bg-blue-600 hover:text-white"
                            >
                              <CheckCircle size={16} />
                            </button>
                          )}
                          {booking.status !== "CANCELLED" && booking.status !== "COMPLETED" && (
                            <button
                              onClick={() => {
                                setItemIdTarget(booking.id);
                                setCancelModal(true);
                              }}
                              title="Halt Appointment"
                              className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-200/40 transition hover:bg-red-500 hover:text-white"
                            >
                              <XCircle size={16} />
                            </button>
                          )}
                          {(booking.status === "CANCELLED" || booking.status === "COMPLETED") && (
                            <span className="text-xs text-gray-400 italic px-3 py-2">Archived Records</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredBookings.length === 0 && (
              <div className="py-16 text-center text-gray-400 text-sm">No reservations fit the active criteria filters.</div>
            )}
          </div>
        </div>
      ) : (
        /* Catalogue Portfolio Configuration Viewport */
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-in fade-in duration-200">
          {services.map((service) => (
            <div key={service.id} className="rounded-3xl border border-[#E8E0D5] bg-white p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold text-[#1C1C1C]">{service.title}</h2>
                <p className="mt-2 line-clamp-2 text-sm text-gray-500">{service.description}</p>
                <div className="mt-4 space-y-1 text-sm font-medium text-[#4A4A4A]">
                  <p>Operations Track: {service.duration} mins</p>
                  <p>Valuation Fee: Rs {service.price}</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  onClick={() => {
                    setEditingService(service);
                    setServiceImage(null); 
                    setServiceFormData({
                      title: service.title, description: service.description,
                      duration: String(service.duration), price: String(service.price),
                    });
                    setShowServiceModal(true);
                  }}
                  className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-600 hover:text-white"
                >
                  Modify Formats
                </button>
                <button
                  onClick={() => {
                    setItemIdTarget(service.id);
                    setDeleteModal(true);
                  }}
                  className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-500 hover:text-white"
                >
                  Purge Service
                </button>
              </div>
            </div>
          ))}
          {services.length === 0 && (
            <div className="col-span-full py-16 text-center text-gray-400 text-sm">Portfolio catalogue empty. Construct records via top context link.</div>
          )}
        </div>
      )}

      {/* --- REUSABLE DOCK MODALS --- */}

      {/* Catalogue Mutator Form Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">
            <h2 className="mb-6 text-2xl font-semibold text-[#1C1C1C]">
              {editingService ? "Modify Strategic Parameter" : "Incorporate Asset Formats"}
            </h2>
            <div className="space-y-4">
              <input
                placeholder="Product Designation"
                value={serviceFormData.title}
                onChange={(e) => setServiceFormData({ ...serviceFormData, title: e.target.value })}
                className="w-full rounded-xl border border-gray-200 p-4 outline-none transition focus:border-[#C9A227]"
              />
              <textarea
                placeholder="Marketing Summary"
                value={serviceFormData.description}
                onChange={(e) => setServiceFormData({ ...serviceFormData, description: e.target.value })}
                rows={3}
                className="w-full rounded-xl border border-gray-200 p-4 outline-none transition focus:border-[#C9A227]"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  placeholder="Minutes Limit"
                  type="number"
                  value={serviceFormData.duration}
                  onChange={(e) => setServiceFormData({ ...serviceFormData, duration: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 p-4 outline-none transition focus:border-[#C9A227]"
                />
                <input
                  placeholder="Valuation (LKR)"
                  type="number"
                  value={serviceFormData.price}
                  onChange={(e) => setServiceFormData({ ...serviceFormData, price: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 p-4 outline-none transition focus:border-[#C9A227]"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Portfolio Display Banner</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files) setServiceImage(e.target.files[0]);
                  }}
                  className="w-full cursor-pointer rounded-xl border border-gray-200 bg-white p-2 file:mr-4 file:rounded-lg file:border-0 file:bg-[#1C1C1C] file:px-4 file:py-2 file:text-sm file:text-white"
                />
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <button onClick={() => setShowServiceModal(false)} className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-medium">Dismiss</button>
              <button onClick={handleServiceSubmit} className="rounded-xl bg-[#1C1C1C] px-6 py-3 text-sm font-medium text-white hover:bg-[#C9A227]">Save Configuration</button>
            </div>
          </div>
        </div>
      )}

      {/* Reservation Disruption Confirmation Modal */}
      {cancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
              <AlertTriangle size={32} />
            </div>
            <h2 className="mb-2 text-2xl font-semibold text-[#1C1C1C]">Abort Customer Reservation?</h2>
            <p className="mb-8 text-sm text-gray-500">Confirm cancellation workflows on this row item index? This will flag customer records as inactive.</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => { setCancelModal(false); setItemIdTarget(null); }} className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-medium">Retain Record</button>
              <button onClick={confirmCancelBooking} className="rounded-xl bg-red-500 px-6 py-3 text-sm font-medium text-white shadow-md shadow-red-500/15">Halt Appointment</button>
            </div>
          </div>
        </div>
      )}

      {/* Catalogue Purge Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
              <AlertTriangle size={32} />
            </div>
            <h2 className="mb-2 text-2xl font-semibold text-[#1C1C1C]">Purge Corporate Product Listing?</h2>
            <p className="mb-8 text-sm text-gray-500">Are you absolutely sure you want to completely erase this item profile allocation from databases? Cascade workflows could alter customer schedules.</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => { setDeleteModal(false); setItemIdTarget(null); }} className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-medium">Cancel Action</button>
              <button onClick={confirmDeleteService} className="rounded-xl bg-red-500 px-6 py-3 text-sm font-medium text-white shadow-md shadow-red-500/15">Execute Purge</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Internal Styled Pipeline Badges
function StatusBadge({ status }: { status: string }) {
  const styles = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-green-100 text-green-700",
    COMPLETED: "bg-blue-100 text-blue-700",
    CANCELLED: "bg-red-100 text-red-700",
  };
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${styles[status as keyof typeof styles] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
}