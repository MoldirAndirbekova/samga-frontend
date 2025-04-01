"use client";

import api from "@/features/page";

// export async function login(
//   prevState: any,
//   formData: FormData
// ): Promise<{ success?: boolean; error?: string; redirect?: string }> {
//   const email = formData.get("username") as string;
//   const password = formData.get("password") as string;

//   try {
//     // const response = await api.post("apis/auth/sign-in", {
//     //   email: email,
//     //   password: password,
//     // });

//     // const { access_token, refresh_token, user } = response.data;
//     const access_token = "123";
//     const refresh_token = "123";
//     const user = {
//       id: 1,
//       username: "test",
//       email: "test@test.com",
//     };

//     localStorage.setItem("access_token", access_token);
//     localStorage.setItem("refresh_token", refresh_token);
//     localStorage.setItem("user", JSON.stringify(user));
//     // const router = useRouter();

//     // router.push("/games");
    
//     return { success: true, redirect: "/games" };
//   } catch (error: any) {
//     if (error.response) {
//       if (error.response.status === 401) {
//         return { error: "Invalid email or password. Please try again." };
//       }
//       return { error: error.response.data.detail || "An error occurred." };
//     }

//     return { error: "Network error. Please try again later." };
//   }
// }

interface LoginProps {
  email: string;
  password: string;
}

export async function APILogin(values: LoginProps) {

    // Рабочий запрос на сервер
    const response = await api.post("apis/auth/sign-in", {
      email: values.email,
      password: values.password,
    });

    const { access_token, refresh_token, user } = response.data;


    // Только для тестов без запроса на сервер
    // const access_token = "123";
    // const refresh_token = "123";
    // const user = {
    //   id: 1,
    //   username: "test",
    //   email: "test@test.com",
    // };

    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    localStorage.setItem("user", JSON.stringify(user));

    return response;
}
