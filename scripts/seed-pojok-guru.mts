/**
 * Kerangka Pojok Guru — sesi 5A di `docs/RENCANA-EKSEKUSI-LIBRARY-GURU.md` §4.5.
 *
 * Jalankan:  npm run seed:pojok-guru
 *   (setelah seed:pages & seed:navigation, dan migrasi `pojok_guru_navigasi`
 *   sudah dijalankan — skrip ini menulis field `sorot` & `anchor` dari migrasi itu)
 *
 * Empat langkah, masing-masing dilewati bila sudah pernah dijalankan:
 *  1. Dokumen Halaman `pojok-guru` (ID + EN): Hero Pencarian (5B), Pembuka 2
 *     Kolom & Produk Sorotan (5C), Perangkat Guru (5D), Acara Terdekat (5E),
 *     Kartu Komunitas & Tentang Ringkas (5F). Halaman hasil seed sesi
 *     sebelumnya (tanpa Kartu Komunitas) dibuat ulang otomatis, asal belum
 *     disunting staf.
 *  2. Menu "Pojok Guru" di Global Navigasi, disisipkan tepat setelah "Beranda".
 *  3. Kotak sorot ajakan ke Pojok Guru di beranda, setelah blok Kartu Berisi.
 *  4. Penanda `jadwal-acara` pada blok Jadwal Acara di /belajar-bersama, supaya
 *     menu "Jadwal Acara" melompat ke bagiannya.
 *
 * Kenapa langkah 3–4 memakai SQL, bukan `payload.update`: menulis `layout`
 * halaman lewat Payload API menghapus terjemahan Inggris seluruh halaman —
 * termasuk dengan `locale: "all"`, yang sempat dicoba 15 Sep 2026 dan
 * mengosongkan EN beranda (sudah dipulihkan dari cadangan). Lihat memory
 * `payload_blocks_update_wipes_locale`. Langkah 1 (`create`) dan 2 (`updateGlobal`,
 * Global tanpa versions) terbukti aman dengan `locale: "all"`, dan tetap
 * diverifikasi setelah ditulis.
 *
 * Isi lama disimpan ke `$BACKUP_DIR` sebelum ditulis bila variabel itu diisi.
 */
import crypto from "crypto";
import fs from "fs";
import path from "path";

for (const line of fs.readFileSync(".env", "utf8").split("\n")) {
  if (!line.includes("=") || line.trimStart().startsWith("#")) continue;
  const i = line.indexOf("=");
  process.env[line.slice(0, i).trim()] ??= line.slice(i + 1).trim();
}

const { getPayload } = await import("payload");
const { sql } = await import("@payloadcms/db-postgres");
const config = (await import("../src/payload.config.js")).default;

const payload = await getPayload({ config });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Json = any;
const SEMUA = "all" as never;
const db = payload.db.drizzle as Json;

const L = (id: string, en: string) => ({ id, en });

const paragraf = (teks: string) => ({
  root: {
    type: "root",
    format: "",
    indent: 0,
    version: 1,
    direction: "ltr",
    children: [
      {
        type: "paragraph",
        format: "",
        indent: 0,
        version: 1,
        direction: "ltr",
        textFormat: 0,
        textStyle: "",
        children: [
          { type: "text", text: teks, version: 1, format: 0, detail: 0, mode: "normal", style: "" },
        ],
      },
    ],
  },
});

/**
 * Bentuk pembanding: kunci diurutkan, nilai kosong (null, {}, []) dibuang.
 * Payload kadang mengembalikan grup kosong sebagai `{ id: null }` dan kadang
 * tidak sama sekali — keduanya berarti sama.
 */
function normal(v: unknown): unknown {
  if (Array.isArray(v)) {
    const isi = v.map(normal).filter((x) => x !== undefined);
    return isi.length ? isi : undefined;
  }
  if (v && typeof v === "object") {
    const pasangan = Object.keys(v)
      .filter((k) => !["updatedAt", "createdAt"].includes(k))
      .sort()
      .map((k) => [k, normal((v as Record<string, unknown>)[k])] as const)
      .filter(([, x]) => x !== undefined);
    return pasangan.length ? Object.fromEntries(pasangan) : undefined;
  }
  return v ?? undefined;
}
const sama = (a: unknown, b: unknown) => JSON.stringify(normal(a)) === JSON.stringify(normal(b));

function cadangkan(nama: string, isi: unknown) {
  const dir = process.env.BACKUP_DIR;
  if (!dir) return;
  fs.mkdirSync(dir, { recursive: true });
  const berkas = path.join(dir, `${nama}-${Date.now()}.json`);
  fs.writeFileSync(berkas, JSON.stringify(isi, null, 2));
  console.log(`   cadangan: ${berkas}`);
}

async function halamanSemuaLocale(slug: string): Promise<Json | null> {
  const res = await payload.find({
    collection: "pages",
    where: { slug: { equals: slug } },
    locale: SEMUA,
    depth: 0,
    limit: 1,
    pagination: false,
  });
  return res.docs[0] ?? null;
}

/** Versi terakhir sebuah halaman, atau null. Blok baru juga harus disisipkan di sini — dasbor membuka versi ini. */
async function versiTerakhir(pageId: number): Promise<{ id: number; status: string } | null> {
  const res = await db.execute(
    sql`select id, version__status as status from _pages_v where parent_id = ${pageId} and latest = true order by id desc limit 1`,
  );
  return res.rows[0] ?? null;
}

/** Tabel blok tingkat atas (punya `_path` & `_parent_id` bilangan) untuk dokumen utama atau versi. */
async function tabelBlok(awalan: "pages_blocks_" | "_pages_v_blocks_"): Promise<string[]> {
  const pola = `${awalan.replace(/_/g, "\\_")}%`;
  const res = await db.execute(sql`
    select c.table_name from information_schema.columns c
    where c.table_schema = 'public' and c.table_name like ${pola} and c.column_name = '_path'
      and exists (
        select 1 from information_schema.columns p
        where p.table_schema = 'public' and p.table_name = c.table_name
          and p.column_name = '_parent_id' and p.udt_name = 'int4'
      )`);
  return res.rows.map((r: Json) => r.table_name as string);
}

// ── 1. Halaman pojok-guru ──────────────────────────────────────────────────

const belajarBersama = await halamanSemuaLocale("belajar-bersama");
if (!belajarBersama) throw new Error("Halaman belajar-bersama tidak ada — jalankan seed:pages dulu.");

const pojokGuruLama = await halamanSemuaLocale("pojok-guru");
let perluDibuat = !pojokGuruLama;

if (pojokGuruLama && !pojokGuruLama.layout?.some((b: Json) => b.blockType === "komunitas")) {
  // Isi hasil seed sesi sebelumnya (5A–5E, tanpa Kartu Komunitas). Dibuat
  // ulang dengan blok terbaru — tapi hanya bila belum pernah disunting staf,
  // yaitu masih satu versi saja.
  const versi = await db.execute(
    sql`select count(*)::int as n from _pages_v where parent_id = ${pojokGuruLama.id}`,
  );
  if (versi.rows[0].n <= 1) {
    cadangkan("pojok-guru", pojokGuruLama);
    await payload.delete({ collection: "pages", id: pojokGuruLama.id });
    perluDibuat = true;
    console.log("↻  /pojok-guru — isi seed lama dihapus, dibuat ulang dengan blok 5F");
  } else {
    console.log(
      "⚠  /pojok-guru sudah disunting staf — tambahkan blok Kartu Komunitas & Tentang Ringkas lewat dasbor",
    );
  }
}

if (!perluDibuat) {
  console.log("⏭  /pojok-guru — sudah ada, tidak dibuat ulang");
} else {
  // Gambar hero dipinjam dari hero Belajar Bersama (foto kegiatan guru) sampai
  // ada foto khusus; staf tinggal menggantinya di dasbor.
  const gambarHero = belajarBersama.layout.find((b: Json) => b.blockType === "pageHero")?.image;
  if (!gambarHero) throw new Error("Hero Belajar Bersama tidak punya gambar untuk dipinjam.");

  await payload.create({
    collection: "pages",
    locale: SEMUA,
    depth: 0,
    data: {
      title: L("Pojok Guru", "Teacher's Corner"),
      slug: "pojok-guru",
      _status: "published",
      meta: {
        title: L("Pojok Guru", "Teacher's Corner"),
        description: L(
          "Perangkat pembelajaran untuk guru SD/MI dari Gernas Tastaka: buku, bahan ajar, alat peraga, video, media interaktif, dan jadwal acara.",
          "Teaching resources for primary school teachers from Gernas Tastaka: books, teaching materials, teaching aids, videos, interactive media, and events.",
        ),
      },
      layout: [
        {
          blockType: "pencarianCepat",
          judul: L("Cari Kebutuhan Anda!", "Find What You Need!"),
          subjudul: L(
            "Temukan buku, alat peraga, video, dan media interaktif untuk kelas Anda dengan mudah.",
            "Easily find books, teaching aids, videos, and interactive media for your classroom.",
          ),
          gambarLatar: gambarHero,
          placeholder: L(
            "Cari materi, topik, kelas, atau kata kunci…",
            "Search materials, topics, grades, or keywords…",
          ),
          // Dipilih yang terbukti ada hasilnya per 15 Sep 2026 ("geometri" &
          // "statistika" nihil: topik produk berupa pilihan, bukan teks yang
          // dicari). Isi materi berbahasa Indonesia, jadi versi Inggrisnya
          // tetap kata Indonesia.
          tagPopuler: ["Pecahan", "Bangun Datar", "Perkalian", "Nilai Tempat"].map((k) => ({
            label: L(k, k),
          })),
        },
        {
          blockType: "introDuaKolom",
          judul: L(
            "Tumbuh Bersama Dengan Kompilasi Bahan Ajar",
            "Growing Together Through a Collection of Teaching Materials",
          ),
          ringkas: L(
            "Gernas Tastaka mengompilasi beragam materi dan ide belajar praktis yang dapat diakses para guru untuk memperkaya pembelajaran di kelas.",
            "Gernas Tastaka compiles a wide range of materials and practical learning ideas that teachers can access to enrich classroom learning.",
          ),
          isi: {
            id: paragraf(
              "Gernas Tastaka menghadirkan berbagai karya dan materi pembelajaran yang dapat langsung diterapkan oleh guru di kelas. Materi dirancang dengan prinsip kedekatan pada kehidupan sehari-hari, penumbuhan nalar, dan pembangunan rasa percaya diri murid dalam belajar matematika dan membaca. Selain itu, tersedia juga rekaman webinar dan video pembelajaran dari program Bincang Gernas yang berisi refleksi, diskusi, serta praktik langsung penerapan pembelajaran bernalar di Sekolah Dasar. Kami percaya, pengetahuan akan tumbuh lebih kuat ketika dibagikan dan diterapkan bersama.",
            ),
            en: paragraf(
              "Gernas Tastaka offers a variety of works and learning materials that teachers can apply directly in the classroom. The materials are designed around closeness to everyday life, nurturing reasoning, and building students' confidence in learning mathematics and reading. Recordings of webinars and learning videos from the Bincang Gernas program are also available, featuring reflections, discussions, and hands-on practice of reasoning-based learning in primary schools. We believe knowledge grows stronger when it is shared and applied together.",
            ),
          },
        },
        {
          // Produk dikosongkan → otomatis produk "Produk Terbaru" katalog.
          // Kalimat sorotan mockup ("Membaca menjadi jauh lebih bermakna")
          // milik produk contoh LKS Fonik yang tidak ada di data, jadi tidak diisi.
          blockType: "produkSorotan",
          heading: L("Produk Terbaru", "Latest Product"),
          alasan: {
            judul: L("Mengapa Guru Memilih Perangkat Gernas?", "Why Teachers Choose Gernas Resources"),
            poin: [
              L("Disusun oleh praktisi pendidikan", "Developed by education practitioners"),
              L("Sesuai kurikulum terbaru", "Aligned with the latest curriculum"),
              L("Siap digunakan di kelas", "Ready to use in the classroom"),
              L("Tersedia versi cetak & digital", "Available in print & digital editions"),
              L("Harga terjangkau", "Affordable pricing"),
            ].map((teks) => ({ teks })),
          },
        },
        {
          // Judul kartu & keterangan angka dikosongkan → nama katalog; gambar
          // kartu dikosongkan → sampul materi pertama katalognya. Deskripsi
          // Video & Media Interaktif di mockup hanya salinan kartu atasnya,
          // jadi ditulis ulang sesuai isi katalog.
          blockType: "perangkatGuru",
          judul: L("Perangkat Pembelajaran untuk Guru", "Teaching Resources for Teachers"),
          subjudul: L(
            "Temukan berbagai sumber belajar siap pakai untuk mendukung pembelajaran di kelas",
            "Discover ready-to-use learning resources to support teaching in your classroom",
          ),
          kartu: [
            {
              katalog: "produk",
              warna: "navy",
              deskripsi: L(
                "Materi lengkap dan terstruktur sesuai kebutuhan guru.",
                "Complete, well-structured materials tailored to teachers' needs.",
              ),
            },
            {
              katalog: "videoPembelajaran",
              warna: "kuning",
              deskripsi: L(
                "Video aktivitas sederhana untuk mengajarkan konsep secara bernalar.",
                "Short activity videos for teaching concepts through reasoning.",
              ),
            },
            {
              katalog: "mediaInteraktif",
              warna: "abu",
              deskripsi: L(
                "Latihan numerasi digital yang bisa langsung dimainkan siswa.",
                "Digital numeracy activities students can play right away.",
              ),
            },
          ],
          panel: {
            // Angka mockup (45.000+ / 200+ / 1000+) sengaja tidak dipakai —
            // keputusan 16 Sep 2026: tampilkan jumlah materi yang ada. Alat
            // Peraga tidak ikut dihitung karena isinya masih dokumen uji [QA].
            statistik: [{ sumber: "produk" }, { sumber: "videoPembelajaran" }, { sumber: "mediaInteraktif" }],
            judul: L("Belum menemukan yang anda cari?", "Haven't found what you're looking for?"),
            isi: L(
              "Kami siap membantu Anda menemukan perangkat pembelajaran yang sesuai dengan kebutuhan Anda.",
              "We are ready to help you find the learning materials that fit your needs.",
            ),
            // Sama dengan banner bantuan Library: formulir kontak di halaman Mitra.
            cta: { label: L("Hubungi Kami!", "Contact Us"), href: "/mitra#hubungi" },
          },
        },
        {
          // Per 16 Sep 2026 semua acara sudah lewat. Keputusan user: bagian ini
          // tetap tampil dengan acara terbaru, jadi `sembunyikanSelesai` tidak
          // dicentang — acara mendatang tetap otomatis di depan bila ada.
          blockType: "jadwalAcara",
          heading: L("Acara Terdekat", "Upcoming Events"),
          deskripsi: L(
            "Tingkatkan kompetensi dan dapatkan inspirasi dari kegiatan Gernas Tastaka dan Gernas Tastaba",
            "Build your skills and get inspired by Gernas Tastaka and Gernas Tastaba activities",
          ),
          tampilan: "geser",
          batasAwal: 8,
          sembunyikanSelesai: false,
          tautanLihatSemua: {
            label: L("Lihat Semua Program", "View All Programs"),
            href: "/belajar-bersama#jadwal-acara",
          },
        },
        {
          // Jumlah anggota ("300+ Pendidik") sengaja tidak ditampilkan dan tombol
          // Gabung disamakan dengan "Hubungi Kami" — keputusan user 16 Sep 2026.
          // Ilustrasi dikosongkan sampai ada aset dari tim.
          blockType: "komunitas",
          judul: L("Bergabung dengan Komunitas", "Join the Community"),
          subjudul: L(
            "Berbagi, belajar, dan tumbuh bersama ribuan guru di seluruh Indonesia.",
            "Share, learn, and grow with thousands of teachers across Indonesia.",
          ),
          kartu: [
            {
              nama: L("Komunitas Gernas Tastaka", "Gernas Tastaka Community"),
              deskripsi: L(
                "Komunitas untuk guru yang ingin berbagi praktik baik, diskusi pembelajaran, dan kolaborasi untuk kelas yang lebih bermakna.",
                "A community for teachers who want to share good practices, discuss teaching, and collaborate for more meaningful classrooms.",
              ),
              warna: "navy",
              ikon: "komunitas",
              cta: { label: L("Gabung Sekarang!", "Join Now!"), href: "/mitra#hubungi" },
            },
            {
              nama: L("Komunitas Gernas Tastaba", "Gernas Tastaba Community"),
              deskripsi: L(
                "Komunitas penggerak literasi membaca yang membantu sekolah dan guru menciptakan perubahan yang berdampak.",
                "A community of reading literacy champions helping schools and teachers create meaningful change.",
              ),
              warna: "merah",
              ikon: "buku",
              cta: { label: L("Gabung Sekarang!", "Join Now!"), href: "/mitra#hubungi" },
            },
          ],
        },
        {
          // Fakta diambil dari data situs, bukan mockup: mockup menulis "Berdiri
          // sejak 2017", linimasa halaman Tentang menulis deklarasi 2018; angka
          // pendidik & provinsi sama dengan Baris Statistik beranda/Tentang.
          blockType: "tentangRingkas",
          judul: L("Tentang Gernas Tastaka", "About Gernas Tastaka"),
          isi: L(
            "Gerakan Nasional Literasi dan Numerasi yang berfokus pada peningkatan kualitas pembelajaran di sekolah dasar dan madrasah ibtidaiyah di Indonesia.",
            "A national literacy and numeracy movement focused on improving the quality of learning in Indonesian primary schools and madrasahs.",
          ),
          cta: { label: L("Selengkapnya Tentang Kami", "More About Us"), href: "/tentang-gernas-tastaka" },
          fakta: [
            { ikon: "kalender", teks: L("Dideklarasikan tahun 2018", "Declared in 2018") },
            { ikon: "komunitas", teks: L("Bersama 16.000+ pendidik", "With 16,000+ educators") },
            { ikon: "lokasi", teks: L("Hadir di 21 provinsi", "Present in 21 provinces") },
            { ikon: "kolaborasi", teks: L("Didukung mitra dan relawan", "Supported by partners and volunteers") },
          ],
        },
      ],
    } as never,
  });

  const cek = await halamanSemuaLocale("pojok-guru");
  const intro = cek?.layout?.find((b: Json) => b.blockType === "introDuaKolom");
  const sorotan = cek?.layout?.find((b: Json) => b.blockType === "produkSorotan");
  const perangkat = cek?.layout?.find((b: Json) => b.blockType === "perangkatGuru");
  const acara = cek?.layout?.find((b: Json) => b.blockType === "jadwalAcara");
  const komunitas = cek?.layout?.find((b: Json) => b.blockType === "komunitas");
  const tentang = cek?.layout?.find((b: Json) => b.blockType === "tentangRingkas");
  if (
    cek?.title?.en !== "Teacher's Corner" ||
    cek?.layout?.[0]?.judul?.en !== "Find What You Need!" ||
    !intro?.judul?.en ||
    !intro?.isi?.en ||
    sorotan?.alasan?.poin?.[0]?.teks?.en !== "Developed by education practitioners" ||
    perangkat?.kartu?.length !== 4 ||
    perangkat?.kartu?.[3]?.deskripsi?.en !== "Digital numeracy activities students can play right away." ||
    perangkat?.panel?.cta?.label?.en !== "Contact Us" ||
    acara?.tampilan !== "geser" ||
    acara?.tautanLihatSemua?.label?.en !== "View All Programs" ||
    komunitas?.kartu?.[1]?.cta?.label?.en !== "Join Now!" ||
    tentang?.fakta?.length !== 4 ||
    tentang?.fakta?.[3]?.teks?.en !== "Supported by partners and volunteers"
  ) {
    throw new Error("/pojok-guru dibuat, tetapi terjemahan Inggrisnya tidak tersimpan. Periksa manual.");
  }
  console.log(`✓  /pojok-guru — ${cek.layout.length} blok (id + en)`);
}

// ── 2. Menu navbar ─────────────────────────────────────────────────────────

const nav: Json = await payload.findGlobal({ slug: "navigation", locale: SEMUA, depth: 0 });
const items: Json[] = nav.items ?? [];
const semuaTujuan = items.flatMap((it) => [
  it.preset,
  it.custom,
  ...(it.children ?? []).flatMap((c: Json) => [c.preset, c.custom]),
]);

if (semuaTujuan.includes("/pojok-guru")) {
  console.log("⏭  navigasi — menu Pojok Guru sudah ada");
} else {
  cadangkan("navigation", nav);

  const anak = (
    label: { id: string; en: string },
    preset: string,
    desc: { id: string; en: string },
  ) => ({ label, linkType: "custom", preset, desc, hidden: false });

  const menuPojokGuru = {
    label: L("Pojok Guru", "Teacher's Corner"),
    linkType: "custom",
    preset: "/pojok-guru",
    hidden: false,
    sorot: true,
    children: [
      anak(L("Beranda Pojok Guru", "Teacher's Corner Home"), "/pojok-guru", L("Semua perangkat belajar untuk guru", "All teaching resources in one place")),
      anak(L("Buku, Bahan Ajar & Modul", "Books, Teaching Materials & Modules"), "/buku-bahan-ajar-modul", L("Materi ajar siap unduh", "Downloadable teaching materials")),
      anak(L("Video Pembelajaran", "Learning Videos"), "/video-pembelajaran", L("Video aktivitas mengajar", "Classroom activity videos")),
      anak(L("Media Interaktif", "Interactive Media"), "/media-interaktif", L("Latihan numerasi digital", "Digital numeracy activities")),
      anak(L("Jadwal Acara", "Event Schedule"), "/belajar-bersama#jadwal-acara", L("Webinar, pelatihan & klub buku", "Webinars, training & book clubs")),
    ],
  };

  const posisiBeranda = items.findIndex((it) => it.preset === "/" || it.custom === "/");
  const itemsBaru = [...items];
  itemsBaru.splice(posisiBeranda + 1, 0, menuPojokGuru);

  const { id: _id, globalType: _g, updatedAt: _u, createdAt: _c, ...isiNav } = nav;
  await payload.updateGlobal({
    slug: "navigation",
    locale: SEMUA,
    depth: 0,
    data: { ...isiNav, items: itemsBaru } as never,
  });

  const navSesudah: Json = await payload.findGlobal({ slug: "navigation", locale: SEMUA, depth: 0 });
  const utuh =
    sama(
      (navSesudah.items ?? []).filter((it: Json) => it.preset !== "/pojok-guru"),
      items,
    ) && sama(navSesudah.ctaButton, nav.ctaButton);
  const baruTersimpan = (navSesudah.items ?? []).find((it: Json) => it.preset === "/pojok-guru");

  if (!utuh || baruTersimpan?.label?.en !== "Teacher's Corner" || baruTersimpan?.children?.length !== 6) {
    throw new Error(
      "navigasi: isi setelah ditulis tidak sesuai. Pulihkan dari cadangan di $BACKUP_DIR lalu periksa manual.",
    );
  }
  console.log("✓  navigasi — menu Pojok Guru disisipkan setelah Beranda (id + en)");
}

// ── 3. Ajakan di beranda (SQL) ─────────────────────────────────────────────

const beranda = await halamanSemuaLocale("beranda");
const ajakanPojokGuru = (b: Json) => b.blockType === "callout" && b.cta?.href === "/pojok-guru";

if (!beranda) {
  console.log("⚠  beranda tidak ada — ajakan Pojok Guru dilewati");
} else if (beranda.layout.some(ajakanPojokGuru)) {
  console.log("⏭  beranda — ajakan Pojok Guru sudah ada");
} else {
  const versi = await versiTerakhir(beranda.id);
  if (versi?.status === "draft") {
    console.log("⚠  beranda punya draf belum terbit — ajakan dilewati, tambahkan lewat dasbor");
  } else {
    cadangkan("beranda", beranda);

    const idBlok = crypto.randomBytes(12).toString("hex");
    const teks = {
      judul: L("Anda Seorang Guru? Mampir ke Pojok Guru", "Are You a Teacher? Visit the Teacher's Corner"),
      isi: L(
        "Temukan buku dan bahan ajar siap unduh, alat peraga, video pembelajaran, media interaktif, serta jadwal acara untuk mendukung pembelajaran matematika dan membaca di kelas Anda.",
        "Find downloadable books and teaching materials, teaching aids, learning videos, interactive media, and upcoming events to support mathematics and reading lessons in your classroom.",
      ),
      tombol: L("Buka Pojok Guru", "Visit Teacher's Corner"),
    };
    const [blokUtama, blokVersi] = await Promise.all([
      tabelBlok("pages_blocks_"),
      tabelBlok("_pages_v_blocks_"),
    ]);

    /** Geser urutan blok sesudah Kartu Berisi, lalu sisipkan kotak sorot di celahnya. */
    await db.transaction(async (tx: Json) => {
      const acuan = (
        await tx.execute(
          sql`select _order, _path from pages_blocks_feature_cards where _parent_id = ${beranda.id} order by _order limit 1`,
        )
      ).rows[0];
      const jalur = acuan?._path ?? "layout";
      const posisi = acuan ? acuan._order + 1 : beranda.layout.length;

      for (const t of blokUtama) {
        await tx.execute(
          sql`update ${sql.raw(`"${t}"`)} set _order = _order + 1 where _parent_id = ${beranda.id} and _path = ${jalur} and _order >= ${posisi}`,
        );
      }
      await tx.execute(sql`
        insert into pages_blocks_callout (_order, _parent_id, _path, id, warna, rata_tengah, cta_href)
        values (${posisi}, ${beranda.id}, ${jalur}, ${idBlok}, 'navy', true, '/pojok-guru')`);
      await tx.execute(sql`
        insert into pages_blocks_callout_locales (_locale, _parent_id, judul, isi, cta_label) values
          ('id', ${idBlok}, ${teks.judul.id}, ${teks.isi.id}, ${teks.tombol.id}),
          ('en', ${idBlok}, ${teks.judul.en}, ${teks.isi.en}, ${teks.tombol.en})`);

      if (!versi) return;
      const acuanV = (
        await tx.execute(
          sql`select _order, _path from _pages_v_blocks_feature_cards where _parent_id = ${versi.id} order by _order limit 1`,
        )
      ).rows[0];
      const jalurV = acuanV?._path ?? "version.layout";
      const posisiV = acuanV ? acuanV._order + 1 : posisi;

      for (const t of blokVersi) {
        await tx.execute(
          sql`update ${sql.raw(`"${t}"`)} set _order = _order + 1 where _parent_id = ${versi.id} and _path = ${jalurV} and _order >= ${posisiV}`,
        );
      }
      const [{ id: idVersiBlok }] = (
        await tx.execute(sql`
          insert into _pages_v_blocks_callout (_order, _parent_id, _path, warna, rata_tengah, cta_href, _uuid)
          values (${posisiV}, ${versi.id}, ${jalurV}, 'navy', true, '/pojok-guru', ${idBlok})
          returning id`)
      ).rows;
      await tx.execute(sql`
        insert into _pages_v_blocks_callout_locales (_locale, _parent_id, judul, isi, cta_label) values
          ('id', ${idVersiBlok}, ${teks.judul.id}, ${teks.isi.id}, ${teks.tombol.id}),
          ('en', ${idVersiBlok}, ${teks.judul.en}, ${teks.isi.en}, ${teks.tombol.en})`);
    });

    const sesudah = await halamanSemuaLocale("beranda");
    const sisipan = sesudah?.layout?.find(ajakanPojokGuru);
    const utuh =
      sesudah &&
      sama(sesudah.layout.filter((b: Json) => !ajakanPojokGuru(b)), beranda.layout) &&
      sama(sesudah.title, beranda.title) &&
      sama(sesudah.meta, beranda.meta);
    if (!utuh || sisipan?.judul?.en !== teks.judul.en) {
      throw new Error(
        "beranda: hasil sisipan tidak sesuai. Hapus blok callout ber-cta /pojok-guru lewat SQL & periksa cadangan di $BACKUP_DIR.",
      );
    }
    console.log("✓  beranda — ajakan Pojok Guru disisipkan setelah Kartu Berisi (id + en)");
  }
}

// ── 4. Penanda Jadwal Acara di Belajar Bersama (SQL) ───────────────────────

const blokJadwal = belajarBersama.layout.find((b: Json) => b.blockType === "jadwalAcara");

if (!blokJadwal) {
  console.log("⚠  belajar-bersama tidak punya blok Jadwal Acara — penanda dilewati");
} else if (blokJadwal.anchor === "jadwal-acara") {
  console.log("⏭  belajar-bersama — penanda jadwal-acara sudah ada");
} else {
  // Field `anchor` tidak localized — satu kolom di tabel blok, tidak menyentuh *_locales.
  await db.transaction(async (tx: Json) => {
    await tx.execute(
      sql`update pages_blocks_jadwal_acara set anchor = 'jadwal-acara' where id = ${blokJadwal.id}`,
    );
    await tx.execute(sql`
      update _pages_v_blocks_jadwal_acara v set anchor = 'jadwal-acara'
      from _pages_v p
      where v._parent_id = p.id and p.parent_id = ${belajarBersama.id} and p.latest = true
        and v._uuid = ${blokJadwal.id}`);
  });

  const sesudah = await halamanSemuaLocale("belajar-bersama");
  const blok = sesudah?.layout?.find((b: Json) => b.blockType === "jadwalAcara");
  const utuh = sama(
    sesudah?.layout?.map((b: Json) => (b.id === blokJadwal.id ? { ...b, anchor: undefined } : b)),
    belajarBersama.layout,
  );
  if (blok?.anchor !== "jadwal-acara" || !utuh) {
    throw new Error("belajar-bersama: penanda tidak tersimpan seperti yang diharapkan. Periksa manual.");
  }
  console.log("✓  belajar-bersama — penanda #jadwal-acara dipasang");
}

process.exit(0);
