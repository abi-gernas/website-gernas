import { publicPath, type PreviewableCollection } from "@/lib/routes";

/**
 * URL yang dipakai dasbor untuk membuka pratinjau — baik di dalam iframe Live
 * Preview maupun lewat tombol "Pratinjau" yang membuka tab baru.
 *
 * Tidak menunjuk langsung ke halaman publik, melainkan ke `/next/preview`, agar
 * route itu bisa menyalakan draft mode Next lebih dulu. Tanpa perantara itu
 * pratinjau hanya menampilkan versi terbit terakhir — persis masalah yang
 * membuat Live Preview di koleksi Halaman sebelumnya terlihat aktif tetapi
 * tidak pernah menampilkan suntingan yang belum disimpan.
 */
export function previewURL({
  collection,
  slug,
}: {
  collection: PreviewableCollection;
  slug: unknown;
}): string | null {
  // Dokumen baru yang belum punya slug belum punya alamat untuk dipratinjau.
  if (typeof slug !== "string" || slug.length === 0) return null;

  const params = new URLSearchParams({
    path: publicPath(collection, slug),
    collection,
    slug,
  });

  // Absolut, karena nilainya dipakai sebagai `src` iframe.
  const base = process.env.NEXT_PUBLIC_SERVER_URL ?? "";
  return `${base}/next/preview?${params.toString()}`;
}

/**
 * Ukuran layar yang bisa dipilih staf di bilah Live Preview.
 * "Responsif" sudah disediakan Payload secara bawaan.
 */
export const livePreviewBreakpoints = [
  { name: "mobile", label: "Ponsel", width: 390, height: 844 },
  { name: "tablet", label: "Tablet", width: 768, height: 1024 },
  { name: "desktop", label: "Layar lebar", width: 1440, height: 900 },
];
