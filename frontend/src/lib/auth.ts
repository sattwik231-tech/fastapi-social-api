import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "../types/api";

const TOKEN_KEY = "access_token";
const USER_KEY = "user";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getUserIdFromToken(): number | null {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = jwtDecode<JwtPayload>(token);
    return payload.user_id ?? null;
  } catch {
    return null;
  }
}

export function isTokenExpired(): boolean {
  const token = getToken();
  if (!token) return true;
  try {
    const { exp } = jwtDecode<JwtPayload>(token);
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
}

export function cacheUser(user: { id: number; email: string }): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getCachedUser(): { id: number; email: string } | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as { id: number; email: string };
  } catch {
    return null;
  }
}
