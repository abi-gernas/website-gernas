/**
 * Isi awal Global "Navigation" (menu navbar) — menggantikan `navByLocale`
 * yang sebelumnya hardcode di `src/lib/nav.ts`.
 *
 * Jalankan:  npm run seed:navigation
 *
 * Ditulis dalam SATU panggilan `updateGlobal({ locale: "all" })`: field
 * `items`/`children` (array) tidak localized, jadi tiap array itu sendiri
 * ditulis ulang seluruhnya di setiap panggilan — memanggilnya dua kali per
 * locale membuat baris lama diganti baris baru berid acak, dan label locale
 * sebelumnya hilang (lihat memory `payload_blocks_update_wipes_locale`).
 *
 * Aman diulang: bila Global sudah punya isi (`items` tidak kosong), skrip
 * ini dilewati seluruhnya, sama seperti pola seed lain di proyek ini.
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

type Label = { id: string; en: string };
type Child = { label: Label; href: string; desc?: Label };
type Item = { label: Label; href?: string; children?: Child[] };

const items: Item[] = [
  { label: { id: "Beranda", en: "Home" }, href: "/" },
  {
    label: { id: "Profil", en: "Profile" },
    children: [
      {
        label: { id: "Tentang Gernas Tastaka", en: "About Gernas Tastaka" },
        href: "/tentang-gernas-tastaka",
        desc: {
          id: "Sejarah, visi-misi, dan para penggerak",
          en: "History, vision, mission, and the team",
        },
      },
      {
        label: { id: "Galeri", en: "Gallery" },
        href: "/galeri",
        desc: { id: "Dokumentasi kegiatan", en: "Program documentation" },
      },
    ],
  },
  {
    label: { id: "Kemitraan", en: "Partnerships" },
    children: [
      {
        label: { id: "Mitra", en: "Partners" },
        href: "/mitra",
        desc: { id: "Kolaborasi & CSR", en: "Collaboration & CSR" },
      },
      {
        label: { id: "Donatur", en: "Donors" },
        href: "/donatur",
        desc: { id: "Dukung program kami", en: "Support our programs" },
      },
    ],
  },
  {
    label: { id: "Program", en: "Programs" },
    children: [
      {
        label: { id: "Tumbuh Bersama", en: "Tumbuh Bersama" },
        href: "/tumbuh-bersama",
        desc: { id: "Kompilasi bahan ajar", en: "Teaching resource collection" },
      },
      {
        label: { id: "Belajar Bersama", en: "Belajar Bersama" },
        href: "/belajar-bersama",
        desc: { id: "Program pelatihan", en: "Training programs" },
      },
    ],
  },
  {
    label: { id: "Mari Gabung", en: "Get Involved" },
    children: [
      {
        label: { id: "Jadi Mitra", en: "Become a Partner" },
        href: "/mitra",
        desc: { id: "Berkolaborasi bersama", en: "Collaborate with us" },
      },
      {
        label: { id: "Donasi", en: "Donate" },
        href: "/donatur",
        desc: { id: "Berikan dukungan", en: "Give your support" },
      },
      {
        label: { id: "Penggerak", en: "Team" },
        href: "/tentang-gernas-tastaka#penggerak",
        desc: { id: "Tim di balik gerakan", en: "The people behind the movement" },
      },
    ],
  },
  {
    label: { id: "Informasi", en: "Information" },
    children: [
      {
        label: { id: "Publikasi", en: "Publications" },
        href: "/publikasi",
        desc: { id: "Riset & kajian", en: "Research & insights" },
      },
      {
        label: { id: "Kabar Terbaru", en: "Latest News" },
        href: "/#kabar-terbaru",
        desc: { id: "Berita & kolaborasi", en: "News & collaborations" },
      },
    ],
  },
];

const existing = await payload.findGlobal({ slug: "navigation", locale: "id", depth: 0 });
const isiSekarang = (existing.items ?? []).filter((item: { label?: unknown }) => item?.label);
if (isiSekarang.length > 0) {
  console.log(`⏭  navigation — sudah berisi ${isiSekarang.length} menu, dilewati`);
  process.exit(0);
}

/** `href` -> field Tautan Kustom (linkType/preset/custom) yang dipakai skema saat ini. */
function withLink<T extends { href?: string }>(node: T) {
  const { href, ...rest } = node;
  return {
    ...rest,
    ...(href ? { linkType: "custom" as const, preset: "__custom__", custom: href } : {}),
  };
}

const itemsUntukPayload = items.map((item) => ({
  ...withLink(item),
  children: item.children?.map(withLink),
}));

await payload.updateGlobal({ slug: "navigation", locale: "all", data: { items: itemsUntukPayload } });

console.log(`✅ navigation — ${items.length} menu utama diisi (id + en)`);
process.exit(0);
