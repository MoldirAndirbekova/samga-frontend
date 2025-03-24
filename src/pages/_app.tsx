import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="flex flex-col min-h-screen bg-[#FFF5E1]">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <Component {...pageProps} />
        </div>
    </div>
  )
}
