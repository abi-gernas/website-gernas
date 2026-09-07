/**
 * Bintang rating read-only — dibulatkan ke bilangan terdekat (tidak ada
 * render bintang setengah). Dipakai utk rata-rata di header produk maupun
 * rating per ulasan di `UlasanList`.
 */
export function RatingBintang({
  rating,
  size = "md",
}: {
  rating: number;
  size?: "sm" | "md";
}) {
  const terisi = Math.min(5, Math.max(0, Math.round(rating)));
  const kelasUkuran = size === "sm" ? "text-sm" : "text-base";

  return (
    <span aria-hidden="true" className={`text-brand-yellow-dark ${kelasUkuran}`}>
      {"★".repeat(terisi)}
      <span className="text-brand-navy/20">{"★".repeat(5 - terisi)}</span>
    </span>
  );
}
