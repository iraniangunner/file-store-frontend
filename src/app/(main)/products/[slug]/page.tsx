"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "../../../../lib/api";
import { Product } from "../../../../types";
import toast, { Toaster } from "react-hot-toast";
import { Button, Divider, Select, SelectItem, Spinner } from "@heroui/react";
import { InternalAxiosRequestConfig } from "axios";
import Image from "next/image";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [payCurrency, setPayCurrency] = useState("usdterc20"); // پیش‌فرض

  const currencies = [
    {
      label: "USDT (ERC20)",
      key: "usdterc20",
      icon: "/images/USDT-ERC20.png",
    },
    {
      label: "USDT (BEP20)",
      key: "usdtbsc",
      icon: "/images/USDT-BEP20.png",
    },
  ];

  useEffect(() => {
    if (!slug) return;
    api
      .get<Product>(`/products/${slug}`)
      .then((res) => setProduct(res.data))
      .catch((err) => {
        if (err.response?.status === 401) {
          toast.error("Please login first");
        } else {
          toast.error("Something went wrong");
        }
      });
  }, [slug]);

  async function handleBuy() {
    if (!product) return;
    setCreating(true);
    try {
      const res = await api.post(
        "/orders",
        {
          product_id: product.id,
          pay_currency: payCurrency,
        },
        { requiresAuth: true } as InternalAxiosRequestConfig
      );

      if (Number(product.price) === 0) {
        // محصول رایگان: هدایت به داشبورد سفارشات
        toast.success("Order created successfully!");
        window.location.href = "/dashboard/orders";
      } else {
        // محصول پولی: هدایت به لینک فاکتور
        const url = res.data.invoice_url;
        if (url) window.location.href = url;
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        toast.error("Please login first");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setCreating(false);
    }
  }

  if (!product)
    return (
      <div className="min-h-[80vh] flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );

  return (
    <div className="min-h-[80vh] flex justify-center items-center">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <Toaster />
        <h1 className="text-2xl font-bold">{product.title}</h1>
        <p className="text-gray-600 my-3">{product.description}</p>

        {/* فقط وقتی محصول پولی است نمایش بده */}
        {Number(product.price) > 0 && (
          <div className="mb-4">
            <Select
              className="max-w-xs"
              items={currencies}
              value={payCurrency}
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
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <span>{currency.label}</span>
                  </div>
                </SelectItem>
              )}
            </Select>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="text-green-600 font-semibold">
            {Number(product.price) === 0 ? "Free" : `$${product.price}`}
          </div>
          <Button
            onClick={handleBuy}
            className="bg-gray-600 text-white px-4 py-2 rounded cursor-pointer"
            disabled={creating}
          >
            {creating ? (
              <Spinner size="sm" />
            ) : Number(product.price) === 0 ? (
              "Get for Free"
            ) : (
              "Buy"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
