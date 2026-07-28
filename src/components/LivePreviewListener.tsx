"use client";

import { RefreshRouteOnSave } from "@payloadcms/live-preview-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

/**
 * Menyegarkan halaman setiap kali staf menyimpan dokumen di dasbor.
 *
 * Dasbor mengirim `window.postMessage` ke iframe Live Preview; komponen ini
 * mendengarkannya lalu memanggil `router.refresh()` sehingga server component
 * mengambil ulang data dari Payload. Tanpa ini iframe hanya memuat satu kali
 * dan staf harus menekan muat ulang sendiri untuk melihat perubahannya.
 *
 * HANYA dipasang di dalam iframe Live Preview, bukan di setiap halaman yang
 * kebetulan sedang draft mode. Alasannya: cookie draft mode berlaku untuk
 * seluruh domain dan bertahan sampai staf menekan "Keluar", sehingga setelah
 * sekali membuka pratinjau, staf yang menjelajah situs seperti biasa tetap
 * dianggap "draft". Bila komponen ini ikut terpasang di sana, `RefreshRouteOnSave`
 * memanggil `refresh()` sekali saat mount — satu render server penuh berikut
 * query database tambahan untuk setiap halaman yang dibuka, padahal tidak ada
 * dasbor yang mengirim pesan apa pun ke tab itu.
 */
export function LivePreviewListener() {
  const router = useRouter();

  /**
   * Ditentukan setelah render pertama, bukan saat render: `window` tidak ada di
   * server, dan menebaknya akan membuat HTML server berbeda dari klien.
   */
  const [diDalamIframe, setDiDalamIframe] = useState(false);

  useEffect(() => {
    setDiDalamIframe(window.self !== window.top);
  }, []);

  /**
   * Identitasnya dijaga tetap: `refresh` masuk daftar dependensi useEffect di
   * dalam `RefreshRouteOnSave`, jadi fungsi baru tiap render membuat efek itu
   * dilepas dan dipasang ulang terus-menerus.
   */
  const refresh = useCallback(() => router.refresh(), [router]);

  if (!diDalamIframe) return null;

  return (
    <RefreshRouteOnSave
      refresh={refresh}
      serverURL={process.env.NEXT_PUBLIC_SERVER_URL ?? ""}
    />
  );
}
