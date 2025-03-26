"use server";

import api from "@/features";

export async function login(
  prevState: any,
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const email = formData.get("username") as string;
  const password = formData.get("password") as string;

  try {
    const response = await api.post("apis/auth/sign-in", {
      email: email,
      password: password,
    });

    const { access_token, refresh_token, user } = response.data;

    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    localStorage.setItem("user", JSON.stringify(user));

    window.location.href = "/games";

    return { success: true };
  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 401) {
        return { error: "Invalid email or password. Please try again." };
      }
      return { error: error.response.data.detail || "An error occurred." };
    }

    return { error: "Network error. Please try again later." };
  }
}
