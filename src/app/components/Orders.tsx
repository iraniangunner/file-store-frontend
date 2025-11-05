"use client";
import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import toast, { Toaster } from "react-hot-toast";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Spinner,
} from "@heroui/react";
import { Download, ShoppingBag } from "lucide-react";

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
  const [downloading, setDownloading] = useState<{ [key: string]: boolean }>(
    {}
  );

  // 🟢 گرفتن سفارش‌ها
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

  // 🟢 دانلود فایل

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

      // 📦 استخراج نام فایل از هدر Content-Disposition (که سرور فرستاده)
      let filename = "file";
      const disposition = res.headers["content-disposition"];
      if (disposition) {
        const match = disposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        );
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
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
              "docx",
            "application/vnd.ms-excel": "xls",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
              "xlsx",
          };
          extension = mimeToExt[contentType] || "";
        }

        filename = extension ? `${item.title}.${extension}` : item.title;
      }

      // 🧾 ساخت لینک دانلود
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

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <Spinner size="lg" />
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Toaster />
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <ShoppingBag className="w-6 h-6 text-blue-500" />
        My Orders
      </h1>

      {orders.length === 0 ? (
        <p className="text-gray-600 text-center">
          You haven't made any purchases yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order) => (
            <Card key={order.id} className="shadow-md border border-gray-200">
              <CardHeader className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">Order #{order.id}</h3>
                  <p className="text-sm text-gray-500">
                    Date:{" "}
                    {new Date(order.created_at).toLocaleDateString("en-US")}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      order.status === "finished" ||
                      order.status === "confirmed"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.status}
                  </span>
                  <p className="font-semibold text-sm mt-1">
                    Amount: {order.amount} {order.currency?.toUpperCase()}
                  </p>
                </div>
              </CardHeader>

              <CardBody>
                <div className="space-y-4">
                  {order.items.map((item) => {
                    const key = `orderitem-${item.id}`;
                    const canDownload =
                      order.status === "confirmed" ||
                      order.status === "finished";

                    return (
                      <div
                        key={key}
                        className="flex justify-between items-center border-b border-gray-100 pb-3"
                      >
                        {/* 🔹 Product info */}
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity} | Price: ${item.price}
                          </p>
                        </div>

                        {/* 🔹 Download button */}
                        <div className="flex flex-col items-end">
                          {canDownload ? (
                            <Button
                              size="sm"
                              color="primary"
                              onClick={() => handleDownload(order.id, item)}
                              startContent={<Download className="w-4 h-4" />}
                              disabled={downloading[key]}
                            >
                              {downloading[key] ? "Downloading..." : "Download"}
                            </Button>
                          ) : (
                            <span className="text-gray-400 text-xs">
                              Payment pending
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardBody>

              <CardFooter className="text-xs text-gray-500">
                Order ID: {order.id}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
