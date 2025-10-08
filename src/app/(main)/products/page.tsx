"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
  Button,
  Skeleton,
} from "@heroui/react";
import { RefreshCcw, AlertCircle } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { Product } from "@/types";
import { ProductCard } from "@/app/components/Productcard";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get<Product[]>("/products");
        setProducts(res.data);
      } catch {
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // --- Loading ---
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center mb-16">
            {/* <h1 className="text-5xl font-semibold text-foreground mb-4">
              Our Products
            </h1>
            <p className="text-default-500 text-lg max-w-2xl mx-auto">
              Explore premium digital products crafted for creators and
              developers.
            </p> */}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
            {[...Array(3)].map((_, i) => (
              <Card
                key={i}
                className="w-[340px] space-y-4 p-4 rounded-2xl shadow-sm"
              >
                {/* <Skeleton className="h-[180px] w-full rounded-xl" /> */}
                <Skeleton className="h-4 w-3/4 rounded-lg" />
                <Skeleton className="h-4 w-1/2 rounded-lg" />
                <Skeleton className="h-10 w-full rounded-full" />
              </Card>
            ))}
          </div>
        </div>
      </div>
      // <div className="flex flex-wrap justify-center gap-8 p-10 bg-background">
      //   {[...Array(3)].map((_, i) => (
      //     <Card key={i} className="w-[340px] space-y-4 p-4 rounded-2xl shadow-sm">
      //       <Skeleton className="h-[180px] w-full rounded-xl" />
      //       <Skeleton className="h-4 w-3/4 rounded-lg" />
      //       <Skeleton className="h-4 w-1/2 rounded-lg" />
      //       <Skeleton className="h-10 w-full rounded-full" />
      //     </Card>
      //   ))}
      // </div>
    );
  }

  // --- Error ---
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center gap-4 p-6">
        <AlertCircle className="w-10 h-10 text-danger" />
        <p className="text-lg text-foreground font-medium">{error}</p>
        <Button
          startContent={<RefreshCcw size={16} />}
          color="primary"
          variant="flat"
          onPress={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  // --- Empty ---
  if (!products.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-10">
        <div className="text-7xl mb-4">🛍️</div>
        <h2 className="text-2xl font-semibold mb-2">No products available</h2>
        <p className="text-default-500">New products will be added soon!</p>
      </div>
    );
  }

  // --- Product List ---
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          {/* <h1 className="text-5xl font-semibold text-foreground mb-4">
            Our Products
          </h1>
          <p className="text-default-500 text-lg max-w-2xl mx-auto">
            Explore premium digital products crafted for creators and
            developers.
          </p> */}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
