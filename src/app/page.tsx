import Link from "next/link"

export default function HomePage() {
  return (
    <div className="text-center py-16">
      <h1 className="text-3xl font-bold mb-4">فروشگاه فایل</h1>
      <p className="text-gray-600 mb-6">
        محصولات را ببین، بخرید و فایل را با لینک امن دانلود کن.
      </p>
      <Link
        href="/products"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        مشاهده محصولات
      </Link>
    </div>
  )
}
