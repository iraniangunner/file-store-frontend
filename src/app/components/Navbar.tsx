"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getUser, clearAuth } from "../../lib/auth";
import { User } from "../../types";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setUser(getUser());
  }, []);

  const logout = () => {
    clearAuth();
    setUser(null);
    router.push("/auth/login");
  };

  return (
    <nav className="bg-white shadow px-4 py-3 mb-8 flex items-center justify-between">
      {/* سمت چپ */}
      <div className="flex items-center gap-4">
        <Link href="/" className="font-bold text-lg">
          FileShop
        </Link>
        <Link href="/products" className="text-sm text-gray-600">
          محصولات
        </Link>
      </div>

      {/* سمت راست */}
      <div>
        {user ? (
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 text-sm text-gray-700 focus:outline-none"
            >
              <span>سلام، {user.name}</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {open && (
              <div className="absolute right-0 mt-2 bg-white border rounded shadow-md z-50">
                {/* <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  پروفایل
                </Link> */}
                <Link
                  href="/orders"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  سفارشات
                </Link>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  خروج
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-2">
            <Link
              href="/auth/login"
              className="text-sm px-3 py-1 border rounded"
            >
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
      </div>
    </nav>
  );
}
