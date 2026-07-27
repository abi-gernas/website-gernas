import { draftMode } from "next/headers";

/**
 * Mematikan draft mode. Dipakai tautan "Keluar" pada penanda pratinjau
 * (<PreviewBadge />) agar staf bisa kembali melihat situs seperti pengunjung
 * biasa tanpa harus menghapus cookie secara manual.
 */
export async function GET(): Promise<Response> {
  const draft = await draftMode();
  draft.disable();

  return new Response("Mode pratinjau dimatikan. Silakan muat ulang halaman.", {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
