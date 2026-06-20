"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";

function SHMonogram() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="24" fill="#F5A623" fillOpacity="0.1" stroke="#F5A623" strokeWidth="1"/>
      <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="#F5A623" fontSize="16" fontWeight="700" fontFamily="Georgia, serif" letterSpacing="1">SH</text>
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Login failed."); return; }
      setAuth(data.user, data.accessToken, data.refreshToken);
      router.push("/");
    } catch { setError("Something went wrong."); }
    finally { setLoading(false); }
  };

  return (
    <div className="w-full max-w-sm" style={{ fontFamily: "Georgia, serif" }}>
      <div className="flex flex-col items-center mb-8">
        <SHMonogram />
        <h1 className="mt-4 text-3xl tracking-[0.2em] text-white font-normal">
          STREET<span style={{ color: "#F5A623" }}>HEAT</span>
        </h1>
        <div style={{ width: 40, height: 1, backgroundColor: "#F5A623", margin: "12px 0" }} />
        <p className="text-zinc-400 text-xs tracking-widest uppercase">Sign in to your account</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs text-zinc-500 mb-1 uppercase tracking-widest" style={{ fontFamily: "Inter, sans-serif" }}>Email</label>
          <input name="email" type="email" required value={form.email} onChange={handleChange}
            className="w-full bg-transparent border border-zinc-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-[#F5A623] transition-colors"
            style={{ fontFamily: "Inter, sans-serif" }} placeholder="you@example.com" />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1 uppercase tracking-widest" style={{ fontFamily: "Inter, sans-serif" }}>Password</label>
          <input name="password" type="password" required value={form.password} onChange={handleChange}
            className="w-full bg-transparent border border-zinc-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-[#F5A623] transition-colors"
            style={{ fontFamily: "Inter, sans-serif" }} placeholder="Your password" />
        </div>
        {error && <p className="text-[#D9483B] text-xs" style={{ fontFamily: "Inter, sans-serif" }}>{error}</p>}
        <button type="submit" disabled={loading}
          className="w-full py-3 text-xs font-bold uppercase tracking-widest transition-opacity disabled:opacity-50"
          style={{ backgroundColor: "#F5A623", color: "#0A0A0A", fontFamily: "Inter, sans-serif", letterSpacing: "0.2em" }}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <div className="mt-8 border border-zinc-800 p-4 text-center">
        <p className="text-zinc-500 text-xs tracking-widest uppercase mb-1" style={{ fontFamily: "Inter, sans-serif" }}>Personal Shopping</p>
        <p className="text-zinc-300 text-xs leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>Need it sourced or styled? Our concierge team handles both.</p>
        <a href="mailto:shopping@streetheat.co.uk" className="text-[#F5A623] text-xs tracking-widest uppercase mt-2 inline-block hover:underline" style={{ fontFamily: "Inter, sans-serif" }}>Get in touch</a>
      </div>
      <p className="mt-6 text-center text-zinc-600 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>
        No account?{" "}
        <Link href="/register" className="text-[#F5A623] hover:underline">Create one</Link>
      </p>
    </div>
  );
}