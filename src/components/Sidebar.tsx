"use client";

import { Gamepad2, Mic, MessageSquare, List, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

const menuItems = [
  { name: "Games", icon: Gamepad2 },
  { name: "Reports", icon: Mic },
  { name: "Feedback", icon: MessageSquare },
  { name: "Guidelines", icon: List },
  { name: "Profile", icon: User },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <aside className="w-1/5 bg-transparent p-4 h-screen text-[#694800] ml-3 flex flex-col items-start">
      
      <div className="mb-6 flex justify-center w-full">
        <Image src="/logo.png" alt="Product Logo" width={64} height={64} />
      </div>

      
      <nav className="w-full">
        <ul className="space-y-3">
          {menuItems.map((item) => {
            const isActive = pathname === `/${item.name.toLowerCase()}`;

            return (
              <li
                key={item.name}
                onClick={() => router.push(`/${item.name.toLowerCase()}`)}
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
                <span className="text-lg font-bold">{item.name}</span>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}