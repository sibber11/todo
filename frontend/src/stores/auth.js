import { defineStore } from "pinia";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
  }),
  actions: {
    async login(username, password) {
      const res = await api.post("/auth/login", { username, password });
      this.token = res.data.token;
      this.user = res.data.user;
      localStorage.setItem("token", this.token);
      localStorage.setItem("user", JSON.stringify(this.user));
      api.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
    },
    async register(username, password) {
      await api.post("/auth/register", { username, password });
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      delete api.defaults.headers.common["Authorization"];
    },
    init() {
      if (this.token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
      }
    },
  },
});

export { api };
