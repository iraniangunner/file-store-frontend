"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import toast, { Toaster } from "react-hot-toast";
import { Spinner } from "@heroui/react";
import { Heart, ShoppingCart, Share2, Check, Link as LinkIcon } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function ProductDetailClient({ product }: any) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [liking, setLiking] = useState(false);
  const [creating, setCreating] = useState(false);
  const [added, setAdded] = useState(false);
  const [copied, setCopied] = useState(false);

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
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
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

  function handleShare() {
    const url = `https://filerget.com/products/${product.slug}`;
    if (navigator.share) {
      navigator.share({ title: product.title, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="space-y-4">
      <Toaster position="top-right" />

      {/* Main Action Button */}
      <button
        onClick={handleAddToCart}
        disabled={creating || added}
        className={`w-full flex items-center justify-center gap-3 px-6 py-4 font-semibold rounded-2xl shadow-lg transition-all duration-300 ${
          added
            ? "bg-emerald-500 text-white shadow-emerald-500/25"
            : "bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30"
        } disabled:cursor-not-allowed`}
      >
        {creating ? (
          <>
            <Spinner size="sm" color="white" />
            <span>Adding to Cart...</span>
          </>
        ) : added ? (
          <>
            <Check className="w-5 h-5" />
            <span>Added to Cart!</span>
          </>
        ) : (
          <>
            <ShoppingCart className="w-5 h-5" />
            <span>Add to Cart</span>
          </>
        )}
      </button>

      {/* Secondary Actions */}
      <div className="flex items-center gap-3">
        {/* Like Button */}
        <button
          onClick={handleToggleLike}
          disabled={liking}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
            liked
              ? "bg-rose-50 text-rose-600 border-2 border-rose-200"
              : "bg-white text-slate-700 border-2 border-slate-200 hover:border-rose-200 hover:bg-rose-50"
          }`}
        >
          {liking ? (
            <Spinner size="sm" color="danger" />
          ) : (
            <Heart
              className={`w-5 h-5 transition-all ${
                liked ? "fill-rose-500 text-rose-500 scale-110" : ""
              }`}
            />
          )}
          <span>{likesCount > 0 ? likesCount : "Like"}</span>
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
            copied
              ? "bg-emerald-50 text-emerald-600 border-2 border-emerald-200"
              : "bg-white text-slate-700 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
          }`}
        >
          {copied ? (
            <>
              <Check className="w-5 h-5" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}