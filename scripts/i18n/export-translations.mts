/**
 * Ekspor semua field yang ditandai `localized: true` (lihat payload.config.ts)
 * yang versi Inggrisnya masih kosong, sebagai satu file JSON berdampingan
 * Indonesia–Inggris — untuk diberikan ke AI penerjemah, lalu diimpor balik
 * lewat `npm run translate:import`.
 *
 * Jalankan:  npm run translate:export
 *
 * Skrip ini TIDAK mengubah data apa pun — hanya membaca. Ia menemukan tabel
 * `*_locales` secara otomatis lewat information_schema, bukan daftar yang
 * ditulis tangan, supaya field localized baru ikut terbaca tanpa menyunting
 * skrip ini. Tabel versi (`_pages_v`, `_articles_v`, dst — diawali garis
 * bawah) dilewati: itu riwayat draf yang akan tertulis ulang begitu staf
 * menyimpan halamannya lagi, jadi menerjemahkannya sia-sia.
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

const client = new pg.Client({ connectionString: process.env.DATABASE_URI_DIRECT });
await client.connect();

/** Label ramah-manusia per tabel, supaya AI punya konteks blok apa yang ia terjemahkan. */
const LABEL: Record<string, string> = {
  pages: "Judul halaman",
  articles: "Judul artikel",
  pages_blocks_hero_slides: "Hero Beranda — slide",
  pages_blocks_page_hero: "Hero Halaman",
  pages_blocks_rich_text: "Blok Teks Bebas",
  pages_blocks_feature_cards: "Blok Kartu Berisi",
  pages_blocks_feature_cards_cards: "Blok Kartu Berisi — kartu",
  pages_blocks_value_cards_cards: "Blok Kartu Nilai — kartu",
  pages_blocks_callout: "Blok Kotak Sorot",
  pages_blocks_cta_banner: "Blok Banner Ajakan",
  pages_blocks_timeline: "Blok Linimasa",
  pages_blocks_stat_counter: "Blok Baris Statistik",
  pages_blocks_latest_news: "Blok Berita Terbaru",
  pages_blocks_team_grid: "Blok Penggerak",
  pages_blocks_partner_logos: "Blok Logo Mitra",
  pages_blocks_video_grid: "Blok Daftar Video",
  pages_blocks_training_modules: "Blok Modul Pelatihan",
  pages_blocks_gallery: "Blok Galeri Foto",
  pages_blocks_testimonials: "Blok Kata Mereka",
  pages_blocks_indonesia_map: "Blok Peta Indonesia",
  pages_blocks_idea_cards: "Blok Kartu Ide",
  pages_blocks_contact_form: "Blok Formulir Kontak",
  pages_blocks_donation_tiers: "Blok Pilihan Donasi",
  pages_blocks_donation_campaigns: "Blok Kampanye Donasi",
};

// ── 1. Temukan semua tabel `*_locales` beserta kolomnya ─────────────────────
const { rows: localeTables } = await client.query<{ table_name: string; columns: string[] }>(`
  select table_name,
         array_agg(column_name::text order by ordinal_position) as columns
  from information_schema.columns
  where table_schema = 'public'
    and table_name ~ '_locales$'
    and table_name !~ '^_'
    and column_name not in ('id', '_locale', '_parent_id')
  group by table_name
`);

// ── 2. Peta induk setiap tabel (lewat FK kolom _parent_id) ──────────────────
const { rows: parentRows } = await client.query<{ table_name: string; parent: string }>(`
  select tc.table_name, ccu.table_name as parent
  from information_schema.table_constraints tc
  join information_schema.key_column_usage kcu
    on tc.constraint_name = kcu.constraint_name and tc.table_schema = kcu.table_schema
  join information_schema.constraint_column_usage ccu
    on tc.constraint_name = ccu.constraint_name and tc.table_schema = ccu.table_schema
  where tc.constraint_type = 'FOREIGN KEY' and kcu.column_name = '_parent_id'
`);
const parentOf = new Map(parentRows.map((r) => [r.table_name, r.parent]));

// ── 2b. Tipe tiap kolom — richText disimpan sebagai jsonb, bukan teks biasa ──
const { rows: typeRows } = await client.query<{
  table_name: string;
  column_name: string;
  data_type: string;
}>(`
  select table_name, column_name, data_type
  from information_schema.columns
  where table_schema = 'public' and table_name ~ '_locales$' and table_name !~ '^_'
`);
const isJsonb = new Set(
  typeRows.filter((r) => r.data_type === "jsonb").map((r) => `${r.table_name}.${r.column_name}`),
);

/** Semua "tabel.kolom" di skema — dipakai memilih kolom pengenal tabel akar. */
const { rows: semuaKolom } = await client.query<{ table_name: string; column_name: string }>(`
  select table_name, column_name from information_schema.columns where table_schema = 'public'
`);
const kolomTabel = new Set(semuaKolom.map((r) => `${r.table_name}.${r.column_name}`));


const rootSlugCache = new Map<string, string>(); // "table:id" -> slug

/** Telusuri _parent_id sampai ke tabel akar (pages/articles), kembalikan slug-nya. */
async function resolveRootSlug(table: string, id: string): Promise<string> {
  const cacheKey = `${table}:${id}`;
  if (rootSlugCache.has(cacheKey)) return rootSlugCache.get(cacheKey)!;

  let curTable = table;
  let curId = id;
  while (parentOf.has(curTable)) {
    const parentTable = parentOf.get(curTable)!;
    const { rows } = await client.query(
      `select "_parent_id" from "${curTable}" where "id" = $1`,
      [curId],
    );
    curId = rows[0]._parent_id;
    curTable = parentTable;
  }
  // Tidak semua tabel akar punya `slug` (mis. media, video, site-settings) —
  // pakai kolom pengenal yang ada, jatuh ke id kalau tidak ada sama sekali.
  const kolomNama = ["slug", "nama", "judul", "title"].find((c) =>
    kolomTabel.has(`${curTable}.${c}`),
  );
  const { rows } = kolomNama
    ? await client.query(`select "${kolomNama}" as nama from "${curTable}" where "id" = $1`, [curId])
    : { rows: [] as { nama?: string }[] };
  const slug = `${curTable}:${rows[0]?.nama ?? curId}`;
  rootSlugCache.set(cacheKey, slug);
  return slug;
}

type Entry = { key: string; context: string; teks_id: string; teks_en: string };
const entries: Entry[] = [];

for (const { table_name: table, columns } of localeTables) {
  const baseTable = table.replace(/_locales$/, "");
  const label = LABEL[baseTable] ?? baseTable;
  const selectId = columns.map((c) => `id_row."${c}" as "id_${c}"`).join(", ");
  const selectEn = columns.map((c) => `en_row."${c}" as "en_${c}"`).join(", ");

  const { rows } = await client.query(`
    select id_row."_parent_id" as parent_id, ${selectId}, ${selectEn}
    from "${table}" id_row
    left join "${table}" en_row on en_row."_parent_id" = id_row."_parent_id" and en_row."_locale" = 'en'
    where id_row."_locale" = 'id'
  `);

  for (const row of rows) {
    const rootSlug = await resolveRootSlug(baseTable, row.parent_id);
    for (const col of columns) {
      const nilaiId = row[`id_${col}`];
      const nilaiEn = row[`en_${col}`];

      // richText (jsonb): satu entri per paragraf/simpul teks, bukan per kolom,
      // supaya AI menerjemahkan kalimat biasa — bukan menyunting JSON mentah.
      if (isJsonb.has(`${table}.${col}`)) {
        if (!nilaiId) continue;
        if (nilaiEn) continue; // kolom ini sudah punya versi Inggris
        const simpul = simpulTeks(structuredClone(nilaiId));
        simpul.forEach((s, i) => {
          if (!s.text.trim()) return;
          entries.push({
            key: `${baseTable}|${row.parent_id}|${col}#${i}`,
            context: `${rootSlug} > ${label} > ${col} (paragraf ${i + 1})`,
            teks_id: s.text,
            teks_en: "",
          });
        });
        continue;
      }

      const teksId: string | null = nilaiId;
      const teksEn: string | null = nilaiEn;
      if (!teksId || !teksId.trim()) continue; // tidak ada yang perlu diterjemahkan
      if (teksEn && teksEn.trim()) continue; // sudah diterjemahkan, lewati

      entries.push({
        key: `${baseTable}|${row.parent_id}|${col}`,
        context: `${rootSlug} > ${label} > ${col}`,
        teks_id: teksId,
        teks_en: "",
      });
    }
  }
}

await client.end();

const outDir = path.resolve("scripts/i18n");
fs.mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, "translations.json");
fs.writeFileSync(outFile, JSON.stringify(entries, null, 2));

console.log(`${entries.length} teks belum punya versi Inggris.`);
console.log(`Ditulis ke: ${outFile}`);
console.log(`\nLangkah berikutnya:`);
console.log(`1. Berikan file ini ke AI (mis. unggah ke chat), minta isi "teks_en" saja,`);
console.log(`   jangan ubah "key"/"context"/"teks_id".`);
console.log(`2. Simpan hasilnya menimpa file yang sama (atau kirim isinya balik ke sini).`);
console.log(`3. Jalankan: npm run translate:import`);
