// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://habitcycle.onrender.com", // your backend URL
  withCredentials: true, // 🔥 REQUIRED for cookies
});

export default api;
