import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, LogOut } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ChildSelector from "./ChildSelector";
import { useChild } from "@/contexts/ChildContext";

export default function Header() {
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const { selectedChildId, setSelectedChildId, refreshChildren } = useChild();
  const router = useRouter();

  useEffect(() => {
    refreshChildren();
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshChildren();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [refreshChildren]);

  useEffect(() => {
    const handleChildChanged = (e: Event) => {
      if (e instanceof CustomEvent) {
        refreshChildren();
      }
    };
    window.addEventListener("childChanged", handleChildChanged);
    return () => {
      window.removeEventListener("childChanged", handleChildChanged);
    };
  }, [refreshChildren]);

  const handleChildSelect = (childId: string | null) => {
    setSelectedChildId(childId);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    document.cookie =
      "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict";
    router.push("/login");
  };

  return (
    <header className="bg-[#2959BF] p-4 flex justify-between items-center text-white shadow-md mb-3 px-10">
      <Image src="/logo.png" alt="Samga Logo" width={100} height={40} />

      <div className="flex items-center space-x-4">
        <ChildSelector
          onSelectChild={handleChildSelect}
          selectedChildId={selectedChildId}
        />

        <LanguageSwitcher />

        <div className="relative">
          <button className="rounded-full border-2 border-white p-1 mr-3">
            <Image
              src="/icons/photo.png"
              alt="User Photo"
              width={32}
              height={32}
              className="rounded-full"
            />
          </button>

          <button
            onClick={() => setIsAccountOpen(!isAccountOpen)}
            className="rounded-full border-2 border-white p-1"
          >
            <Image
              src="/icons/avatar.png"
              alt="User Avatar"
              width={32}
              height={32}
              className="rounded-full"
            />
          </button>

          {isAccountOpen && (
            <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-md w-36 z-50">
              <div
                className="px-4 py-2 flex items-center space-x-2 cursor-pointer hover:bg-gray-200"
                onClick={() => router.push("/profile")}
              >
                <User className="w-4 h-4" /> <span>Profile</span>
              </div>
              <div
                className="px-4 py-2 flex items-center space-x-2 cursor-pointer hover:bg-gray-200"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" /> <span>Logout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
