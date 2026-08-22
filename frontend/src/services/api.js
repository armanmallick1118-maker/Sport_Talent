import axios from "axios";
import { getAuth } from "firebase/auth";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    (import.meta.env.MODE === "production" ? "https://soprttelent-production.up.railway.app" : "http://localhost:8000"),
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(
  async (config) => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser) {
        // Retrieve fresh Firebase ID token
        const token = await currentUser.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn("Firebase Auth not initialized yet or user unauthenticated:", error.message);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default API;