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
  const pathname = usePathname(); 
  const isHome = pathname === "/"; 

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-[#FFF5E1]">
        <Header />
        <div className="flex flex-1">
          {!isHome && <Sidebar />}
          <main className="flex-1">{children}</main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
