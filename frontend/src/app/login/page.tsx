"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Mail, Lock } from "lucide-react";
import api from "@/services/api";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

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
      const response = await api.post("/auth/login", formData);

      // Extract the token AND the user object from the response
      const token = response.data.access_token;
      const user = response.data.user;

      // Save token for future API requests
      localStorage.setItem("token", token);

      // --- CONDITIONAL ROUTING BASED ON ROLE ---
      if (user.role === "ADMIN") {
        toast.success("Welcome back, Admin!");
        router.push("/admin");
      } else {
        toast.success("Logged in successfully!");
        router.push("/account"); // Sends standard users to their personal dashboard
      }

    } catch (error) {
      console.error(error);
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-[#FAF8F5]
        px-6
      "
    >
      <div
        className="
          w-full
          max-w-md
          rounded-[32px]
          bg-white
          p-10
          shadow-xl
        "
      >
        <h1
          className="
            text-3xl
            font-semibold
            text-[#1C1C1C]
            text-center
          "
        >
          Luxe Studio
        </h1>

        <p
          className="
            mt-2
            text-center
            text-gray-500
          "
        >
          Account Login
        </p>

        <form
          onSubmit={handleSubmit}
          className="
            mt-8
            space-y-5
          "
        >
          <div className="relative">
            <Mail
              className="
                absolute
                left-4
                top-4
                text-gray-400
              "
              size={20}
            />

            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="
                w-full
                rounded-xl
                border
                p-4
                pl-12
                outline-none
                focus:border-[#C9A227]
              "
            />
          </div>

          <div className="relative">
            <Lock
              className="
                absolute
                left-4
                top-4
                text-gray-400
              "
              size={20}
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="
                w-full
                rounded-xl
                border
                p-4
                pl-12
                outline-none
                focus:border-[#C9A227]
              "
            />
          </div>

          <button
            disabled={loading}
            className="
              w-full
              rounded-xl
              bg-[#1C1C1C]
              py-4
              text-white
              transition
              hover:bg-[#C9A227]
              disabled:opacity-50
            "
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
}