"use client";
import { FaCalendarAlt } from "react-icons/fa";
import { BiPencil } from "react-icons/bi";
import Image from "next/image";

export default function Profile() {
  return (
    <div className="flex">
      <main className="flex-1 p-10  text-[#694800] flex ">
        <div className="flex flex-col items-center w-1/3  ">
          <h2 className="mr-13 text-3xl font-bold mb-6 text-start">Profile</h2>
          <Image
            src="/icons/user-avatar.png"
            alt="User Avatar"
            width={160}
            height={160}
            className="bg-[#F9DB63] rounded-xl w-40 h-40"
          />
          <p className="mt-3 text-xl font-bold">USER</p>
        </div>
        <div className="mr-22 flex-1 p-18 relative">
          <button className="absolute top-3 right-2 text-2xl text-gray-800 hover:text-gray-600">
            <BiPencil />
          </button>
          <div className="space-y-4 w-160 ">
            <div className=" bg-[#F9DB63] px-7 py-2 rounded-3xl text-lg font-semibold">
              Name: User
            </div>
            <div className=" bg-[#F9DB63] px-7 py-2 rounded-3xl text-lg font-semibold">
              Email: user.user@gmail.com
            </div>
            <div className=" bg-[#F9DB63] px-7 py-2 rounded-3xl text-lg font-semibold flex items-center gap-2">
              <span>Date of Birth: 01.01.2015</span>
              <FaCalendarAlt />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
