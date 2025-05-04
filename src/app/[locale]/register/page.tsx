"use client";

import '@ant-design/v5-patch-for-react-19';
import { useState } from "react";
import { Button, Input, Form } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { APIRegister } from "@/components/actions/register-action";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import LanguageSwitcher2 from '@/components/LanguageSwitcher2';

export default function SignupPage() {
  const t = useTranslations("SignupPage");
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      fullName: "",
    },
    onSubmit: async (values) => {
      console.log(values);
      const res = await APIRegister(values);
  
      if (res.status === 200) {
        router.push("/login");
        console.log("Register successful");
      } else {
        // Use the error message from the API instead of hardcoded message
        setError(res.error || "Registration failed. Please try again.");
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
        <LanguageSwitcher2/>
           
          
          
          
          </div>
          <Button
            className="w-full sm:w-1/2 flex items-center justify-center gap-2 mb-6"
            icon={<GoogleOutlined />}
          >
           {t('sign-up-google')}
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
              label={t('full-name')}
              rules={[
                { required: true, message: t('full-name-required') },
              ]}
            >
              <Input placeholder={t('full-name-placeholder')} {...formik.getFieldProps("fullName")} />
            </Form.Item>
            <Form.Item
              name="email"
              label={t('email')}
              rules={[{ required: true, message: t('email-required') }]}
            >
              <Input type="email" placeholder={t('email-placeholder')} {...formik.getFieldProps("email")} />
            </Form.Item>
            <Form.Item
              name="password"
              label={t('password')}
              rules={[
                { required: true, message: t('password-required') },
              ]}
            >
              <Input.Password placeholder={t('password-placeholder')} {...formik.getFieldProps("password")} />
            </Form.Item>
            <Form.Item className="flex justify-center">
              <Button htmlType="submit" className="w-full">
               {t('sign-up')}
              </Button>
            </Form.Item>
            <Form.Item>
              <Link href="/login" className="text-blue-500 text-sm">
               {t('back-login')}
              </Link>
            </Form.Item>
          </Form>
        </div>
        <div className="hidden sm:flex w-1/2 flex-col justify-center items-center relative p-6">
          <div className="absolute inset-0 bg-yellow-200/60"></div>
          <h2 className="text-6xl font-bold text-[#694800] relative z-10">
          {t('welcome-message')}
          </h2>
          <img
            src="/auth/logo_brown.png"
            alt="samğa"
            className="relative z-10 w-56 h-auto mt-2"
          />
          <p className="text-[#694800] relative z-10 mt-1">
          {t('welcome-message-p')}
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