/**
 * Tulis balik "teks_en" dari scripts/i18n/translations.json (hasil isian AI)
 * ke kolom Inggris yang tepat di database.
 *
 * Jalankan:  npm run translate:import
 *
 * Hanya menulis SATU kolom per baris lewat UPSERT ke tabel `*_locales` —
 * tabel itu memang cuma berisi kolom yang diterjemahkan (judul, heading, dst),
 * bukan seluruh dokumen, jadi field lain (gambar, tautan, warna) di tabel
 * induk tidak pernah tersentuh. Baris dengan "table"/"column" yang bukan
 * berasal dari skema field localized saat ini ditolak (jaga-jaga kalau file
 * hasil AI rusak/diedit manual).
 *
 * Aman diulang: entri dengan "teks_en" kosong dilewati; menjalankan
 * translate:export lagi setelah ini hanya akan mengeluarkan sisa yang benar-
 * benar belum diterjemahkan.
 */
import fs from "fs";
import path from "path";
import pg from "pg";
import { simpulTeks } from "./richtext.mts";

for (const line of fs.readFileSync(".env", "utf8").split("\n")) {
  if (!line.includes("=") || line.trimStart().startsWith("#")) continue;
  const i = line.indexOf("=");
  process.env[line.slice(0, i).trim()] ??= line.slice(i + 1).trim();
}

const file = path.resolve("scripts/i18n/translations.json");
if (!fs.existsSync(file)) {
  console.error(`Tidak ditemukan: ${file}`);
  console.error(`Jalankan "npm run translate:export" dulu.`);
  process.exit(1);
}

type Entry = { key: string; context: string; teks_id: string; teks_en: string };
const entries: Entry[] = JSON.parse(fs.readFileSync(file, "utf8"));

const client = new pg.Client({ connectionString: process.env.DATABASE_URI_DIRECT });
await client.connect();

// Whitelist tabel.kolom yang sah — sumbernya skema saat ini, bukan isi file.
const { rows: validCols } = await client.query<{ table_name: string; column_name: string }>(`
  select table_name, column_name
  from information_schema.columns
  where table_schema = 'public'
    and table_name ~ '_locales$'
    and table_name !~ '^_'
    and column_name not in ('id', '_locale', '_parent_id')
`);
const validSet = new Set(
  validCols.map((r) => `${r.table_name.replace(/_locales$/, "")}.${r.column_name}`),
);

let updated = 0;
let skippedEmpty = 0;
let rejected = 0;

/** Kumpulan entri richText, dikelompokkan per kolom: "tabel|induk|kolom" -> { indeks: teks }. */
const richText = new Map<string, Map<number, string>>();

await client.query("BEGIN");
try {
  for (const entry of entries) {
    const teksEn = entry.teks_en?.trim();
    if (!teksEn) {
      skippedEmpty++;
      continue;
    }

    // Kunci berakhiran "#n" berasal dari dokumen richText: satu paragraf ke-n.
    // Dikumpulkan dulu, ditulis belakangan sebagai satu dokumen utuh.
    const hash = entry.key.lastIndexOf("#");
    const dasar = hash === -1 ? entry.key : entry.key.slice(0, hash);
    const indeks = hash === -1 ? null : Number(entry.key.slice(hash + 1));

    const [table, parentId, column] = dasar.split("|");
    if (!table || !parentId || !column || !validSet.has(`${table}.${column}`)) {
      console.warn(`Ditolak (bukan field localized yang dikenal): ${entry.key}`);
      rejected++;
      continue;
    }

    if (indeks !== null) {
      if (!Number.isInteger(indeks) || indeks < 0) {
        console.warn(`Ditolak (nomor paragraf tidak sah): ${entry.key}`);
        rejected++;
        continue;
      }
      if (!richText.has(dasar)) richText.set(dasar, new Map());
      richText.get(dasar)!.set(indeks, teksEn);
      continue;
    }

    await client.query(
      `insert into "${table}_locales" ("_parent_id", "_locale", "${column}")
       values ($1, 'en', $2)
       on conflict ("_locale", "_parent_id")
       do update set "${column}" = excluded."${column}"`,
      [parentId, teksEn],
    );
    updated++;
  }

  // Rakit ulang tiap dokumen richText: ambil versi Indonesia sebagai kerangka,
  // ganti isi tiap simpul teks yang punya terjemahan, simpan sebagai versi
  // Inggris. Struktur paragraf, penebalan, dan tautan ikut terbawa apa adanya.
  for (const [dasar, perIndeks] of richText) {
    const [table, parentId, column] = dasar.split("|");
    const { rows } = await client.query(
      `select "${column}" as dok from "${table}_locales" where "_parent_id" = $1 and "_locale" = 'id'`,
      [parentId],
    );
    if (!rows[0]?.dok) {
      console.warn(`Dilewati (dokumen Indonesia tidak ditemukan): ${dasar}`);
      rejected += perIndeks.size;
      continue;
    }

    const dok = structuredClone(rows[0].dok);
    const simpul = simpulTeks(dok);
    let terpakai = 0;
    for (const [i, teks] of perIndeks) {
      if (!simpul[i]) {
        console.warn(`Dilewati (paragraf ${i} tidak ada lagi di ${dasar} — isinya berubah?)`);
        rejected++;
        continue;
      }
      simpul[i].set(teks);
      terpakai++;
    }
    if (!terpakai) continue;

    await client.query(
      `insert into "${table}_locales" ("_parent_id", "_locale", "${column}")
       values ($1, 'en', $2)
       on conflict ("_locale", "_parent_id")
       do update set "${column}" = excluded."${column}"`,
      [parentId, JSON.stringify(dok)],
    );
    updated += terpakai;
  }

  await client.query("COMMIT");
} catch (err) {
  await client.query("ROLLBACK");
  throw err;
} finally {
  await client.end();
}

console.log(`${updated} kolom Inggris ditulis.`);
if (skippedEmpty) console.log(`${skippedEmpty} entri dilewati (teks_en masih kosong).`);
if (rejected) console.log(`${rejected} entri ditolak (key tidak dikenal).`);
console.log(`\nSelesai. Buka halamannya di /en untuk memastikan.`);
