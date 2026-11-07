import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard, { type ProductCardData } from "@/components/product/ProductCard";

export const dynamic = "force-dynamic";

async function getLatestProducts(): Promise<ProductCardData[]> {
  try {
    const products = await prisma.product.findMany({
      where: { status: "published" },
      include: {
        brand: true,
        images: { orderBy: { displayOrder: "asc" }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    });
    return products.map((p) => ({
      id: p.id,
      name: p.name,
      brandName: p.brand.name,
      price: Number(p.basePrice),
      imageUrl: p.images[0]?.url ?? null,
      offerEnabled: p.offerEnabled,
      condition: p.condition,
    }));
  } catch (err) {
    // Keep the homepage up even if the database is unreachable.
    console.error("Homepage product query failed", err);
    return [];
  }
}

export default async function HomePage() {
  const products = await getLatestProducts();
  const heroImage = products.find((p) => p.imageUrl)?.imageUrl ?? null;

  return (
    <main style={{ backgroundColor: "#0A0A0A", fontFamily: "Inter, sans-serif" }}>

      {/* HERO */}
      <section className="relative isolate flex min-h-[80vh] items-end overflow-hidden md:min-h-[88vh]">
        {heroImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={heroImage}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 -z-20 h-full w-full object-cover opacity-60"
          />
        ) : (
          <div
            className="absolute inset-0 -z-20"
            style={{ background: "radial-gradient(ellipse at 70% 30%, rgba(245,166,35,0.18), transparent 60%)" }}
          />
        )}
        <div
          className="absolute inset-0 -z-10"
          style={{ background: "linear-gradient(to top, #0A0A0A 8%, rgba(10,10,10,0.55) 45%, rgba(10,10,10,0.25) 100%)" }}
        />

        <div className="mx-auto w-full max-w-6xl px-4 pb-14 md:pb-20">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em]" style={{ color: "#F5A623" }}>
            Authenticated sneakers &amp; streetwear
          </p>
          <h1 className="mb-6 text-6xl font-black uppercase leading-[0.9] tracking-tight text-white md:text-8xl lg:text-9xl">
            Street<span style={{ color: "#F5A623" }}>Heat</span>
          </h1>
          <p className="mb-8 max-w-md text-sm leading-relaxed text-zinc-300">
            Every pair authenticated. UK delivery. Make an offer, earn loyalty points, own the heat.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/products"
              className="px-10 py-4 text-xs font-bold uppercase tracking-widest transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#F5A623", color: "#0A0A0A" }}>
              Shop the drop
            </Link>
            <Link href="/personal-shopping"
              className="border border-zinc-600 px-10 py-4 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:border-white">
              Personal shopping
            </Link>
          </div>
        </div>
      </section>

      {/* LATEST DROPS */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.3em]" style={{ color: "#F5A623" }}>Just landed</p>
            <h2 className="text-3xl font-black uppercase tracking-tight text-white md:text-4xl">Latest drops</h2>
          </div>
          <Link href="/products"
            className="text-xs uppercase tracking-widest text-zinc-400 underline-offset-4 transition-colors hover:text-white hover:underline">
            View all
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="border border-zinc-800 py-20 text-center">
            <p className="mb-2 text-sm text-zinc-400">New drops incoming.</p>
            <p className="text-xs text-zinc-600">Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-4 md:gap-x-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* DIVIDER */}
      <div className="max-w-6xl mx-auto px-4">
        <div style={{ height: 1, backgroundColor: "#1a1a1a" }} />
      </div>

      {/* WHY STREETHEAT */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <p className="text-xs uppercase tracking-[0.3em] mb-12 text-center" style={{ color: "#F5A623" }}>Why StreetHeat</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Authenticated", body: "Every item verified before it ships. No fakes, no compromises." },
            { title: "Make an Offer", body: "See something you want? Submit an offer and we'll work with you on price." },
            { title: "Loyalty Rewards", body: "Earn points on every purchase. Bronze, Silver, Gold — the more you buy, the more you unlock." },
          ].map((item) => (
            <div key={item.title} className="border border-zinc-800 p-8">
              <div style={{ width: 24, height: 1, backgroundColor: "#F5A623", marginBottom: 16 }} />
              <h3 className="text-white text-sm font-bold uppercase tracking-widest mb-3">{item.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DIVIDER */}
      <div className="max-w-6xl mx-auto px-4">
        <div style={{ height: 1, backgroundColor: "#1a1a1a" }} />
      </div>

      {/* PERSONAL SHOPPING */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.3em] mb-6" style={{ color: "#F5A623" }}>Personal Shopping</p>
          <h2 className="text-3xl font-normal tracking-[0.1em] text-white mb-6" style={{ fontFamily: "Georgia, serif" }}>
            Can't find what you're looking for?
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed mb-4">
            Our personal shopping service sources and styles for you. Tell us the sneaker, the colourway, the size — we'll find it. Or let us build you a full look based on your taste and budget.
          </p>
          <p className="text-zinc-500 text-xs mb-8">
            Concierge sourcing · Styled outfits · UK delivery
          </p>
          <Link href="/personal-shopping"
            className="inline-block px-8 py-3 text-xs font-bold uppercase tracking-widest transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#F5A623", color: "#0A0A0A" }}>
            Find Out More
          </Link>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="max-w-6xl mx-auto px-4">
        <div style={{ height: 1, backgroundColor: "#1a1a1a" }} />
      </div>

      {/* LOYALTY */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <p className="text-xs uppercase tracking-[0.3em] mb-12 text-center" style={{ color: "#F5A623" }}>Loyalty Programme</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { tier: "Bronze", points: "0+ pts", perks: "1pt per £1 spent · Standard delivery", color: "#CD7F32" },
            { tier: "Silver", points: "500+ pts", perks: "1.25pts per £1 · Free delivery over £75 · Early access", color: "#C0C0C0" },
            { tier: "Gold", points: "1500+ pts", perks: "1.5pts per £1 · Free delivery · Priority offers · Exclusive drops", color: "#F5A623" },
          ].map((t) => (
            <div key={t.tier} className="border border-zinc-800 p-8 text-center">
              <div className="text-2xl font-bold mb-2" style={{ color: t.color, fontFamily: "Georgia, serif" }}>{t.tier}</div>
              <div className="text-xs text-zinc-500 mb-4 uppercase tracking-widest">{t.points}</div>
              <p className="text-zinc-400 text-xs leading-relaxed">{t.perks}</p>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}