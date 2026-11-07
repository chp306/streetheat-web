"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import { useRouter } from "next/navigation";

const NAV_LINKS = [
  { href: "/products", label: "Shop" },
  { href: "/personal-shopping", label: "Personal Shopping" },
];

export default function Navbar() {
  const { user, clearAuth } = useAuthStore();
  const count = useCartStore((s) => s.totalItems());
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    clearAuth();
    setOpen(false);
    router.push("/login");
  };

  const linkClass = "text-zinc-400 hover:text-white text-xs uppercase tracking-widest transition-colors";

  return (
    <nav style={{ backgroundColor: "#0A0A0A", borderBottom: "1px solid #1a1a1a", fontFamily: "Inter, sans-serif" }}
      className="sticky top-0 z-50 w-full">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" onClick={() => setOpen(false)}>
          <span className="text-xl font-black uppercase tracking-tight text-white">
            Street<span style={{ color: "#F5A623" }}>Heat</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={linkClass}>{l.label}</Link>
          ))}

          <CartLink count={count} />

          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-zinc-400 text-xs tracking-wide">{user.firstName}</span>
              <button onClick={handleLogout}
                className="text-xs uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className={linkClass}>Sign in</Link>
              <Link href="/register"
                className="text-xs uppercase tracking-widest px-4 py-2 font-bold transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#F5A623", color: "#0A0A0A" }}>
                Join
              </Link>
            </div>
          )}
        </div>

        {/* Mobile: cart + menu button */}
        <div className="flex items-center gap-4 md:hidden">
          <CartLink count={count} />
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="text-zinc-300 hover:text-white transition-colors"
          >
            {open ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <div className="md:hidden border-t px-4 py-6 flex flex-col gap-5" style={{ borderColor: "#1a1a1a", backgroundColor: "#0A0A0A" }}>
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="text-white text-sm font-bold uppercase tracking-widest">
              {l.label}
            </Link>
          ))}
          {user ? (
            <>
              <span className="text-zinc-500 text-xs tracking-wide">Signed in as {user.firstName}</span>
              <button onClick={handleLogout}
                className="text-left text-sm uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
                Sign out
              </button>
            </>
          ) : (
            <div className="flex gap-3 pt-1">
              <Link href="/login" onClick={() => setOpen(false)}
                className="flex-1 border border-zinc-700 py-3 text-center text-xs font-bold uppercase tracking-widest text-white">
                Sign in
              </Link>
              <Link href="/register" onClick={() => setOpen(false)}
                className="flex-1 py-3 text-center text-xs font-bold uppercase tracking-widest"
                style={{ backgroundColor: "#F5A623", color: "#0A0A0A" }}>
                Join
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

function CartLink({ count }: { count: number }) {
  return (
    <Link href="/cart" aria-label="Cart" className="relative text-zinc-400 hover:text-white transition-colors">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
      {count > 0 && (
        <span className="absolute -top-2 -right-2 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
          style={{ backgroundColor: "#F5A623", color: "#0A0A0A" }}>
          {count}
        </span>
      )}
    </Link>
  );
}
