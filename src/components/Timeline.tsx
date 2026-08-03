import Image from "next/image";
import { Fragment } from "react";

/**
 * Linimasa riwayat — bagian "Tumbuh Bersama Kami" di halaman Tentang.
 *
 * Di layar lebar entri berselang-seling di atas dan di bawah satu garis
 * mendatar; di layar sempit jadi daftar vertikal biasa.
 *
 * Susunannya memakai grid tiga baris (atas — garis — bawah) dengan tinggi
 * baris `auto`, bukan tinggi tetap: entri yang teksnya panjang ikut
 * menaikkan tinggi baris untuk semua kolom, sehingga tahun/teks tidak
 * pernah terpotong berapa pun panjangnya.
 *
 * Foto bersifat opsional dan sengaja TIDAK menyisakan kotak kosong bila
 * belum diisi — kotak abu-abu kosong lebih mengganggu daripada tidak ada
 * gambar sama sekali.
 */
export type EntriLinimasa = { tahun: string; teks: string; foto?: string };

function Foto({ foto, tahun }: { foto?: string; tahun: string }) {
  if (!foto) return null;

  return (
    <div className="relative aspect-[4/3] w-full max-w-[180px] overflow-hidden rounded-lg">
      <Image src={foto} alt={tahun} fill sizes="180px" className="object-cover" />
    </div>
  );
}

export function Timeline({ entries }: { entries: EntriLinimasa[] }) {
  if (entries.length === 0) return null;

  return (
    <div className="mx-auto max-w-6xl">
      {/* Layar lebar: zigzag mendatar */}
      <div className="hidden overflow-x-auto pb-2 sm:block">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${entries.length}, minmax(160px, 1fr))`,
            gridTemplateRows: "auto auto auto",
          }}
        >
          {entries.map((t, i) => {
            const atas = i % 2 === 0;
            const isi = (
              <>
                <span className="text-lg font-extrabold text-brand-red">{t.tahun}</span>
                <p className="text-sm leading-relaxed text-body">{t.teks}</p>
                <Foto foto={t.foto} tahun={t.tahun} />
              </>
            );

            return (
              <Fragment key={`${t.tahun}-${i}`}>
                {/* Baris atas — isi menempel ke bawah, mendekati garis */}
                <div
                  className="flex flex-col items-center justify-end gap-3 px-3 pb-6 text-center"
                  style={{ gridColumn: i + 1, gridRow: 1 }}
                >
                  {atas && isi}
                </div>

                {/* Baris tengah — potongan garis + titik */}
                <div
                  className="relative flex h-3 items-center justify-center"
                  style={{ gridColumn: i + 1, gridRow: 2 }}
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-brand-navy/15"
                  />
                  <span
                    aria-hidden="true"
                    className="relative h-3 w-3 rounded-full bg-brand-red ring-4 ring-white"
                  />
                </div>

                {/* Baris bawah — isi menempel ke atas, urutan dibalik */}
                <div
                  className="flex flex-col-reverse items-center justify-end gap-3 px-3 pt-6 text-center"
                  style={{ gridColumn: i + 1, gridRow: 3 }}
                >
                  {!atas && isi}
                </div>
              </Fragment>
            );
          })}
        </div>
      </div>

      {/* Layar sempit: daftar vertikal */}
      <div className="relative sm:hidden">
        <div
          aria-hidden="true"
          className="absolute left-4 top-0 h-full w-0.5 bg-brand-navy/15"
        />
        <ul className="space-y-8">
          {entries.map((t, i) => (
            <li key={`${t.tahun}-${i}`} className="relative pl-12">
              <span
                aria-hidden="true"
                className="absolute left-2.5 top-1 h-3 w-3 rounded-full bg-brand-red ring-4 ring-white"
              />
              <span className="text-lg font-extrabold text-brand-red">{t.tahun}</span>
              <p className="mt-1 text-sm leading-relaxed text-body">{t.teks}</p>
              {t.foto && (
                <div className="mt-3">
                  <Foto foto={t.foto} tahun={t.tahun} />
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
