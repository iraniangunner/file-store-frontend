"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import type { Product } from "@/types";
import toast, { Toaster } from "react-hot-toast";
import {
  Button,
  Spinner,
  Card,
  CardBody,
  Chip,
  Divider,
  Tabs,
  Tab,
  Image,
  Breadcrumbs,
  BreadcrumbItem,
} from "@heroui/react";
import { useCart } from "@/context/CartContext";
import {
  ShoppingCart,
  Heart,
  Share2,
  Minus,
  Plus,
  Star,
  Package,
  Truck,
  Shield,
  ArrowLeft,
  Wallet,
  Download,
} from "lucide-react";
import Link from "next/link";
import { CommentsSection } from "@/app/components/Commentsection";
import { ProductRating } from "./Productrating";

export function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  // const [quantity, setQuantity] = useState(1);
  // const [selectedImage, setSelectedImage] = useState(0);
  // const [relatedProducts, setRelatedProducts] = useState<Product[] | null>([]);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [liking, setLiking] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    if (!slug) return;

    async function fetchData() {
      try {
        // درخواست اصلی محصول (همیشه جواب میده)
        const productRes = await api.get(`/products/${slug}`);
        setProduct(productRes.data);
      } catch (err) {
        toast.error("Error loading product data");
        return;
      }

      // درخواست like status (نیاز به login)
      try {
        const likeStatusRes = await api.get(`/products/${slug}/like/status`);
        setLiked(likeStatusRes.data.liked);
      } catch (err) {
        setLiked(false); // اگه لاگین نیست، فرض کن لایک نشده
      }

      // درخواست like count (معمولاً public است)
      try {
        const likeCountRes = await api.get(`/products/${slug}/likes/count`);
        setLikesCount(likeCountRes.data.likes);
      } catch (err) {
        setLikesCount(0); // اگه مشکلی بود، صفر فرض کن
      }
    }

    fetchData();
  }, [slug]);

  //   useEffect(() => {
  //     async function fetchRelated() {
  //       if (!product) return;

  //       try {
  //         const categoryIds = product.categories.map((c:any) => c.id).join(",");
  //         // API عمومی products با فیلتر دسته‌بندی
  //         const res = await api.get(`/products?categories=${categoryIds}`);
  //         console.log(res.data.data)
  //         // محصول جاری را حذف می‌کنیم
  //         const related = res.data.data.filter((p: Product) => p.id !== product.id);
  //         setRelatedProducts(related);
  //       } catch (err) {
  //         console.error("Failed to fetch related products", err);
  //       }
  //     }

  //     fetchRelated();
  //   }, [product]);

  async function handleAddToCart() {
    if (!product) return;
    setCreating(true);
    try {
      await addToCart(product.id, 1);
    } catch (error) {
    } finally {
      setCreating(false);
    }
  }

  async function handleToggleLike() {
    if (!product || liking) return;
    setLiking(true);
    try {
      const res = await api.post(`/products/${slug}/like`);
      setLiked(res.data.liked);
      setLikesCount((prev) => (res.data.liked ? prev + 1 : prev - 1));
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error("Please login first");
      } else {
        toast.error("Error toggling like");
      }
    } finally {
      setLiking(false);
    }
  }

  // const incrementQuantity = () => {
  //   setQuantity((prev) => prev + 1);
  // };

  // const decrementQuantity = () => {
  //   if (quantity > 1) setQuantity((prev) => prev - 1);
  // };

  if (!product)
    return (
      <div className="min-h-[80vh] flex justify-center items-center">
        <Spinner size="lg" color="primary" />
      </div>
    );

  const isFree = Number(product.price) === 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Toaster position="top-center" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 overflow-hidden">
          <Breadcrumbs>
            <BreadcrumbItem>
              <Link href="/">Home</Link>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <Link href="/products">Products</Link>
            </BreadcrumbItem>
            <BreadcrumbItem>{product.title}</BreadcrumbItem>
          </Breadcrumbs>
        </div>

        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={16} />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div>
            {product.image_url && (
              <div className="overflow-hidden">
                <Image
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  radius="none"
                />
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                {product.title}
              </h1>

              {product.id && <ProductRating productSlug={product.slug} />}
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-primary">
                {isFree ? "Free" : `$${product.price}`}
              </span>
            </div>

            <Divider />

            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed text-justify">
                {product.description}
              </p>
            </div>

            <Divider />

            <div className="space-y-4">
              {/* <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center gap-2">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    onPress={decrementQuantity}
                    isDisabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </Button>
                  <span className="w-12 text-center font-semibold">
                    {quantity}
                  </span>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    onPress={incrementQuantity}
                    isDisabled={
                      !isInStock || (product.stock && quantity >= product.stock)
                    }
                  >
                    <Plus size={16} />
                  </Button>
                </div>
                {product.stock && (
                  <span className="text-sm text-gray-500">
                    {product.stock} available
                  </span>
                )}
              </div> */}

              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-[#3B9FE8] to-[#3D3D8F] text-white font-semibold"
                  startContent={
                    creating ? (
                      <Spinner size="sm" color="white" />
                    ) : (
                      <ShoppingCart size={20} />
                    )
                  }
                  onPress={handleAddToCart}
                >
                  {creating ? "Adding..." : "Add to Cart"}
                </Button>
                <Button
                  isIconOnly
                  size="lg"
                  variant={liked ? "solid" : "bordered"}
                  color="danger"
                  onPress={handleToggleLike}
                  isDisabled={liking}
                >
                  {liking ? (
                    <Spinner size="sm" color="danger" />
                  ) : (
                    <Heart
                      size={20}
                      className={liked ? "fill-red-500" : "text-red-500"}
                    />
                  )}
                </Button>

                <span className="text-sm text-gray-600">{likesCount}</span>
                <Button
                  isIconOnly
                  size="lg"
                  variant="bordered"
                  onPress={() => {
                    if (!product) return;
                    const url = `https://filerget.com/products/${product.slug}`;

                    // اگر مرورگر قابلیت share داشته باشه
                    if (navigator.share) {
                      navigator
                        .share({
                          title: product.title,
                          url,
                        })
                        .catch((err) => console.error("Share failed:", err));
                    } else {
                      // fallback: کپی به clipboard
                      navigator.clipboard.writeText(url);
                      toast.success("Product URL copied to clipboard!");
                    }
                  }}
                >
                  <Share2 size={20} />
                </Button>
              </div>
            </div>

            <Card className="bg-gray-50">
              <CardBody>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center text-center gap-2">
                    <Wallet size={24} className="text-primary" />
                    <span className="text-xs text-gray-600">
                      Crypto Payments
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-2">
                    <Download size={24} className="text-primary" />
                    <span className="text-xs text-gray-600">
                      Instant Access
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-2">
                    <Shield size={24} className="text-primary" />
                    <span className="text-xs text-gray-600">
                      Blockchain Secured
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>

        <div className="mt-12">
          <CommentsSection productSlug={slug} />
        </div>

        {/* {relatedProducts.length > 0 && (
  <div className="mt-12">
    <h2 className="text-2xl font-bold mb-6">Related Products</h2>
    <div className="flex gap-6 overflow-x-auto scrollbar-none px-2 py-1">
      {relatedProducts.map((rp) => (
        <Card
          key={rp.id}
          className="min-w-[220px] flex-shrink-0 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl"
        >
          <CardBody className="p-2">
            <Link href={`/products/${rp.slug}`}>
              <div className="overflow-hidden rounded-lg relative group">
                <Image
                  src={rp.image_url ? `https://filerget.com/${rp.image_url}` : "/placeholder.svg"}
                  alt={rp.title}
                  className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="mt-3 font-semibold text-sm text-gray-800 truncate">{rp.title}</h3>
              <span className="text-primary font-bold text-sm">
                {Number(rp.price) === 0 ? "Free" : `$${rp.price}`}
              </span>
            </Link>
          </CardBody>
        </Card>
      ))}
    </div>
  </div>
        )} */}
      </div>
    </div>
  );
}
