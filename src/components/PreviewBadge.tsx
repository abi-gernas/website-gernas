"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Penanda bahwa halaman yang sedang dilihat adalah versi draf, bukan yang
 * dilihat pengunjung.
 *
 * Tanpa penanda ini tombol "Pratinjau" membuka tab yang tampak identik dengan
 * situs asli, dan staf mudah mengira perubahannya sudah terbit padahal belum.
 *
 * Tampilannya menyesuaikan tempatnya muncul, karena taruhannya berbeda:
 *
 *  - Di dalam iframe Live Preview, staf sudah tahu sedang melihat pratinjau —
 *    penanda cukup kecil di pojok supaya tidak menutupi halaman yang ditinjau.
 *
 *  - Di tab biasa, penanda ini adalah satu-satunya petunjuk bahwa cookie draft
 *    mode masih menyala. Cookie itu berlaku untuk SELURUH domain dan bertahan
 *    sampai dimatikan, jadi selama menyala setiap halaman yang dibuka staf
 *    melewati cache dan dirender ulang langsung dari database — situs terasa
 *    lambat atau gagal dimuat, sementara di browser lain baik-baik saja karena
 *    di sana tidak ada cookie-nya. Gejala itu nyaris mustahil ditebak sendiri,
 *    maka penandanya dibuat sebagai bilah lebar di atas layar, bukan pil kecil
 *    yang mudah terabaikan.
 */
export function PreviewBadge() {
  const pathname = usePathname();

  /**
   * Diawali `true` supaya HTML dari server sama dengan render pertama di klien
   * (`window` tidak ada di server). Nilai sebenarnya ditetapkan setelah mount.
   */
  const [diDalamIframe, setDiDalamIframe] = useState(true);

  useEffect(() => {
    setDiDalamIframe(window.self !== window.top);
  }, []);

  // Kembali ke halaman yang sedang dilihat, bukan ke halaman teks buntu.
  const keluar = `/next/exit-preview?path=${encodeURIComponent(pathname)}`;

  if (diDalamIframe) {
    return (
      <div className="pointer-events-none fixed bottom-4 left-4 z-50 print:hidden">
        <div className="pointer-events-auto flex items-center gap-2 rounded-pill bg-brand-navy px-4 py-2 text-xs font-semibold text-white shadow-lg">
          <span
            aria-hidden="true"
            className="inline-block h-2 w-2 rounded-full bg-brand-yellow"
          />
          <span>Pratinjau draf — belum terlihat pengunjung</span>
        </div>
      </div>
    );
  }

  return (
    /**
     * Menempel di bawah, bukan di atas: <Navbar> sudah memakai `sticky top-0
     * z-50`, sehingga bilah kedua di posisi yang sama akan saling menimpa.
     */
    <div
      role="status"
      className="fixed inset-x-0 bottom-0 z-50 bg-brand-navy text-white shadow-[0_-4px_12px_rgba(0,0,0,0.15)] print:hidden"
    >
      <div className="container-page flex flex-wrap items-center justify-center gap-x-3 gap-y-2 py-2.5 text-center text-xs font-semibold sm:text-sm">
        <span
          aria-hidden="true"
          className="inline-block h-2 w-2 shrink-0 rounded-full bg-brand-yellow"
        />
        <span>
          Mode pratinjau menyala — Anda melihat versi draf, dan situs terasa
          lebih lambat selama mode ini aktif.
        </span>
        <a
          href={keluar}
          className="rounded-pill bg-brand-yellow px-3.5 py-1.5 font-bold text-brand-navy underline-offset-2 hover:brightness-95 hover:underline"
        >
          Keluar dari pratinjau
        </a>
      </div>
    </div>
  );
}
