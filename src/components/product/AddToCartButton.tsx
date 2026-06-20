"use client";

import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Variant {
  id: string;
  size: string;
  price: unknown;
  stockQuantity: number;
  productId: string;
  sku: string;
}

interface Product {
  id: string;
  name: string;
  images: { url: string }[];
  variants: Variant[];
  brand: { name: string };
}

export default function AddToCartButton({ product }: { product: Product }) {
  const { user } = useAuthStore();
  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants.find((v) => v.stockQuantity > 0)?.id ?? ""
  );
  const [added, setAdded] = useState(false);

  const availableVariants = product.variants.filter((v) => v.stockQuantity > 0);

  if (availableVariants.length === 0) {
    return (
      <button disabled className="w-full py-3 text-xs font-bold uppercase tracking-widest opacity-40 cursor-not-allowed"
        style={{ backgroundColor: "#F5A623", color: "#0A0A0A" }}>
        Sold Out
      </button>
    );
  }

  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId);

  const handleAddToCart = () => {
    if (!user) { router.push("/login"); return; }
    if (!selectedVariant) return;
    addItem({
      id: product.id,
      productVariantId: selectedVariant.id,
      name: product.name,
      brand: product.brand.name,
      size: selectedVariant.size,
      price: Number(selectedVariant.price),
      image: product.images[0]?.url ?? "",
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex flex-col gap-3">
      {availableVariants.length > 1 && (
        <div>
          <p className="text-xs uppercase tracking-widest text-zinc-500 mb-2">Select Size</p>
          <div className="flex flex-wrap gap-2">
            {availableVariants.map((v) => (
              <button key={v.id}
                onClick={() => setSelectedVariantId(v.id)}
                className="border px-3 py-2 text-xs transition-colors"
                style={{
                  borderColor: selectedVariantId === v.id ? "#F5A623" : "#3f3f46",
                  color: selectedVariantId === v.id ? "#F5A623" : "#d4d4d8",
                }}>
                UK {v.size}
              </button>
            ))}
          </div>
        </div>
      )}
      <button onClick={handleAddToCart}
        className="w-full py-3 text-xs font-bold uppercase tracking-widest transition-opacity hover:opacity-90"
        style={{ backgroundColor: "#F5A623", color: "#0A0A0A" }}>
        {added ? "Added to Bag" : "Add to Bag"}
      </button>
    </div>
  );
}