"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "../../lib/api";
import { Order } from "../../types";

export default function PaymentSuccessPage() {
  const params = useSearchParams();
  const orderId = params.get("order_id");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    setLoading(true);
    api
      .get<Order>(`/orders/${orderId}`)
      .then((res) => setOrder(res.data))
      .finally(() => setLoading(false));
  }, [orderId]);

  async function handleDownload() {
    if (!order) return;
    try {
      const res = await api.get(`/orders/${order.id}/download`, {
        responseType: "blob",
      });
      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "file.pdf"; // یا از متادیتا بگیری
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("خطا در دانلود فایل");
    }
  }

  if (loading) return <div className="text-center">در حال بارگذاری...</div>;
  if (!order)
    return <div className="text-center text-red-500">سفارش یافت نشد</div>;

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow text-center">
      <h1 className="text-2xl font-bold mb-3">پرداخت موفق 🎉</h1>
      <p className="mb-4 text-gray-600">
        سفارش شما با موفقیت ثبت شد. وضعیت:{" "}
        <span className="font-semibold">{order.status}</span>
      </p>
      {["finished", "confirmed"].includes(order.status) ? (
        <button
          onClick={handleDownload}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          دانلود فایل
        </button>
      ) : (
        <p className="text-yellow-600">پرداخت هنوز در حال تأیید است...</p>
      )}
    </div>
  );
}
