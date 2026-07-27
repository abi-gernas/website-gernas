/**
 * Terjemahan pilihan "warna" di dasbor menjadi kelas Tailwind.
 *
 * Dikumpulkan di satu tempat karena pilihan yang sama muncul di beberapa blok
 * (Kartu Berisi, Kotak Sorot). Bila daftar warnanya berubah di
 * `src/payload/blocks/shared.ts`, berkas ini yang perlu ikut disesuaikan.
 */
export type Warna = "putih" | "abu" | "navy" | "merah" | "kuning";

/** Latar + warna teks utama. */
export const warnaKotak: Record<Warna, string> = {
  putih: "bg-white text-body",
  abu: "bg-surface text-body",
  navy: "bg-brand-navy text-white",
  merah: "bg-brand-red text-white",
  kuning: "bg-brand-yellow text-brand-navy",
};

/** Warna judul di atas latar tersebut. */
export const warnaJudul: Record<Warna, string> = {
  putih: "text-brand-navy",
  abu: "text-brand-navy",
  navy: "text-brand-yellow",
  merah: "text-white",
  kuning: "text-brand-navy",
};

/** Warna paragraf di atas latar tersebut. */
export const warnaIsi: Record<Warna, string> = {
  putih: "text-body",
  abu: "text-body",
  navy: "text-white/85",
  merah: "text-white/90",
  kuning: "text-brand-navy/85",
};

export const asWarna = (v: unknown): Warna =>
  typeof v === "string" && v in warnaKotak ? (v as Warna) : "putih";

/**
 * Warna bergilir merah–biru–kuning untuk daftar yang warnanya ditentukan
 * posisi, bukan pilihan staf (modul pelatihan, kutipan tokoh).
 */
export const giliranTone = <T>(daftar: readonly T[], i: number): T =>
  daftar[i % daftar.length];

/** Terjemahan jumlah kolom dari dasbor ke kelas grid. */
export const kolomGrid: Record<string, string> = {
  "2": "sm:grid-cols-2",
  "3": "sm:grid-cols-2 lg:grid-cols-3",
  "4": "grid-cols-2 lg:grid-cols-4",
};

export const kolomKe = (v: unknown, bawaan = "3"): string =>
  kolomGrid[typeof v === "string" ? v : bawaan] ?? kolomGrid[bawaan];
