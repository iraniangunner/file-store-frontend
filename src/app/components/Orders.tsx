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
  Tabs,
  Tab,
  Avatar,
  Skeleton,
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
} from "lucide-react";

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
        icon: <CheckCircle2 className="w-4 h-4" />,
        label: "Completed",
      };
    }
    if (statusLower === "pending") {
      return {
        color: "warning" as const,
        icon: <Clock className="w-4 h-4" />,
        label: "Pending",
      };
    }
    if (statusLower === "cancelled") {
      return {
        color: "danger" as const,
        icon: <XCircle className="w-4 h-4" />,
        label: "Cancelled",
      };
    }
    return {
      color: "default" as const,
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

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <Skeleton className="h-10 w-48 mb-8 rounded-lg" />
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="w-full">
              <CardBody className="p-6">
                <Skeleton className="h-6 w-32 mb-4 rounded-lg" />
                <Skeleton className="h-4 w-full mb-2 rounded-lg" />
                <Skeleton className="h-4 w-3/4 rounded-lg" />
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 mb-36">
      <Toaster position="top-right" />

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <ShoppingBag className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">My Orders</h1>
        </div>
        <p className="text-default-500 ml-14">
          Track and manage your order history
        </p>
      </div>

      <Tabs
        selectedKey={selectedTab}
        onSelectionChange={(key) => setSelectedTab(key as string)}
        className="mb-6"
        color="primary"
        variant="underlined"
      >
        <Tab
          key="all"
          title={
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              <span>All Orders</span>
              <Chip size="sm" variant="flat">
                {orders.length}
              </Chip>
            </div>
          }
        />
        <Tab
          key="completed"
          title={
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Completed</span>
              <Chip size="sm" variant="flat" color="success">
                {
                  orders.filter(
                    (o) =>
                      o.status.toLowerCase() === "confirmed" ||
                      o.status.toLowerCase() === "finished"
                  ).length
                }
              </Chip>
            </div>
          }
        />
        <Tab
          key="pending"
          title={
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Pending</span>
              <Chip size="sm" variant="flat" color="warning">
                {
                  orders.filter((o) => o.status.toLowerCase() === "pending")
                    .length
                }
              </Chip>
            </div>
          }
        />
      </Tabs>

      {filteredOrders.length === 0 ? (
        <Card className="w-full">
          <CardBody className="py-16">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="p-4 bg-default-100 rounded-full mb-4">
                <ShoppingBag className="w-12 h-12 text-default-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No orders found</h3>
              <p className="text-default-500 mb-6 max-w-sm">
                {selectedTab === "all"
                  ? "You haven't made any purchases yet. Start shopping to see your orders here."
                  : `You don't have any ${selectedTab} orders.`}
              </p>
              <Button
                color="primary"
                startContent={<ShoppingBag className="w-4 h-4" />}
              >
                Start Shopping
              </Button>
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const statusConfig = getStatusConfig(order.status);
            const canDownload =
              order.status.toLowerCase() === "confirmed" ||
              order.status.toLowerCase() === "finished";

            return (
              <Card
                key={order.id}
                className="w-full shadow-md hover:shadow-lg transition-shadow"
              >
                <CardHeader className="flex-col items-start gap-3 p-6 bg-default-50/50">
                  <div className="flex w-full justify-between items-start">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">
                          Order #{order.id}
                        </h3>
                        <Chip
                          color={statusConfig.color}
                          variant="flat"
                          startContent={statusConfig.icon}
                          size="sm"
                        >
                          {statusConfig.label}
                        </Chip>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-default-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(order.created_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="w-4 h-4" />
                          <span>{order.items.length} item(s)</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-default-500 mb-1">
                        Total Amount
                      </p>
                      <div className="flex items-center gap-1">
                        <CreditCard className="w-4 h-4 text-default-400" />
                        <p className="text-xl font-bold">
                          {order.amount} {order.currency?.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <Divider />

                <CardBody className="p-6">
                  <div className="space-y-4">
                    {order.items.map((item) => {
                      const key = `orderitem-${item.id}`;

                      return (
                        <div
                          key={key}
                          className="flex items-center justify-between p-4 rounded-lg bg-default-50/50 hover:bg-default-100/50 transition-colors"
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <Avatar
                              icon={<FileText className="w-5 h-5" />}
                              classNames={{
                                base: "bg-primary/10",
                                icon: "text-primary",
                              }}
                              size="lg"
                            />

                            <div className="flex-1">
                              <p className="font-semibold text-base mb-1">
                                {item.title}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-default-500">
                                <span>Qty: {item.quantity}</span>
                                <span>•</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {canDownload ? (
                              <Button
                                color="primary"
                                variant="flat"
                                size="md"
                                onClick={() => handleDownload(order.id, item)}
                                startContent={
                                  downloading[key] ? (
                                    <Spinner size="sm" color="current" />
                                  ) : (
                                    <Download className="w-4 h-4" />
                                  )
                                }
                              >
                                {downloading[key]
                                  ? "Downloading..."
                                  : "Download"}
                              </Button>
                            ) : (
                              <Chip
                                color="warning"
                                variant="flat"
                                startContent={<Clock className="w-3 h-3" />}
                                size="sm"
                              >
                                Payment Pending
                              </Chip>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardBody>

                <Divider />

                <CardFooter className="px-6 py-4 bg-default-50/30">
                  <div className="flex w-full justify-between items-center">
                    <p className="text-sm text-default-500">
                      Order ID: <span className="font-mono">{order.id}</span>
                    </p>
                    <Button
                      size="sm"
                      variant="light"
                      startContent={<FileText className="w-4 h-4" />}
                    >
                      View Invoice
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
