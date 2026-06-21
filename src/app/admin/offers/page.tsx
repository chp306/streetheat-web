"use client";
import { useEffect, useState } from "react";

interface Offer {
  id: string;
  offerPrice: number;
  listedPrice: number;
  counterPrice?: number;
  status: string;
  createdAt: string;
  user: { email: string; firstName: string; lastName: string };
  productVariant: {
    size: string;
    product: { name: string; brand: { name: string } };
  };
}

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [counterInputs, setCounterInputs] = useState<Record<string, string>>({});
  const [acting, setActing] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/offers")
      .then(r => r.json())
      .then(d => { setOffers(d.offers || []); setLoading(false); });
  }, []);

  async function handleAction(id: string, action: string, counterPrice?: string) {
    setActing(id);
    const body: Record<string, unknown> = { action };
    if (action === "counter" && counterPrice) body.counterPrice = Number(counterPrice);
    const res = await fetch(`/api/offers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const data = await res.json();
      setOffers(prev => prev.map(o => o.id === id ? { ...o, status: data.offer.status, counterPrice: data.offer.counterPrice } : o));
    }
    setActing(null);
  }

  const statusColor: Record<string, string> = {
    pending: "#F5A623",
    accepted: "#22c55e",
    rejected: "#D9483B",
    countered: "#a78bfa",
    expired: "#71717a",
  };

  return (
    <main style={{ backgroundColor: "#0A0A0A", minHeight: "100vh", fontFamily: "Inter, sans-serif", padding: "48px 24px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <p style={{ color: "#F5A623", fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 8 }}>Admin</p>
        <h1 style={{ color: "#fff", fontSize: 28, fontFamily: "Georgia, serif", fontWeight: "normal", marginBottom: 32 }}>Offers</h1>

        {loading ? (
          <p style={{ color: "#71717a", fontSize: 13 }}>Loading...</p>
        ) : offers.length === 0 ? (
          <p style={{ color: "#71717a", fontSize: 13 }}>No offers yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {offers.map(offer => (
              <div key={offer.id} style={{ backgroundColor: "#111", border: "1px solid #222", padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div>
                    <p style={{ color: "#fff", fontSize: 14, marginBottom: 4, fontFamily: "Georgia, serif" }}>
                      {offer.productVariant.product.brand.name} — {offer.productVariant.product.name}
                    </p>
                    <p style={{ color: "#71717a", fontSize: 12 }}>
                      Size UK {offer.productVariant.size} · {offer.user.firstName} {offer.user.lastName} · {offer.user.email}
                    </p>
                    <p style={{ color: "#71717a", fontSize: 12 }}>{new Date(offer.createdAt).toLocaleDateString("en-GB")}</p>
                  </div>
                  <span style={{ fontSize: 11, color: statusColor[offer.status] || "#fff", textTransform: "uppercase", letterSpacing: "0.15em" }}>
                    {offer.status}
                  </span>
                </div>

                <div style={{ display: "flex", gap: 24, marginBottom: 16, fontSize: 13 }}>
                  <div><p style={{ color: "#71717a", fontSize: 11, marginBottom: 2 }}>Listed</p><p style={{ color: "#fff" }}>£{Number(offer.listedPrice).toFixed(2)}</p></div>
                  <div><p style={{ color: "#71717a", fontSize: 11, marginBottom: 2 }}>Offered</p><p style={{ color: "#F5A623" }}>£{Number(offer.offerPrice).toFixed(2)}</p></div>
                  {offer.counterPrice && (
                    <div><p style={{ color: "#71717a", fontSize: 11, marginBottom: 2 }}>Counter</p><p style={{ color: "#a78bfa" }}>£{Number(offer.counterPrice).toFixed(2)}</p></div>
                  )}
                </div>

                {offer.status === "pending" && (
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button
                      onClick={() => handleAction(offer.id, "accept")}
                      disabled={acting === offer.id}
                      style={{ padding: "8px 16px", fontSize: 11, fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", backgroundColor: "#22c55e", color: "#000", border: "none", cursor: "pointer" }}
                    >Accept</button>
                    <button
                      onClick={() => handleAction(offer.id, "reject")}
                      disabled={acting === offer.id}
                      style={{ padding: "8px 16px", fontSize: 11, fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", backgroundColor: "#D9483B", color: "#fff", border: "none", cursor: "pointer" }}
                    >Reject</button>
                    <input
                      type="number"
                      placeholder="Counter £"
                      value={counterInputs[offer.id] || ""}
                      onChange={e => setCounterInputs(prev => ({ ...prev, [offer.id]: e.target.value }))}
                      style={{ padding: "8px 12px", fontSize: 11, backgroundColor: "transparent", border: "1px solid #333", color: "#fff", width: 120 }}
                    />
                    <button
                      onClick={() => handleAction(offer.id, "counter", counterInputs[offer.id])}
                      disabled={acting === offer.id || !counterInputs[offer.id]}
                      style={{ padding: "8px 16px", fontSize: 11, fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", backgroundColor: "#a78bfa", color: "#000", border: "none", cursor: "pointer" }}
                    >Counter</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
