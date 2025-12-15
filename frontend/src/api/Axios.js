// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // your backend URL
  withCredentials: true, // 🔥 REQUIRED for cookies
});

export default api;
