"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;
const HCAPTCHA_SECRET = process.env.NEXT_PUBLIC_HCAPTCHA_SECRET_KEY!;

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

type RegisterResp = {
  access_token: string;
  refresh_token: string;
  expires_in: number; // ثانیه
};

export async function registerAction(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const password_confirmation = formData.get("password_confirmation") as string;
  const token = formData.get("h-captcha-response") as string;

  // Basic validation
  if (!name || !email || !password || !password_confirmation) {
    return { isSuccess: false, error: "Enter the username and password" };
  }

  if (!token) {
    return { isSuccess: false, error: "Please complete the hCaptcha." };
  }

  // ✅ Step 1: Verify hCaptcha
  try {
    const verifyRes = await fetch("https://hcaptcha.com/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${HCAPTCHA_SECRET}&response=${token}`,
    });

    const verifyData = await verifyRes.json();

    if (!verifyData.success) {
      return { isSuccess: false, error: "hCaptcha verification failed." };
    }
  } catch (err) {
    return { isSuccess: false, error: "Error verifying hCaptcha." };
  }

  // ✅ مرحله دوم: لاگین به API
  try {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, password_confirmation }),
    });

    if (!res.ok) {
      return { isSuccess: false, error: "Email or password is invalid" };
    }

    const data = (await res.json()) as RegisterResp;
    const c = await cookies();

    const expiresAt = Date.now() + data.expires_in * 1000;

    // ست کردن کوکی‌ها
    c.set("access_token", data.access_token, {
      ...cookieBase,
      maxAge: data.expires_in,
    });
    c.set("refresh_token", data.refresh_token, {
      ...cookieBase,
      maxAge: 7 * 24 * 60 * 60, // ۷ روز
    });
    c.set("expires_at", String(expiresAt), {
      ...cookieBase,
      maxAge: data.expires_in,
    });

    return { isSuccess: true, error: "" };
  } catch (error) {
    return { isSuccess: false, error: "Register failed" };
  }
}
