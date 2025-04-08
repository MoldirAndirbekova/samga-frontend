'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from "@/components/Header";
import HeaderHome from "@/components/ui/navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

const baseRoutes = ["/", "/login", "/register"];

function stripLocale(pathname: string): string {
  const segments = pathname.split('/');
  if (segments.length >= 2 && segments[1].length === 2) {
    const stripped = '/' + segments.slice(2).join('/');
    return stripped === '/' || stripped === '/undefined' ? '/' : stripped;
  }
  return pathname;
}

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  const cleanPath = stripLocale(pathname);

  const isHome = cleanPath === '/';
  const isAuth = baseRoutes.includes(cleanPath);
  const isGameDetailPage = cleanPath.startsWith("/games/") && cleanPath.split("/").length > 2;
  const needSidebar = !isAuth && !isGameDetailPage && !isHome;

  return (
    <>
      {isHome ? (
        <HeaderHome />
      ) : !isAuth && !isGameDetailPage ? (
        <Header />
      ) : null}

      <div className="flex flex-1">
        {needSidebar && <Sidebar />}
        <main className="flex-1">{children}</main>
      </div>

      {isHome && <Footer />}
    </>
  );
}
