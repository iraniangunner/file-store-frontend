import { ProductDetail } from "@/app/components/Productdetail";
import { Metadata } from "next";

type Props = {
  params: { slug: string };
};

type Product = {
  title: string;
  description: string;
  image_url: string;
  updated_at: string;
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  const baseUrl = "https://filerget.com";

  try {
    const res = await fetch(`${baseUrl}/api/products/${slug}`, {
      next: { revalidate: 60 * 60 }, // ISR: هر 1 ساعت بازسازی
    });

    if (!res.ok) throw new Error("Product not found");

    const product: Product = await res.json();

    return {
      title: product.title,
      description: product.description,
      openGraph: {
        title: product.title,
        description: product.description,
        url: `${baseUrl}/products/${slug}`,
        images: [
          {
            url: `${product.image_url}`,
            width: 800,
            height: 600,
          },
        ],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: product.title,
        description: product.description,
        images: [`${product.image_url}`],
      },
    };
  } catch (err) {
    // fallback metadata
    return {
      title: "Product",
      description: "Filerget Product",
    };
  }
}

// صفحه محصول امن
export default async function ProductPage({ params }: Props) {
  try {
    const res = await fetch(
      `https://filerget.com/api/products/${params.slug}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) throw new Error("Product not found");

    const product = await res.json();

    return <ProductDetail product={product} />;
  } catch (err) {
    console.error(err);
    return <div className="p-10 text-center">Product not found</div>;
  }
}
