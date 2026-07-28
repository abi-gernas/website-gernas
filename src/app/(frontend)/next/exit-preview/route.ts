import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { jalurInternal } from "@/lib/routes";

/**
 * Mematikan draft mode. Dipakai tautan "Keluar" pada penanda pratinjau
 * (<PreviewBadge />) agar staf bisa kembali melihat situs seperti pengunjung
 * biasa tanpa harus menghapus cookie secara manual.
 *
 * Ini bukan sekadar kenyamanan. Cookie draft mode berlaku untuk seluruh domain
 * dan bertahan sampai dimatikan, sehingga selama menyala SETIAP halaman yang
 * dibuka staf melewati cache dan dirender ulang langsung dari database —
 * termasuk saat mereka hanya menjelajah situs seperti biasa. Karena itu jalan
 * keluarnya harus semudah mungkin ditemukan dan dipakai.
 *
 * `path` mengembalikan staf ke halaman yang tadi dilihat. Tanpa itu tombol
 * "Keluar" mendarat di halaman teks polos tanpa jalan kembali — dan tombol
 * yang terasa seperti jalan buntu tidak akan dipakai.
 */
export async function GET(req: Request): Promise<Response> {
  const path = new URL(req.url).searchParams.get("path");

  const draft = await draftMode();
  draft.disable();

  // `redirect` bekerja dengan melempar — jangan bungkus dalam try/catch.
  redirect(jalurInternal(path) ? path : "/");
}
