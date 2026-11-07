import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/products", label: "Shop" },
  { href: "/personal-shopping", label: "Personal Shopping" },
  { href: "/cart", label: "Cart" },
  { href: "/login", label: "Account" },
];

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid #1a1a1a", backgroundColor: "#0A0A0A", fontFamily: "Inter, sans-serif" }} className="py-12">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        <span className="text-lg font-black uppercase tracking-tight text-white">
          Street<span style={{ color: "#F5A623" }}>Heat</span>
        </span>
        <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-6 gap-y-3">
          {FOOTER_LINKS.map((l) => (
            <Link key={l.href} href={l.href}
              className="text-zinc-500 text-xs hover:text-white transition-colors uppercase tracking-widest">
              {l.label}
            </Link>
          ))}
        </nav>
        <p className="text-zinc-600 text-xs text-center">© 2026 StreetHeat. UK only. All rights reserved.</p>
      </div>
    </footer>
  );
}
