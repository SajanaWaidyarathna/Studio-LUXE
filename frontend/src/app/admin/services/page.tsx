"use client";

import { useEffect, useState } from "react";
import {
  getAdminServices,
  createService,
  updateService,
  deleteService
} from "@/services/admin-api";
import { toast } from "sonner";

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal and Form States
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  
  // 1. Added image state for the file upload
  const [image, setImage] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    price: "",
  });

  const loadServices = async () => {
    try {
      const data = await getAdminServices();
      setServices(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const removeService = async (id: number) => {
    try {
      await deleteService(id);
      toast.success("Service deleted");
      loadServices();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  // 4. Updated Submit Logic to use FormData
  const handleSubmit = async () => {
    try {
      const submitData = new FormData();
      
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("duration", String(formData.duration));
      submitData.append("price", String(formData.price));

      if (image) {
        submitData.append("image", image);
      }

      if (editingService) {
        // Pass the FormData object instead of JSON
        await updateService(editingService.id, submitData);
        toast.success("Service updated");
      } else {
        // Pass the FormData object instead of JSON
        await createService(submitData);
        toast.success("Service created");
      }
      
      setShowModal(false);
      loadServices();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        Loading services...
      </div>
    );
  }

  return (
    <div className="pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-[#1C1C1C]">Services</h1>

        <button
          onClick={() => {
            setEditingService(null);
            setImage(null); // Reset image state
            setFormData({
              title: "",
              description: "",
              duration: "",
              price: "",
            });
            setShowModal(true);
          }}
          className="rounded-xl bg-[#1C1C1C] px-5 py-3 text-white transition hover:bg-[#C9A227]"
        >
          Add Service
        </button>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <div
            key={service.id}
            className="rounded-3xl border border-[#E8E0D5] bg-white p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-[#1C1C1C]">{service.title}</h2>
            <p className="mt-2 line-clamp-2 text-gray-500">{service.description}</p>

            <div className="mt-4 space-y-1 text-sm text-[#4A4A4A]">
              <p>Duration: {service.duration} min</p>
              <p>Price: Rs {service.price}</p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setEditingService(service);
                  setImage(null); // Reset image in case they don't want to change it
                  setFormData({
                    title: service.title,
                    description: service.description,
                    duration: String(service.duration),
                    price: String(service.price),
                  });
                  setShowModal(true);
                }}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition hover:bg-blue-700"
              >
                Edit
              </button>

              <button
                onClick={() => removeService(service.id)}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white transition hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Service Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">
            <h2 className="mb-6 text-2xl font-semibold text-[#1C1C1C]">
              {editingService ? "Edit Service" : "Add Service"}
            </h2>

            <div className="space-y-4">
              <input
                placeholder="Service name"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full rounded-xl border border-[#E8E0D5] p-4 outline-none transition focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]"
              />
              
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full rounded-xl border border-[#E8E0D5] p-4 outline-none transition focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <input
                  placeholder="Duration (min)"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full rounded-xl border border-[#E8E0D5] p-4 outline-none transition focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]"
                />
                <input
                  placeholder="Price (Rs)"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full rounded-xl border border-[#E8E0D5] p-4 outline-none transition focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]"
                />
              </div>

              {/* 3. Added File Input with custom styling */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files) {
                      setImage(e.target.files[0]);
                    }
                  }}
                  className="w-full cursor-pointer rounded-xl border border-[#E8E0D5] bg-white p-2 outline-none transition focus:border-[#C9A227] file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-[#1C1C1C] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white file:transition hover:file:bg-[#C9A227]"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-xl border border-[#E8E0D5] px-6 py-3 font-medium text-[#1C1C1C] transition hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="rounded-xl bg-[#1C1C1C] px-6 py-3 font-medium text-white transition hover:bg-[#C9A227]"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}