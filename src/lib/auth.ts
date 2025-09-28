import Cookies from "js-cookie";
import { User } from "../types";

export function setAuth(token: string, user: User) {
  Cookies.set("token", token, { expires: 7, sameSite: "Lax" });
  Cookies.set("user", JSON.stringify(user), { expires: 7, sameSite: "Lax" });
}

export function clearAuth() {
  Cookies.remove("token");
  Cookies.remove("user");
}

export function getUser(): User | null {
  try {
    const u = Cookies.get("user");
    return u ? JSON.parse(u) : null;
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  return Cookies.get("token") || null;
}

// import { User } from "../types";

// let accessToken: string | null = null;
// let currentUser: User | null = null;

// export function setAuth(token: string, user: User) {
//   accessToken = token;   // فقط در memory نگه داشته می‌شود
//   currentUser = user;
// }

// export function clearAuth() {
//   accessToken = null;
//   currentUser = null;
// }

// export function getUser(): User | null {
//   return currentUser;
// }

// export function getToken(): string | null {
//   return accessToken;
// }
