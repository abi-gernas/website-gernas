import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { RenderBlocks } from "@/components/RenderBlocks";
import { LivePreviewListener } from "@/components/LivePreviewListener";
import { PreviewBadge } from "@/components/PreviewBadge";
import { getPageBySlug } from "@/lib/pages";
import { HOME_SLUG } from "@/lib/routes";

/**
 * Beranda — isinya dokumen Halaman ber-slug `beranda`, bukan tata letak yang
 * ditulis di berkas ini.
 *
 * Beranda tidak bisa ikut route catch-all `[...slug]` karena "/" tidak punya
 * segmen yang bisa dicocokkan, jadi route ini mengambil dokumennya secara
 * khusus. Selebihnya perlakuannya sama persis dengan halaman lain: blok yang
 * sama, pratinjau draf yang sama.
 */

export default async function HomePage() {
  const { isEnabled: draft } = await draftMode();
  const page = await getPageBySlug(HOME_SLUG, draft);
  if (!page) notFound();

  return (
    <>
      {draft && (
        <>
          <LivePreviewListener />
          <PreviewBadge />
        </>
      )}
      <RenderBlocks blocks={page.layout} />
    </>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const { isEnabled: draft } = await draftMode();
  const page = await getPageBySlug(HOME_SLUG, draft);
  if (!page) return {};

  /**
   * Berbeda dari halaman lain, judul dokumen TIDAK dipakai sebagai cadangan:
   * judulnya "Beranda", sedangkan beranda harus memakai judul situs lengkap
   * yang sudah ditetapkan di layout. Nilai di sini hanya menimpa bila staf
   * benar-benar mengisi panel SEO.
   */
  const title = page.meta?.title || undefined;
  const description = page.meta?.description || undefined;
  const ogImage =
    page.meta?.image && typeof page.meta.image === "object"
      ? page.meta.image.url
      : undefined;

  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    alternates: { canonical: "/" },
    openGraph: {
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      type: "website",
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
  };
}
