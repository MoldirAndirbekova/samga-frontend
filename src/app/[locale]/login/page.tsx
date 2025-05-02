"use client";

import "@ant-design/v5-patch-for-react-19";
import { useState } from "react";
import { Button, Input, Form } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { APILogin } from "@/components/actions/login-action";
import Link from "next/link";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import LanguageSwitcher2 from "@/components/LanguageSwitcher2";

export default function LoginPage() {
  const t = useTranslations("LoginPage");
  const router = useRouter();
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
      } else {
        setError(t("error"));
      }
    },
  });

  return (
    <div
      className="flex h-screen w-full items-center justify-center px-4 sm:px-0"
      style={{
        backgroundImage: "url('/auth/login_background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex flex-col sm:flex-row w-full max-w-5xl rounded-xl shadow-lg overflow-hidden bg-white">
        <div className="w-full sm:w-1/2 p-6 sm:p-8">
          <div className="relative flex justify-end mb-10 sm:mb-20">
            <LanguageSwitcher2 />
          </div>

          <Form
            layout="vertical"
            className="font-semibold"
            requiredMark={false}
            onFinish={formik.handleSubmit}
          >
            {error && <p className="text-red-500">{error}</p>}
            <Form.Item
              name="username"
              label={t('email')}
              rules={[{ required: true, message: t('email-required') }]}
            >
              <Input
                type="email"
                placeholder={t('email-placeholder')}
                {...formik.getFieldProps("email")}
              />
            </Form.Item>
            <Form.Item
              name="password"
              label={t('password')}
              rules={[
                { required: true, message: t('password-required') },
              ]}
            >
              <Input.Password
                placeholder={t('password-placeholder')}
                {...formik.getFieldProps("password")}
              />
            </Form.Item>
            <div className="flex justify-between mb-4">
              <Link href="/password-recovery" className="text-blue-500 text-sm">
                {t("forget_password")}
              </Link>
            </div>
            <div>
              <p className="mb-2">
               {t('register')}{" "}
                <Link href="/register" className="underline text-black text-sm">
                  {t('register-link')}
                </Link>
              </p>
              <Button
                className="w-full sm:w-1/2 flex items-center justify-center gap-2 mb-6"
                icon={<GoogleOutlined />}
              >
               {t('sign-with-google')}
              </Button>
            </div>
            <Form.Item className="flex justify-center">
              <Button htmlType="submit" className="w-full">
              {t('sign-in')}
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className="hidden sm:flex w-1/2 flex-col justify-center items-center relative p-6">
          <div className="absolute inset-0 bg-yellow-200/60"></div>
          <h2 className="text-6xl font-bold text-[#FFF5E1] relative z-10">
            {t('welcome-message')}
          </h2>
          <img
            src="/auth/logo_white.png"
            alt="samğa"
            className="relative z-10 w-56 h-auto mt-2"
          />
          <p className="text-[#FFF5E1] relative z-10 mt-1">
            {t('welcome-message-p')}
          </p>
          <img
            src="/auth/login_welcome.png"
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
