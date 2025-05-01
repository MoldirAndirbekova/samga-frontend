"use client";

import Header from "@/components/Header";
import HeaderHome from "@/components/ui/navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import WebSocketCleanup from "@/components/WebSocketCleanup";
import "@/styles/globals.css";
import { usePathname } from "next/navigation";
import { SidebarProvider } from "@/lib/context/SidebarContext";
import { ChildProvider } from "@/contexts/ChildContext";

const routes = ["/", "/login", "/register", "/reset-password"];
const authRoutes = ["/login", "/register", "/reset-password"];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); 
  const isHome = pathname === "/";
  const isAuth = authRoutes.includes(pathname);
  const isGameDetail = pathname.startsWith("/games/") && pathname !== "/games";
  const needSidebar = !routes.includes(pathname) && !isGameDetail;

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-[#FFF5E1]">
        <SidebarProvider>
          {isAuth ? (
            // Don't wrap auth routes with ChildProvider
            <>
              <div className="flex flex-1">
                <main className="flex-1 transition-all duration-300">{children}</main>
              </div>
            </>
          ) : (
            // Wrap non-auth routes with ChildProvider
            <ChildProvider>
              {isHome ? <HeaderHome /> : <Header />}
              <div className="flex flex-1">
                {needSidebar && <Sidebar />}
                <main className="flex-1 transition-all duration-300">{children}</main>
              </div>
              {isHome && <Footer />}
              <WebSocketCleanup />
            </ChildProvider>
          )}
        </SidebarProvider>
      </body>
    </html>
  );
}