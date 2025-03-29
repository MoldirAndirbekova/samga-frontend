"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import "@/styles/globals.css";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); // detect current route
  const isHome = pathname === "/"; // check if we're on homepage

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-[#FFF5E1]">
        <Header />
        <div className="flex flex-1">
          {!isHome && <Sidebar />} {/* 👈 Only show Sidebar if not on home */}
          <main className="flex-1">{children}</main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
