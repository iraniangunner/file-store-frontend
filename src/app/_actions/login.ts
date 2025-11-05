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

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const token = formData.get("h-captcha-response") as string;

  // Basic validation
  if (!email || !password) {
    return { isSuccess: false, error: "Enter the username and password" };
  }

  if (!token) {
    return { isSuccess: false, error: "Please complete the hCaptcha." };
  }

  try {
    const verifyRes = await fetch("https://hcaptcha.com/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
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
    // const guestToken = localStorage.getItem("guest_token");
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
          // ...(guestToken ? { "X-Guest-Token": guestToken } : {}), 
        // "X-Guest-Token": localStorage.getItem("guest_token") || "",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json().catch(() => ({})); // فقط یه بار parse JSON

    if (!res.ok) {
      if (res.status === 403 && data.requiresVerification) {
        return {
          isSuccess: false,
          redirectToVerify: true,
          email: data.email,
          error: data.message || "Your email is not verified.",
        };
      }

      if (res.status === 401) {
        return {
          isSuccess: false,
          error: data.message || "Email or password is invalid",
        };
      }

      return {
        isSuccess: false,
        error: data.message || "Login failed. Please try again later.",
      };
    }

    // ✅ اگر به اینجا رسید یعنی لاگین موفق بوده
    const c = await cookies();

    const expiresAt = Date.now() + data.expires_in * 1000;

    c.set("access_token", data.access_token, {
      ...cookieBase,
      maxAge: data.expires_in,
    });
    c.set("refresh_token", data.refresh_token, {
      ...cookieBase,
      maxAge: 7 * 24 * 60 * 60, // 7 روز
    });
    c.set("expires_at", String(expiresAt), {
      ...cookieBase,
      maxAge: data.expires_in,
    });

    return { isSuccess: true, error: "" };
  } catch (error) {
    return { isSuccess: false, error: "Login failed. Please try again later." };
  }
}
