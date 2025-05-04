"use client";

import api from "@/features/page";

interface RegisterProps {
  email: string;
  password: string;
  fullName: string;  // Note: the form sends fullName, not full_name
}

export async function register(
  prevState: any,
  formData: FormData
): Promise<{ success?: boolean; error?: string; redirect?: string }> {
  try {
    const response = await api.post("/auth/register", {
      email: formData.get("email"),
      password: formData.get("password"),
      full_name: formData.get("fullName"),  // Map fullName to full_name
    });

    return { success: true, redirect: "/login" };

  } catch (error: any) {
    console.error("Registration error:", error);
    
    if (error.response) {
      if (error.response.status === 400) {
        return { error: error.response.data.detail || "Invalid registration data." };
      }
      if (error.response.status === 409) {
        return { error: "A user with this email already exists." };
      }
      return { error: error.response.data.detail || "An error occurred during registration." };
    }
    
    return { error: "Network error. Please try again later." };
  }
}

export async function APIRegister(values: RegisterProps) {
  try {
    // Map fullName to full_name for the API
    const formattedValues = {
      email: values.email,
      password: values.password,
      full_name: values.fullName,  // Important: map fullName to full_name
    };

    const response = await api.post("/auth/register", formattedValues);

    return {
      status: 200,
      data: response.data
    };
  } catch (error: any) {
    console.error("Registration error:", error);
    
    // Return more specific status codes and errors
    if (error.response) {
      return {
        status: error.response.status,
        error: error.response.data.detail || "Registration failed",
        data: error.response.data
      };
    }
    
    return {
      status: 500,
      error: "Network error. Please try again later."
    };
  }
}