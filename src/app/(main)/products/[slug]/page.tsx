"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "../../../../lib/api";
import { Product } from "../../../../types";
import toast, { Toaster } from "react-hot-toast";
import { Button, Select, SelectItem, Spinner } from "@heroui/react";
import { InternalAxiosRequestConfig } from "axios";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [payCurrency, setPayCurrency] = useState("usdterc20"); // پیش‌فرض

  const currencies = [
    { label: "USDT (ERC20)", key: "usdterc20" },
    { label: "USDT (TRC20)", key: "usdttrc20" },
    { label: "USDT (BEP20)", key: "usdtbsc" },
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
      // const res = await api.post("/orders", {
      //   product_id: product.id,
      //   pay_currency: "usdc",
      // });
      const res = await api.post(
        "/orders",
        {
          product_id: product.id,
          pay_currency: payCurrency,
        },
        { requiresAuth: true } as InternalAxiosRequestConfig
      );
      const url = res.data.invoice_url;
      if (url) window.location.href = url;
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
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <Toaster />
      <h1 className="text-2xl font-bold">{product.title}</h1>
      <p className="text-gray-600 my-3">{product.description}</p>

      <div className="mb-4">
        <Select
          className="max-w-xs"
          items={currencies}
          value={payCurrency}
          onChange={(e) => setPayCurrency(e.target.value)}
          label="pay currency"
          placeholder="Select the currency"
        >
          {(currency) => <SelectItem>{currency.label}</SelectItem>}
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-green-600 font-semibold">${product.price}</div>
        <Button
          onClick={handleBuy}
          className="bg-gray-600 text-white px-4 py-2 rounded cursor-pointer"
          disabled={creating}
        >
          {creating ? <Spinner size="sm" /> : "Buy"}
        </Button>
      </div>
    </div>
  );
}
