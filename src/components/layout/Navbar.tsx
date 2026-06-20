"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, clearAuth } = useAuthStore();
  const count = useCartStore((s) => s.count());
  const router = useRouter();

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  return (
    <nav style={{ backgroundColor: "#0A0A0A", borderBottom: "1px solid #1a1a1a", fontFamily: "Inter, sans-serif" }}
      className="sticky top-0 z-50 w-full">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" style={{ fontFamily: "Georgia, serif" }}>
          <span className="text-xl tracking-[0.15em] text-white font-normal">
            STREET<span style={{ color: "#F5A623" }}>HEAT</span>
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/products" className="text-zinc-400 hover:text-white text-xs uppercase tracking-widest transition-colors">
            Shop
          </Link>
          <Link href="/personal-shopping" className="text-zinc-400 hover:text-white text-xs uppercase tracking-widest transition-colors">
            Personal Shopping
          </Link>

          <Link href="/cart" className="relative text-zinc-400 hover:text-white transition-colors">
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

          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-zinc-400 text-xs tracking-wide">
                {user.firstName}
              </span>
              <button onClick={handleLogout}
                className="text-xs uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-xs uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
                Sign in
              </Link>
              <Link href="/register"
                className="text-xs uppercase tracking-widest px-4 py-2 font-bold transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#F5A623", color: "#0A0A0A" }}>
                Join
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}