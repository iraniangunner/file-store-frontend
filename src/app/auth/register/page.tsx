"use client";
import { useState } from "react";
import api from "../../../lib/api";
import { setAuth } from "../../../lib/auth";
import { useRouter } from "next/navigation";
import { User } from "../../../types";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post<{ token: string; user: User }>(
        "/register",
        form
      );
      setAuth(res.data.token, res.data.user);
      router.push("/products");
    } catch (err: any) {
      alert(err?.response?.data?.message || "خطا در ثبت‌نام");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">ثبت‌نام</h2>
      <form onSubmit={submit} className="space-y-3">
        <input
          required
          placeholder="نام"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          required
          type="email"
          placeholder="ایمیل"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          required
          type="password"
          placeholder="رمز عبور"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          required
          type="password"
          placeholder="تکرار رمز عبور"
          value={form.password_confirmation}
          onChange={(e) =>
            setForm({ ...form, password_confirmation: e.target.value })
          }
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded cursor-pointer"
          disabled={loading}
        >
          {loading ? "در حال ثبت..." : "ثبت‌نام"}
        </button>
      </form>
    </div>
  );
}
