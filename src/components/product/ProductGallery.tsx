'use client';

import { useState } from 'react';

type Img = { url: string };

export default function ProductGallery({ images, name }: { images: Img[]; name: string }) {
  const [active, setActive] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-zinc-900 border border-zinc-800 flex items-center justify-center">
        <div className="text-zinc-700 text-xs uppercase tracking-widest">No image</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="aspect-square bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden">
        <img src={images[active].url} alt={name} className="w-full h-full object-cover" />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="w-16 h-16 bg-zinc-900 border overflow-hidden flex-shrink-0 transition-colors"
              style={{ borderColor: i === active ? '#F5A623' : '#27272a' }}
            >
              <img src={img.url} alt={`${name} view ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
