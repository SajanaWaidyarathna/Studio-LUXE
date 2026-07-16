"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // Prevents Next.js hydration mismatch
  
  const pathname = usePathname();
  const router = useRouter();

  // Check login status whenever the page loads or the URL changes
  useEffect(() => {
    setIsMounted(true);
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/"); // Redirect to homepage on logout
  };

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        
        {/* Logo Section */}
        <Link
          href="/"
          className="
            text-2xl
            font-extrabold
            tracking-[0.15em]
            text-[#1C1C1C]
          "
        >
          LUXE<span className="font-light text-[#C9A227] ml-2">STUDIO</span>
        </Link>

        <div className="flex items-center gap-8">
          <Link 
            href="/" 
            className="text-sm font-medium text-gray-600 hover:text-black transition"
          >
            Home
          </Link>

          <Link 
            href="/#services"
            className="text-sm font-medium text-gray-600 hover:text-black transition"
          >
            Services
          </Link>

          <Link 
            href="/#about"
            className="text-sm font-medium text-gray-600 hover:text-black transition"
          >
            About
          </Link>

           <Link 
            href="/#gallery"
            className="text-sm font-medium text-gray-600 hover:text-black transition"
          >
            Gallery
          </Link>

          <Link 
            href="/#booking"
            className="text-sm font-medium text-gray-600 hover:text-black transition"
          >
            Book now
          </Link>

          {/* Dynamic Auth Section */}
          <div className="flex items-center gap-4 ml-4">
            {isMounted && isLoggedIn ? (
              <>
                <button 
                  onClick={handleLogout}
                  className="text-sm font-medium text-red-500 hover:text-red-700 transition"
                >
                  Logout
                </button>
                <Link
                  href="/account"
                  className="rounded-full bg-[#1C1C1C] px-6 py-2.5 text-sm text-white transition hover:bg-[#C9A227]"
                >
                  My Account
                </Link>
              </>
            ) : isMounted ? (
              <>
                {/* 👇 Added Register and styled Login to look like a pair */}
                <Link
                  href="/login"
                  className="text-sm font-medium text-[#1C1C1C] hover:text-[#C9A227] transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-full bg-[#1C1C1C] px-6 py-2.5 text-sm text-white transition hover:bg-[#C9A227]"
                >
                  Register
                </Link>
              </>
            ) : (
              // Invisible placeholder to prevent layout shift while checking local storage
              <div className="w-[160px] h-[40px]"></div> 
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}