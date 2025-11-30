

// export function ProductCard({ product, view }: any) {
//   const isFree = product.price == 0;
//   const isList = view === "list";

//   return (
//     <div
//       key={product.id}
//       className={`group rounded-2xl transition-all duration-300 hover:shadow-2xl border border-divider overflow-hidden 
//         ${isList ? "flex flex-row h-[200px]" : ""}`}
//     >
//       {/* IMAGE SECTION */}
//       <div
//         className={`p-0 relative overflow-hidden 
//           ${isList ? "w-1/3 h-full" : ""}`}
//       >
//         <div
//           className={`relative w-full ${
//             isList ? "h-full" : "h-[240px]"
//           } overflow-hidden`}
//         >
//           <img
//             alt={product.title}
//             src={
//               product.image_url
//                 ? `https://filerget.com${product.image_url}`
//                 : "/images/folder.png"
//             }
//             className={`w-full h-full object-cover transition-transform duration-500 
//               group-hover:scale-110`}
//           />

//           {isFree && (
//             <span className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-md shadow font-semibold">
//               Free
//             </span>
//           )}
//         </div>
//       </div>

//       {/* TEXT SECTION */}
//       <div className={`${isList ? "w-2/3 flex flex-col justify-between" : ""}`}>
//         <div className={`p-5 space-y-2 ${isList ? "flex-1" : ""}`}>
//           <h3 className="text-lg font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
//             {product.title}
//           </h3>
//           <p className="text-sm text-default-500 line-clamp-2 leading-relaxed">
//             {product.description}
//           </p>
//         </div>

//         {/* FOOTER */}
//         <div
//           className={`flex items-center justify-between px-5 pb-5 pt-0 gap-2 
//             ${isList ? "" : ""}`}
//         >
//           <div className="flex flex-col">
//             <span className="text-xs text-default-400">Price</span>
//             <span className="text-2xl font-bold text-primary">
//               ${product.price}
//             </span>
//           </div>

//           <a
//             href={`/products/${product.slug}`}
//             className="font-semibold px-3 py-2 bg-primary/20 text-primary rounded-lg text-sm hover:bg-primary/30 transition"
//           >
//             View More
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { Product } from "@/types";
import { Download, Star, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

interface ProductCardProps {
  product: {
    id: number;
    title: string;
    description: string;
    price: number;
    slug: string;
    image_url?: string;
    downloads_count?: number;
    rating?: number;
    is_featured?: boolean;
  };
  view?: "grid" | "list";
}

export function ProductCard({ product ,view}: any) {
  const isFree = product.price === 0;
  const isList = view === "list";

  // Grid View
  if (!isList) {
    return (
      <Link
        href={`/products/${product.slug}`}
        className="group block relative bg-white rounded-2xl overflow-hidden border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300"
      >
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
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
            {product.is_featured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-400 text-amber-950 text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-lg">
                <Sparkles className="w-3 h-3" />
                Featured
              </span>
            )}
            {isFree && (
              <span className="ml-auto inline-flex items-center px-3 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-lg">
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

        {/* Content */}
        <div className="p-5">
          <h3 className="text-base font-semibold text-slate-900 line-clamp-1 group-hover:text-violet-600 transition-colors duration-200">
            {product.title}
          </h3>
          <p className="mt-1.5 text-sm text-slate-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
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

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.is_featured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-400 text-amber-950 text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-lg">
                <Sparkles className="w-3 h-3" />
                Featured
              </span>
            )}
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