"use server";

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
