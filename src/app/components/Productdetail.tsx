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
} from "lucide-react";

// Client-only components
const ProductDetailClient = dynamic(() => import("./Productdetailclient"), {
  ssr: false,
});
const CommentsSection = dynamic(() => import("./Commentsection"), {
  ssr: false,
});

// Helper function to format file size
function formatFileSize(bytes: string | number): string {
  const size = Number(bytes);
  if (size === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(size) / Math.log(k));
  return Math.round((size / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

// Helper function to get file type label
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="mb-6 text-sm text-gray-600">
          <Link href="/">Home</Link> / <Link href="/products">Products</Link> /{" "}
          {product.title}
        </div>

        {/* Back */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={16} />
          Back to Products
        </Link>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <div>
            <img
              src={product.image_url}
              alt={product.title}
              width={800}
              height={800}
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>

          {/* Text */}
          <div className="space-y-6">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              {product.title}
            </h1>

            <div className="text-4xl font-bold text-primary">
              {isFree ? "Free" : `$${product.price}`}
            </div>

            {/* Categories */}
            {product.categories && product.categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.categories.map((category: any) => (
                  <span
                    key={category.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                  >
                    <Tag size={14} />
                    {category.name}
                  </span>
                ))}
              </div>
            )}

            {/* File Info */}
            <div className="flex flex-wrap gap-3">
              {product.mime && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">
                  <File size={16} />
                  {getFileTypeLabel(product.mime)}
                </span>
              )}
              {product.file_size && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                  <HardDrive size={16} />
                  {formatFileSize(product.file_size)}
                </span>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed text-justify">
                {product.description}
              </p>
            </div>

            {/* Client Buttons (Like / Cart) */}
            <div className="mt-4">
              <ProductDetailClient product={product} />
            </div>

            {/* Feature Icons */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="flex flex-col items-center text-center gap-2 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <span className="text-primary text-2xl">
                  <Wallet />
                </span>
                <span className="text-xs text-gray-600">Crypto Payments</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <span className="text-primary text-2xl">
                  <Download />
                </span>
                <span className="text-xs text-gray-600">Instant Access</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <span className="text-primary text-2xl">
                  <Shield />
                </span>
                <span className="text-xs text-gray-600">
                  Blockchain Secured
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Comments */}
        <div className="mt-12">
          <CommentsSection productSlug={product.slug} />
        </div>
      </div>
    </div>
  );
}
