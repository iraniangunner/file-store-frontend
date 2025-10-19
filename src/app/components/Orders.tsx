"use client";
import { useEffect, useState } from "react";
import api from "../../lib/api";
import toast, { Toaster } from "react-hot-toast";
import { Order } from "@/types";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Progress,
  Card,
  CardHeader,
  CardBody,
  Spinner,
} from "@heroui/react";
import { InternalAxiosRequestConfig } from "axios";

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get<Order[]>("/orders", { requiresAuth: true } as InternalAxiosRequestConfig);
        setOrders(res.data);
      } catch (err: any) {
        if (err.response?.status === 401) toast.error("Please login first");
        else toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  async function downloadOrderFile(order: Order) {
    if (!order) return;
    setProgress((prev) => ({ ...prev, [order.id]: 0 }));

    try {
      const res = await api.get(`/orders/${order.id}/download`, {
        responseType: "blob",
        onDownloadProgress: (e: any) => {
          const percent = Math.round((e.loaded * 100) / (e.total || 1));
          setProgress((prev) => ({ ...prev, [order.id]: percent }));
        },
        requiresAuth: true, // همون رو نگه داشتیم
      } as any);

      const blob = new Blob([res.data], { type: res.headers["content-type"] || "application/octet-stream" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = order.product?.title || "file";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      // بروزرسانی download_used بعد از دانلود موفق
      setOrders((prevOrders) =>
        prevOrders.map((o: any) =>
          o.id === order.id
            ? { ...o, download_used: o.download_used + 1 }
            : o
        )
      );
      setProgress((prev) => ({ ...prev, [order.id]: 100 }));
    } catch (err: any) {
      toast.error(err.message || "Download failed");
      setProgress((prev) => ({ ...prev, [order.id]: 0 }));
    }
  }

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <Spinner size="lg" />
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Toaster />
      <Card>
        <CardHeader>
          <h2 className="text-lg font-bold">My Orders</h2>
        </CardHeader>
        <CardBody>
          {orders.length === 0 ? (
            <p className="text-gray-600">You have not purchased any products yet.</p>
          ) : (
            <Table aria-label="Orders List">
              <TableHeader>
                <TableColumn>ID</TableColumn>
                <TableColumn>Product</TableColumn>
                <TableColumn>Amount</TableColumn>
                <TableColumn>Status</TableColumn>
                <TableColumn>Date</TableColumn>
                <TableColumn>Download</TableColumn>
              </TableHeader>
              <TableBody>
                {orders.map((order: any) => {
                  // فقط سفارش‌های confirmed قابل دانلود
                  const canDownload =
                    order.status === "confirmed" &&
                    (order.download_allowed === 0 || order.download_allowed > order.download_used) &&
                    (!order.download_expires_at || new Date(order.download_expires_at) > new Date());

                  return (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.product?.title}</TableCell>
                      <TableCell>
                        {order.amount === 0 ? "Free" : `${order.amount} ${order.currency.toUpperCase()}`}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            ["finished", "confirmed"].includes(order.status)
                              ? "bg-green-100 text-green-800"
                              : order.status === "waiting"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Date(order.created_at).toLocaleDateString("en-US")}
                      </TableCell>
                      <TableCell>
                        {canDownload ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() => downloadOrderFile(order)}
                            >
                              Download {order.download_allowed !== 0 && `(${order.download_allowed - order.download_used} left)`}
                            </Button>
                            {progress[order.id] !== undefined && progress[order.id] < 100 && (
                              <Progress value={progress[order.id]} color="primary" size="sm" className="mt-1" />
                            )}
                          </>
                        ) : (
                          <span className="text-gray-400 text-xs">
                            {order.download_allowed !== 0 ? "Expired" : "No downloads allowed"}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
