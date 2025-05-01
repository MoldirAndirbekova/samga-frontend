import { NAV_LINKS } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./button";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 lg:px-20 3xl:px-0 relative z-30 bg-orange-500 rounded-xl p-3 mt-3 mb-4 mx-3 border border-blue-400 shadow-md">
      <Link href="/">
        <Image src="/logo.png" alt="logo" width={100} height={29} />
      </Link>
      <ul className="hidden h-full gap-12 lg:flex">
        {NAV_LINKS.map((link) => (
          <Link
            href={link.href}
            key={link.key}
            className="text-[16px] font-[400] text-gray-50 flex items-center justify-center 
                cursor-pointer pb-1.5 transition-all hover:font-bold"
          >
            {link.label}
          </Link>
        ))}
      </ul>
      <div className="lg:flex items-center justify-center hidden">
      <Link href="/login">
          <Button className="px-8 py-4 text-xl font-semibold rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 focus:ring-4 focus:ring-blue-300">
            Login
          </Button>
        </Link>
      </div>
      <Image
        src="/images/menu.svg"
        alt="menu"
        width={32}
        height={32}
        className="inline-block cursor-pointer lg:hidden"
      />
    </nav>
  );
};

export default Navbar;
