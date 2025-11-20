
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft, Wallet, Download, Shield } from "lucide-react";

// کامپوننت‌های Client-only
const ProductDetailClient = dynamic(() => import("./Productdetailclient"), {
  ssr: false,
});
const CommentsSection = dynamic(() => import("./Commentsection"), {
  ssr: false,
});

export function ProductDetail({ product }: { product: any }) {
  const isFree = Number(product.price) === 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumbs ساده */}
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
              className="w-full h-auto object-cover"
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

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed text-justify">
                {product.description}
              </p>
            </div>

            {/* ⭐ Client Buttons (Like / Cart) */}
            <div className="mt-4">
              <ProductDetailClient product={product} />
            </div>

            {/* Feature Icons ساده */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="flex flex-col items-center text-center gap-2 p-4 bg-gray-50 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <span className="text-primary text-2xl">
                  <Wallet />
                </span>
                <span className="text-xs text-gray-600">Crypto Payments</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2 p-4 bg-gray-50 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <span className="text-primary text-2xl">
                  <Download />
                </span>
                <span className="text-xs text-gray-600">Instant Access</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2 p-4 bg-gray-50 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
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
