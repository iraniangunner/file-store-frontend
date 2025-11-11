import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Image,
  Chip,
} from "@heroui/react";
import Link from "next/link";
import { ShoppingCart, Eye } from "lucide-react";

export function ProductCard({ product }: any) {
  const isFree = product.price == 0;

  return (
    <Card
      key={product.id}
      shadow="sm"
      className="group rounded-2xl transition-all duration-300 hover:shadow-2xl border border-divider overflow-hidden"
    >
      <CardHeader className="p-0 relative overflow-hidden">
        <div className="relative w-full h-[240px] overflow-hidden">
          <Image
            alt={product.title}
            src={
              product.image_url
                ? `https://filerget.com${product.image_url}`
                : "/images/folder.png"
            }
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            removeWrapper
          />
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {isFree && (
            <Chip
              color="success"
              variant="shadow"
              size="sm"
              className="absolute top-3 right-3 font-semibold"
            >
              Free
            </Chip>
          )}

          {/* <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              as={Link}
              href={`/products/${product.slug}`}
              color="primary"
              variant="shadow"
              size="lg"
              startContent={<Eye className="w-5 h-5" />}
              className="font-semibold"
            >
              Quick View
            </Button>
          </div> */}
        </div>
      </CardHeader>

      <CardBody className="p-5 space-y-2">
        <h3 className="text-lg font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {product.title}
        </h3>
        <p className="text-sm text-default-500 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
      </CardBody>

      <CardFooter className="flex items-center justify-between px-5 pb-5 pt-0 gap-2">
        <div className="flex flex-col">
          <span className="text-xs text-default-400">Price</span>
          <span className="text-2xl font-bold text-primary">
            ${product.price}
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            as={Link}
            href={`/products/${product.slug}`}
            color="primary"
            variant="flat"
            size="sm"
            // startContent={<ShoppingCart className="w-4 h-4" />}
            className="font-semibold"
          >
            View More
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
