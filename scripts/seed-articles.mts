/**
 * Impor artikel hasil migrasi WordPress (scripts/data-artikel.ts) ke koleksi
 * Articles Payload.
 *
 * Jalankan:  npm run seed:articles   (jalankan seed:media lebih dulu)
 *
 * Aman diulang: artikel yang slug-nya sudah ada akan dilewati.
 *
 * Gambar dipetakan lewat Media.legacyPath — nama berkas sudah berubah
 * menjadi .webp, jadi path lama adalah satu-satunya penghubung.
 */
import fs from "fs";

for (const line of fs.readFileSync(".env", "utf8").split("\n")) {
  if (!line.includes("=") || line.trimStart().startsWith("#")) continue;
  const i = line.indexOf("=");
  process.env[line.slice(0, i).trim()] ??= line.slice(i + 1).trim();
}

const { getPayload } = await import("payload");
const config = (await import("../src/payload.config.js")).default;
const { articles } = await import("./data-artikel.js");

const payload = await getPayload({ config });

// ── Lexical ────────────────────────────────────────────────────────────────
// Payload menyimpan rich text sebagai pohon Lexical. Blok sederhana dari
// WordPress (p / h / image) dipetakan ke node yang setara.

const textNode = (text: string) => ({
  type: "text",
  text,
  version: 1,
  format: 0,
  detail: 0,
  mode: "normal",
  style: "",
});

const paragraphNode = (text: string) => ({
  type: "paragraph",
  version: 1,
  format: "",
  indent: 0,
  direction: "ltr" as const,
  textFormat: 0,
  textStyle: "",
  children: [textNode(text)],
});

const headingNode = (text: string) => ({
  type: "heading",
  tag: "h2",
  version: 1,
  format: "",
  indent: 0,
  direction: "ltr" as const,
  children: [textNode(text)],
});

const uploadNode = (mediaId: number | string) => ({
  type: "upload",
  version: 3,
  relationTo: "media",
  value: mediaId,
  fields: null,
  format: "",
});

// ── Pemetaan gambar ────────────────────────────────────────────────────────

const mediaCache = new Map<string, number | string | null>();

async function findMedia(legacyPath: string) {
  if (mediaCache.has(legacyPath)) return mediaCache.get(legacyPath)!;
  const res = await payload.find({
    collection: "media",
    where: { legacyPath: { equals: legacyPath } },
    limit: 1,
    pagination: false,
  });
  const id = res.docs[0]?.id ?? null;
  mediaCache.set(legacyPath, id);
  return id;
}

// ── Kategori ───────────────────────────────────────────────────────────────

const categoryCache = new Map<string, number | string>();

async function ensureCategory(title: string) {
  if (categoryCache.has(title)) return categoryCache.get(title)!;
  const found = await payload.find({
    collection: "categories",
    where: { title: { equals: title } },
    limit: 1,
    pagination: false,
  });
  if (found.docs[0]) {
    categoryCache.set(title, found.docs[0].id);
    return found.docs[0].id;
  }
  const created = await payload.create({ collection: "categories", data: { title } });
  console.log(`  + kategori dibuat: ${title}`);
  categoryCache.set(title, created.id);
  return created.id;
}

// ── Impor ──────────────────────────────────────────────────────────────────

let dibuat = 0;
let dilewati = 0;
let gambarHilang = 0;

for (const a of articles) {
  const ada = await payload.find({
    collection: "articles",
    where: { slug: { equals: a.slug } },
    limit: 1,
    pagination: false,
  });
  if (ada.docs.length > 0) {
    dilewati++;
    console.log(`⏭  ${a.slug} — sudah ada`);
    continue;
  }

  console.log(`\n▸ ${a.title.slice(0, 62)}`);

  const categoryId = await ensureCategory(a.category);

  let coverId: number | string | null = null;
  if (a.image) {
    coverId = await findMedia(a.image);
    if (!coverId) {
      gambarHilang++;
      console.log(`  ⚠ sampul tidak ditemukan di Media: ${a.image}`);
    }
  }

  const children: unknown[] = [];
  for (const b of a.blocks) {
    if (b.type === "image") {
      if (!b.src) continue;
      const id = await findMedia(b.src);
      if (id) {
        children.push(uploadNode(id));
      } else {
        gambarHilang++;
        console.log(`  ⚠ gambar isi tidak ditemukan di Media: ${b.src}`);
      }
      continue;
    }
    const text = b.text?.trim();
    if (!text) continue;
    children.push(b.type === "h" ? headingNode(text) : paragraphNode(text));
  }

  // Ringkasan diambil dari paragraf pertama, dipotong di batas kata.
  const firstParagraph = a.blocks.find((b) => b.type === "p" && b.text?.trim())?.text ?? "";
  const excerpt =
    firstParagraph.length > 200
      ? firstParagraph.slice(0, 200).replace(/\s+\S*$/, "") + "…"
      : firstParagraph;

  await payload.create({
    collection: "articles",
    data: {
      title: a.title,
      slug: a.slug,
      publishedAt: new Date(a.date).toISOString(),
      category: categoryId,
      image: coverId,
      excerpt,
      content: {
        root: {
          type: "root",
          format: "",
          indent: 0,
          version: 1,
          direction: "ltr",
          children,
        },
      },
      _status: "published",
    } as never,
  });

  dibuat++;
  console.log(`  ✓ dibuat — ${children.length} blok isi`);
}

console.log(`\n${"─".repeat(52)}`);
console.log(`Dibuat: ${dibuat}   Dilewati: ${dilewati}   Gambar tak ketemu: ${gambarHilang}`);
process.exit(gambarHilang > 0 ? 1 : 0);
