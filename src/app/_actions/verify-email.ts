
"use server";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function verifyEmailAction(prevState: any, formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const token = formData.get("token") as string;

    const res = await fetch(`${API_URL}/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, token}),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: "Server returned non-JSON" }));
      return { isSuccess: false, error: err?.message || "Verification failed" };
    }

    return { isSuccess: true };
  } catch (err: any) {
    return { isSuccess: false, error: err.message || "Server error" };
  }
}
