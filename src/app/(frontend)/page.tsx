import type { Metadata } from "next";
import { HomeContent, homeMetadata } from "@/components/pages/HomeContent";

/**
 * Beranda — isinya dokumen Halaman ber-slug `beranda`, bukan tata letak yang
 * ditulis di berkas ini.
 *
 * Beranda tidak bisa ikut route catch-all `[...slug]` karena "/" tidak punya
 * segmen yang bisa dicocokkan, jadi route ini mengambil dokumennya secara
 * khusus. Selebihnya perlakuannya sama persis dengan halaman lain: blok yang
 * sama, pratinjau draf yang sama.
 *
 * Versi Inggris ada di `en/page.tsx` sebagai route terpisah (bukan segmen
 * `[locale]`) karena locale default (id) sengaja tidak berprefix di URL —
 * lihat `src/lib/i18n.ts`.
 */
export default function HomePage() {
  return <HomeContent locale="id" />;
}

export async function generateMetadata(): Promise<Metadata> {
  return homeMetadata("id");
}
