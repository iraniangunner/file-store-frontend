"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function logoutAction(prevState: any, formData: FormData) {
  const c = await cookies();
  let accessToken = c.get("access_token")?.value;
  const refreshToken = c.get("refresh_token")?.value;

  try {
    // اگر access_token نبود → سعی کن refresh کنی
    if (!accessToken && refreshToken) {
      const refreshRes = await fetch(`${API_URL}/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (refreshRes.ok) {
        const data = await refreshRes.json();
        accessToken = data.access_token;

        // آپدیت توکن جدید تو کوکی
        c.set("access_token", accessToken ?? "", {
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        });
      }
    }

    // الان access_token باید داشته باشیم
    if (!accessToken) {
      return { isSuccess: false, error: "No token available to logout" };
    }

    // درخواست logout به سرور لاراول
    const res = await fetch(`${API_URL}/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // در هر صورت کوکی‌ها رو پاک کن
    const domain =
      process.env.NODE_ENV === "production" ? ".yourdomain.com" : undefined;

    ["access_token", "refresh_token", "expires_at"].forEach((name) => {
      c.set({
        name,
        value: "",
        path: "/",
        domain,
        expires: new Date(0),
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
      });
    });

    if (res.ok) {
      return { isSuccess: true, error: "" };
    } else {
      return { isSuccess: false, error: "Logout failed" };
    }
  } catch (err) {
    console.error("Logout failed:", err);
    return { isSuccess: false, error: "Network error occurred" };
  }
}
