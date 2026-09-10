import { TOKEN_KEY } from "../features/auth/auth.context";

const API_BASE_URL = "http://localhost:3000";

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();

    throw new Error(error.message || "Something went wrong");
  }

  if (response.status === 204) {
    return undefined as unknown as T;
  }

  return response.json();
}
