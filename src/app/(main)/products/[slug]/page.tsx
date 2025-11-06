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
} from "lucide-react";
import Link from "next/link";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!slug) return;

    api
      .get<Product>(`/products/${slug}`)
      .then((res) => setProduct(res.data))
      .catch((err) => {
        if (err.response?.status === 401) toast.error("Please login first");
        else toast.error("Something went wrong");
      });
  }, [slug]);

  async function handleAddToCart() {
    if (!product) return;
    setCreating(true);
    try {
      await addToCart(product.id, quantity);
      // toast.success(`Added ${quantity} item(s) to cart`)
    } catch (error) {
      // toast.error("Failed to add to cart")
    } finally {
      setCreating(false);
    }
  }

  const incrementQuantity = () => {
    // if (product?.stock && quantity >= product.stock) return;
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  if (!product)
    return (
      <div className="min-h-[80vh] flex justify-center items-center">
        <Spinner size="lg" color="primary" />
      </div>
    );

  // const productImages = product.images || [
  //   product.image ||
  //     `/placeholder.svg?height=600&width=600&query=${encodeURIComponent(
  //       product.title
  //     )}`,
  // ];

  // const isInStock = !product.stock || product.stock > 0;
  const isFree = Number(product.price) === 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Toaster position="top-center" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
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
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <CardBody className="p-0">
                {/* <Image
                  src={productImages[selectedImage] || "/placeholder.svg"}
                  alt={product.title}
                  className="w-full aspect-square object-cover"
                  radius="none"
                /> */}
              </CardBody>
            </Card>

            {/* {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {productImages.map((img, idx) => (
                  <Card
                    key={idx}
                    isPressable
                    onPress={() => setSelectedImage(idx)}
                    className={`overflow-hidden cursor-pointer transition-all ${
                      selectedImage === idx
                        ? "ring-2 ring-primary"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <CardBody className="p-0">
                      <Image
                        src={img || "/placeholder.svg"}
                        alt={`${product.title} ${idx + 1}`}
                        className="w-full aspect-square object-cover"
                        radius="none"
                      />
                    </CardBody>
                  </Card>
                ))}
              </div>
            )} */}
          </div>

          <div className="space-y-6">

            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                {product.title}
              </h1>
              {/* {product.rating && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={
                          i < Math.floor(product.rating!)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating} ({product.reviews || 0} reviews)
                  </span>
                </div>
              )} */}
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-primary">
                {isFree ? "Free" : `$${product.price}`}
              </span>
              {/* {!isFree && (
                <span className="text-xl text-gray-400 line-through">
                  ${(Number(product.price) * 1.2).toFixed(2)}
                </span>
              )} */}
            </div>

            <Divider />

            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* {product.features && product.features.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )} */}

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
                  color="primary"
                  size="lg"
                  className="flex-1"
                  startContent={
                    creating ? (
                      <Spinner size="sm" color="white" />
                    ) : (
                      <ShoppingCart size={20} />
                    )
                  }
                  onPress={handleAddToCart}
                  // isDisabled={!isInStock || creating}
                >
                  {creating ? "Adding..." : "Add to Cart"}
                </Button>
                <Button isIconOnly size="lg" variant="bordered" color="danger">
                  <Heart size={20} />
                </Button>
                <Button isIconOnly size="lg" variant="bordered">
                  <Share2 size={20} />
                </Button>
              </div>
            </div>

            <Card className="bg-gray-50">
              <CardBody>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center text-center gap-2">
                    <Truck size={24} className="text-primary" />
                    <span className="text-xs text-gray-600">Free Shipping</span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-2">
                    <Shield size={24} className="text-primary" />
                    <span className="text-xs text-gray-600">
                      Secure Payment
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-2">
                    <Package size={24} className="text-primary" />
                    <span className="text-xs text-gray-600">Easy Returns</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>

        <div className="mt-12">
          {/* <Card>
            <CardBody>
              <Tabs aria-label="Product information" size="lg" fullWidth>
                <Tab key="description" title="Description">
                  <div className="py-6">
                    <p className="text-gray-600 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                </Tab>
                {product.specifications && (
                  <Tab key="specifications" title="Specifications">
                    <div className="py-6">
                      <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(product.specifications).map(
                          ([key, value]) => (
                            <div key={key} className="flex flex-col gap-1">
                              <dt className="text-sm font-semibold text-gray-900">
                                {key}
                              </dt>
                              <dd className="text-sm text-gray-600">{value}</dd>
                            </div>
                          )
                        )}
                      </dl>
                    </div>
                  </Tab>
                )}
                <Tab key="reviews" title={`Reviews (0)`}>
                  <div className="py-6 text-center text-gray-500">
                    No reviews yet. Be the first to review this product!
                  </div>
                </Tab>
              </Tabs>
            </CardBody>
          </Card> */}
        </div>
      </div>
    </div>
  );
}
