interface ProductsHeaderProps {
  productsCount: number;
  // loading: boolean;
}

export default function ProductsHeader({
  productsCount,
  // loading,
}: ProductsHeaderProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold">Products</h2>
      {/* {!loading && ( */}
        <p className="text-sm text-default-500 mt-1">
          {productsCount} products
        </p>
      {/* )} */}
    </div>
  );
}
