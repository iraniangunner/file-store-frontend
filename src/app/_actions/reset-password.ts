"use server";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function resetPasswordAction(prevState: any, formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const token = formData.get("token") as string;
    const password = formData.get("password") as string;
    const password_confirmation = formData.get("password_confirmation") as string;

    // ارسال درخواست به لاراول
    const res = await fetch(`${API_URL}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, token, password, password_confirmation }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: "Server returned non-JSON" }));
      return { isSuccess: false, error: err?.message || "Reset password failed" };
    }

    return { isSuccess: true };
  } catch (err: any) {
    return { isSuccess: false, error: err.message || "Server error" };
  }
}
