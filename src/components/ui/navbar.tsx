"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Globe } from "lucide-react";

const navItems = [
  { label: "Home", href: "#", active: true },
  { label: "For Parents", href: "#" },
  { label: "For Teachers", href: "#" },
  { label: "About Us", href: "#" },
  { label: "News", href: "#" },
];

export default function Navbar() {
  const [languageOpen, setLanguageOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("EN");

  return (
    <nav className="bg-gradient-to-b from-[#48A9F8] to-[#3FA9F5] w-full py-4 px-4 shadow-sm flex justify-between items-center">

      {/* Left: Logo */}
      <div className="flex items-center">
        <Image src="/logo.png" alt="Samga Logo" width={130} height={40} />
      </div>

      {/* Center: Rounded Menu */}
      <div className="flex-grow flex justify-center">
        <ul className="flex gap-6 bg-white rounded-full px-6 py-2 shadow-md items-center">
          {navItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className={`text-sm font-semibold ${
                  item.active ? "text-[#F49B00]" : "text-black"
                } hover:text-[#F49B00] transition`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Right: Try button + Language selector */}
      <div className="flex items-center gap-3">
        <button className="bg-black text-white px-4 py-2 rounded-full font-semibold hover:bg-gray-800 transition text-sm">
          Try it for free!
        </button>

        <div className="relative">
          <button
            onClick={() => setLanguageOpen(!languageOpen)}
            className="border border-black rounded-full px-3 py-2 text-sm flex items-center gap-1 font-medium text-black hover:bg-black hover:text-white transition"
          >
            <Globe className="w-4 h-4" />
            {selectedLang}
            <ChevronDown className="w-4 h-4" />
          </button>
          {languageOpen && (
            <ul className="absolute right-0 mt-2 bg-white text-black rounded shadow-md w-24 z-50">
              {["EN", "RU", "KZ"].map((lang) => (
                <li
                  key={lang}
                  onClick={() => {
                    setSelectedLang(lang);
                    setLanguageOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                >
                  {lang}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}
