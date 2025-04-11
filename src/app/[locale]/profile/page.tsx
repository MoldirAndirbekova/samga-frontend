"use client"

import { useState, useEffect } from "react";
import { BiPencil } from "react-icons/bi";
import api from "@/features/page"; 
import { useTranslations } from 'next-intl';

interface User {
  id: string;
  full_name: string;
  email: string;
  children?: Child[]; 
}

interface Child {
  id: string;
  full_name: string;
  email: string;
}

export default function Profile() {
  const t = useTranslations('Profile');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("apis/users/me");

        if (response.data) {
          setUser(response.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  if (!user) {
    return <p>{t('loading')}...</p>;
  }

  return (
    <div className="flex flex-col gap-10 p-10 text-[#694800]">
      <div className="flex items-center gap-10">
        <div className="flex flex-col items-center w-1/3">
          <h2 className="text-3xl font-bold mb-6">{t('account')}</h2>
          <img src="/icons/user-avatar.png" alt="User Avatar" className="w-40 h-40 rounded-xl bg-[#F9DB63]" />
          <p className="mt-3 text-xl font-bold">{t('personal-account')}</p>
        </div>
        <div className="flex-1 p-10 relative">
          <button className="absolute top-3 right-2 text-2xl text-gray-800 hover:text-gray-600">
            <BiPencil />
          </button>
          <div className="space-y-4 w-160">
            <div className="bg-[#F9DB63] px-7 py-2 rounded-3xl text-lg font-semibold">{t('name')}: {user.full_name}</div>
            <div className="bg-[#F9DB63] px-7 py-2 rounded-3xl text-lg font-semibold">{t('email')}: {user.email}</div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-10">
          <div className="flex flex-col items-center w-1/3">
            <img src="/icons/kid-avatar.png" alt="Child Avatar" className="w-40 h-40 rounded-xl bg-[#F9DB63]" />
            <p className="mt-3 text-xl font-bold">{t('player')}</p>
          </div>
          <div className="flex-1 p-10 relative">
            <button className="absolute top-3 right-2 text-2xl text-gray-800 hover:text-gray-600">
              <BiPencil />
            </button>
            <div className="space-y-4 w-160">
              {/* {user.children?.map((child) => ( */}
              {/* key={child.id} */}
                <div className="space-y-4">
                  <div className="bg-[#F9DB63] px-7 py-2 rounded-3xl text-lg font-semibold">{t('name')}: {t('child-name')}</div>
                </div>
              {/* ))} */}
            </div>
          </div>
      </div>
    </div>
  );
}
