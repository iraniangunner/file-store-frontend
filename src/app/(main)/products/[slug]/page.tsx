import { ProductDetail } from "@/app/components/Productdetail";
import { Metadata } from "next";

type Props = {
  params: { slug: string };
};

// تولید پارامترهای static (در صورت نیاز)
// export async function generateStaticParams() {
//   try {
//     const res = await fetch("https://filerget.com/api/products", { next: { revalidate: 3600 } });
//     if (!res.ok) return [];
//     const data = await res.json();
//     if (!data?.data) return [];
//     return data.data.map((p: any) => ({ slug: p.slug }));
//   } catch {
//     return [];
//   }
// }



// // Metadata امن
// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   const { slug } = params;

//   try {
//     const res = await fetch(`https://filerget.com/api/products/${slug}`, { next: { revalidate: 3600 } });
//     if (!res.ok) throw new Error("Not found");

//     const product = await res.json();

//     return {
//       title: product.title?.substring(0, 60) || "Product",
//       description: product.description?.substring(0, 160) || "Filerget Product",
//       openGraph: {
//         title: product.title?.substring(0, 60) || "Product",
//         description: product.description?.substring(0, 160) || "Filerget Product",
//         images: [product.image_url].filter(Boolean), // فقط url معتبر
//       },
//       twitter: {
//         card: "summary_large_image",
//         title: product.title?.substring(0, 60) || "Product",
//         description: product.description?.substring(0, 160) || "Filerget Product",
//         images: [product.image_url].filter(Boolean),
//       },
//     };
//   } catch {
//     return {
//       title: "Product",
//       description: "Filerget Product",
//     };
//   }
// }

// صفحه محصول امن
export default async function ProductPage({ params }: Props) {
  try {
    const res = await fetch(`https://filerget.com/api/products/${params.slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error("Product not found");

    const product = await res.json();

    return <ProductDetail product={product} />;
  } catch (err) {
    console.error(err);
    return <div className="p-10 text-center">Product not found</div>;
  }
}

