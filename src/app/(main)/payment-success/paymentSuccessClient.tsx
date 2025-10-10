"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "../../../lib/api";
import { Order } from "../../../types";
import { InternalAxiosRequestConfig } from "axios";

export default function PaymentSuccessClientPage() {
  const params = useSearchParams();
  const router = useRouter();
  const orderId = params.get("order_id");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await api.get<Order>(`/orders/${orderId}`, {
          requiresAuth: true,
        } as InternalAxiosRequestConfig);
        setOrder(res.data);
      } catch {
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  // ری‌دایرکت خودکار به داشبورد بعد از 5 ثانیه
  useEffect(() => {
    if (order) {
      const timer = setTimeout(() => {
        router.push("/dashboard/orders");
      }, 5000); // 5 ثانیه
      return () => clearTimeout(timer);
    }
  }, [order, router]);

  if (loading) return <div className="text-center">Loading...</div>;
  if (!order)
    return <div className="text-center text-red-500">Order not found</div>;

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow text-center">
      <h1 className="text-2xl font-bold mb-3">Payment Successful 🎉</h1>
      <p className="mb-2 text-gray-600">
        Your order has been successfully placed. Status:{" "}
        <span className="font-semibold">{order.status}</span>
      </p>
      <p className="text-gray-500 text-sm mt-2">
        You will be redirected to your dashboard in 5 seconds.
      </p>
    </div>
  );
}
