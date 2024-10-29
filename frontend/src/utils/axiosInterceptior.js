import axios from "axios";
const axiosInterceptor = axios.create({
  baseURL: "http://localhost:3000/api.todo",
  // baseURL: "/api",
});

axiosInterceptor.interceptors.request.use((req) => {
  if (localStorage.getItem("authToken")) {
    req.headers.Authorization = `Bearer ${localStorage.getItem("authToken")}`;
  }
  return req;
});

export default axiosInterceptor;
