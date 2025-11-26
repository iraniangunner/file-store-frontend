import { Metadata } from "next";
import dynamic from "next/dynamic";

const ProductGrid = dynamic(() => import("@/app/components/Productgrid"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "Filerget | products",
  description:
    "Digital files, made simple Buy and download what you need Instantly, Safely, Securely",
};

export default function ProductsPage() {
  return (
    <div className="min-h-screen">
      <ProductGrid />
    </div>
  );
}

