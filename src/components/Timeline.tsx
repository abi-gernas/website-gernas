/**
 * Linimasa riwayat — bagian "Tumbuh Bersama Kami" di halaman Tentang.
 *
 * Entri berselang-seling kiri–kanan mengikuti posisinya; di layar sempit
 * semuanya rata kiri dengan garis di tepi.
 */
export type EntriLinimasa = { tahun: string; teks: string };

export function Timeline({ entries }: { entries: EntriLinimasa[] }) {
  if (entries.length === 0) return null;

  return (
    <div className="relative mx-auto max-w-4xl">
      <div
        aria-hidden="true"
        className="absolute left-4 top-0 h-full w-0.5 bg-brand-navy/15 sm:left-1/2"
      />
      <ul className="space-y-8">
        {entries.map((t, i) => (
          <li
            key={`${t.tahun}-${i}`}
            className={`relative pl-12 sm:w-1/2 sm:pl-0 ${
              i % 2 === 0
                ? "sm:ml-0 sm:pr-10 sm:text-right"
                : "sm:ml-auto sm:pl-10"
            }`}
          >
            <span
              aria-hidden="true"
              className={`absolute left-2.5 top-1 h-3 w-3 rounded-full bg-brand-red ring-4 ring-white sm:left-auto ${
                i % 2 === 0 ? "sm:-right-1.5" : "sm:-left-1.5"
              }`}
            />
            <span className="text-lg font-extrabold text-brand-red">
              {t.tahun}
            </span>
            <p className="mt-1 text-sm text-body">{t.teks}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
