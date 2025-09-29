"use client";
import { useEffect, useState } from "react";
import api from "../../lib/api";
import { Product } from "../../types";
import Link from "next/link";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Skeleton,
} from "@heroui/react";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      api.get<Product[]>("/products").then((res) => {
        setProducts(res.data);
        setLoading(false);
      });
    } catch (error) {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <Skeleton className="h-12 w-48 mx-auto mb-6 rounded-lg" />
            <Skeleton className="h-6 w-96 mx-auto rounded-lg" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="w-full space-y-5 p-4" radius="lg">
                <Skeleton className="rounded-lg">
                  <div className="h-48 rounded-lg bg-default-300"></div>
                </Skeleton>
                <div className="space-y-3">
                  <Skeleton className="w-3/5 rounded-lg">
                    <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
                  </Skeleton>
                  <Skeleton className="w-4/5 rounded-lg">
                    <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
                  </Skeleton>
                  <Skeleton className="w-2/5 rounded-lg">
                    <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
                  </Skeleton>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-light text-foreground mb-6 text-balance">
            محصولات
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            مجموعه‌ای از بهترین محصولات با کیفیت برتر و طراحی مدرن
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card
              key={product.id}
              className="group hover:scale-105 transition-all duration-300"
              shadow="sm"
              isPressable
              isHoverable
            >
              {/* Product Image */}
              {/* <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <div className="w-full aspect-[4/3] bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center mb-4">
                  <div className="text-6xl opacity-30">📦</div>
                </div>
                <Chip color="primary" variant="flat" size="sm">
                  جدید
                </Chip>
              </CardHeader> */}

              {/* Product Content */}
              <CardBody className="overflow-visible py-2">
                <h3 className="text-xl font-semibold text-foreground mb-2 text-balance">
                  {product.title}
                </h3>
                <p className="text-default-500 text-sm leading-relaxed text-pretty">
                  {product.description}
                </p>
              </CardBody>

              {/* Price and Action */}
              <CardFooter className="pt-0">
                <div className="flex items-center justify-between w-full">
                  <div className="text-2xl font-bold text-success">
                    ${product.price}
                  </div>
                  <Button
                    as={Link}
                    href={`/products/${product.id}`}
                    color="primary"
                    variant="solid"
                    size="sm"
                    radius="full"
                  >
                    مشاهده و خرید
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">🛍️</div>
            <h3 className="text-2xl font-light text-foreground mb-4">
              هیچ محصولی یافت نشد
            </h3>
            <p className="text-muted-foreground">
              محصولات جدید به زودی اضافه خواهند شد
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
