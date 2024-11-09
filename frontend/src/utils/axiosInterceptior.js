import axios from "axios";
const axiosInterceptor = axios.create({
  baseURL: "https://digiaccel-todoapp-backend.onrender.com/api",
  // baseURL: "http://localhost:3000/api",
  // baseURL: "/api",
});

axiosInterceptor.interceptors.request.use((req) => {
  if (localStorage.getItem("authToken")) {
    req.headers.Authorization = `Bearer ${localStorage.getItem("authToken")}`;
  }
  return req;
});

export default axiosInterceptor;
