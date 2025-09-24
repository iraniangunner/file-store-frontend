"use client";
import { useEffect, useState } from "react";
import api from "../../lib/api";
import { Product } from "../../types";
import Link from "next/link";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api.get<Product[]>("/products").then((res) => setProducts(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">محصولات</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.id} className="bg-white p-4 rounded shadow">
            <h3 className="font-bold">{p.title}</h3>
            <p className="text-sm text-gray-600">{p.description}</p>
            <div className="mt-2 flex items-center justify-between">
              <div className="text-green-600 font-semibold">${p.price}</div>
              <Link
                href={`/products/${p.id}`}
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                مشاهده و خرید
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
