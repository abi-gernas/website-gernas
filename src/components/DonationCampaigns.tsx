import Image from "next/image";
import Link from "next/link";
import { kolomKe } from "./warna";

export type Kampanye = {
  judul: string;
  gambar: string;
  terkumpul: number;
  target: number;
  cta?: { label: string; href: string };
};

const rupiah = (n: number) => "Rp " + n.toLocaleString("id-ID");

/** Kartu kampanye donasi dengan bilah kemajuan. */
export function DonationCampaigns({
  items,
  kolom = "3",
}: {
  items: Kampanye[];
  kolom?: string;
}) {
  if (items.length === 0) return null;

  return (
    <div className={`grid gap-6 ${kolomKe(kolom, "3")}`}>
      {items.map((c, i) => {
        // Target dijamin >= 1 oleh skema, tapi bilahnya tetap dibatasi 100%
        // agar angka terkumpul yang melebihi target tidak meluber.
        const pct = Math.min(100, Math.round((c.terkumpul / c.target) * 100));

        return (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded-card bg-white shadow-soft"
          >
            <div className="relative aspect-[16/10]">
              <Image
                src={c.gambar}
                alt={c.judul}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="text-base font-bold text-brand-navy">{c.judul}</h3>
              <div className="mt-4">
                <div
                  className="h-2 overflow-hidden rounded-full bg-surface"
                  role="progressbar"
                  aria-valuenow={pct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Terkumpul ${pct} persen dari target`}
                >
                  <div
                    className="h-full rounded-full bg-brand-red"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-muted">
                  <span className="font-semibold text-brand-navy">
                    {rupiah(c.terkumpul)}
                  </span>{" "}
                  dari {rupiah(c.target)}
                </p>
              </div>

              {c.cta && (
                <Link
                  href={c.cta.href}
                  className="btn-red mt-5 w-full !py-2.5 text-center text-xs"
                >
                  {c.cta.label}
                </Link>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
