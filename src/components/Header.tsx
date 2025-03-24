'use client'
import Image from "next/image";
import { useState } from "react";
import { ChevronDown, User, LogOut } from "lucide-react";

export default function Header() {
  const [language, setLanguage] = useState("RU");
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  return (
    <header className="bg-[#2959BF] p-4 flex justify-between items-center text-white shadow-md mb-3">
      <Image src="/logo.png" alt="Samga Logo" width={100} height={40} />

      <div className="flex items-center space-x-4">
        <div className="relative">
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center border-2 border-white px-3 py-1 rounded-full"
          >
            {language} <ChevronDown className="ml-1 w-4 h-4" />
          </button>
          {isLangOpen && (
            <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-md w-24">
              {["KZ", "RU", "EN"].map((lang) => (
                <div
                  key={lang}
                  onClick={() => {
                    setLanguage(lang);
                    setIsLangOpen(false);
                  }}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                >
                  {lang}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <button className="rounded-full border-2 border-white p-1 mr-3">
            <Image
              src="/icons/photo.png"
              alt="User Avatar"
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
            <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-md w-36">
              <div className="px-4 py-2 flex items-center space-x-2 cursor-pointer hover:bg-gray-200">
                <User className="w-4 h-4" /> <span>Profile</span>
              </div>
              <div className="px-4 py-2 flex items-center space-x-2 cursor-pointer hover:bg-gray-200">
                <LogOut className="w-4 h-4" /> <span>Logout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
