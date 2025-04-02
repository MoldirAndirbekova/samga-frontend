"use client";

import { redirect } from "next/navigation";
import api from "@/features/page";

export async function register(prevState: any, formData: FormData) {
  try {
    const response = await api.post("/apis/auth/sign-up", {
      email: formData.get("email"),
      password: formData.get("password"),
      full_name: formData.get("fullName"),
    });

    redirect("/login");
    return { success: true, data: response.data};

  } catch (error: any) {
    console.error("Registration error:", error);
    return {
      error: error.response?.data?.detail || "Failed to register. Please try again.",
    };
  }
}


interface RegisterProps {
  email: string;
  password: string;
  fullName: string;
}

export async function APIRegister(values: RegisterProps) {
  const formattedValues = {
      email: values.email,
      password: values.password,
      full_name: values.fullName, // Convert fullName to full_name
  };

  const response = await api.post("apis/auth/sign-up", formattedValues);

  return response;
}
