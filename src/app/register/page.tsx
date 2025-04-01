"use client";

import { useState } from "react";
import { Button, Input, Form } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { ChevronDown } from "lucide-react";
import { register } from "@/components/actions/register-action";
import { useActionState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { APILogin } from "@/components/actions/login-action";
import form from "antd/es/form";
import { useFormik } from "formik";

export default function SignupPage() {
  const router = useRouter();
  const [language, setLanguage] = useState("RU");
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      const res = await APILogin(values);
      
      if (res.status === 200) {
        router.push("/games");
        console.log("Login successful");
      }
      else {
        setError("Пользователь с таким email уже существует");
      }
    },
  });

  return (
    <div
      className="flex h-screen w-full items-center justify-center px-4 sm:px-0"
      style={{
        backgroundImage: "url('/auth/background_registration.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex flex-col sm:flex-row w-full max-w-5xl rounded-xl shadow-lg overflow-hidden bg-white">
        <div className="w-full sm:w-1/2 p-6 sm:p-8">
          <div className="relative flex justify-end mb-4">
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
          <Button
            className="w-full sm:w-1/2 flex items-center justify-center gap-2 mb-6"
            icon={<GoogleOutlined />}
          >
            Sign up with Google
          </Button>
          <Form
            layout="vertical"
            className="font-semibold"
            requiredMark={false}
            onFinish={formik.handleSubmit}
          >
            {error && <p className="text-red-500">{error}</p>}
            <Form.Item
              name="fullName"
              label="Full Name"
              rules={[
                { required: true, message: "Please input your full name!" },
              ]}
            >
              <Input placeholder="Full Name" {...formik.getFieldProps("fullName")} />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input type="email" placeholder="Email" {...formik.getFieldProps("email")} />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password placeholder="Password" {...formik.getFieldProps("password")} />
            </Form.Item>
            <Form.Item className="flex justify-center">
              <Button htmlType="submit" className="w-full">
                Sign up
              </Button>
            </Form.Item>
            <Form.Item>
              <Link href="/login" className="text-blue-500 text-sm">
                Back to Login
              </Link>
            </Form.Item>
          </Form>
        </div>
        <div className="hidden sm:flex w-1/2 flex-col justify-center items-center relative p-6">
          <div className="absolute inset-0 bg-yellow-200/60"></div>
          <h2 className="text-6xl font-bold text-[#694800] relative z-10">
            WELCOME TO
          </h2>
          <img
            src="/auth/logo_brown.png"
            alt="samğa"
            className="relative z-10 w-56 h-auto mt-2"
          />
          <p className="text-[#694800] relative z-10 mt-1">
            Active minds, moving bodies!
          </p>
          <img
            src="/auth/registration_welcome.png"
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
