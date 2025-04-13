"use client";

import { Gamepad2, Mic, MessageSquare, List, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function Sidebar() {
  const t = useTranslations("Sidebar");
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { key: "games", label: t("games"), icon: Gamepad2 },
    { key: "reports", label: t("reports"), icon: Mic },
    { key: "feedback", label: t("feedback"), icon: MessageSquare },
    { key: "guidelines", label: t("guidelines"), icon: List },
    { key: "profile", label: t("profile"), icon: User },
  ];

  return (
    <aside className="w-1/5 bg-transparent p-4 h-screen text-[#694800] ml-3 flex flex-col items-start">
      {/* Product Logo */}
      <div className="mb-6 flex justify-center w-full">
        <Image src="/logo.png" alt="Product Logo" width={64} height={64} />
      </div>

      {/* Navigation Menu */}
      <nav className="w-full">
        <ul className="space-y-3">
          {menuItems.map((item) => {
            const isActive = pathname === `/${item.key}`;

            return (
              <li
                key={item.key}
                onClick={() => router.push(`/${item.key}`)}
                className={`flex items-center gap-3 p-3 cursor-pointer rounded-4xl 
        ${isActive ? "bg-[#2959BF] text-white" : "text-[#694800]"} 
        transition hover:bg-blue-200 w-full`}
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 
          ${isActive ? "border-white" : "border-[#694800]"}`}
                >
                  <item.icon size={20} />
                </div>
                <span className="text-lg font-bold">{item.label}</span>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
