import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ backgroundColor: "#0A0A0A", fontFamily: "Inter, sans-serif" }}>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-4 py-24 flex flex-col items-center text-center">
        <p className="text-xs uppercase tracking-[0.3em] mb-6" style={{ color: "#F5A623" }}>
          Authenticated Sneakers & Streetwear
        </p>
        <h1 className="text-5xl md:text-7xl font-normal tracking-[0.15em] text-white mb-6"
          style={{ fontFamily: "Georgia, serif" }}>
          STREET<span style={{ color: "#F5A623" }}>HEAT</span>
        </h1>
        <p className="text-zinc-400 text-sm max-w-md leading-relaxed mb-10">
          Premium resale. Every pair authenticated. Make an offer, earn loyalty points, own the heat.
        </p>
        <div className="flex gap-4">
          <Link href="/products"
            className="px-8 py-3 text-xs font-bold uppercase tracking-widest transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#F5A623", color: "#0A0A0A" }}>
            Shop Now
          </Link>
          <Link href="/personal-shopping"
            className="px-8 py-3 text-xs font-bold uppercase tracking-widest border border-zinc-700 text-zinc-300 hover:border-zinc-400 transition-colors">
            Personal Shopping
          </Link>
        </div>
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

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid #1a1a1a" }} className="py-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm tracking-[0.15em] text-white" style={{ fontFamily: "Georgia, serif" }}>
            STREET<span style={{ color: "#F5A623" }}>HEAT</span>
          </span>
          <p className="text-zinc-600 text-xs">© 2026 StreetHeat. UK only. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/products" className="text-zinc-500 text-xs hover:text-white transition-colors uppercase tracking-widest">Shop</Link>
            <Link href="/personal-shopping" className="text-zinc-500 text-xs hover:text-white transition-colors uppercase tracking-widest">Personal Shopping</Link>
            <Link href="/login" className="text-zinc-500 text-xs hover:text-white transition-colors uppercase tracking-widest">Account</Link>
          </div>
        </div>
      </footer>

    </main>
  );
}