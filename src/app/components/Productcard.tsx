"use client";

import { Download, Star, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function ProductCard({ product, view }: any) {
  const isFree = product.price == 0;
  const isList = view === "list";

  // Grid View
  if (!isList) {
    return (
      <Link
        href={`/products/${product.slug}`}
        className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300"
      >
        {/* Image Container - Fixed aspect ratio */}
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 flex-shrink-0">
          <img
            alt={product.title}
            src={
              product.image_url
                ? `https://filerget.com${product.image_url}`
                : "/images/folder.png"
            }
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Top badges */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
            {/* Featured badge - left side */}
            {product.is_featured ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-400 text-amber-950 text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-lg">
                <Sparkles className="w-3 h-3" />
                Featured
              </span>
            ) : (
              <span />
            )}
            
            {/* Free badge - right side, always visible on image */}
            {isFree && (
              <span className="inline-flex items-center px-3 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-lg">
                Free
              </span>
            )}
          </div>

          {/* Stats bar at bottom of image */}
          {(product.downloads_count || product.rating) && (
            <div className="absolute bottom-0 left-0 right-0 px-4 py-2.5 bg-gradient-to-t from-black/70 to-transparent">
              <div className="flex items-center justify-between text-white/90 text-xs">
                {product.downloads_count && (
                  <span className="flex items-center gap-1">
                    <Download className="w-3.5 h-3.5" />
                    {product.downloads_count.toLocaleString()}
                  </span>
                )}
                {product.rating && (
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {product.rating.toFixed(1)}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Content - Flex grow to fill remaining space */}
        <div className="flex flex-col flex-grow p-5">
          {/* Title - Fixed height with line clamp */}
          <h3 className="text-base font-semibold text-slate-900 line-clamp-1 group-hover:text-violet-600 transition-colors duration-200">
            {product.title}
          </h3>
          
          {/* Description - Fixed height container */}
          <div className="mt-1.5 h-[2.75rem]">
            <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Footer - Push to bottom with margin-top auto */}
          <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                Price
              </span>
              <span
                className={`text-xl font-bold ${
                  isFree ? "text-emerald-600" : "text-slate-900"
                }`}
              >
                {isFree ? "Free" : `$${product.price}`}
              </span>
            </div>

            <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-violet-50 text-violet-600 text-sm font-semibold rounded-xl group-hover:bg-violet-100 transition-colors duration-200">
              Details
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  // List View
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block relative bg-white rounded-2xl overflow-hidden border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:translate-x-1 transition-all duration-300"
    >
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="relative sm:w-64 md:w-72 flex-shrink-0 overflow-hidden bg-slate-100">
          <div className="aspect-[4/3] sm:aspect-auto sm:h-full">
            <img
              alt={product.title}
              src={
                product.image_url
                  ? `https://filerget.com${product.image_url}`
                  : "/images/folder.png"
              }
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* Badges on image */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
            {/* Featured badge - left */}
            {product.is_featured ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-400 text-amber-950 text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-lg">
                <Sparkles className="w-3 h-3" />
                Featured
              </span>
            ) : (
              <span />
            )}
            
            {/* Free badge - right */}
            {isFree && (
              <span className="inline-flex items-center px-3 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-lg">
                Free
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-lg font-semibold text-slate-900 line-clamp-1 group-hover:text-violet-600 transition-colors duration-200">
                {product.title}
              </h3>

              {/* Stats */}
              {(product.downloads_count || product.rating) && (
                <div className="hidden md:flex items-center gap-3 text-sm text-slate-500 flex-shrink-0">
                  {product.downloads_count && (
                    <span className="flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      {product.downloads_count.toLocaleString()}
                    </span>
                  )}
                  {product.rating && (
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      {product.rating.toFixed(1)}
                    </span>
                  )}
                </div>
              )}
            </div>

            <p className="mt-2 text-sm text-slate-500 line-clamp-2 sm:line-clamp-3 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
            <div className="flex items-baseline gap-2">
              <span
                className={`text-2xl font-bold ${
                  isFree ? "text-emerald-600" : "text-slate-900"
                }`}
              >
                {isFree ? "Free" : `$${product.price}`}
              </span>
              {!isFree && <span className="text-xs text-slate-400">USD</span>}
            </div>

            <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-500 to-violet-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-violet-500/25 group-hover:shadow-xl group-hover:shadow-violet-500/30 group-hover:from-violet-600 group-hover:to-violet-700 transition-all duration-200">
              View Details
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;