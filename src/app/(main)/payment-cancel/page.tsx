import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow text-center">
      <h1 className="text-2xl font-bold text-red-600 mb-3">Payment Cancelled ❌</h1>
      <p className="mb-4 text-gray-600">
        Unfortunately, your payment was not completed. You can try again.
      </p>
      <Link
        href="/products"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Back to Store
      </Link>
    </div>
  );
}

