"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { User } from "../../types";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import api from "../../lib/api";
import { getToken } from "@/lib/auth";
import { logoutAction } from "../actions/logout";
import { useFormState, useFormStatus } from "react-dom";

function LogoutButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      size="sm"
      disabled={pending}
      className="bg-red-500 text-white px-3 py-1 rounded cursor-pointer"
    >
      {pending ? "خروج..." : "خروج"}
    </Button>
  );
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // فرم state logout
  const [state, formAction] = useFormState(logoutAction, {
    isSuccess: false,
    error: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/token");
        const { token } = await response.json();

        const res = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data.user);
        setLoading(false);
      } catch (err) {
        setUser(null);
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // بعد از logout موفق -> ریدایرکت
  useEffect(() => {
    if (state.isSuccess) {
      setUser(null);
      router.push("/auth/login");
    }
  }, [state, router]);

  return (
    <nav className="bg-white shadow px-4 py-3 mb-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/" className="font-bold text-lg">
          FileShop
        </Link>
        <Link href="/products" className="text-sm text-gray-600">
          محصولات
        </Link>
      </div>

      {loading && !user ? (
        <p>loading...</p>
      ) : user ? (
        <form action={formAction}>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700">سلام، {user.name}</span>
            <LogoutButton />
          </div>
        </form>
      ) : (
        <div className="flex gap-2">
          <Link href="/auth/login" className="text-sm px-3 py-1 border rounded">
            ورود
          </Link>
          <Link
            href="/auth/register"
            className="text-sm px-3 py-1 bg-blue-500 text-white rounded"
          >
            ثبت‌نام
          </Link>
        </div>
      )}
    </nav>
  );
}
