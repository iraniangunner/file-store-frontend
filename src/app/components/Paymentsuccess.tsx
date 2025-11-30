"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "../../lib/api";
import { Order } from "../../types";
import { InternalAxiosRequestConfig } from "axios";
import {
  CheckCircle2,
  Package,
  ArrowRight,
  Sparkles,
  Download,
  Receipt,
  Clock,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { Spinner } from "@heroui/react";

export default function PaymentSuccess() {
  const params = useSearchParams();
  const router = useRouter();
  const orderId = params.get("order_id");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(5);

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

  // Countdown and redirect
  useEffect(() => {
    if (!order) return;

    const countdownTimer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          router.push("/dashboard/orders");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownTimer);
  }, [order, router]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p className="text-slate-500">Loading order details...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50/30 flex items-center justify-center p-4">
        {/* Background decoration */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-rose-200/40 via-transparent to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-slate-200/40 via-transparent to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-1 group">
              <span className="text-2xl font-bold bg-gradient-to-r from-sky-500 to-sky-600 bg-clip-text text-transparent">
                Filer
              </span>
              <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-violet-700 bg-clip-text text-transparent">
                Get
              </span>
            </Link>
          </div>

          {/* Error Card */}
          <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/50 p-8 sm:p-10 text-center">
            <div className="relative mb-6 inline-block">
              <div className="absolute inset-0 bg-rose-200 rounded-full blur-xl opacity-50" />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-rose-400 to-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/30">
                <AlertCircle className="w-10 h-10 text-white" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 mb-3">
              Order Not Found
            </h1>
            <p className="text-slate-500 mb-8">
              We couldn't find the order you're looking for. It may have been
              removed or the link is incorrect.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/dashboard/orders"
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
              >
                <Package className="w-5 h-5" />
                View Orders
              </Link>
              <Link
                href="/products"
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/25 transition-all"
              >
                <Sparkles className="w-5 h-5" />
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success State
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-emerald-200/40 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-sky-200/40 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      {/* Confetti-like decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-20 left-[20%] w-3 h-3 bg-amber-400 rounded-full animate-bounce"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="absolute top-32 right-[25%] w-2 h-2 bg-violet-400 rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
        />
        <div
          className="absolute top-40 left-[30%] w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
          style={{ animationDelay: "0.4s" }}
        />
        <div
          className="absolute top-24 right-[30%] w-3 h-3 bg-sky-400 rounded-full animate-bounce"
          style={{ animationDelay: "0.6s" }}
        />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-1 group">
            <span className="text-2xl font-bold bg-gradient-to-r from-sky-500 to-sky-600 bg-clip-text text-transparent">
              Filer
            </span>
            <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-violet-700 bg-clip-text text-transparent">
              Get
            </span>
            <Sparkles className="w-4 h-4 text-amber-400 ml-1" />
          </Link>
        </div>

        {/* Success Card */}
        <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/50 overflow-hidden">
          {/* Header */}
          <div className="p-8 sm:p-10 text-center">
            {/* Success Icon */}
            <div className="relative mb-6 inline-block">
              <div className="absolute inset-0 bg-emerald-200 rounded-full blur-xl opacity-60 animate-pulse" />
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-slate-900 mb-3">
              Payment Successful!
            </h1>
            <p className="text-slate-500 text-lg">
              Thank you for your purchase. Your order has been confirmed.
            </p>
          </div>

          {/* Order Details */}
          <div className="px-8 sm:px-10 pb-6">
            <div className="bg-slate-50 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Order ID</span>
                <span className="text-sm font-semibold text-slate-900 font-mono">
                  #{orderId}
                </span>
              </div>
              {order.amount && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Amount Paid</span>
                  <span className="text-sm font-semibold text-emerald-600">
                    ${order.amount} {order.currency?.toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Status</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Confirmed
                </span>
              </div>
            </div>
          </div>

          {/* What's Next */}
          <div className="px-8 sm:px-10 pb-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              What's next?
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 bg-violet-50 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                  <Download className="w-4 h-4 text-violet-600" />
                </div>
                <span className="text-sm text-slate-700">
                  Download your files from the orders page
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-sky-50 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center">
                  <Receipt className="w-4 h-4 text-sky-600" />
                </div>
                <span className="text-sm text-slate-700">
                  Receipt has been sent to your email
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-8 sm:px-10 pb-8 sm:pb-10 space-y-4">
            <Link
              href="/dashboard/orders"
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 transition-all duration-200"
            >
              <Package className="w-5 h-5" />
              Go to My Orders
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/products"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
            >
              Continue Shopping
            </Link>
          </div>

          {/* Redirect Notice */}
          <div className="px-8 sm:px-10 pb-6 border-t border-slate-100 pt-4">
            <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
              <Clock className="w-4 h-4" />
              <span>
                Redirecting to orders in{" "}
                <span className="font-semibold text-slate-600">
                  {countdown}s
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
