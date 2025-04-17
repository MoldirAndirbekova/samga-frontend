"use client";

import { NAV_LINKS } from "@/constants";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./button";
import { useState } from "react";

const Navbar = () => {
  const [languageOpen, setLanguageOpen] = useState(false);

  const toggleLanguageMenu = () => setLanguageOpen(!languageOpen);

  return (
    <nav className="w-full flex justify-center bg-[#A2DBF4] py-2">
      <ul className="flex items-center justify-center gap-16 px-16 py-4 bg-[#89DBFC] rounded-full shadow-md">
        {NAV_LINKS.map((link) => (
          <li key={link.key}>
            <Link
              href={link.href}
              className="text-white font-bold text-sm sm:text-base hover:underline transition-all"
            >
              {link.label}
            </Link>
          </li>
        ))}
        <li className="relative">
          <button
            onClick={toggleLanguageMenu}
            className="text-white font-bold text-sm sm:text-base flex items-center gap-1"
          >
            EN
            <span className={`transition-transform duration-200 ${languageOpen ? "rotate-180" : "rotate-0"}`}>▼</span>
          </button>
          {languageOpen && (
            <ul className="absolute top-full mt-2 right-0 bg-white text-black rounded-md shadow-lg overflow-hidden z-50">
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">EN</li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">RU</li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">KZ</li>
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
