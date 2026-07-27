"use client";

import { RefreshRouteOnSave } from "@payloadcms/live-preview-react";
import { useRouter } from "next/navigation";

/**
 * Menyegarkan halaman setiap kali staf menyimpan dokumen di dasbor.
 *
 * Dasbor mengirim `window.postMessage` ke iframe Live Preview; komponen ini
 * mendengarkannya lalu memanggil `router.refresh()` sehingga server component
 * mengambil ulang data dari Payload. Tanpa ini iframe hanya memuat satu kali
 * dan staf harus menekan muat ulang sendiri untuk melihat perubahannya.
 *
 * Hanya dipasang saat draft mode menyala, jadi pengunjung biasa tidak ikut
 * mengunduh JavaScript-nya.
 */
export function LivePreviewListener() {
  const router = useRouter();

  return (
    <RefreshRouteOnSave
      refresh={() => router.refresh()}
      serverURL={process.env.NEXT_PUBLIC_SERVER_URL ?? ""}
    />
  );
}
