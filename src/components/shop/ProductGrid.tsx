import * as React from "react";
import { ProductCard } from "../product/ProductCard";
import { Product } from "@/types";

interface ProductGridProps {
  products: Product[];
}

export const ProductGrid = ({ products }: ProductGridProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
};
