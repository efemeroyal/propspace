import { client } from "./client";

export const propertiesAPI = {
  getAll: (filters = "") => client(`/properties?${filters}`),
  getMine: () => client("/properties/mine"),
  create: (data) => client("/properties", { body: data, method: "POST" }),
  update: (id, data) =>
    client(`/properties/${id}`, { body: data, method: "PUT" }),
  delete: (id) => client(`/properties/${id}`, { method: "DELETE" }),
};
