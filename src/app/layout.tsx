"use client";

import Header from "@/components/Header";
import HeaderHome from "@/components/ui/navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import "@/styles/globals.css";
import { usePathname } from "next/navigation";
import { Nerko_One } from 'next/font/google';

const nerkoOne = Nerko_One({ subsets: ['latin'], weight: ['400'] });


const routes = ["/", "/login", "/register"];
const authRoutes = ["/login", "/register"];
const noSidebarRoutes = ["/cognitive", "/skills"];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); 
  const isHome = pathname === "/";
  const isAuth = authRoutes.includes(pathname);
  const isGameDetailPage = pathname.startsWith("/games/") && pathname.split("/").length > 2;

  const shouldHideSidebar = 
    routes.includes(pathname) || 
    isGameDetailPage || 
    noSidebarRoutes.some((route) => pathname.startsWith(route));

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-[#FFF5E1]">
        {isHome ? (
          <HeaderHome />
        ) : !isAuth && !isGameDetailPage ? (
          <Header />
        ) : null}

        <div className="flex flex-1">
          {!shouldHideSidebar && <Sidebar />}
          <main className="flex-1">{children}</main>
        </div>

        {isHome && <Footer />}
      </body>
    </html>
  );
}
