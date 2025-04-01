import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});


api.interceptors.request.use((config) => {
  const access_token = localStorage.getItem("access_token");
  if (access_token) {
    config.headers.Authorization = `Bearer ${access_token}`;
    return config;
  } else {
    window.location.href = "/login";
    return config;
  }
});

api.interceptors.response.use((response) => {
  if (response.status === 403) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/login";
  }
  return response;
});


export default api;


