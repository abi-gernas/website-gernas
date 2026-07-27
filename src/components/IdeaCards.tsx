import Image from "next/image";
import Link from "next/link";
import { kolomKe } from "./warna";

export type KartuIde = {
  judul: string;
  kelas?: string;
  topik?: string;
  gambar: string;
  href?: string;
};

/** Kartu tegak bergambar dengan label kelas & topik — halaman Tumbuh Bersama. */
export function IdeaCards({
  items,
  kolom = "4",
}: {
  items: KartuIde[];
  kolom?: string;
}) {
  if (items.length === 0) return null;

  return (
    <div className={`grid gap-5 ${kolomKe(kolom, "4")}`}>
      {items.map((idea, i) => {
        const isi = (
          <>
            <div className="relative aspect-[3/4]">
              <Image
                src={idea.gambar}
                alt={idea.judul}
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="p-4">
              {(idea.kelas || idea.topik) && (
                <div className="flex flex-wrap gap-2">
                  {idea.kelas && (
                    <span className="rounded bg-brand-yellow px-2 py-0.5 text-[11px] font-semibold text-brand-navy">
                      {idea.kelas}
                    </span>
                  )}
                  {idea.topik && (
                    <span className="rounded bg-brand-red px-2 py-0.5 text-[11px] font-semibold text-white">
                      {idea.topik}
                    </span>
                  )}
                </div>
              )}
              <p className="mt-2 line-clamp-2 text-sm font-semibold text-brand-navy">
                {idea.judul}
              </p>
            </div>
          </>
        );

        const kelas = "overflow-hidden rounded-card bg-white shadow-soft";

        return idea.href ? (
          <Link key={i} href={idea.href} className={`${kelas} block`}>
            {isi}
          </Link>
        ) : (
          <div key={i} className={kelas}>
            {isi}
          </div>
        );
      })}
    </div>
  );
}
