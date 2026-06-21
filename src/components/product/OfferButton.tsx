"use client";
import { useState } from "react";
import OfferModal from "./OfferModal";

interface Props {
  productVariantId: string;
  listedPrice: number;
  productName: string;
}

export default function OfferButton({ productVariantId, listedPrice, productName }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full py-3 text-xs font-bold uppercase tracking-widest border transition-colors"
        style={{ borderColor: "#D9483B", color: "#D9483B" }}
      >
        Make an Offer
      </button>
      {open && (
        <OfferModal
          productVariantId={productVariantId}
          listedPrice={listedPrice}
          productName={productName}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
