"use client";

import { useState } from "react";

const tiers = [50000, 100000, 150000, 200000, 500000, 1000000];
const rupiah = (n: number) => "Rp " + n.toLocaleString("id-ID");

/**
 * DonationTierButtons — nominal donasi + tombol CTA.
 * CTA href kosong (payment gateway di luar cakupan Sprint 1, per PRD/Technical Brief).
 */
export function DonationTierButtons() {
  const [tab, setTab] = useState<"bebas" | "bulanan">("bebas");
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="rounded-card bg-white p-6 shadow-card sm:p-8">
      <div className="flex gap-2 rounded-pill bg-surface p-1 text-sm font-semibold">
        <button
          onClick={() => setTab("bebas")}
          className={`flex-1 rounded-pill py-2 transition ${
            tab === "bebas" ? "bg-brand-red text-white" : "text-brand-navy"
          }`}
        >
          Donasi Bebas
        </button>
        <button
          onClick={() => setTab("bulanan")}
          className={`flex-1 rounded-pill py-2 transition ${
            tab === "bulanan" ? "bg-brand-red text-white" : "text-brand-navy"
          }`}
        >
          Donasi Bulanan
        </button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {tiers.map((t) => (
          <button
            key={t}
            onClick={() => setActive(t)}
            className={`rounded-xl border py-3 text-sm font-semibold transition ${
              active === t
                ? "border-brand-red bg-brand-red/5 text-brand-red"
                : "border-black/10 text-brand-navy hover:border-brand-red"
            }`}
          >
            {rupiah(t)}
          </button>
        ))}
      </div>

      <button
        type="button"
        // href/aksi kosong: payment gateway belum aktif
        className="btn-red mt-6 w-full"
        title="Fitur donasi online akan segera hadir"
      >
        DONASI SEKARANG
      </button>
      <p className="mt-3 text-center text-xs text-muted">
        Untuk donasi saat ini, silakan hubungi kami langsung. Donasi online akan
        segera hadir.
      </p>
    </div>
  );
}
