import Link from "next/link";

export type ProductCardData = {
  id: string;
  name: string;
  brandName: string;
  price: number;
  imageUrl: string | null;
  offerEnabled: boolean;
  condition: string;
};

export default function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-zinc-900">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[10px] uppercase tracking-widest text-zinc-700">
            No image
          </div>
        )}
        {product.offerEnabled && (
          <span
            className="absolute left-0 top-3 px-2 py-1 text-[10px] font-bold uppercase tracking-widest"
            style={{ backgroundColor: "#F5A623", color: "#0A0A0A" }}
          >
            Offers open
          </span>
        )}
      </div>
      <div className="pt-3">
        <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-zinc-500">{product.brandName}</p>
        <p className="mb-1 text-sm font-semibold uppercase leading-tight tracking-wide text-white">{product.name}</p>
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold" style={{ color: "#F5A623" }}>
            £{product.price.toFixed(2)}
          </p>
          <p className="text-[10px] uppercase tracking-wide text-zinc-600">{product.condition.replace(/_/g, " ")}</p>
        </div>
      </div>
    </Link>
  );
}
