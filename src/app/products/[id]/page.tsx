import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/product/AddToCartButton";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      brand: true,
      category: true,
      images: { orderBy: { displayOrder: "asc" } },
      variants: true,
    },
  });

  if (!product || product.status !== "published") return notFound();

  const mainImage = product.images[0]?.url;

  return (
    <main style={{ backgroundColor: "#0A0A0A", fontFamily: "Inter, sans-serif", minHeight: "100vh" }}>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-square bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden">
            {mainImage ? (
              <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="text-zinc-700 text-xs uppercase tracking-widest">No image</div>
            )}
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-xs uppercase tracking-[0.3em] mb-2" style={{ color: "#F5A623" }}>
              {product.brand.name}
            </p>
            <h1 className="text-2xl font-normal tracking-wide text-white mb-2" style={{ fontFamily: "Georgia, serif" }}>
              {product.name}
            </h1>
            <div style={{ width: 32, height: 1, backgroundColor: "#F5A623", marginBottom: 16 }} />
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">{product.description}</p>
            <div className="mb-6 space-y-2">
              <div className="flex justify-between text-xs border-b border-zinc-800 pb-2">
                <span className="text-zinc-500 uppercase tracking-widest">Condition</span>
                <span className="text-zinc-300">{product.condition.replace(/_/g, " ")}</span>
              </div>
              {product.category && (
                <div className="flex justify-between text-xs border-b border-zinc-800 pb-2">
                  <span className="text-zinc-500 uppercase tracking-widest">Category</span>
                  <span className="text-zinc-300">{product.category.name}</span>
                </div>
              )}
            </div>
            {product.variants.length > 0 && (
              <div className="mb-8">
                <p className="text-xs uppercase tracking-widest text-zinc-500 mb-3">Available Sizes</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <div key={v.id} className="border border-zinc-700 px-3 py-2 text-xs text-zinc-300 flex flex-col items-center gap-1">
                      <span>UK {v.size}</span>
                      <span className="font-bold" style={{ color: "#F5A623" }}>£{Number(product.basePrice).toFixed(2)}</span>
                      {v.stockQuantity === 0 && <span className="text-zinc-600">Sold</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex flex-col gap-3">
              <AddToCartButton product={{
                id: product.id,
                name: product.name,
                images: product.images,
                variants: product.variants.map((v) => ({
                  id: v.id,
                  size: v.size,
                  price: Number(product.basePrice),
                  stockQuantity: v.stockQuantity,
                  productId: v.productId,
                  sku: v.sku,
                })),
                brand: product.brand,
              }} />
              {product.offerEnabled && (
                <button className="w-full py-3 text-xs font-bold uppercase tracking-widest border transition-colors"
                  style={{ borderColor: "#D9483B", color: "#D9483B" }}>
                  Make an Offer
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}