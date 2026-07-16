import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});


export const metadata: Metadata = {
  title: "Luxe Studio | Premium Salon",
  description: "Book premium salon and beauty services online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      className={`${inter.variable} ${playfair.variable}`}
        >
        {children}
        <Toaster position="top-right"/>
      </body>
    </html>
  );
}