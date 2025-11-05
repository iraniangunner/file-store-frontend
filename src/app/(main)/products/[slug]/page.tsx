"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "../../../../lib/api";
import { Product } from "../../../../types";
import toast, { Toaster } from "react-hot-toast";
import { Button, Spinner } from "@heroui/react";
import { useCart } from "@/context/CartContext";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  // const [message, setMessage] = useState("");
  const { addToCart } = useCart();


  useEffect(() => {
    if (!slug) return;

    // ✅ بارگذاری محصول
    api
      .get<Product>(`/products/${slug}`)
      .then((res) => setProduct(res.data))
      .catch((err) => {
        if (err.response?.status === 401) toast.error("Please login first");
        else toast.error("Something went wrong");
      });
  }, [slug]);

  useEffect(() => {
    if (!product) return;
  }, [product]);


  async function handleAddToCart() {
   if (!product) return;
  await addToCart(product.id, 1);

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

      

        {/* {message && <p className="text-red-500 text-sm mb-2">{message}</p>} */}

        <div className="flex items-center justify-between">
          <div className="text-green-600 font-semibold">
            {Number(product.price) === 0 ? "Free" : `$${product.price}`}
          </div>
          <Button
            onClick={handleAddToCart}
            className="bg-gray-600 text-white px-4 py-2 rounded cursor-pointer"
            disabled={creating}
          >
            {creating ? <Spinner size="sm" /> : "Add to Cart"}
          </Button>
        </div>
      </div>
    </div>
  );
}
