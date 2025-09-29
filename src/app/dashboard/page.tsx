
"use client";

import { useEffect, useState } from "react";
import api from "../../lib/api";
import toast from "react-hot-toast";
import { Order } from "@/types";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { getToken } from "@/lib/auth";

export default function OrdersPage() {
  useAuthGuard();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/token");
        const { token } = await response.json();
        const res = await api.get<Order[]>("/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err: any) {
        if (err.response?.status === 401) {
          toast.error("لطفا ابتدا وارد شوید");
        } else {
          toast.error("خطایی رخ داد");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p className="p-4">در حال بارگذاری...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">سفارش‌های من</h1>
      {orders.length === 0 ? (
        <p>هیچ سفارشی ثبت نکردی.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">محصول</th>
                <th className="p-3">مبلغ</th>
                <th className="p-3">وضعیت</th>
                <th className="p-3">تاریخ</th>
                <th className="p-3">دانلود</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3">{order.id}</td>
                  <td className="p-3">{order.product?.title}</td>
                  <td className="p-3">
                    {order.amount} {order.currency.toUpperCase()}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        order.status === "finished" ||
                        order.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "waiting"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {new Date(order.created_at).toLocaleDateString("fa-IR")}
                  </td>
                  <td className="p-3">
                    {order.download_url ? (
                      <a
                        href={order.download_url}
                        className="px-3 py-1 rounded bg-blue-600 text-white text-xs hover:bg-blue-700"
                      >
                        دانلود
                      </a>
                    ) : (
                      <span className="text-gray-400 text-xs">غیرفعال</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
