/**
 * Pembantu untuk dokumen richText (Lexical) — dipakai bareng oleh
 * export-translations.mts dan import-translations.mts.
 */

/**
 * Kumpulkan simpul teks di dalam dokumen richText sesuai urutan kemunculannya.
 * Yang diterjemahkan hanya isi `text`-nya; struktur paragraf, penebalan, daftar,
 * dan tautan tetap utuh karena simpul lain tidak disentuh.
 *
 * Urutannya deterministik (telusur mendalam mengikuti urutan kunci JSON), jadi
 * indeks yang dipakai saat ekspor menunjuk simpul yang sama saat impor —
 * SELAMA isi versi Indonesianya tidak diubah di antara keduanya. Bila berubah,
 * impor akan melewati indeks yang tidak lagi ada dan memberi peringatan.
 */
export function simpulTeks(
  node: unknown,
  out: { text: string; set: (v: string) => void }[] = [],
): { text: string; set: (v: string) => void }[] {
  if (Array.isArray(node)) {
    for (const n of node) simpulTeks(n, out);
    return out;
  }
  if (!node || typeof node !== "object") return out;
  const obj = node as Record<string, unknown>;
  if (obj.type === "text" && typeof obj.text === "string") {
    out.push({ text: obj.text, set: (v) => (obj.text = v) });
  }
  for (const key of Object.keys(obj)) {
    const v = obj[key];
    if (v && typeof v === "object") simpulTeks(v, out);
  }
  return out;
}
