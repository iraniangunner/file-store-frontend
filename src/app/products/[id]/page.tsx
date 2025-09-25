"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "../../../lib/api";
import { Product } from "../../../types";
import toast, { Toaster } from "react-hot-toast";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!id) return;
    api
      .get<Product>(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => {
        if (err.response?.status === 401) {
          toast.error("لطفا ابتدا وارد شوید"); // نمایش toast
        } else {
          toast.error("خطایی رخ داد");
        }
      });
  }, [id]);

  async function handleBuy() {
    if (!product) return;
    setCreating(true);
    try {
      const res = await api.post("/orders", {
        product_id: product.id,
        // pay_currency: "usdc",
        pay_currency: "trx",
       
      });
      const url = res.data.invoice_url;
      if (url) window.location.href = url;
    } catch (err: any) {
      if (err.response?.status === 401) {
        toast.error("لطفا ابتدا وارد شوید");
      } else {
        toast.error("خرید انجام نشد، دوباره تلاش کنید");
      }
    } finally {
      setCreating(false);
    }
  }

  if (!product) return <div>در حال بارگذاری...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <Toaster /> {/* اضافه شد */}
      <h1 className="text-2xl font-bold">{product.title}</h1>
      <p className="text-gray-600 my-3">{product.description}</p>
      <div className="flex items-center justify-between">
        <div className="text-green-600 font-semibold">${product.price}</div>
        <button
          onClick={handleBuy}
          className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
          disabled={creating}
        >
          {creating ? "..." : "خرید"}
        </button>
      </div>
    </div>
  );
}
