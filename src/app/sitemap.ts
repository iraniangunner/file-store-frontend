import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://filerget.com";

  let products: { slug: string; updated_at?: string }[] = [];

  try {
    let page = 1;
    let lastPage = 1;

    do {
      const res = await fetch(`${baseUrl}/api/products?page=${page}`, {
        next: { revalidate: 60 * 60 },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.data)) {
          products.push(...data.data);
        }
        lastPage = data.last_page || 1;
        page++;
      } else {
        break; // اگر پاسخ خطا بود، از حلقه خارج شو
      }
    } while (page <= lastPage);
  } catch (e) {
    console.warn("⚠️ Error fetching products for sitemap:", e);
    products = [];
  }

  const staticRoutes = [
    "",
    "auth",
    "auth/google/callback",
    "cart",
    "contact-us",
    "dashboard/orders",
    "forgot-password",
    "payment-cancel",
    "payment-success",
    "products",
    "reset-password",
    "verify-email",
  ].map((path) => ({
    url: `${baseUrl}/${path}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1.0 : 0.7,
  }));

  const productRoutes = (products || []).map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: product.updated_at
      ? new Date(product.updated_at).toISOString()
      : new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // حذف مسیرهای ادمین
  const routes = [...staticRoutes, ...productRoutes].filter(
    (route) => !route.url.includes("/admin")
  );

  return routes;
}
