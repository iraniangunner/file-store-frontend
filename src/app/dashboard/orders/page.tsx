"use client";
import { useEffect, useState } from "react";
import api from "../../../lib/api";
import toast from "react-hot-toast";
import { Order } from "@/types";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
} from "@heroui/react";
import { InternalAxiosRequestConfig } from "axios";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get<Order[]>("/orders", {
          requiresAuth: true,
        } as InternalAxiosRequestConfig);
        setOrders(res.data);
      } catch (err: any) {
        if (err.response?.status === 401) {
          toast.error("Please login first");
        } else {
          toast.error("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  //   async function downloadOrderFile(order: Order) {
  //     if (!order) return;

  //     try {
  //       const res = await api.get(`/orders/${order.id}/download`, {
  //         responseType: "blob",
  //         requiresAuth: true,
  //       } as any);

  //       const blob = new Blob([res.data], { type: "application/pdf" });
  //       const url = window.URL.createObjectURL(blob);

  //       const a = document.createElement("a");
  //       a.href = url;
  //       a.download = order.product?.title || "file.pdf";
  //       document.body.appendChild(a);
  //       a.click();
  //       a.remove();
  //       window.URL.revokeObjectURL(url);
  //     } catch {
  //       toast.error("Error downloading file");
  //     }
  //   }

  if (loading)
    return (
      <div className="min-h-[80vh] flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card>
        <CardHeader className="font-bold text-lg">My Orders</CardHeader>
        <CardBody>
          {orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <Table
              aria-label="Orders List"
              removeWrapper
              shadow="none"
              className="min-w-full"
            >
              <TableHeader>
                <TableColumn>ID</TableColumn>
                <TableColumn>Product</TableColumn>
                <TableColumn>Amount</TableColumn>
                <TableColumn>Status</TableColumn>
                <TableColumn>Date</TableColumn>
                {/* <TableColumn>Download</TableColumn> */}
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow
                    key={order.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => router.push(`/dashboard/orders/${order.id}`)}
                  >
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.product?.title}</TableCell>
                    <TableCell>
                      {order.amount} {order.currency.toUpperCase()}
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell>
                      {new Date(order.created_at).toLocaleDateString("en-US")}
                    </TableCell>
                    {/* <TableCell>
                      {order.download_url ? (
                        <Button
                          size="sm"
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation(); // prevent row click
                            downloadOrderFile(order);
                          }}
                        >
                          Download
                        </Button>
                      ) : (
                        <span className="text-gray-400 text-xs">
                          Unavailable
                        </span>
                      )}
                    </TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
