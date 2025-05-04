"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import WebSocketCleanup from "@/components/WebSocketCleanup";
import { usePathname } from "next/navigation";
import { SidebarProvider } from "@/lib/context/SidebarContext";
import { ChildProvider } from "@/contexts/ChildContext";

const authRoutes = ["/login", "/register", "/reset-password"];
const noNavbarRoutes = ["/", ]; // только эти без навбара
const noSidebarRoutes = ["/", "/product", "/skills/cognitive", "/skills/motoric","/product"];
const footerRoutes = ["/", "/product", "/skills/cognitive", "/skills/motoric"];

// Убираем локаль из пути
function stripLocale(pathname: string): string {
  const segments = pathname.split("/");
  if (segments.length >= 2 && segments[1].length === 2) {
    const stripped = "/" + segments.slice(2).join("/");
    return stripped === "/" || stripped === "/undefined" ? "/" : stripped;
  }
  return pathname;
}

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const cleanPath = stripLocale(pathname);

  const isAuth = authRoutes.includes(cleanPath);
  const isGameDetail = cleanPath.startsWith("/games/") && cleanPath !== "/games";
  const hideNavbar = noNavbarRoutes.includes(cleanPath);
  const hideSidebar = noSidebarRoutes.includes(cleanPath) || isGameDetail;  
  const showFooter = footerRoutes.includes(cleanPath);

  return (
    <SidebarProvider>
      {isAuth ? (
        <div className="flex flex-1">
          <main className="flex-1 transition-all duration-300">{children}</main>
        </div>
      ) : (
        <ChildProvider>
          {!hideNavbar && !isGameDetail && <Header />}
          <div className="flex flex-1">
            {!hideSidebar && <Sidebar />}
            <main className="flex-1 transition-all duration-300">{children}</main>
          </div>
          {showFooter && <Footer />}
          <WebSocketCleanup />
        </ChildProvider>
      )}
    </SidebarProvider>
  );
}
