import { getMediaInteraktifBySlug } from "@/lib/mediaInteraktif";

/**
 * Halaman main satu Media Interaktif: `kontenHtml` dikirim apa adanya sebagai
 * halaman penuh, dibuka dari tombol di halaman detail (tab baru).
 *
 * Kode ini tempelan staf/kontributor, padahal disajikan dari domain kita.
 * Header CSP `sandbox` (tanpa `allow-same-origin`) membuat halamannya jalan di
 * origin kosong, sama seperti iframe ber-sandbox: tidak bisa membaca cookie
 * atau sesi admin, dan tidak bisa memanggil /api atas nama pengunjung.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getMediaInteraktifBySlug(slug);
  if (!item?.kontenHtml) return new Response("Not found", { status: 404 });

  return new Response(item.kontenHtml, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Security-Policy": "sandbox allow-scripts allow-forms allow-popups allow-modals",
      "X-Robots-Tag": "noindex",
    },
  });
}
