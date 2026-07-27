/**
 * Penanda kecil bahwa halaman yang sedang dilihat adalah versi draf, bukan
 * yang dilihat pengunjung.
 *
 * Tanpa penanda ini tombol "Pratinjau" membuka tab yang tampak identik dengan
 * situs asli, dan staf mudah mengira perubahannya sudah terbit padahal belum.
 * Tautan "Keluar" mematikan draft mode lewat `/next/exit-preview`.
 */
export function PreviewBadge() {
  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-50 print:hidden">
      <div className="pointer-events-auto flex items-center gap-2 rounded-pill bg-brand-navy px-4 py-2 text-xs font-semibold text-white shadow-lg">
        <span
          aria-hidden="true"
          className="inline-block h-2 w-2 rounded-full bg-brand-yellow"
        />
        <span>Pratinjau draf — belum terlihat pengunjung</span>
        <a
          href="/next/exit-preview"
          className="ml-1 rounded-pill bg-white/15 px-2.5 py-1 underline-offset-2 hover:bg-white/25 hover:underline"
        >
          Keluar
        </a>
      </div>
    </div>
  );
}
