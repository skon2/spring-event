import { AuthResponse } from "./types";

export const API_BASE = "http://localhost:8082";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

export function saveAuth(data: AuthResponse) {
  localStorage.setItem("access_token", data.access_token);
  localStorage.setItem("refresh_token", data.refresh_token);
}

export function clearAuth() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

export function getRole(): "ADMIN" | "CLIENT" | null {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    // Spring sets roles as "ROLE_ADMIN" or "ROLE_CLIENT"
    if (payload.authorities?.some((a: string) => a === "ROLE_ADMIN")) return "ADMIN";
    if (payload.authorities?.some((a: string) => a === "ROLE_CLIENT")) return "CLIENT";
    return null;
  } catch {
    return null;
  }
}

export function getUserEmail(): string | null {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub ?? null;
  } catch {
    return null;
  }
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(text || `HTTP ${res.status}`);
  }
  // 204 no content
  if (res.status === 204) return undefined as unknown as T;
  return res.json();
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    apiFetch<{ access_token: string; refresh_token: string }>("/apii/auth/authenticate", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (body: { firstName: string; lastName: string; email: string; password: string }) =>
    apiFetch<{ access_token: string; refresh_token: string }>("/apii/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  logout: () =>
    apiFetch<void>("/apii/auth/logout", { method: "POST" }),

  // Events
  getEvents: () => apiFetch<import("./types").Event[]>("/api/events"),
  getEvent: (id: number) => apiFetch<import("./types").Event>(`/api/events/${id}`),
  createEvent: (event: Partial<import("./types").Event>) =>
    apiFetch<import("./types").Event>("/api/events", {
      method: "POST",
      body: JSON.stringify(event),
    }),
  updateEvent: (id: number, event: Partial<import("./types").Event>) =>
    apiFetch<import("./types").Event>(`/api/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(event),
    }),
  deleteEvent: (id: number) =>
    apiFetch<void>(`/api/events/${id}`, { method: "DELETE" }),
  likeEvent: (id: number) =>
    apiFetch<import("./types").Event>(`/api/events/${id}/like`, { method: "PUT" }),
  dislikeEvent: (id: number) =>
    apiFetch<import("./types").Event>(`/api/events/${id}/dislike`, { method: "PUT" }),
  getEventsByLocation: (location: string) =>
    apiFetch<import("./types").Event[]>(`/api/events/Same/${encodeURIComponent(location)}`),

  // Feedback
  getFeedbacks: () => apiFetch<import("./types").FeedBack[]>("/api/feedback"),
  getFeedbacksByEvent: (eventId: number) =>
    apiFetch<import("./types").FeedBack[]>(`/api/feedback/event/${eventId}`),
  getMyFeedbacks: () => apiFetch<import("./types").FeedBack[]>("/api/feedback/my"),
  addFeedback: (eventId: number, body: { message: string; rate: number }) =>
    apiFetch<import("./types").FeedBack>(`/api/feedback/event/${eventId}`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  updateFeedback: (feedbackId: number, body: { message: string; rate: number }) =>
    apiFetch<import("./types").FeedBack>(`/api/feedback/${feedbackId}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  deleteFeedback: (feedbackId: number) =>
    apiFetch<string>(`/api/feedback/${feedbackId}`, { method: "DELETE" }),

  // User
  getConnectedUser: () => apiFetch<import("./types").User>("/api/getConnecteduser"),
};

// SWR fetcher (requires auth header)
export function authFetcher(url: string) {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  return fetch(`${API_BASE}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  }).then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    if (r.status === 204) return null;
    return r.json();
  });
}
