import Link from "next/link";

export default function PersonalShoppingPage() {
  return (
    <main style={{ backgroundColor: "#0A0A0A", fontFamily: "Inter, sans-serif" }}>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-4 py-24 text-center">
        <p className="text-xs uppercase tracking-[0.3em] mb-6" style={{ color: "#F5A623" }}>Concierge Service</p>
        <h1 className="text-4xl md:text-6xl font-normal tracking-[0.15em] text-white mb-6" style={{ fontFamily: "Georgia, serif" }}>
          Personal Shopping
        </h1>
        <div style={{ width: 40, height: 1, backgroundColor: "#F5A623", margin: "0 auto 24px" }} />
        <p className="text-zinc-400 text-sm max-w-lg mx-auto leading-relaxed">
          Can't find it on the site? We'll source it. Want a full look? We'll style it.
          StreetHeat's personal shopping service handles both — so you get exactly what you want, without the hunt.
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-4">
        <div style={{ height: 1, backgroundColor: "#1a1a1a" }} />
      </div>

      {/* HOW IT WORKS */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <p className="text-xs uppercase tracking-[0.3em] mb-12 text-center" style={{ color: "#F5A623" }}>How It Works</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              label: "01",
              title: "Sourcing",
              body: "Tell us the exact sneaker — model, colourway, size. We search our network, authenticate it, and ship it to you. No fakes, no hassle."
            },
            {
              label: "02",
              title: "Styling",
              body: "Share your budget, vibe, and sizes. We curate a full look — footwear, tops, bottoms — delivered as a shoppable edit just for you."
            },
            {
              label: "03",
              title: "Get in Touch",
              body: "Drop us a message with what you're looking for. We'll come back within 24 hours with availability, pricing, and next steps."
            },
            {
              label: "04",
              title: "We Handle the Rest",
              body: "Once confirmed, we authenticate, pack, and ship. Loyalty points apply on all personal shopping orders."
            },
          ].map((step) => (
            <div key={step.label} className="border border-zinc-800 p-8">
              <div className="text-xs uppercase tracking-widest mb-4" style={{ color: "#F5A623" }}>{step.label}</div>
              <h3 className="text-white text-sm font-bold uppercase tracking-widest mb-3">{step.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4">
        <div style={{ height: 1, backgroundColor: "#1a1a1a" }} />
      </div>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-normal tracking-[0.1em] text-white mb-4" style={{ fontFamily: "Georgia, serif" }}>
          Ready to get started?
        </h2>
        <p className="text-zinc-400 text-sm mb-8">
          Message us with your request and we'll get back to you within 24 hours.
        </p>
        <a href="mailto:shopping@streetheat.co.uk"
          className="inline-block px-8 py-3 text-xs font-bold uppercase tracking-widest transition-opacity hover:opacity-90 mr-4"
          style={{ backgroundColor: "#F5A623", color: "#0A0A0A" }}>
          Email Us
        </a>
        <Link href="/products"
          className="inline-block px-8 py-3 text-xs font-bold uppercase tracking-widest border border-zinc-700 text-zinc-300 hover:border-zinc-400 transition-colors">
          Browse the Shop
        </Link>
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