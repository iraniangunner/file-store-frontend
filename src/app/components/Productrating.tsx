"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface ProductRatingProps {
  productSlug: string;
}

export function ProductRating({ productSlug }: ProductRatingProps) {
  const [averageRating, setAverageRating] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchRating();
  }, [productSlug]);

  async function fetchRating() {
    try {
      const res = await api.get(`/products/${productSlug}/rating`);
      setAverageRating(res.data.average_rating); // مثلا 4.3
      setReviewsCount(res.data.reviews_count);
      setUserRating(res.data.user_rating || 0);
    } catch (err) {
      console.error("Failed to fetch rating", err);
    }
  }

  async function handleRate(rating: number) {
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await api.post(`/products/${productSlug}/rate`, { rating });
      setAverageRating(res.data.average_rating);
      setReviewsCount(res.data.reviews_count);
      setUserRating(res.data.user_rating);
      toast.success("Your rating has been saved!");
    } catch (err: any) {
      if (err.response?.status === 401) {
        toast.error("Please login to rate this product");
      } else {
        toast.error("Failed to save rating");
      }
    } finally {
      setSubmitting(false);
    }
  }

  function renderStar(index: number) {
    const ratingToShow = hoverRating || userRating || averageRating;
    if (index <= Math.floor(ratingToShow)) return "full";
    if (index - 0.5 <= ratingToShow) return "half";
    return "empty";
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((i) => {
          const starType = renderStar(i);
          let starClass = "text-gray-300";
          if (starType === "full")
            starClass = "fill-yellow-400 text-yellow-400";
          else if (starType === "half")
            starClass = "fill-yellow-400 text-yellow-400 relative";
          return (
            <Star
              key={i}
              size={20}
              className={`${starClass} cursor-pointer ${
                submitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onMouseEnter={() => !submitting && setHoverRating(i)}
              onMouseLeave={() => !submitting && setHoverRating(0)}
              onClick={() => handleRate(i)}
              style={
                starType === "half"
                  ? { clipPath: "inset(0 50% 0 0)" }
                  : undefined
              } // نیم ستاره سمت چپ
            />
          );
        })}
      </div>
      <span className="text-sm text-gray-600">
        {averageRating.toFixed(1)} ({reviewsCount}{" "}
        {reviewsCount === 1 ? "review" : "reviews"})
      </span>
    </div>
  );
}
