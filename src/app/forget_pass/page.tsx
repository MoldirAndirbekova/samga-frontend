"use client";

import { useState } from "react";
import Image from "next/image";
import { Button, Input, Form } from "antd";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
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
          <h2 className="text-2xl font-bold text-[#1A54AF]">FORGOT PASSWORD</h2>
          <p className="text-gray-600 mb-4">
            Enter your email and we’ll send you a link to reset your password.
          </p>
          <Form
            form={form}
            layout="vertical"
            className="font-semibold"
            requiredMark={false}
          >
            <Form.Item
              name="email"
              label="Email Address"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input placeholder="Type your email" />
            </Form.Item>
            <div className="flex flex-col sm:flex-row gap-4 mb-10 sm:mb-20">
              <Button className="bg-yellow-400 text-black border-none px-6 w-full sm:w-auto">
                Send Email
              </Button>
              <Link href="/login">
                <Button className="border-black w-full sm:w-auto">
                  Back to Login
                </Button>
              </Link>
            </div>
          </Form>
        </div>
        <div className="hidden sm:flex w-1/2 flex-col justify-center items-center relative p-6">
          <div className="absolute inset-0 bg-blue-500/70"></div>
          <h2 className="text-6xl font-bold text-[#FFF5E1] relative z-10">
            WELCOME TO
          </h2>
          <Image
            src="/auth/logo_white.png"
            alt="samğa"
            width={224}
            height={112} 
            className="relative z-10 w-56 h-auto mt-2"
          />
          <p className="text-[#FFF5E1] relative z-10 mt-1">
            Active minds, moving bodies!
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
