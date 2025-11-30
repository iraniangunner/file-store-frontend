"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import api from "@/lib/api";

interface Product {
  id: number;
  title: string;
  image_url: string;
  price: number;
  slug: string;
}

interface SimilarProductsSliderProps {
  productSlug: string;
}

export default function SimilarProductsSlider({
  productSlug,
}: SimilarProductsSliderProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSimilar() {
      try {
        setLoading(true);
        const res = await api.get(`/products/${productSlug}/similar`);
        setProducts(res.data.products || []);
      } catch (err) {
        console.error("Failed to fetch similar products", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSimilar();
  }, [productSlug]);

  if (loading) {
    return (
      <div className="mt-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse mb-2" />
            <div className="h-4 w-64 bg-slate-100 rounded-lg animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
            >
              <div className="aspect-square bg-slate-100 animate-pulse" />
              <div className="p-5">
                <div className="h-5 w-3/4 bg-slate-200 rounded-lg animate-pulse mb-3" />
                <div className="h-6 w-20 bg-slate-200 rounded-lg animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) return null;

  return (
    <div className="mt-16 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl shadow-lg shadow-violet-500/25">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900">
              You May Also Like
            </h3>
            <p className="text-slate-500 text-sm">
              Discover similar products you'll love
            </p>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="hidden md:flex gap-2">
          <button
            className="swiper-button-prev-custom w-11 h-11 rounded-xl bg-white border-2 border-slate-200 hover:border-violet-300 hover:bg-violet-50 transition-all duration-200 flex items-center justify-center shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600 group-hover:text-violet-600 transition-colors" />
          </button>
          <button
            className="swiper-button-next-custom w-11 h-11 rounded-xl bg-white border-2 border-slate-200 hover:border-violet-300 hover:bg-violet-50 transition-all duration-200 flex items-center justify-center shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-violet-600 transition-colors" />
          </button>
        </div>
      </div>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation={{
          prevEl: ".swiper-button-prev-custom",
          nextEl: ".swiper-button-next-custom",
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 24 },
          1280: { slidesPerView: 4, spaceBetween: 24 },
        }}
        className="pb-14"
      >
        {products.map((product) => {
          const isFree = product.price === 0;

          return (
            <SwiperSlide key={product.id}>
              <Link
                href={`/products/${product.slug}`}
                className="group block bg-white rounded-2xl overflow-hidden border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-slate-100">
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Badges */}
                  {isFree && (
                    <span className="absolute top-3 right-3 px-2.5 py-1 bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-lg">
                      FREE
                    </span>
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-5">
                  <h4 className="font-semibold text-slate-900 line-clamp-2 mb-3 group-hover:text-violet-600 transition-colors min-h-[2.5rem] leading-tight">
                    {product.title}
                  </h4>

                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xl font-bold ${
                        isFree
                          ? "text-emerald-600"
                          : "bg-gradient-to-r from-violet-600 to-violet-700 bg-clip-text text-transparent"
                      }`}
                    >
                      {isFree ? "Free" : `$${product.price}`}
                    </span>

                    <span className="inline-flex items-center gap-1 text-sm font-medium text-violet-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      View
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <style jsx global>{`
        .swiper-pagination-bullet {
          background: #cbd5e1;
          opacity: 1;
          width: 8px;
          height: 8px;
          transition: all 0.3s ease;
        }
        .swiper-pagination-bullet-active {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          width: 24px;
          border-radius: 4px;
        }
        .swiper-button-disabled {
          opacity: 0.4 !important;
          cursor: not-allowed !important;
        }
      `}</style>
    </div>
  );
}
