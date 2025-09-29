import Cookies from "js-cookie";
import { User } from "../types";

export function setAuth(access_token: string, refresh_token:string, user: User) {
  Cookies.set("access_token", access_token, { expires: 7, sameSite: "Lax" });
  Cookies.set("refresh_token", refresh_token, { expires: 7*24*30, sameSite: "Lax" });
  Cookies.set("user", JSON.stringify(user), { expires: 7, sameSite: "Lax" })
}

export function clearAuth() {
  Cookies.remove("access_token");
  Cookies.remove("refresh_token");
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
  return Cookies.get("access_token") || null;
}
