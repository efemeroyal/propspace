const BASE_URL = import.meta.env.API_BASE_URL; // Swap out with your operational backend URL

export async function client(endpoint, { body, ...customConfig } = {}) {
  const token = localStorage.getItem("prop_token");
  const headers = { "Content-Type": "application/json" };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    method: body ? "POST" : "GET",
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (response.status === 401) {
    localStorage.removeItem("prop_token");
    window.location.href = "/login";
  }

  const data = await response.json();

  if (response.ok) {
    return data;
  }

  throw new Error(
    data.message || "Something went wrong across the server connection.",
  );
}
