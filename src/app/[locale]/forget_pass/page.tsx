"use client";

import { useState } from "react";
import Image from "next/image";
import { Button, Input, Form } from "antd";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function ForgotPasswordPage() {
    const t = useTranslations("ForgotPasswordPage");
  const [language, setLanguage] = useState("RU");
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [form] = Form.useForm();

  return (
    <div
      className="flex h-screen w-full items-center justify-center px-4 sm:px-0"
      style={{
        backgroundImage: "url('/auth/forget_pass_background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex flex-col sm:flex-row w-full max-w-5xl rounded-xl shadow-lg overflow-hidden bg-white">
        <div className="w-full sm:w-1/2 p-6 sm:p-14">
          <div className="relative flex justify-end mb-6 sm:mb-16">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center border px-2 py-1 rounded-md"
            >
              {language} <ChevronDown className="ml-1 w-3 h-3" />
            </button>
            {isLangOpen && (
              <div className="absolute top-full right-0 mt-1 bg-white border rounded shadow-md w-16">
                {["KZ", "RU", "EN"].map((lang) => (
                  <div
                    key={lang}
                    onClick={() => {
                      setLanguage(lang);
                      setIsLangOpen(false);
                    }}
                    className="px-2 py-1 cursor-pointer hover:bg-gray-200"
                  >
                    {lang}
                  </div>
                ))}
              </div>
            )}
          </div>
          <h2 className="text-2xl font-bold text-[#1A54AF]">{t('title')}</h2>
          <p className="text-gray-600 mb-4">
           {t('title-paragraph')}
          </p>
          <Form
            form={form}
            layout="vertical"
            className="font-semibold"
            requiredMark={false}
          >
            <Form.Item
              name="email"
              label={t('email')}
              rules={[{ required: true, message: t('email-required') }]}
            >
              <Input placeholder={t('email-placeholder')} />
            </Form.Item>
            <div className="flex flex-col sm:flex-row gap-4 mb-10 sm:mb-20">
              <Button className="bg-yellow-400 text-black border-none px-6 w-full sm:w-auto">
                {t('send-email')}
              </Button>
              <Link href="/login">
                <Button className="border-black w-full sm:w-auto">
                   {t('back-login')}
                </Button>
              </Link>
            </div>
          </Form>
        </div>
        <div className="hidden sm:flex w-1/2 flex-col justify-center items-center relative p-6">
          <div className="absolute inset-0 bg-blue-500/70"></div>
          <h2 className="text-6xl font-bold text-[#FFF5E1] relative z-10">
          {t('welcome-message')}
          </h2>
          <Image
            src="/auth/logo_white.png"
            alt="samğa"
            width={224}
            height={112} 
            className="relative z-10 w-56 h-auto mt-2"
          />
          <p className="text-[#FFF5E1] relative z-10 mt-1">
          {t('welcome-message-p')}
          </p>
          <Image
            src="/auth/forget_pass_welcome.png"
            alt="Background"
            layout="fill" 
            objectFit="cover"
            className="absolute inset-0"
          />
        </div>
      </div>
    </div>
  );
}
