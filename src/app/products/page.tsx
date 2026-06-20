import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: { status: "published" },
    include: {
      brand: true,
      images: { orderBy: { displayOrder: "asc" }, take: 1 },
      variants: { take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main style={{ backgroundColor: "#0A0A0A", fontFamily: "Inter, sans-serif", minHeight: "100vh" }}>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.3em] mb-2" style={{ color: "#F5A623" }}>Catalogue</p>
          <h1 className="text-3xl font-normal tracking-[0.1em] text-white" style={{ fontFamily: "Georgia, serif" }}>
            All Products
          </h1>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-zinc-500 text-sm mb-2">No products listed yet.</p>
            <p className="text-zinc-600 text-xs">Check back soon — new drops incoming.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`} className="group">
                <div className="border border-zinc-800 group-hover:border-zinc-600 transition-colors">
                  <div className="aspect-square bg-zinc-900 flex items-center justify-center overflow-hidden">
                    {product.images[0] ? (
                      <img src={product.images[0].url} alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="text-zinc-700 text-xs uppercase tracking-widest">No image</div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">{product.brand.name}</p>
                    <p className="text-white text-sm font-medium mb-2 leading-tight">{product.name}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold" style={{ color: "#F5A623" }}>
                        £{Number(product.variants[0]?.price ?? product.basePrice).toFixed(2)}
                      </p>
                      {product.offerEnabled && (
                        <span className="text-xs uppercase tracking-widest" style={{ color: "#D9483B" }}>Offers</span>
                      )}
                    </div>
                    <p className="text-zinc-600 text-xs mt-1 uppercase tracking-wide">{product.condition.replace(/_/g, " ")}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}