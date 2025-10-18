
"use server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

const cookieBase = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  secure: false,
};

// const cookieBase = {
//   httpOnly: true,
//   sameSite: "none" as const,
//   path: "/",
//   secure: true,
//   domain: ".filerget.com",
// };

export async function verifyEmailAction(prevState: any, formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const token = formData.get("token") as string;
    const password = formData.get("password") as string;

    const res = await fetch(`${API_URL}/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, token, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: "Server returned non-JSON" }));
      return { isSuccess: false, error: err?.message || "Verification failed" };
    }

    const data = await res.json();

    const c = await cookies();
    const expiresAt = Date.now() + data.expires_in * 1000;
    c.set("access_token", data.access_token, { ...cookieBase, maxAge: data.expires_in });
    c.set("refresh_token", data.refresh_token, { ...cookieBase, maxAge: 7 * 24 * 60 * 60 });
    c.set("expires_at", String(expiresAt), { ...cookieBase, maxAge: data.expires_in });

    return { isSuccess: true };
  } catch (err: any) {
    return { isSuccess: false, error: err.message || "Server error" };
  }
}
