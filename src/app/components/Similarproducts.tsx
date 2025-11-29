"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchSimilar() {
      try {
        const res = await api.get(`/products/${productSlug}/similar`);
        setProducts(res.data.products || []);
      } catch (err) {
        console.error("Failed to fetch similar products", err);
      }
    }
    fetchSimilar();
  }, [productSlug]);

  if (!products || products.length === 0) return null;

  return (
    <div className="mt-16 relative">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
            You May Also Like
          </h3>
          <p className="text-gray-500 text-sm">
            Discover similar products you'll love
          </p>
        </div>
        <div className="hidden md:flex gap-3">
          <button
            className="swiper-button-prev-custom group w-12 h-12 rounded-full bg-white border-2 border-gray-200 hover:border-gray-900 hover:bg-gray-900 transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors" />
          </button>
          <button
            className="swiper-button-next-custom group w-12 h-12 rounded-full bg-white border-2 border-gray-200 hover:border-gray-900 hover:bg-gray-900 transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors" />
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
        spaceBetween={24}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 24 },
          1280: { slidesPerView: 4, spaceBetween: 24 },
        }}
        className="pb-14"
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <div
              className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100"
              onMouseEnter={() => setHoveredId(product.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <Link href={`/products/${product.slug}`} className="block">
                {/* Image Container */}
                <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 aspect-square">
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Wishlist Button */}
                  {/* <button 
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm hover:bg-white flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100 z-10"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    aria-label="Add to wishlist"
                  >
                    <Heart className="w-5 h-5 text-gray-700 hover:text-red-500 hover:fill-red-500 transition-colors" />
                  </button> */}

                  {/* Quick View Badge */}
                  {/* <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="flex gap-2 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-xl">
                      <button 
                        className="flex items-center gap-1.5 text-sm font-medium text-gray-900 hover:text-primary transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        <Eye className="w-4 h-4" />
                        <span>Quick View</span>
                      </button>
                      <div className="w-px bg-gray-300" />
                      <button 
                        className="flex items-center gap-1.5 text-sm font-medium text-gray-900 hover:text-primary transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div> */}

                  {/* Badge */}
                  {/* <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold rounded-full shadow-lg backdrop-blur-sm">
                      Similar
                    </span>
                  </div> */}
                </div>

                {/* Content */}
                <div className="p-5">
                  <p className="text-sm font-semibold text-gray-900 line-clamp-2 mb-3 group-hover:text-primary transition-colors leading-relaxed min-h-[2.5rem]">
                    {product.title}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <p className="text-primary font-bold text-xl">
                        ${product.price}
                      </p>
                      {/* <p className="text-gray-400 text-sm line-through">
                        ${(product.price * 1.25).toFixed(2)}
                      </p> */}
                    </div>

                    {/* Rating */}
                    {/* <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-gray-700">4.8</span>
                    </div> */}
                  </div>

                  {/* Stock Info */}
                  {/* <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${70}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 font-medium">In Stock</span>
                    </div>
                  </div> */}
                </div>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 rounded-2xl border-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .swiper-pagination-bullet {
          background: #d1d5db;
          opacity: 1;
          width: 8px;
          height: 8px;
          transition: all 0.3s ease;
        }
        .swiper-pagination-bullet-active {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          width: 28px;
          border-radius: 4px;
        }
        .swiper-button-disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
