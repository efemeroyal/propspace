import { client } from "./client";

export const authAPI = {
  login: (credentials) =>
    client("/auth/login", { body: credentials, method: "POST" }),
  register: (userData) =>
    client("/auth/register", { body: userData, method: "POST" }),
  getProfile: () => client("/users/me"),
  updateProfile: (metrics) =>
    client("/users/me", { body: metrics, method: "PUT" }),
  updatePassword: (passwords) =>
    client("/users/me/password", { body: passwords, method: "PUT" }),
};
