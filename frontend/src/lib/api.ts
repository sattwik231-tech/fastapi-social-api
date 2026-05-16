import { clearAuth, getToken } from "./auth";
import type {
  ApiError,
  Post,
  PostCreate,
  PostOut,
  TokenResponse,
  User,
  VotePayload,
} from "../types/api";

const BASE_URL = import.meta.env.VITE_API_URL ?? "";

async function parseError(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as ApiError;
    if (typeof data.detail === "string") return data.detail;
    if (Array.isArray(data.detail)) {
      return data.detail.map((d) => d.msg).join(", ");
    }
  } catch {
    /* ignore */
  }
  return res.statusText || "Something went wrong";
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  auth = false
): Promise<T> {
  const headers = new Headers(options.headers);

  if (auth) {
    const token = getToken();
    if (!token) throw new Error("Not authenticated");
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401 && auth) {
    clearAuth();
    window.location.href = "/login";
    throw new Error("Session expired");
  }

  if (!res.ok) {
    throw new Error(await parseError(res));
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  register(email: string, password: string) {
    return request<User>(
      "/users/",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      },
      false
    );
  },

  login(email: string, password: string) {
    const body = new URLSearchParams();
    body.set("username", email);
    body.set("password", password);
    return request<TokenResponse>(
      "/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      },
      false
    );
  },

  getUser(id: number) {
    return request<User>(`/users/${id}`, {}, false);
  },

  getPosts(params: { limit?: number; skip?: number; search?: string }) {
    const q = new URLSearchParams();
    if (params.limit != null) q.set("limit", String(params.limit));
    if (params.skip != null) q.set("skip", String(params.skip));
    if (params.search) q.set("search", params.search);
    const query = q.toString();
    return request<PostOut[]>(`/posts/?${query}`, {}, true);
  },

  getPost(id: number) {
    return request<PostOut>(`/posts/${id}`, {}, true);
  },

  createPost(data: PostCreate) {
    return request<Post>(
      "/posts/",
      { method: "POST", body: JSON.stringify(data) },
      true
    );
  },

  updatePost(id: number, data: PostCreate) {
    return request<Post>(
      `/posts/${id}`,
      { method: "PUT", body: JSON.stringify(data) },
      true
    );
  },

  deletePost(id: number) {
    return request<void>(`/posts/${id}`, { method: "DELETE" }, true);
  },

  vote(payload: VotePayload) {
    return request<{ message: string }>(
      "/vote/",
      { method: "POST", body: JSON.stringify(payload) },
      true
    );
  },
};
