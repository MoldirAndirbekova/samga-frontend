import { Gamepad2, Mic, MessageSquare, List, User } from "lucide-react";
import { useState } from "react";

const menuItems = [
  { name: "Games", icon: Gamepad2, active: true },
  { name: "Reports", icon: Mic, active: false },
  { name: "Feedback", icon: MessageSquare, active: false },
  { name: "Guidelines", icon: List, active: false },
  { name: "Profile", icon: User, active: false },
];

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState("Games");

  return (
    <aside className="w-1/5 bg-transparent p-4 h-screen text-[#694800] ml-3">
      <nav>
        <ul className="space-y-3">
          {menuItems.map((item) => (
            <li
              key={item.name}
              onClick={() => setActiveItem(item.name)}
              className={`flex items-center gap-3 p-3 cursor-pointer rounded-4xl  
              ${activeItem === item.name ? "bg-[#2959BF] text-white" : "text-[#694800]"} 
              transition hover:bg-blue-200 `}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 
                ${activeItem === item.name ? "border-white" : "border-[#694800]"}`}
              >
                <item.icon size={20} />
              </div>
              <span className="text-lg font-bold">{item.name}</span>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
