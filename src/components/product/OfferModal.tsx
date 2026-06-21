"use client";
import { useState } from "react";

interface Props {
  productVariantId: string;
  listedPrice: number;
  productName: string;
  onClose: () => void;
}

export default function OfferModal({ productVariantId, listedPrice, productName, onClose }: Props) {
  const [offerPrice, setOfferPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const floor = (listedPrice * 0.75).toFixed(2);

  async function handleSubmit() {
    setError("");
    const amount = Number(offerPrice);
    if (!amount || amount <= 0) { setError("Enter a valid amount"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productVariantId, offerPrice: amount }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong"); return; }
      setSuccess(true);
    } catch {
      setError("Network error, please try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.8)" }}>
      <div className="w-full max-w-md mx-4 p-8" style={{ backgroundColor: "#111", border: "1px solid #333" }}>
        {success ? (
          <div className="text-center">
            <p className="text-white text-lg mb-2" style={{ fontFamily: "Georgia, serif" }}>Offer Submitted</p>
            <p className="text-zinc-400 text-sm mb-6">We will review your offer and respond within 24 hours.</p>
            <button onClick={onClose} className="w-full py-3 text-xs font-bold uppercase tracking-widest" style={{ backgroundColor: "#F5A623", color: "#000" }}>Close</button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#F5A623" }}>Make an Offer</p>
                <p className="text-white text-sm" style={{ fontFamily: "Georgia, serif" }}>{productName}</p>
              </div>
              <button onClick={onClose} className="text-zinc-500 hover:text-white text-xl leading-none">×</button>
            </div>
            <div className="mb-4">
              <div className="flex justify-between text-xs text-zinc-500 mb-1">
                <span>Listed price</span><span>£{listedPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-zinc-500 mb-4">
                <span>Minimum offer</span><span>£{floor}</span>
              </div>
              <label className="block text-xs uppercase tracking-widest text-zinc-400 mb-2">Your Offer (£)</label>
              <input
                type="number"
                value={offerPrice}
                onChange={e => setOfferPrice(e.target.value)}
                placeholder={floor}
                className="w-full px-4 py-3 text-white text-sm bg-transparent border border-zinc-700 focus:outline-none focus:border-zinc-400"
              />
            </div>
            {error && <p className="text-xs mb-4" style={{ color: "#D9483B" }}>{error}</p>}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 text-xs font-bold uppercase tracking-widest transition-opacity"
              style={{ backgroundColor: "#D9483B", color: "#fff", opacity: loading ? 0.6 : 1 }}
            >
              {loading ? "Submitting..." : "Submit Offer"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
