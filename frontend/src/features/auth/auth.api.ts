import { apiFetch } from "../../services/api";
import type { AuthUser, LoginCredentials, LoginResponse } from "./auth.types";

export function Login(credentials: LoginCredentials) {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export function getCurrentUser(token: string) {
    return apiFetch<AuthUser>("/auth/me", {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
}
