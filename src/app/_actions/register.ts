"use server";


const API_URL = process.env.NEXT_PUBLIC_API_URL!;
const HCAPTCHA_SECRET = process.env.NEXT_PUBLIC_HCAPTCHA_SECRET_KEY!;

export async function registerAction(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const password_confirmation = formData.get("password_confirmation") as string;
  const token = formData.get("h-captcha-response") as string;

  if (!name || !email || !password || !password_confirmation) {
    return { isSuccess: false, error: "Enter the username and password" };
  }

  if (!token) {
    return { isSuccess: false, error: "Please complete the hCaptcha." };
  }

  // ✅ Verify hCaptcha
  const verifyRes = await fetch("https://hcaptcha.com/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `secret=${HCAPTCHA_SECRET}&response=${token}`,
  });
  const verifyData = await verifyRes.json();
  if (!verifyData.success) {
    return { isSuccess: false, error: "hCaptcha verification failed." };
  }

  // ✅ Register user
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, password_confirmation }),
  });

  if (!res.ok) {
    const err = await res.json();
    return {
      isSuccess: false,
      error: err?.errors ? JSON.stringify(err.errors) : "Register failed",
    };
  }

  const data = await res.json();
  return { isSuccess: true, user: data.user }; // فقط کاربر و پیام برگردان
}