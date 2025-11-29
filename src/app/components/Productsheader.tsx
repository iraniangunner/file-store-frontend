interface ProductsHeaderProps {
  productsCount: number;
}

export default function ProductsHeader({ productsCount }: ProductsHeaderProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold">Products</h2>
      <p className="text-sm text-default-500 mt-1">{productsCount} products</p>
    </div>
  );
}
