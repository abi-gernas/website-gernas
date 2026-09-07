import Image from "next/image";
import type { MediaInteraktifView } from "@/lib/mediaInteraktif";
import type { Locale } from "@/lib/i18n";

/**
 * Penampil di halaman detail Media Interaktif — mengikuti pola
 * `VideoPembelajaranPlayer`: kontennya disematkan langsung di situs ini bila
 * ada (`kontenHtml`, lewat iframe `srcDoc`), dan jatuh ke sampul + tombol
 * "Buka Link" eksternal bila kosong.
 *
 * `sandbox` sengaja tanpa `allow-same-origin` — kontennya cuma game/kanvas
 * mandiri (tak perlu akses cookie/DOM situs ini), jadi diperlakukan sbg
 * origin unik yang lebih terisolasi.
 */
export function MediaInteraktifPlayer({
  item,
  locale = "id",
}: {
  item: MediaInteraktifView;
  locale?: Locale;
}) {
  const bingkai = "relative aspect-[4/3] w-full overflow-hidden rounded-card bg-surface sm:aspect-video";

  if (item.kontenHtml) {
    return (
      <div className={bingkai}>
        <iframe
          srcDoc={item.kontenHtml}
          title={item.judul}
          sandbox="allow-scripts"
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    );
  }

  return <PenampungTautan item={item} locale={locale} kelas={bingkai} />;
}

/** Cadangan saat kontennya tidak disematkan: sampul + tautan sumber. */
function PenampungTautan({
  item,
  locale,
  kelas,
}: {
  item: MediaInteraktifView;
  locale: Locale;
  kelas: string;
}) {
  const label = locale === "en" ? "Open Link" : "Buka Link";

  return (
    <div className={kelas}>
      {item.thumbnail && (
        <Image
          src={item.thumbnail.url}
          alt={item.judul}
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover opacity-60"
        />
      )}
      <div className="absolute inset-0 flex items-center justify-center">
        <a href={item.tautan} target="_blank" rel="noopener noreferrer" className="btn-red">
          {label}
        </a>
      </div>
    </div>
  );
}
