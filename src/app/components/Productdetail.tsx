import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ArrowLeft,
  Wallet,
  Download,
  Shield,
  File,
  HardDrive,
  Tag,
  ChevronRight,
  Star,
  Eye,
  Zap,
  Lock,
} from "lucide-react";

const ProductDetailClient = dynamic(() => import("./Productdetailclient"), {
  ssr: false,
  loading: () => (
    <div className="space-y-4 animate-pulse">
      {/* Add to Cart Skeleton */}
      <div className="w-full h-14 bg-slate-200 rounded-2xl"></div>

      {/* Like + Share Skeleton */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-12 bg-slate-200 rounded-xl"></div>
        <div className="flex-1 h-12 bg-slate-200 rounded-xl"></div>
      </div>
    </div>
  ),
});

const CommentsSection = dynamic(() => import("./Commentsection"), {
  ssr: false,
  loading: () => (
    <div className="space-y-8 animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-200" />
        <div>
          <div className="h-6 w-40 bg-slate-200 rounded-lg mb-2" />
          <div className="h-4 w-24 bg-slate-100 rounded-lg" />
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="h-4 w-32 bg-slate-200 rounded mb-4" />
        <div className="h-28 w-full bg-slate-100 rounded-xl mb-4" />
        <div className="flex items-center justify-between">
          <div className="h-3 w-48 bg-slate-100 rounded" />
          <div className="h-10 w-32 bg-slate-300 rounded-xl" />
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-200 p-6"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-slate-200" />
              <div className="flex-1">
                <div className="h-4 w-36 bg-slate-200 rounded mb-2" />
                <div className="h-3 w-20 bg-slate-100 rounded" />
              </div>
            </div>
            <div className="h-4 w-full bg-slate-100 rounded mb-2" />
            <div className="h-4 w-3/4 bg-slate-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  ),
});

const SimilarProductsSlider = dynamic(() => import("./Similarproducts"), {
  ssr: false,
  loading: () => (
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
  ),
});

function formatFileSize(bytes: string | number): string {
  const size = Number(bytes);
  if (size === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(size) / Math.log(k));
  return Math.round((size / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

function getFileTypeLabel(mime: string): string {
  const mimeMap: Record<string, string> = {
    "application/pdf": "PDF",
    "application/epub+zip": "EPUB",
    "application/zip": "ZIP",
    "application/x-zip-compressed": "ZIP",
    "image/jpeg": "JPEG",
    "image/png": "PNG",
    "video/mp4": "MP4",
    "audio/mpeg": "MP3",
  };
  return mimeMap[mime] || mime.split("/")[1]?.toUpperCase() || "FILE";
}

export function ProductDetail({ product }: { product: any }) {
  const isFree = Number(product.price) === 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/50">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-violet-100/40 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-sky-100/40 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm mb-6">
          <Link
            href="/"
            className="text-slate-500 hover:text-slate-700 transition-colors"
          >
            Home
          </Link>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <Link
            href="/products"
            className="text-slate-500 hover:text-slate-700 transition-colors"
          >
            Products
          </Link>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <span className="text-slate-900 font-medium truncate max-w-[200px]">
            {product.title}
          </span>
        </nav>

        {/* Back Button */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200 mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Products
        </Link>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden group">
              {/* Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {isFree && (
                  <span className="inline-flex items-center px-3 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-lg">
                    FREE
                  </span>
                )}
                {product.is_featured && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-400 text-amber-950 text-xs font-bold rounded-lg shadow-lg">
                    <Star className="w-3 h-3 fill-current" />
                    Featured
                  </span>
                )}
              </div>

              <img
                src={product.image_url}
                alt={product.title}
                className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Title & Price */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight mb-4">
                {product.title}
              </h1>
              <div className="flex items-baseline gap-3">
                <span
                  className={`text-4xl font-bold ${
                    isFree
                      ? "text-emerald-600"
                      : "bg-gradient-to-r from-violet-600 to-violet-700 bg-clip-text text-transparent"
                  }`}
                >
                  {isFree ? "Free" : `$${product.price}`}
                </span>
                {!isFree && <span className="text-sm text-slate-400">USD</span>}
              </div>
            </div>

            {/* Categories */}
            {product.categories && product.categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.categories.map((category: any) => (
                  <span
                    key={category.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 text-violet-700 rounded-lg text-sm font-medium border border-violet-100"
                  >
                    <Tag className="w-3.5 h-3.5" />
                    {category.name}
                  </span>
                ))}
              </div>
            )}

            {/* File Info Pills */}
            <div className="flex flex-wrap gap-3">
              {product.mime && (
                <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                    <File className="w-4 h-4 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                      Format
                    </p>
                    <p className="text-sm font-semibold text-slate-900">
                      {getFileTypeLabel(product.mime)}
                    </p>
                  </div>
                </div>
              )}
              {product.file_size && (
                <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <HardDrive className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                      Size
                    </p>
                    <p className="text-sm font-semibold text-slate-900">
                      {formatFileSize(product.file_size)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-slate-200/60 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                Description
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Client Buttons */}
            <ProductDetailClient product={product} />

            {/* Feature Cards */}
            <div className="grid grid-cols-3 gap-3 pt-4">
              <div className="flex flex-col items-center text-center gap-2 p-4 bg-white rounded-2xl border border-slate-200/60 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-100 to-violet-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Wallet className="w-5 h-5 text-violet-600" />
                </div>
                <span className="text-xs font-medium text-slate-600">
                  Crypto Payments
                </span>
              </div>
              <div className="flex flex-col items-center text-center gap-2 p-4 bg-white rounded-2xl border border-slate-200/60 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-100 to-sky-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Zap className="w-5 h-5 text-sky-600" />
                </div>
                <span className="text-xs font-medium text-slate-600">
                  Instant Access
                </span>
              </div>
              <div className="flex flex-col items-center text-center gap-2 p-4 bg-white rounded-2xl border border-slate-200/60 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Lock className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="text-xs font-medium text-slate-600">
                  Secure Download
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        <SimilarProductsSlider productSlug={product.slug} />

        {/* Comments */}
        <div className="mt-16">
          <CommentsSection productSlug={product.slug} />
        </div>
      </div>
    </div>
  );
}
