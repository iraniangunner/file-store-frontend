"use client";
import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow text-center">
      <h1 className="text-2xl font-bold text-red-600 mb-3">پرداخت لغو شد ❌</h1>
      <p className="mb-4 text-gray-600">
        متأسفانه پرداخت شما تکمیل نشد. می‌توانید دوباره تلاش کنید.
      </p>
      <Link
        href="/products"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        بازگشت به فروشگاه
      </Link>
    </div>
  );
}
