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


export function ProductCard({ product, view }: any) {
  const isFree = product.price == 0;

  const isList = view === "list";

  return (
    <Card
      key={product.id}
      shadow="sm"
      className={`group rounded-2xl transition-all duration-300 hover:shadow-2xl border border-divider overflow-hidden 
        ${isList ? "flex flex-row h-[200px]" : ""}`}
    >
      {/* IMAGE SECTION */}
      <CardHeader
        className={`p-0 relative overflow-hidden 
          ${isList ? "w-1/3 h-full" : ""}`}
      >
        <div className={`relative w-full ${isList ? "h-full" : "h-[240px]"} overflow-hidden`}>
          <Image
            alt={product.title}
            src={
              product.image_url
                ? `https://filerget.com${product.image_url}`
                : "/images/folder.png"
            }
            className={`w-full h-full object-cover transition-transform duration-500 
              group-hover:scale-110`}
            removeWrapper
          />

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
        </div>
      </CardHeader>

      {/* TEXT SECTION */}
      <div className={`${isList ? "w-2/3 flex flex-col justify-between" : ""}`}>
        <CardBody className={`p-5 space-y-2 ${isList ? "flex-1" : ""}`}>
          <h3 className="text-lg font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {product.title}
          </h3>
          <p className="text-sm text-default-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </CardBody>

        {/* FOOTER */}
        <CardFooter
          className={`flex items-center justify-between px-5 pb-5 pt-0 gap-2 
            ${isList ? "" : ""}`}
        >
          <div className="flex flex-col">
            <span className="text-xs text-default-400">Price</span>
            <span className="text-2xl font-bold text-primary">
              ${product.price}
            </span>
          </div>
          <Button
            as={Link}
            href={`/products/${product.slug}`}
            color="primary"
            variant="flat"
            size="sm"
            className="font-semibold"
          >
            View More
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
