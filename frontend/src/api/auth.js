import { client } from "./client";

export const authAPI = {
  login: (credentials) =>
    client("/auth/login", { body: credentials, method: "POST" }),
  register: (userData) =>
    client("/auth/register", { body: userData, method: "POST" }),
  getProfile: () => client("/auth/profile"),
  updateProfile: (metrics) =>
    client("/auth/profile", { body: metrics, method: "PUT" }),
  updatePassword: (passwords) =>
    client("/auth/profile/password", { body: passwords, method: "PUT" }),
};
