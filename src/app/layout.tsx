'use client'
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import "@/styles/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-[#FFF5E1]">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1">{children}</main>  
        </div>
      </body>
    </html>
  );
}
