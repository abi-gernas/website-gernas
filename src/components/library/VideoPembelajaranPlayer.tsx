import Image from "next/image";
import type { VideoPembelajaranView } from "@/lib/videoPembelajaran";
import { videoPembelajaranSumberHref, youtubeVideoId } from "@/lib/videoPembelajaran";
import type { Locale } from "@/lib/i18n";

/**
 * Pemutar video di halaman detail — hasil keputusan QA 26 Agu 2026: video
 * diputar di situs ini, bukan melempar pengunjung ke YouTube.
 *
 * Dua sumber sesuai `sumberTipe` di `VideoPembelajaran.ts`:
 * - `youtube` → iframe `youtube-nocookie.com/embed/…` (domain tanpa cookie
 *   pelacak sampai videonya benar-benar diputar).
 * - `upload`  → tag `<video controls>` biasa ke berkas Media.
 *
 * Kalau tautan YouTube-nya tidak dikenali (field teks bebas, staf bisa salah
 * ketik), yang tampil thumbnail + tautan ke sumbernya, bukan iframe kosong.
 */
export function VideoPembelajaranPlayer({
  item,
  locale = "id",
}: {
  item: VideoPembelajaranView;
  locale?: Locale;
}) {
  const bingkai = "relative aspect-video w-full overflow-hidden rounded-card bg-brand-navy/90";

  if (item.sumberTipe === "youtube") {
    const id = youtubeVideoId(item.tautanYoutube);
    if (id) {
      return (
        <div className={bingkai}>
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}`}
            title={item.judul}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>
      );
    }
    return <PenampungTautan item={item} locale={locale} kelas={bingkai} />;
  }

  if (item.berkasVideo?.url) {
    return (
      <div className={bingkai}>
        <video
          controls
          preload="metadata"
          poster={item.thumbnail?.url}
          className="absolute inset-0 h-full w-full"
        >
          <source src={item.berkasVideo.url} />
        </video>
      </div>
    );
  }

  return <PenampungTautan item={item} locale={locale} kelas={bingkai} />;
}

/** Cadangan saat videonya tidak bisa disematkan: thumbnail + tautan sumber. */
function PenampungTautan({
  item,
  locale,
  kelas,
}: {
  item: VideoPembelajaranView;
  locale: Locale;
  kelas: string;
}) {
  const href = videoPembelajaranSumberHref(item);
  const label = locale === "en" ? "Open video source" : "Buka sumber video";
  const kosong = locale === "en" ? "Video is not available yet." : "Video belum tersedia.";

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
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className="btn-red">
            {label}
          </a>
        ) : (
          <span className="text-sm font-semibold text-white">{kosong}</span>
        )}
      </div>
    </div>
  );
}
