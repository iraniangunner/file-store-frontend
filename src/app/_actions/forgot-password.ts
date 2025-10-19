"use server";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function forgotPasswordAction(prevState: any, formData: FormData) {
  try {
    const email = formData.get("email") as string;

    const res = await fetch(`${API_URL}/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: "Server returned non-JSON" }));
      return { isSuccess: false, error: err?.message || "Failed to send reset link" };
    }

    return { isSuccess: true };
  } catch (err: any) {
    return { isSuccess: false, error: err.message || "Server error" };
  }
}
