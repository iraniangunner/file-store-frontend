"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import toast, { Toaster } from "react-hot-toast";
import { Button, Spinner } from "@heroui/react";
import { Heart, ShoppingCart, Share2 } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function ProductDetailClient({ product }: any) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [liking, setLiking] = useState(false);
  const [creating, setCreating] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    async function getData() {
      try {
        const likeStatus = await api.get(`/products/${product.slug}/like/status`);
        const likeCount = await api.get(`/products/${product.slug}/likes/count`);

        setLiked(likeStatus.data.liked);
        setLikesCount(likeCount.data.likes);
      } catch {}
    }
    getData();
  }, [product.slug]);

  async function handleAddToCart() {
    setCreating(true);
    try {
      await addToCart(product.id, 1);
    } finally {
      setCreating(false);
    }
  }

  async function handleToggleLike() {
    setLiking(true);
    try {
      const res = await api.post(`/products/${product.slug}/like`);
      setLiked(res.data.liked);
      setLikesCount((prev) => (res.data.liked ? prev + 1 : prev - 1));
    } finally {
      setLiking(false);
    }
  }

  return (
    <div>
      <Toaster />

      <div className="flex gap-3">

        {/* Add to Cart */}
        <Button
          size="lg"
          className="flex-1 bg-gradient-to-r from-[#3B9FE8] to-[#3D3D8F] text-white"
          startContent={
            creating ? <Spinner size="sm" color="white" /> : <ShoppingCart size={20} />
          }
          onPress={handleAddToCart}
        >
          {creating ? "Adding..." : "Add to Cart"}
        </Button>

        {/* Like */}
        <Button
          isIconOnly
          size="lg"
          variant={liked ? "solid" : "bordered"}
          color="danger"
          onPress={handleToggleLike}
          isDisabled={liking}
        >
          {liking ? (
            <Spinner size="sm" color="danger" />
          ) : (
            <Heart size={20} className={liked ? "fill-red-500" : "text-red-500"} />
          )}
        </Button>

        <span className="text-sm text-gray-600">{likesCount}</span>

        {/* Share */}
        <Button
          isIconOnly
          size="lg"
          variant="bordered"
          onPress={() => {
            const url = `https://filerget.com/products/${product.slug}`;
            if (navigator.share) {
              navigator.share({ title: product.title, url }).catch(() => {});
            } else {
              navigator.clipboard.writeText(url);
              toast.success("Product URL copied!");
            }
          }}
        >
          <Share2 size={20} />
        </Button>
      </div>
    </div>
  );
}
