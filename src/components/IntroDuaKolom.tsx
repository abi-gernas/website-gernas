/**
 * Blok `introDuaKolom` — judul + ringkasan di kiri, garis pemisah, paragraf
 * panjang di kanan. Dipakai di Pojok Guru ("Tumbuh Bersama Dengan Kompilasi
 * Bahan Ajar"), tapi tidak terikat halaman itu.
 *
 * Paragraf kanan diterima sbg `children` (hasil `ArticleBody`) supaya komponen
 * ini tidak perlu tahu bentuk rich text Payload.
 *
 * Di bawah `lg` kolom menumpuk dan garis pemisahnya jadi mendatar.
 */
export function IntroDuaKolom({
  judul,
  ringkas,
  children,
}: {
  judul: string;
  ringkas?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="container-page py-12 sm:py-16">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-0">
        <div className="lg:pr-12">
          <h2 className="text-2xl font-bold leading-tight text-brand-navy [text-wrap:balance] sm:text-3xl">
            {judul}
          </h2>
          {ringkas && (
            <p className="mt-4 max-w-prose text-sm leading-relaxed text-body sm:text-base">{ringkas}</p>
          )}
        </div>

        {children && (
          <div className="border-t border-brand-navy/15 pt-6 lg:border-l lg:border-t-0 lg:py-6 lg:pl-12">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
