import { useRouter } from "next/router";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const showSidebarAndHeader = ["/games", "/feedback", "/guidelines", "/profile", "/reports"];
  
  const isVisible = showSidebarAndHeader.includes(router.pathname);

  return (
    <div className="flex flex-col min-h-screen bg-[#FFF5E1]">
      {isVisible && <Header />}
      {isVisible && (
        <div className="flex flex-1">
          <Sidebar />
          <Component {...pageProps} />
        </div>
      )}
      {!isVisible && <Component {...pageProps} />}
    </div>
  );
}
