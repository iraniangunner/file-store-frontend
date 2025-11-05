"use client";

import { useCart } from "@/context/CartContext";
import {
  Button,
  Spinner,
  Card,
  CardBody,
  CardHeader,
  Select,
  SelectItem,
} from "@heroui/react";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/api";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, loading, removeFromCart, count, fetchCart } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const [payCurrency, setPayCurrency] = useState("usdtbsc"); // 🪙 مقدار پیش‌فرض
  const router = useRouter();

  const currencies = [
    { label: "USDT (ERC20)", key: "usdterc20", icon: "/images/USDT-ERC20.png" },
    { label: "USDT (BEP20)", key: "usdtbsc", icon: "/images/USDT-BEP20.png" },
  ];

  // ✅ Calculate total
  const total =
    cart?.items?.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    ) || 0;

  // ✅ Checkout handler
  const handleCheckout = async () => {
    if (!payCurrency) {
      toast.error("Please select a payment currency");
      return;
    }

    setCheckingOut(true);
    try {
      const guestToken = localStorage.getItem("guest_token");

      const res = await api.post("/checkout", { pay_currency: payCurrency }, {
        requiresAuth: true,
        headers: guestToken ? { "X-Guest-Token": guestToken } : {},
      } as any);

      if (res.data.invoice_url) {
        // 🔗 انتقال به درگاه (می‌تونی اینو به window.open هم تغییر بدی)
        window.location.href = res.data.invoice_url;
      } else {
        toast.success("Order created successfully!");
        await fetchCart(); // خالی کردن سبد
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        toast.error("Please login first");
      } else {
        toast.error(err.response?.data?.message || "Checkout failed");
      }
    } finally {
      setCheckingOut(false);
    }
  };

  // 🟡 Loading state
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <Spinner size="lg" />
      </div>
    );

  // 🪣 Empty cart
  if (!cart || count === 0)
    return (
      <div className="min-h-[80vh] flex flex-col justify-center items-center text-gray-600">
        <Toaster />
        <p>Your cart is empty.</p>
        <Link href="/products" className="mt-4 text-blue-600 underline">
          Browse products
        </Link>
      </div>
    );

  // 🧾 Cart items
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Toaster />
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">My Cart</h2>
        </CardHeader>
        <CardBody>
          {cart.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b py-3"
            >
              <div className="flex items-center gap-4">
                {item.product.thumbnail && (
                  <Image
                    src={item.product.thumbnail}
                    alt={item.product.title}
                    width={60}
                    height={60}
                    className="rounded"
                  />
                )}
                <div>
                  <p className="font-medium">{item.product.title}</p>
                  <p className="text-sm text-gray-500">
                    ${item.price} × {item.quantity}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-semibold">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
                <Button
                  size="sm"
                  color="danger"
                  onClick={() => removeFromCart(item.product_id)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}

          {/* 💰 انتخاب ارز پرداخت */}
          {total > 0 && (
            <div className="mt-6 mb-4">
              <Select
                className="max-w-xs"
                items={currencies}
                selectedKeys={[payCurrency]}
                onChange={(e) => setPayCurrency(e.target.value)}
                label="Pay currency"
                placeholder="Select the currency"
              >
                {(currency) => (
                  <SelectItem key={currency.key} textValue={currency.label}>
                    <div className="flex items-center gap-2">
                      <Image
                        src={currency.icon}
                        alt={currency.label}
                        width={30}
                        height={30}
                        className="rounded-full"
                      />
                      <span>{currency.label}</span>
                    </div>
                  </SelectItem>
                )}
              </Select>
            </div>
          )}

          {/* 🧮 Summary & Checkout */}
          <div className="flex justify-between items-center mt-6">
            <p className="text-lg font-bold">Total: ${total.toFixed(2)}</p>

            <Button
              color="primary"
              onClick={handleCheckout}
              disabled={checkingOut}
            >
              {checkingOut ? (
                <Spinner size="sm" />
              ) : total === 0 ? (
                "Get for Free"
              ) : (
                "Checkout"
              )}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
