'use client';

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import "@/styles/globals.css";
// import Footer from "@/components/ui/footer";
// import Navbar from "@/components/ui/navbar";

const AUTH_ROUTES = ["/dashboard", "/profile", "/guidelines", "/reports", "/feedback", "/games"]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-[#FFF5E1]">
        {isAuthRoute ? (
          <>
            <Header />
            <div className="flex flex-1">
              <Sidebar />
              <main className="flex-1">{children}</main>
            </div>
          </>
        ) : (
          <div>
            {/* <Navbar /> */}
            <main className="flex-1">{children}</main>
            {/* <Footer /> */}
          </div>
        )}
      </body>
    </html>
  );
}