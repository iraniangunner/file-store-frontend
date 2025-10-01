"use client";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "../../../../lib/api";
import { Order } from "../../../../types";
import { InternalAxiosRequestConfig } from "axios";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Badge,
  Divider,
  Spinner,
} from "@heroui/react";

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id;
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

  async function handleDownload() {
    if (!order) return;
    try {
      const res = await api.get(`/orders/${order.id}/download`, {
        responseType: "blob",
        requiresAuth: true,
      } as any);

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = order.product?.title || "file.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("خطا در دانلود فایل");
    }
  }

  if (loading)
    return (
      <div className="min-h-[80vh] flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  if (!order)
    return <p className="text-center mt-10 text-red-500">Order not found</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">{order.product?.title}</h1>
        </CardHeader>

        <CardBody>
          <p>
            <strong>Amount:</strong> {order.amount}{" "}
            {order.currency.toUpperCase()}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <Badge
              color={
                order.status === "finished" || order.status === "confirmed"
                  ? "success"
                  : order.status === "waiting"
                  ? "warning"
                  : "default"
              }
            >
              {order.status}
            </Badge>
          </p>
          <p>
            <strong>Ordered At:</strong>{" "}
            {new Date(order.created_at).toLocaleDateString()}
          </p>
          <Divider className="my-2" />
        </CardBody>

        <CardFooter className="flex justify-between">
          <Button onClick={() => router.push("/dashboard/orders")}>
            Back to Orders
          </Button>
          {["finished", "confirmed"].includes(order.status) && (
            <Button variant="solid" color="primary" onClick={handleDownload}>
              Download File
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
