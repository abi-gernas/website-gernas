"use client";

import { useRef } from "react";

/** Horizontal scroll carousel with prev/next arrows (Mitra Kolaborasi, dll.) */
export function Carousel({
  children,
  itemClass = "w-64",
}: {
  children: React.ReactNode;
  itemClass?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => {
    ref.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };
  return (
    <div className="relative">
      <div
        ref={ref}
        className="no-scrollbar flex snap-x gap-5 overflow-x-auto scroll-smooth pb-2"
      >
        {Array.isArray(children)
          ? children.map((c, i) => (
              <div key={i} className={`shrink-0 snap-start ${itemClass}`}>
                {c}
              </div>
            ))
          : children}
      </div>
      <div className="mt-5 flex justify-center gap-3">
        <button
          onClick={() => scroll(-1)}
          aria-label="Sebelumnya"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 text-brand-navy transition-colors hover:bg-brand-navy hover:text-white"
        >
          ‹
        </button>
        <button
          onClick={() => scroll(1)}
          aria-label="Berikutnya"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 text-brand-navy transition-colors hover:bg-brand-navy hover:text-white"
        >
          ›
        </button>
      </div>
    </div>
  );
}
