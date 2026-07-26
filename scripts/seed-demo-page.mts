/**
 * Buat satu halaman contoh di koleksi Halaman yang memakai ketujuh blok yang
 * tersedia, supaya route `[...slug]` + <RenderBlocks> bisa dibuktikan berjalan
 * end-to-end (FR-005 / KPI No.5 sisi "halaman").
 *
 * Jalankan:  npm run seed:demo-page   (jalankan seed:media lebih dulu)
 *
 * Aman diulang: bila slug sudah ada, halaman tidak dibuat ulang.
 *
 * CATATAN: halaman ini scaffolding, bukan konten produksi. Hapus atau ubah ke
 * draf lewat dasbor sebelum DNS cutover — selama berstatus terbit ia ikut
 * masuk sitemap.xml.
 */
import fs from "fs";

for (const line of fs.readFileSync(".env", "utf8").split("\n")) {
  if (!line.includes("=") || line.trimStart().startsWith("#")) continue;
  const i = line.indexOf("=");
  process.env[line.slice(0, i).trim()] ??= line.slice(i + 1).trim();
}

const { getPayload } = await import("payload");
const config = (await import("../src/payload.config.js")).default;

const payload = await getPayload({ config });

const SLUG = "contoh-halaman";

// ── Lexical ────────────────────────────────────────────────────────────────
// Bentuk minimal satu paragraf; sama seperti scripts/seed-articles.mts.

const richText = (text: string) => ({
  root: {
    type: "root",
    format: "" as const,
    indent: 0,
    version: 1,
    direction: "ltr" as const,
    children: [
      {
        type: "paragraph",
        version: 1,
        format: "" as const,
        indent: 0,
        direction: "ltr" as const,
        textFormat: 0,
        textStyle: "",
        children: [
          {
            type: "text",
            text,
            version: 1,
            format: 0,
            detail: 0,
            mode: "normal",
            style: "",
          },
        ],
      },
    ],
  },
});

// ── Media ──────────────────────────────────────────────────────────────────

async function findMedia(legacyPath: string) {
  const res = await payload.find({
    collection: "media",
    where: { legacyPath: { equals: legacyPath } },
    limit: 1,
    pagination: false,
  });
  return res.docs[0]?.id ?? null;
}

/**
 * Ambil media apa pun sebagai cadangan. Halaman contoh tidak terikat pada
 * gambar tertentu — yang diuji adalah relasi upload di dalam blok ikut
 * ter-populate, bukan gambarnya sendiri.
 */
async function anyMedia() {
  const res = await payload.find({ collection: "media", limit: 1, pagination: false });
  return res.docs[0]?.id ?? null;
}

// ── Buat halaman ───────────────────────────────────────────────────────────

const ada = await payload.find({
  collection: "pages",
  where: { slug: { equals: SLUG } },
  limit: 1,
  pagination: false,
});

if (ada.docs.length > 0) {
  console.log(`⏭  /${SLUG} — sudah ada, tidak dibuat ulang`);
  process.exit(0);
}

const heroImage =
  (await findMedia("/media/hero-beranda.jpg")) ?? (await anyMedia());
const pageHeroImage =
  (await findMedia("/media/hero-membaca.jpg")) ?? heroImage;

if (!heroImage) {
  console.error(
    "✖ Koleksi Media kosong. Jalankan `npm run seed:media` lebih dulu — " +
      "blok hero & hero halaman mewajibkan gambar.",
  );
  process.exit(1);
}

const page = await payload.create({
  collection: "pages",
  data: {
    title: "Contoh Halaman",
    slug: SLUG,
    _status: "published",
    layout: [
      {
        blockType: "pageHero",
        title: "Contoh Halaman dari Dasbor",
        description:
          "Halaman ini disusun sepenuhnya dari blok di dasbor CMS, tanpa satu baris kode pun. Pakai sebagai contoh saat membuat halaman baru.",
        image: pageHeroImage,
        tint: "navy",
      },
      {
        blockType: "richText",
        heading: "Blok Teks",
        content: richText(
          "Blok Teks dipakai untuk isi halaman yang tidak berpola — paragraf, " +
            "daftar, kutipan, atau gambar sisipan. Susunannya bebas seperti " +
            "menulis artikel.",
        ),
      },
      {
        blockType: "statCounter",
        stats: [
          { value: 16000, suffix: "+", label: "Total Pendidik" },
          { value: 21, label: "Jumlah Provinsi" },
          { value: 62, label: "Jumlah Kab/Kota" },
        ],
      },
      {
        blockType: "valueCards",
        cards: [
          {
            title: "Kartu Merah",
            tone: "red",
            body: "Tiga kartu berwarna untuk merangkum program atau ajakan utama halaman.",
            cta: { label: "Contoh Tombol", href: "/publikasi" },
          },
          {
            title: "Kartu Biru",
            tone: "navy",
            body: "Warna kartu dipilih per kartu di dasbor: merah, biru, atau kuning.",
          },
          {
            title: "Kartu Kuning",
            tone: "yellow",
            body: "Selain tombol utama, tiap kartu bisa diberi beberapa tautan tambahan.",
            links: [
              { label: "Mitra", href: "/mitra" },
              { label: "Donatur", href: "/donatur" },
            ],
          },
        ],
      },
      {
        blockType: "hero",
        slides: [
          {
            title: "Blok Hero Bergambar",
            highlight: "Bergantian Otomatis",
            description:
              "Hero carousel biasanya dipakai di beranda. Tambahkan beberapa slide dan tiap slide berganti sendiri.",
            image: heroImage,
            cta: { label: "Mari Belajar!", href: "/belajar-bersama" },
          },
        ],
      },
      {
        blockType: "latestNews",
        heading: "Kabar Terbaru",
        limit: 3,
      },
      {
        blockType: "ctaBanner",
        title: "Blok Banner CTA menutup halaman dengan satu ajakan jelas",
        body: "Isi teks pendek di sini, lalu arahkan pengunjung ke satu tindakan.",
        image: heroImage,
        cta: { label: "Hubungi Kami", href: "/mitra#hubungi" },
      },
    ],
  },
});

console.log(`✓ Halaman contoh dibuat: /${page.slug} (id ${page.id})`);
console.log("  Buka http://localhost:3000/" + page.slug);
console.log(
  "  Ingat: hapus atau ubah ke draf sebelum DNS cutover agar tidak ikut sitemap.",
);
