"use server";

import api from "@/features";

export async function register(prevState: any, formData: FormData) {
  try {
    const response = await api.post("apis/auth/sign-up", {
      email: formData.get("email"),
      password: formData.get("password"),
      full_name: formData.get("fullName"),
    });

    return { success: true, user: response.data };
  } catch (error: any) {
    return {
      error: error.response?.data?.detail || "Failed to register. Please try again.",
    };
  }
}
