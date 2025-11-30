"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast, { Toaster } from "react-hot-toast";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Spinner,
  Chip,
  Divider,
  Avatar,
} from "@heroui/react";
import {
  Download,
  ShoppingBag,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Calendar,
  CreditCard,
  ArrowRight,
  Receipt,
  Sparkles,
  Filter,
} from "lucide-react";
import Link from "next/link";

interface OrderItem {
  id: number;
  product_id: number;
  title: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  items: OrderItem[];
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<{ [key: string]: boolean }>({});
  const [selectedTab, setSelectedTab] = useState("all");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders", { requiresAuth: true } as any);
        setOrders(res.data.orders || []);
      } catch {
        toast.error("Failed to load your orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleDownload = async (orderId: number, item: OrderItem) => {
    const key = `orderitem-${item.id}`;
    setDownloading((prev) => ({ ...prev, [key]: true }));

    try {
      const res = await api.get(
        `/orders/${orderId}/download/${item.product_id}`,
        {
          responseType: "blob",
          requiresAuth: true,
        } as any
      );

      let filename = "file";
      const disposition = res.headers["content-disposition"];
      if (disposition) {
        const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (match?.[1]) {
          filename = match[1].replace(/['"]/g, "");
          filename = decodeURIComponent(filename);
        }
      } else {
        const contentType = res.headers["content-type"];
        let extension = "";

        if (contentType) {
          const mimeToExt: { [key: string]: string } = {
            "application/pdf": "pdf",
            "application/zip": "zip",
            "application/x-rar-compressed": "rar",
            "image/jpeg": "jpg",
            "image/png": "png",
            "video/mp4": "mp4",
            "application/msword": "doc",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
            "application/vnd.ms-excel": "xls",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
          };
          extension = mimeToExt[contentType] || "";
        }

        filename = extension ? `${item.title}.${extension}` : item.title;
      }

      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success(`Downloaded: ${filename}`);
    } catch (err) {
      console.error("Download error:", err);
      toast.error("Download failed");
    } finally {
      setDownloading((prev) => ({ ...prev, [key]: false }));
    }
  };

  const getStatusConfig = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === "confirmed" || statusLower === "finished") {
      return {
        color: "success" as const,
        bgColor: "bg-emerald-50",
        textColor: "text-emerald-600",
        borderColor: "border-emerald-200",
        icon: <CheckCircle2 className="w-4 h-4" />,
        label: "Completed",
      };
    }
    if (statusLower === "pending") {
      return {
        color: "warning" as const,
        bgColor: "bg-amber-50",
        textColor: "text-amber-600",
        borderColor: "border-amber-200",
        icon: <Clock className="w-4 h-4" />,
        label: "Pending",
      };
    }
    if (statusLower === "cancelled") {
      return {
        color: "danger" as const,
        bgColor: "bg-rose-50",
        textColor: "text-rose-600",
        borderColor: "border-rose-200",
        icon: <XCircle className="w-4 h-4" />,
        label: "Cancelled",
      };
    }
    return {
      color: "default" as const,
      bgColor: "bg-slate-50",
      textColor: "text-slate-600",
      borderColor: "border-slate-200",
      icon: <Package className="w-4 h-4" />,
      label: status,
    };
  };

  const filteredOrders = orders.filter((order) => {
    if (selectedTab === "all") return true;
    const statusLower = order.status.toLowerCase();
    if (selectedTab === "completed")
      return statusLower === "confirmed" || statusLower === "finished";
    if (selectedTab === "pending") return statusLower === "pending";
    return false;
  });

  const completedCount = orders.filter(
    (o) => o.status.toLowerCase() === "confirmed" || o.status.toLowerCase() === "finished"
  ).length;
  const pendingCount = orders.filter((o) => o.status.toLowerCase() === "pending").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header Skeleton */}
          <div className="mb-10">
            <div className="h-10 w-48 bg-slate-200 rounded-xl animate-pulse mb-3" />
            <div className="h-5 w-64 bg-slate-100 rounded-lg animate-pulse" />
          </div>

          {/* Tabs Skeleton */}
          <div className="flex gap-2 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-11 w-32 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>

          {/* Cards Skeleton */}
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="h-6 w-32 bg-slate-200 rounded-lg animate-pulse mb-2" />
                    <div className="h-4 w-48 bg-slate-100 rounded-lg animate-pulse" />
                  </div>
                  <div className="h-8 w-24 bg-slate-200 rounded-lg animate-pulse" />
                </div>
                <div className="h-20 bg-slate-50 rounded-xl animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/50">
      <Toaster position="top-right" />

      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-violet-100/40 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-sky-100/40 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 mb-24">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl shadow-lg shadow-violet-500/25">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Orders</h1>
              <p className="text-slate-500 mt-0.5">Track and manage your purchases</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-slate-900">{orders.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                <Package className="w-6 h-6 text-slate-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">Completed</p>
                <p className="text-2xl font-bold text-emerald-600">{completedCount}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">Pending</p>
                <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <button
            onClick={() => setSelectedTab("all")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              selectedTab === "all"
                ? "bg-slate-900 text-white shadow-lg shadow-slate-900/25"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Package className="w-4 h-4" />
            All Orders
            <span className={`px-2 py-0.5 rounded-md text-xs ${
              selectedTab === "all" ? "bg-white/20" : "bg-slate-100"
            }`}>
              {orders.length}
            </span>
          </button>
          <button
            onClick={() => setSelectedTab("completed")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              selectedTab === "completed"
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            Completed
            <span className={`px-2 py-0.5 rounded-md text-xs ${
              selectedTab === "completed" ? "bg-white/20" : "bg-emerald-50 text-emerald-600"
            }`}>
              {completedCount}
            </span>
          </button>
          <button
            onClick={() => setSelectedTab("pending")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              selectedTab === "pending"
                ? "bg-amber-500 text-white shadow-lg shadow-amber-500/25"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Clock className="w-4 h-4" />
            Pending
            <span className={`px-2 py-0.5 rounded-md text-xs ${
              selectedTab === "pending" ? "bg-white/20" : "bg-amber-50 text-amber-600"
            }`}>
              {pendingCount}
            </span>
          </button>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-200 to-sky-200 rounded-full blur-2xl opacity-40" />
                <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  <ShoppingBag className="w-10 h-10 text-slate-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No orders found</h3>
              <p className="text-slate-500 mb-8 max-w-sm">
                {selectedTab === "all"
                  ? "You haven't made any purchases yet. Browse our products to get started."
                  : `You don't have any ${selectedTab} orders at the moment.`}
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-violet-600 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 hover:from-violet-600 hover:to-violet-700 transition-all duration-200"
              >
                <Sparkles className="w-5 h-5" />
                Browse Products
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              const canDownload =
                order.status.toLowerCase() === "confirmed" ||
                order.status.toLowerCase() === "finished";

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="px-6 py-5 bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-slate-900">
                            Order #{order.id}
                          </h3>
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${statusConfig.bgColor} ${statusConfig.textColor} border ${statusConfig.borderColor}`}
                          >
                            {statusConfig.icon}
                            {statusConfig.label}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                          <span className="inline-flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {new Date(order.created_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Package className="w-4 h-4" />
                            {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Total</p>
                          <p className="text-2xl font-bold text-slate-900">
                            ${order.amount}
                            <span className="text-sm font-normal text-slate-400 ml-1">
                              {order.currency?.toUpperCase()}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-3">
                      {order.items.map((item) => {
                        const key = `orderitem-${item.id}`;
                        const isDownloading = downloading[key];

                        return (
                          <div
                            key={key}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50/80 hover:bg-slate-100/80 transition-colors"
                          >
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-100 to-violet-50 flex items-center justify-center flex-shrink-0">
                                <FileText className="w-5 h-5 text-violet-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-slate-900 truncate">
                                  {item.title}
                                </p>
                                <p className="text-sm text-slate-500">
                                  Qty: {item.quantity} · ${item.price}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 sm:flex-shrink-0">
                              {canDownload ? (
                                <button
                                  onClick={() => handleDownload(order.id, item)}
                                  disabled={isDownloading}
                                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-500 to-violet-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 hover:from-violet-600 hover:to-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                >
                                  {isDownloading ? (
                                    <>
                                      <Spinner size="sm" color="white" />
                                      <span>Downloading...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Download className="w-4 h-4" />
                                      <span>Download</span>
                                    </>
                                  )}
                                </button>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-50 text-amber-600 text-sm font-medium rounded-xl border border-amber-200">
                                  <Clock className="w-4 h-4" />
                                  Awaiting Payment
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Order Footer */}
                  <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <p className="text-sm text-slate-400">
                      Order ID: <span className="font-mono text-slate-600">{order.id}</span>
                    </p>
                    <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200">
                      <Receipt className="w-4 h-4" />
                      View Invoice
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}