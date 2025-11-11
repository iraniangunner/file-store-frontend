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
  Divider,
  Chip,
} from "@heroui/react";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/api";
import { useState } from "react";
import { ShoppingCart, Trash2, Package, CreditCard } from "lucide-react";

export default function CartPage() {
  const { cart, loading, removeFromCart, count, fetchCart } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const [payCurrency, setPayCurrency] = useState("usdtbsc");

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
      <div className="min-h-[80vh] flex flex-col justify-center items-center">
        <Toaster />
        <Card className="max-w-md w-full">
          <CardBody className="text-center py-12">
            <div className="flex justify-center mb-4">
              <div className="bg-default-100 p-6 rounded-full">
                <ShoppingCart className="w-12 h-12 text-default-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-default-500 mb-6">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Button
              as={Link}
              href="/products"
             className="bg-gradient-to-r from-[#3B9FE8] to-[#3D3D8F] text-white font-semibold"
              size="lg"
              startContent={<Package className="w-4 h-4" />}
            >
              Browse Products
            </Button>
          </CardBody>
        </Card>
      </div>
    );

  // 🧾 Cart items
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8 mb-36">
      <Toaster />

      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
        <p className="text-default-500">
          {count} {count === 1 ? "item" : "items"} in your cart
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item:any) => (
            <Card key={item.id} className="border-none shadow-sm">
              <CardBody className="p-4">
                <div className="flex gap-4">
                  {item.product.image_path && (
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <img
                        src={`https://filerget.com/storage/${item.product.image_path}` || "/placeholder.svg"}
                        alt={item.product.title}
                        className="rounded-lg object-cover aspect-square"
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-1 truncate">
                      {item.product.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      <Chip size="sm" variant="flat" color="primary">
                        ${item.price}
                      </Chip>
                      <span className="text-sm text-default-500">
                        Qty: {item.quantity}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-xl font-bold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <Button
                        size="sm"
                        color="danger"
                        variant="flat"
                        startContent={<Trash2 className="w-4 h-4" />}
                        onClick={() => removeFromCart(item.product_id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="border-none shadow-sm sticky top-6">
            <CardHeader className="pb-4">
              <h2 className="text-xl font-bold">Order Summary</h2>
            </CardHeader>
            <Divider />
            <CardBody className="gap-4">
              <div className="space-y-3">
                <div className="flex justify-between text-default-600">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <Divider />

              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-2xl font-bold text-primary">
                  ${total.toFixed(2)}
                </span>
              </div>

              <Divider />

              {total > 0 && (
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Payment Currency
                  </label>
                  <Select
                    items={currencies}
                    selectedKeys={[payCurrency]}
                    onChange={(e) => setPayCurrency(e.target.value)}
                    placeholder="Select currency"
                    classNames={{
                      trigger: "h-12",
                    }}
                  >
                    {(currency) => (
                      <SelectItem key={currency.key} textValue={currency.label}>
                        <div className="flex items-center gap-3">
                          <Image
                            src={currency.icon || "/placeholder.svg"}
                            alt={currency.label}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                          <span className="font-medium">{currency.label}</span>
                        </div>
                      </SelectItem>
                    )}
                  </Select>
                </div>
              )}

              <Button
                color="primary"
                size="lg"
                className="w-full font-semibold bg-gradient-to-r from-[#3B9FE8] to-[#3D3D8F] text-white"
                onClick={handleCheckout}
                disabled={checkingOut}
                startContent={
                  checkingOut ? (
                    <Spinner size="sm" color="white" />
                  ) : (
                    <CreditCard className="w-5 h-5" />
                  )
                }
              >
                {checkingOut
                  ? "Processing..."
                  : total === 0
                  ? "Get for Free"
                  : "Proceed to Checkout"}
              </Button>

              <Button
                as={Link}
                href="/products"
                variant="flat"
                className="w-full"
              >
                Continue Shopping
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
