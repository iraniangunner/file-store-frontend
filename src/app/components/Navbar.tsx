"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { User } from "../../types";
import { useRouter } from "next/navigation";
import {
  Button,
  Spinner,
  Dropdown,
  DropdownItem,
  DropdownTrigger,
  DropdownMenu,
} from "@heroui/react";
import api from "../../lib/api";
import { logoutAction } from "../actions/logout";
import { useFormState, useFormStatus } from "react-dom";
import { InternalAxiosRequestConfig } from "axios";

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
        const res = await api.get("/auth/me", {
          requiresAuth: true,
        } as InternalAxiosRequestConfig);

        setUser(res.data.user);
        setLoading(false);
      } catch {
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
      router.push("/auth");
    }
  }, [state, router]);

  if (loading) return <Spinner size="lg" />;

  return (
    <nav className="bg-white shadow px-4 py-3 mb-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/" className="font-bold text-lg">
          FileShop
        </Link>
        <Link href="/products" className="text-sm text-gray-600">
          Products
        </Link>
      </div>

      {user ? (
        <Dropdown>
          <DropdownTrigger>
            <Button variant="bordered">Hi {user.name}</Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="User Menu">
            <DropdownItem key={"orders"}>
              <Link href="/dashboard/orders" className="w-full block">
                Orders
              </Link>
            </DropdownItem>
            <DropdownItem key={"logout"}>
              <form action={formAction}>
                <Button type="submit" className="w-full text-left">
                  Logout
                </Button>
              </form>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      ) : (
        <div className="flex gap-2">
          <Link
            href="/auth"
            className="text-sm px-3 py-2 bg-blue-500 text-white rounded"
          >
            Login / Signup
          </Link>
        </div>
      )}
    </nav>
  );
}
