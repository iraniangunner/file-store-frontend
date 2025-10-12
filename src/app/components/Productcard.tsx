import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Button,
  Image,
} from "@heroui/react";
import Link from "next/link";

export function ProductCard({ product }: any) {
  return (
    <Card
      key={product.id}
      shadow="sm"
      isHoverable
      isPressable
      className="w-[340px] rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      {/* <CardHeader className="p-0">
      <Image
        alt={product.title}
        // src={product.image || "/placeholder.png"}
        className="w-full h-[200px] object-cover rounded-t-2xl"
      />
    </CardHeader> */}

      <CardBody className="p-5">
        <h3 className="text-lg font-semibold mb-1 text-foreground">
          {product.title}
        </h3>
        <p className="text-sm text-default-500 line-clamp-2">
          {product.description}
        </p>
      </CardBody>

      <CardFooter className="flex items-center justify-between px-5 pb-4 pt-0">
        <span className="text-xl font-bold text-primary">${product.price}</span>
        <Button
          as={Link}
          href={`/products/${product.slug}`}
          color="primary"
          radius="full"
          size="sm"
        >
          View More
        </Button>
      </CardFooter>
    </Card>
  );
}
