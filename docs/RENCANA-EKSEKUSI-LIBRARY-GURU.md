# Rencana Eksekusi — Halaman Library Materi Guru

> **Acuan:** `docs/PRD-GERNASTASTAKA-FASE2-v1.2.md`
> **Prasyarat sudah selesai:** 4 collection Payload (`Produk`, `AlatPeraga`,
> `VideoPembelajaran`, `MediaInteraktif`) + extend `Leads` sudah dibuat &
> dimigrasikan (`migrations/20260824_075753_library_guru_collections.ts`).
> Field lengkap ada di `src/payload/collections/*.ts` masing-masing.

## Cara pakai dokumen ini

Tiap halaman dikerjakan di sesi Claude Code terpisah, biar konteks tiap sesi
kecil/hemat token. Protokolnya:

1. **Awal sesi:** baca dokumen ini dulu, khususnya §2 (Arsitektur Bersama)
   dan baris §3 (Status Tracker) yang statusnya `Belum` paling atas — itu
   yang dikerjakan.
2. **Kerjakan** sesuai task breakdown di §4 untuk halaman itu saja. Kalau
   §2 (komponen/util bersama) belum ada, bikin dulu di sesi yang sama
   (biasanya cuma perlu sekali, di halaman pertama).
3. **Akhir sesi, sebelum selesai:**
   - Update baris status di §3 jadi `Selesai` (atau `Sebagian` + catatan apa yang kurang).
   - Tambah entri baru di §5 (Riwayat Pengerjaan): tanggal, halaman, file yang
     dibuat/diubah, keputusan desain yang diambil di tempat (kalau ada
     ambiguitas yang diputuskan sendiri saat coding), dan PR/commit terkait.
   - Kalau ada keputusan yang mengubah asumsi §2 (mis. pola query berubah),
     **update §2 juga** supaya sesi halaman berikutnya konsisten — jangan
     biarkan drift diam-diam antar halaman.

---

## 1. Urutan Pengerjaan

Sesuai rekomendasi rilis PRD v1.2 §8 — dari yang paling tidak terblokir:

1. **Alat Peraga** (FR-106) — sekalian bangun komponen bersama (§2), showcase only, tanpa dependency eksternal.
2. **Media Digital Interaktif** (FR-108) — paling ringan, tautan eksternal doang.
3. **Video Pembelajaran** (FR-107) — perlu keputusan OI-106 (YouTube vs upload) diambil di tempat kalau belum ada arahan baru.
4. **Buku, Bahan Ajar & Modul** (FR-101–104, FR-109) — nilai terbesar tapi **terblokir OI-108** (OAuth Google Drive belum dibuat). Jalur gratis bisa dikerjakan pakai tautan Drive manual (lihat catatan di `Produk.ts`) sambil OAuth resmi menyusul. Jalur berbayar (FR-110/tombol "Beli Sekarang") **jangan dikerjakan** sampai OI-105 (mekanisme checkout) diputuskan — sembunyikan/nonaktifkan tombolnya, arahkan ke "Hubungi Kami" sbg fallback.
5. **Landing Page Pojok Guru** (§4.5) — dikerjakan **terakhir**, setelah 4 halaman Library punya route nyata untuk ditautkan (sudah terpenuhi). Awalnya ditulis 24 Agu 2026 sbg "Integrasi Beranda"; **15 Sep 2026 diputuskan jadi halaman tersendiri `/pojok-guru`**, bukan ditempel ke beranda utama (lihat §5). Dipecah jadi 6 sesi A–F.

## 2. Arsitektur Bersama

> Dibangun sekali di sesi halaman pertama (Alat Peraga), dipakai ulang oleh
> 3 halaman berikutnya. Kalau ternyata sudah ada saat sesi baru mulai,
> lewati bagian ini dan cek langsung file-nya.

### 2.1 Routing

Route publik baru, di luar sistem Halaman CMS (`Pages`/`[...slug]`) karena
ini listing dinamis dengan pencarian & pagination, bukan konten blok statis:

| Halaman | Route ID | Route EN |
|---|---|---|
| Alat Peraga | `src/app/(frontend)/alat-peraga/page.tsx` | `src/app/(frontend)/en/alat-peraga/page.tsx` |
| Media Digital Interaktif | `src/app/(frontend)/media-interaktif/page.tsx` | `src/app/(frontend)/en/media-interaktif/page.tsx` |
| Video Pembelajaran | `src/app/(frontend)/video-pembelajaran/page.tsx` | `src/app/(frontend)/en/video-pembelajaran/page.tsx` |
| Buku, Bahan Ajar & Modul | `src/app/(frontend)/buku-bahan-ajar-modul/page.tsx` | `src/app/(frontend)/en/buku-bahan-ajar-modul/page.tsx` |

Ikuti pola `src/app/(frontend)/en/berita/` (folder EN terpisah, bukan
`[locale]` dinamis) — konsisten dengan struktur i18n yang sudah ada.

### 2.2 Kontrak Query Parameter (sama di 4 halaman)

Server Component baca `searchParams`, teruskan ke query Payload local API:

| Param | Arti | Contoh |
|---|---|---|
| `q` | Kata kunci. Sejak 7 Sep 2026 dipecah per kata (AND antar kata, OR antar kolom) dan dicari di beberapa kolom teks per koleksi — Alat Peraga: `judul`/`subjudul`/`deskripsi`; Video: `judul`/`deskripsi`; Buku dll.: `judul`/`ringkasan`/`penulis`; Media Interaktif: `judul`/`deskripsi`/`tags.label`. Kata "sd"/"smp"/"numerasi" dst. juga dicocokkan ke `jenjang`/`mapel` | `?q=pecahan+campuran` |
| `jenjang` | Filter jenjang, bisa banyak dipisah koma | `?jenjang=sd,smp` |
| `mapel` | Filter mapel/program | `?mapel=matematika` |
| `kategori` | Cuma dipakai di Buku/Bahan Ajar/Modul (`kategoriProduk` = jenis materi). Masih didukung query-nya, tapi sejak 7 Sep 2026 **tidak lagi ditautkan dari kartu kategori** | `?kategori=modul` |
| `topik` | Cuma dipakai di Buku/Bahan Ajar/Modul (`topik`). Inilah yang dipakai 6 kartu "Jelajahi Berdasarkan Topik" | `?topik=pecahan` |
| `page` | Nomor halaman, 1-based | `?page=2` |

12 item per halaman (`limit: 12`), sesuai mockup "Menampilkan 1–12 dari 86
produk". Pakai `payload.find({ collection, where, limit, page })` — Payload
sudah punya `totalDocs`/`totalPages`/`hasNextPage` bawaan, tidak perlu hitung manual.

### 2.3 Komponen Bersama yang Perlu Dibuat

Ikuti pola yang **sudah ada** di `src/components/` — satu komponen card per
collection (seperti `NewsCard`, `VideoCard`, `TrainingModuleCard` yang sudah
ada), **bukan** satu super-card generik dengan banyak prop opsional.

| Komponen | Dipakai di | Catatan |
|---|---|---|
| `LibrarySearchBar` | Semua 4 halaman | Input + tombol cari, submit via query param `q`. Isi ulang value dari `searchParams.q` saat render. |
| `LibraryCategoryChips` | Alat Peraga ("Jelajahi Berdasarkan Kategori": Gernas Tastaka/Tastaba) & Buku (4 kartu: Modul/Buku/Bahan Ajar/LKS) | Props: daftar {label, deskripsi, ikon, href}. Konten kartu beda per halaman, styling sama. |
| `LibraryPagination` | Semua 4 halaman | Terima `page`, `totalPages`, generate href dengan query param lain tetap terjaga (jangan hilangkan `q`/`jenjang` saat pindah halaman). |
| `CtaBantuanBanner` | Semua 4 halaman | Banner "Belum menemukan yang anda cari? / Hubungi Kami!" di footer tiap halaman — komponen statis, tidak butuh data. |
| `ProdukCard` | Buku, Bahan Ajar & Modul | Tampilkan format, status Gratis/harga, tombol Detail + (kondisional) Beli Sekarang. |
| `AlatPeragaCard` | Alat Peraga | Tampilkan subjudul, jenjang/mapel tag, tombol Detail. |
| `VideoPembelajaranCard` | Video Pembelajaran | **Bukan** `VideoCard` yang sudah ada (itu punya `Video`, koleksi beda tujuan — lihat catatan di `VideoPembelajaran.ts`). |
| `MediaInteraktifCard` | Media Digital Interaktif | Tag chip + tombol "Buka Link" (external, `target="_blank"`, `rel="noopener"`). |

### 2.4 Hal yang Belum Diputuskan (cek ulang tiap sesi sebelum mulai)

- **OI-106** (hosting Video Pembelajaran): kalau belum ada arahan baru saat
  sesi Video Pembelajaran mulai, pakai `sumberTipe: "youtube"` dulu (opsi
  yang sudah didukung skema) dan catat asumsi itu di §5.
- **OI-105** (checkout): jangan bangun alur pembayaran. Tombol "Beli
  Sekarang" di `ProdukCard` untuk item berbayar diarahkan ke halaman/link
  "Hubungi Kami" sampai ada keputusan.
- **OI-108** (OAuth Drive): pakai `tautanDrive` sbg link biasa (folder/berkas
  "siapa saja yang punya tautan"), bukan integrasi OAuth penuh.

---

## 3. Status Tracker

| # | Halaman | Status | Sesi terakhir |
|---|---|---|---|
| 0 | Komponen bersama (§2) | Selesai | 24 Agu 2026 |
| 1 | Alat Peraga | **Dihapus**: digabung ke Buku, Bahan Ajar & Modul sbg Jenis materi "Alat Peraga" (§5 entri 22 Sep 2026) | 22 Sep 2026 |
| 2 | Media Digital Interaktif | Selesai | 24 Agu 2026 |
| 3 | Video Pembelajaran | Selesai | 26 Agu 2026 |
| 4 | Buku, Bahan Ajar & Modul | Selesai (tampilan + data asli + gerbang unduhan FR-104) | 7 Sep 2026 |
| 5A | Pojok Guru — halaman CMS, navbar, breadcrumb, teaser beranda (§4.5) | Selesai (belum dicek di browser) | 15 Sep 2026 |
| 5B | Pojok Guru — blok `pencarianCepat` + halaman `/pojok-guru/cari` | Selesai (belum dicek di browser; bug pencarian `/en` sudah diperbaiki) | 15 Sep 2026 |
| 5C | Pojok Guru — intro 2 kolom + blok `produkSorotan` | Selesai (belum dicek di browser) | 16 Sep 2026 |
| 5D | Pojok Guru — blok `perangkatGuru` (4 kartu + panel statistik/CTA) | Selesai (belum cek browser) | 16 Sep 2026 |
| 5E | Pojok Guru — Acara Terdekat (perluas blok `jadwalAcara`) | Selesai (belum cek browser) | 16 Sep 2026 |
| 5F | Pojok Guru — Komunitas + Tentang ringkas | Selesai (belum cek browser) | 16 Sep 2026 |

## 4. Task per Halaman

### 4.1 Alat Peraga (`FR-106`) — Dihapus 22 Sep 2026

> **22 Sep 2026:** halaman `/alat-peraga` & koleksi `alat-peraga` dihapus. Alat peraga kini jadi Jenis materi "Alat Peraga" di koleksi Produk dan tampil di `/buku-bahan-ajar-modul`. Checklist di bawah tinggal riwayat. Lihat §5 entri 22 Sep 2026.

- [x] Route `alat-peraga/page.tsx` (+ versi `en/`)
- [x] Bangun komponen bersama §2.3 (sekali, dipakai ulang)
- [x] Hero: judul, deskripsi, `LibrarySearchBar` — **tanpa gambar promo**, lihat catatan §5 (belum ada aset gambar, disusulkan)
- [x] `LibraryCategoryChips`: 2 kartu (Gernas Tastaka / Gernas Tastaba) — dikonfirmasi field asli `mapel`, href `?mapel=matematika` / `?mapel=membaca`
- [x] Grid `AlatPeragaCard` dari `payload.find({ collection: "alat-peraga", where, limit: 12, page })`
- [x] `LibraryPagination` + teks "Menampilkan X–Y dari Z produk"
- [x] `CtaBantuanBanner`
- [x] `generateMetadata` — statis (title/description manual), koleksi ini tidak ikut `seoPlugin` (cuma `pages`/`articles`), lihat `src/payload.config.ts`
- [x] Halaman detail: **route terpisah** `alat-peraga/[slug]/page.tsx` (+ `en/`) — diputuskan di tempat krn tidak ada akses ke mockup asli di sesi ini; route nyata lebih aman utk SEO/share drpd modal. Boleh dikoreksi ke modal nanti kalau mockup ternyata beda.
- [x] **Revisi tata letak ke mockup Figma** (26 Agu 2026) — hero 2 kolom (teks + gambar promo, rata kiri) dgn search `variant="kotak"`, 2 kartu kategori varian `lebar` berikon & bertombol panah, judul "Semua Alat Peraga" + teks "Menampilkan…" di atas grid, grid 3 kolom, kartu disusun ulang (judul → subjudul → tag → tombol Detail rata kanan). Menuntaskan temuan QA #1–#3 halaman ini, lihat §5
- [ ] Isi halaman detail (`alat-peraga/[slug]`) — **masih temuan QA #4 yang terbuka**, perlu didiskusikan informasi apa saja yang ditampilkan. Belum disentuh di sesi revisi Figma.

### 4.2 Media Digital Interaktif (`FR-108`) — Selesai

- [x] Route `media-interaktif/page.tsx` (+ `en/`)
- [x] Hero + 4 ikon fitur (Interaktif/Mudah Digunakan/Sesuai Kurikulum/Aman & Terpercaya) — statis, emoji sbg ikon (proyek tidak pakai icon library), lihat §5
- [x] `LibrarySearchBar` + "Pencarian Populer" — **3 tag terbanyak dihitung dari data** (`getPopularMediaInteraktifTags`), bukan hardcode; klik tag pakai param baru `?tag=` (di luar kontrak §2.2 krn koleksi ini tidak punya jenjang/mapel), lihat §5
- [x] List `MediaInteraktifCard` (bukan grid — list horizontal per baris)
- [x] **Revisi tata letak ke mockup Figma** (26 Agu 2026) — hero 2 kolom + ilustrasi, 4 keunggulan berikon SVG + keterangan, panel putih "Cari Kebutuhan Anda!" yang memuat pencarian sekaligus daftar media, baris daftar dgn panel "Buka Link" beralamat. Menuntaskan temuan QA #1 halaman ini, lihat §5
- [x] `CtaBantuanBanner`
- [ ] Section "Bergabung dengan Komunitas" — **sengaja tidak dikerjakan**, belum ditemukan di kode manapun (lihat §4.5), di luar cakupan PRD Fase 2 v1.2. Perlu konfirmasi user dulu sebelum digarap.

### 4.3 Video Pembelajaran (`FR-107`) — Selesai

- [x] Route `video-pembelajaran/page.tsx` (+ `en/`)
- [x] Ambil keputusan OI-106 kalau belum ada arahan baru (lihat §2.4) — dipakai `sumberTipe: "youtube"` sbg default skema (sudah ada), tidak ada arahan baru sesi ini
- [x] Grid `VideoPembelajaranCard`, filter jenjang/mapel + search (pakai `buildLibraryWhere` kontrak §2.2 penuh, sama spt Alat Peraga)
- [x] `LibraryPagination`, `CtaBantuanBanner`
- [x] **Revisi tata letak ke mockup Figma** (26 Agu 2026) — hero 2 kolom (teks +
  gambar promo) dgn search `variant="kotak"`, korsel "Video Pilihan" di antara
  hero & daftar, judul "Semua Video" + teks "Menampilkan…" di atas grid, grid 3
  kolom, kartu disusun ulang (thumbnail membulat → tag → judul, tanpa tombol).
  Menuntaskan temuan QA #1 halaman ini, lihat §5
- [x] **Halaman detail per video dgn pemutar tersemat** (26 Agu 2026,
  menuntaskan temuan QA #2) — field `slug` + `deskripsi` ditambah ke skema
  (migrasi `20260826_161929_video_pembelajaran_slug`), route
  `video-pembelajaran/[slug]` (+ `en/`), komponen `VideoPembelajaranPlayer`
  (iframe YouTube / `<video>` utk berkas unggahan). Tombol "Tonton" keluar ke
  YouTube sudah dihapus — `videoPembelajaranTontonHref()` diganti
  `videoPembelajaranSumberHref()` yang kini cuma dipakai sbg tautan sekunder di
  halaman detail

### 4.4 Buku, Bahan Ajar & Modul (`FR-101–104`, `FR-109`; **FR-110 blocked**)

- [x] Route `buku-bahan-ajar-modul/page.tsx` (+ `en/`) — plus detail `[slug]` (+ `en/`) supaya tombol "Detail" punya tujuan nyata
- [x] Section "Produk Terbaru" (featured) — **tanpa field `unggulan` baru**: dipakai produk dengan `urutan` terkecil, jadi tidak perlu ubah skema + migrasi (lihat §5)
- [x] `LibraryCategoryChips` 4 kartu: Modul/Buku/Bahan Ajar/LKS → href `?kategori=...`
- [x] Grid `ProdukCard` — tampilkan `format` (gabungan label), `status`/`harga` ("Gratis" atau "Rp20.000")
- [x] Tombol "Beli Sekarang" → **checkout tidak dibangun**, diarahkan ke `/mitra` sbg fallback "Hubungi Kami" (lihat §2.4)
- [ ] Alur unduh gratis (FR-104): klik unduh → form gated (nama + `asalInstansi`) → submit ke `leads` (`jenis: "unduhan-materi"`, `produkRef`) → baru tampilkan `tautanDrive`. **Belum dikerjakan** — sesi ini fokus tampilan/layout atas permintaan user, integrasi Drive (OI-108) ditunda. Halaman detail sementara menampilkan `tautanDrive` apa adanya tanpa form pendataan.
- [x] `LibraryPagination` (mockup nunjukin sampai 68 halaman, pastikan pagination-nya handle angka besar dgn elipsis "...")
- [x] `CtaBantuanBanner`

### 4.5 Landing Page Pojok Guru

> **Riwayat:** 24 Agu 2026 ditulis sbg "Integrasi Beranda" (elemen mockup
> ditempel ke beranda utama). **15 Sep 2026 diubah** — mockup itu seluruhnya
> ditujukan ke guru, sedangkan beranda utama bicara ke mitra/donatur/publik.
> Keputusan user: jadi landing page segmen guru tersendiri. Rincian diskusi
> di §5 entri 15 Sep 2026.

#### 4.5.0 Keputusan yang sudah dikunci (15 Sep 2026)

| Topik | Keputusan |
|---|---|
| Nama & URL | **"Pojok Guru"**, `/pojok-guru` (+ `/en/pojok-guru`, label EN "Teacher's Corner") |
| Jenis halaman | **Halaman CMS** (koleksi `pages`, slug `pojok-guru`) lewat `[...slug]` — staf atur urutan/isi section dari dasbor. Section = blok. |
| URL katalog | **Tetap datar** (`/alat-peraga`, `/buku-bahan-ajar-modul`, `/video-pembelajaran`, `/media-interaktif`) — tidak dipindah ke `/pojok-guru/...`. Hierarki cukup lewat breadcrumb + menu. |
| Navbar | Menu utama baru **"Pojok Guru"** berisi dropdown (lihat 5A). |
| Pencarian hero | **Opsi A: halaman pencarian lintas koleksi** `/pojok-guru/cari?q=` (4 koleksi Library). Route kode eksplisit `pojok-guru/cari/page.tsx` — menang atas `[...slug]`. |
| "Mengapa Guru Memilih Perangkat Gernas?" | **Umum** — daftar poin diisi di blok, bukan per produk. |
| Tombol "Gabung Sekarang" komunitas | Field tautan opsional; tombol disembunyikan bila kosong. **16 Sep 2026:** diisi sama dengan "Hubungi Kami" (`/mitra#hubungi`) dulu. |
| Acara | Sumber tunggal koleksi `acara`. `/belajar-bersama` tetap tampil semua; `/pojok-guru` utamakan acara mendatang, **tetap tampil dengan acara terbaru bila tidak ada yang mendatang** (koreksi 16 Sep 2026). Tidak ada data ganda. |
| Angka statistik | **16 Sep 2026:** angka mockup cuma contoh. Tampilkan jumlah materi nyata, dihitung otomatis (5D). Jumlah anggota komunitas tidak ditampilkan dulu (5F). |

Pemetaan section mockup → blok:

| Section mockup | Blok | Sesi |
|---|---|---|
| Hero "Cari Kebutuhan Anda!" + Pencarian Populer | **baru** `pencarianCepat` | 5B |
| "Tumbuh Bersama Dengan Kompilasi Bahan Ajar" (judul+ringkas kiri, paragraf kanan, garis pemisah) | cek `richText`/`visiMisi` dulu; kalau tak bisa, **baru** `introDuaKolom` | 5C |
| Produk Terbaru + "Mengapa Guru Memilih…" | **baru** `produkSorotan` | 5C |
| Perangkat Pembelajaran untuk Guru (4 kartu 2×2) + panel navy statistik & "Belum menemukan…" | **baru** `perangkatGuru` — `featureCards`/`statCounter`/`ctaBanner` terpisah tidak bisa membentuk tata letak gabung ini; pakai ulang `statsArrayField()` & `ctaField()` | 5D |
| Acara Terdekat (kartu geser horizontal) | **perluas** `jadwalAcara` | 5E |
| Bergabung dengan Komunitas (2 kartu) | **baru** `komunitas` | 5F |
| Tentang Gernas Tastaka (panel merah) + 4 ikon fakta | cek blok yang ada dulu; kalau tak cocok, **baru** `tentangRingkas` | 5F |

Aturan umum semua blok baru (ikuti pola yang sudah ada): definisi di
`src/payload/blocks/*.ts` + daftar di `index.ts`, ikon preview
`public/blok/<slug>.svg`, cabang render di `RenderBlocks.tsx`, teks
`localized: true`, migrasi dijalankan ke DB yang sedang dipakai (ingat
gotcha: dev server error sampai migrasi jalan). Isi konten ke halaman lewat
SQL/`locale: "all"`, **jangan `payload.update()` biasa** (menghapus terjemahan
EN). Sinkronkan `scripts/seed-pages.mts`.

#### 5A — Kerangka: halaman, navbar, breadcrumb, teaser

- [x] Dokumen `pages` slug `pojok-guru` (ID "Pojok Guru" / EN "Teacher's Corner"): `pageHero` (gambar dipinjam dari hero Belajar Bersama) + `featureCards` 4 kartu ke katalog + `callout` ke Jadwal Acara — isi sementara, diganti blok 5B–5F. Dibuat lewat `scripts/seed-pojok-guru.mts` (bukan `seed-pages.mts`, yang cuma ID)
- [x] `RUTE_TETAP` di `src/payload/globals/Navigation.ts`: `/pojok-guru`, 4 route katalog, `/belajar-bersama#jadwal-acara`. `/pojok-guru/cari` **ditunda ke 5B** (route belum ada; menambah opsi = migrasi enum lagi)
- [x] Menu "Pojok Guru" disisipkan setelah "Beranda" (6 anak ber-`desc` ID+EN). Field baru `sorot` ("Tampilkan menonjol") di item menu → latar kuning muda. Navbar juga kini menandai menu aktif + `aria-current="page"` (menu pertama yang cocok saja)
- [x] `anchorField` di blok `jadwalAcara` + `anchor: jadwal-acara` di `belajar-bersama` (tabel utama & versi terakhir, via SQL)
- [x] Komponen `src/components/library/Breadcrumb.tsx` (+ `labelKatalogGuru`), dipasang di 4 halaman katalog & 3 halaman detail. Di detail menggantikan tautan "← Kembali ke …"
- [x] `src/lib/routes.ts`: `POJOK_GURU_SLUG`, `pojokGuruPath(locale)`. `pojokGuruCariPath` ditunda ke 5B
- [x] Teaser beranda: `callout` navy "Anda Seorang Guru? Mampir ke Pojok Guru" setelah Kartu Berisi, via SQL (tabel utama + versi terakhir)
- [x] `sitemap.ts`: `/pojok-guru` otomatis masuk (dokumen Halaman), prioritas 0.8. `/pojok-guru/cari` ditunda ke 5B
- [ ] **Belum dicek di browser** (sesuai preferensi). Yang paling perlu dilihat: navbar desktop di lebar `lg` (1024px) sekarang 7 menu + Donasi + ID|EN — berisiko sesak/terlipat

#### 5B — Pencarian: blok `pencarianCepat` + `/pojok-guru/cari`

- [x] Blok `pencarianCepat` ("Hero Pencarian (Pojok Guru)") di `src/payload/blocks/hero.ts`: `judul`, `subjudul`, `gambarLatar`, `placeholder`, `tagPopuler[]` (manual). Komponen `src/components/library/PencarianCepat.tsx`, ikon `public/blok/pencarianCepat.svg`. Judulnya `<h1>` bila blok ini paling atas (`RenderBlocks` kini meneruskan `pertama`). Migrasi `20260915_125414_pojok_guru_pencarian` (8 tabel baru, aditif, sudah jalan)
- [x] `LibrarySearchBar` diperluas: `action`, `inputId`, `tombol` (`navy`/`kuning`), `className`, plus `role="search"`. 4 katalog lama tidak berubah perilakunya
- [x] Route `pojok-guru/cari/page.tsx` + `en/pojok-guru/cari/page.tsx` → `src/components/pages/PencarianGuruContent.tsx`. Metadata `noindex, follow` (tidak masuk sitemap)
- [x] `src/lib/pencarianGuru.ts`: **memanggil fungsi daftar milik tiap katalog** (`getProdukList` dst., halaman 1), bukan query baru — kolom, alias kata kunci, dan jumlah hasilnya persis sama dgn katalog, jadi "Lihat semua N hasil" → `katalog?q=` konsisten. Tag populer halaman hasil dibaca dari blok `pencarianCepat` di halaman Pojok Guru (satu sumber)
- [x] Tampilan: judul "Hasil pencarian “q”" + ringkasan jumlah, tag populer, lompat-ke-katalog (bila >1 katalog berisi), grup per katalog maks. 1 baris kartu (Buku & Media 4, Alat Peraga & Video 3), katalog nihil disebut dalam satu kalimat, keadaan nihil + tautan 4 katalog, keadaan tanpa kata kunci + tautan 4 katalog
- [x] Halaman `pojok-guru`: hero biasa 5A diganti Hero Pencarian lewat `seed:pojok-guru` (dokumen 5A dihapus & dibuat ulang karena masih 1 versi; cadangan di scratchpad). Tag: Pecahan, Bangun Datar, Perkalian, Nilai Tempat — diuji ada hasilnya (12/4/4/2 materi)
- [x] Tidak ada filter khusus `[QA] ` — urusan housekeeping §6. Catatan: 18 dokumen Alat Peraga **semuanya** dummy `[QA] `, jadi hasil Alat Peraga di pencarian saat ini data palsu
- [x] `/pojok-guru/cari` sengaja **tidak** ditambah ke Rute Cepat navigasi — tidak ada menu yang perlu menuju ke sana, dan menambah opsi berarti migrasi enum
- [x] **Bug pencarian di `/en` (berlaku juga di 4 katalog, bukan cuma halaman ini):** `judul`/`deskripsi` koleksi Library `localized`, dan `where` Payload hanya membaca kolom locale yang diminta — kolom EN kosong, jadi di `/en` kata apa pun nihil kecuali alias jenjang/mapel ("numerasi sd" tetap 90). Tag populer di `/en/pojok-guru` karenanya membuka hasil kosong. **Diperbaiki 15 Sep 2026:** `klausaKataKunci`/`buildLibraryWhere` (`src/lib/library.ts`) menerima `locale` + `localized`; di locale selain `id`, tiap field localized juga dicocokkan lewat path `judul.id` (didukung adapter Postgres). Filter tag Media Interaktif ikut (`tags.label.id`). Diuji ke DB asli: jumlah hasil ID = EN untuk Pecahan/Bangun Datar/Perkalian/Nilai Tempat/"numerasi sd"/"pecahan campuran" di 4 koleksi, tag "Numerasi" 20 = 20
- [ ] Belum dicek di browser

#### 5C — Intro 2 kolom + `produkSorotan`

- [x] Intro: `richText` (1 kolom, judul selalu di atas) & `visiMisi` (visi/misi tetap) tidak bisa membentuk judul+ringkas kiri | garis | paragraf kanan → blok baru `introDuaKolom` ("Pembuka 2 Kolom", `konten.ts`): `judul`, `ringkas` textarea, `isi` richText. Komponen `src/components/IntroDuaKolom.tsx` (paragraf kanan lewat `children` = `ArticleBody`); di bawah `lg` menumpuk, garis jadi mendatar
- [x] Blok `produkSorotan` ("Produk Sorotan", `koleksi.ts`): `heading` (kosong = "Produk Terbaru"), `produk` (relationship opsional — kosong/terhapus = `getProdukTerbaru()`, lewat `getProdukById()` baru di `produk.ts`), `subjudul` (kalimat sorotan, melekat di blok), `alasan.judul` + `alasan.poin[]` maks 6 (panel disembunyikan bila poin kosong)
- [x] Kartu produk `src/components/library/ProdukSorotan.tsx`: `cover`, `judul`, `subjudul`, `ringkasan`, format; tombol "Detail Produk" → detail, "Beli Sekarang!" hanya bila `status: berbayar` → `/mitra`, selain itu "Unduh Gratis" → detail (sama dgn `ProdukTerbaru`). `fiturUnggulan` tidak ditampilkan — mockup memakai panel alasan umum. Daftar centang format dipisah jadi `DaftarFormat.tsx`, dipakai juga oleh `ProdukTerbaru` (+ keterangan sr-only "tidak tersedia")
- [x] Migrasi `20260915_170426_pojok_guru_intro_produk` (12 tabel baru, aditif, sudah jalan). Ikon `public/blok/introDuaKolom.svg` & `produkSorotan.svg`
- [x] Isi lewat `seed:pojok-guru`: halaman dibuat ulang (masih 1 versi; cadangan di scratchpad) — teks intro & 5 poin alasan dari mockup + terjemahan EN. `subjudul` tidak diisi: kalimat mockup milik produk contoh "LKS Fonik" yang tidak ada di data; yang tampil otomatis "Bangun Datar Di Mana-Mana"
- [ ] **Perlu dikonfirmasi tim konten:** poin "Tersedia versi cetak & digital" & "Harga terjangkau" belum sesuai data — per 16 Sep 2026 ke-79 produk gratis & PDF saja
- [ ] Belum dicek di browser

#### 5D — `perangkatGuru`

Keputusan user 16 Sep 2026: angka mockup (45.000+ Peserta Didik / 200+ Materi
/ 1000+ Unduhan) memang contoh — **jangan dikarang**, tampilkan jumlah materi
yang ada. Gambar kartu pakai yang sudah ada dulu, tapi bisa diganti dari
dasbor. "Hubungi Kami" ke formulir kontak yang sudah ada.

- [x] Blok `perangkatGuru` ("Perangkat Guru (4 katalog + panel angka)", `koleksi.ts` — datanya dari koleksi): `judul`, `subjudul`, `kartu[]` maks 4 (`katalog` select 4 katalog → tujuan tautan otomatis, `judul` opsional = nama katalog dari `labelKatalogGuru`, `deskripsi`, `warna` aksen dari `warnaOptions`, `gambar` upload opsional), `panel` (`statistik[]` maks 4, `judul`, `isi`, `gambar` opsional, `ctaField`)
- [x] Angka panel **dihitung saat render**: `statistik.sumber` = jumlah 1 katalog / `semua` / `manual` (field `angka` hanya muncul utk manual). `payload.count` di `src/lib/perangkatGuru.ts` (`getJumlahKatalogGuru`). Tidak pakai `statsArrayField()` karena angkanya wajib diketik. Ikon baris dipilih otomatis dari sumber
- [x] Gambar kartu kosong → sampul/thumbnail materi pertama katalognya (Urutan terkecil, `getGambarKatalogGuru`); ilustrasi panel kosong → `/ilustrasi/cs-bantuan.png` (sama dgn `CtaBantuanBanner`). Gambar dekoratif `alt=""` — judul kartu = teks tautan
- [x] Komponen `src/components/library/PerangkatGuru.tsx`: grid kartu `sm:2 kolom` + panel navy kolom kanan di `lg` (`2fr_1fr`), tumpuk di bawahnya. Seluruh kartu = satu `<Link>`; angka dalam `<dl>`. Panel disembunyikan bila tanpa angka & tanpa ajakan. Ikon blok `public/blok/perangkatGuru.svg`
- [x] Migrasi `20260915_172457_pojok_guru_perangkat` (12 tabel + 6 enum baru, aditif, sudah jalan)
- [x] Isi lewat `seed:pojok-guru` (halaman masih 1 versi → dibuat ulang; cadangan di scratchpad): blok ini **menggantikan** `featureCards` sementara 5A. Kartu: Buku (navy), Alat Peraga (merah), Video (kuning), Media Interaktif (abu); deskripsi Buku & Alat Peraga dari mockup, Video & Media ditulis ulang (di mockup cuma salinan). Angka: Buku 79, Video 6, Media Interaktif 20 per 16 Sep 2026. **Alat Peraga sengaja tidak dimasukkan ke angka** (18 dokumennya dummy `[QA]`) — tambahkan barisnya dari dasbor setelah housekeeping §6. Opsi `semua` juga masih ikut menghitung dummy. Tombol "Hubungi Kami!" → `/mitra#hubungi`
- [x] Diuji tanpa browser: `getPageBySlug` id & en (judul/CTA EN tersimpan), `getJumlahKatalogGuru` & `getGambarKatalogGuru` 4 katalog ke DB asli. `npx tsc --noEmit` bersih
- [ ] Belum dicek di browser
- Catatan: "1000+ Unduhan" tidak dibuat — Leads `unduhan-materi` per 16 Sep baru 1 baris. Bisa jadi opsi `sumber` baru nanti (migrasi enum)

#### 5E — Acara Terdekat

Keputusan user 16 Sep 2026: **walau tidak ada acara mendatang, section tetap
tampil dengan acara terbaru** (yang sudah lewat) — bukan disembunyikan, bukan
teks kosong.

- [x] `jadwalAcara` diperluas: `deskripsi` (localized; di Grid jadi subjudul `Section`), `tampilan` (`grid` bawaan | `geser`), `tautanLihatSemua` (`ctaField`, hanya dipakai Geser). Deskripsi `batasAwal` & `sembunyikanSelesai` di dasbor diperjelas (centang + tak ada acara mendatang = bagian hilang)
- [x] **Tidak perlu opsi urutan baru:** urutan bawaan `JadwalAcara.tsx` sudah "mendatang (terdekat dulu), lalu selesai (terbaru dulu)". Geser = `urut.slice(0, batasAwal)` tanpa tombol "Lihat Semua" → acara mendatang otomatis di depan, sisa tempat diisi acara terbaru. Status dihitung ulang di browser seperti sebelumnya
- [x] Tampilan Geser (`DeretAcara` di `JadwalAcara.tsx`): kotak putih berbayang, kepala dari `RenderBlocks` (judul + deskripsi kiri, "Lihat Semua Program →" merah kanan), baris `<ul>` scroll-snap horizontal, kartu 260/280px **tanpa poster** (kotak warna kategori, sesuai mockup), panah ‹ › kanan bawah selebar satu kartu, nonaktif di ujung, disembunyikan bila tidak ada yang perlu digeser. `prefers-reduced-motion` → geser tanpa animasi. `<ul>` bisa difokus (`tabIndex=0`) supaya bisa digeser dengan keyboard. Penanda "Selesai"/"Akan Datang" & aturan tombol Daftar tetap sama
- [x] Migrasi `20260915_173330_pojok_guru_acara` (ADD COLUMN + 2 enum, aditif, sudah jalan). `belajar-bersama` otomatis `tampilan: grid` — ID/EN diuji utuh
- [x] `seed:pojok-guru` (halaman 1 versi → dibuat ulang; cadangan `backup-5e` di scratchpad): `callout` sementara 5A diganti `jadwalAcara` Geser — "Acara Terdekat"/"Upcoming Events", deskripsi mockup, 8 kartu, `sembunyikanSelesai: false`, tautan → `/belajar-bersama#jadwal-acara`. Per 16 Sep 2026 isinya 8 dari 11 acara, semuanya "Selesai"
- [x] `npx tsc --noEmit` bersih; `getPageBySlug` pojok-guru & belajar-bersama id/en dicek
- [ ] Belum dicek di browser
- [ ] **Perlu dipertimbangkan tim konten:** judul "Acara Terdekat" berisi kartu berlabel "Selesai" selama belum ada acara baru. Judul bisa diubah dari dasbor (mis. "Acara Gernas") tanpa kode

#### 5F — Komunitas + Tentang ringkas

Keputusan user 16 Sep 2026: jumlah anggota **belum perlu**; tombol "Gabung
Sekarang" **samakan dengan "Hubungi Kami"** dulu (`/mitra#hubungi`).

- [x] Blok `komunitas` ("Kartu Komunitas", `konten.ts`): `judul`, `subjudul`, `kartu[]` 1–2 (`nama`, `deskripsi`, `warna` navy|merah, `ikon`, `ilustrasi` upload opsional, `cta` via `ctaField` — tombol hilang bila kosong). **Tanpa field jumlah anggota.** Komponen `src/components/Komunitas.tsx`: ikon bulat berwarna, tombol isi-penuh sewarna, ilustrasi pojok kanan bawah (disembunyikan < `sm`, `alt=""`)
- [x] Tentang ringkas: `callout` tidak punya deret fakta, `statCounter` hanya angka → blok baru `tentangRingkas` ("Tentang Ringkas + Fakta", `konten.ts`): `judul`, `isi`, `cta`, `fakta[]` maks 4 (`ikon` + `teks`). Komponen `src/components/TentangRingkas.tsx`: kotak merah kiri + fakta 2 kolom (ponsel) / 4 kolom
- [x] Ikon baru di `ikon.tsx`: `kalender`, `lokasi`, `sekolah`, `kolaborasi`. Pilihannya lewat `ikonLengkapOptions` (shared.ts) yang hanya dipakai 2 blok baru — enum & pilihan Kartu Kegiatan tidak berubah
- [x] Migrasi `20260915_173930_pojok_guru_komunitas` (16 tabel + 6 enum, aditif, sudah jalan). Ikon blok `komunitas.svg`, `tentangRingkas.svg`
- [x] `seed:pojok-guru` (1 versi → dibuat ulang; cadangan `backup-5f` di scratchpad): Komunitas Tastaka (navy, ikon komunitas) & Tastaba (merah, ikon buku), tombol "Gabung Sekarang!" → `/mitra#hubungi`, ilustrasi kosong. Deskripsi Tastaba disesuaikan jadi "literasi membaca" (mockup: "literasi dan numerasi", padahal Tastaba = membaca). Tentang: isi dari mockup, tombol → `/tentang-gernas-tastaka`
- [x] **Fakta tidak diambil dari mockup:** "Berdiri sejak 2017" bertentangan dgn linimasa halaman Tentang (deklarasi **2018**); "ribuan sekolah" tidak ada datanya. Dipakai data situs: "Dideklarasikan tahun 2018", "Bersama 16.000+ pendidik", "Hadir di 21 provinsi" (Baris Statistik beranda/Tentang), "Didukung mitra dan relawan"
- [x] `npx tsc --noEmit` bersih; `getPageBySlug` id/en → 7 blok, teks & tautan kedua bahasa tersimpan
- [ ] Belum dicek di browser

#### Masih terbuka (tanyakan saat sesi terkait, jangan dikarang)

- Aset gambar: latar hero, ilustrasi kartu perangkat, ilustrasi komunitas (5B–5F) — sementara pakai yang ada/kosong, bisa diganti dari dasbor
- Tahun berdiri: mockup 2017 vs linimasa 2018 — konfirmasi tim konten; Pojok Guru memakai 2018
- Posisi menu "Pojok Guru" di navbar & apakah diberi gaya menonjol (5A)

---

## 5. Riwayat Pengerjaan

> Tambah entri baru di paling bawah tiap sesi selesai. Jangan hapus entri lama.

- **24 Agu 2026** — Rencana awal ditulis (§1–4 versi 4 halaman). User lalu
  menunjukkan mockup beranda terpisah dan menandai bahwa halaman itu tidak
  tercakup — ditambahkan §4.5 "Integrasi Beranda" + baris #5 status tracker.
  Tidak ada kode yang ditulis di sesi ini, cuma dokumen. Temuan: 3 dari 5
  elemen beranda ternyata reuse block yang sudah ada (`featureCards`,
  `statCounter`, `ctaBanner`) — cuma search bar & "Acara Terdekat" yang
  butuh kerja baru (dan "Acara Terdekat" sengaja tidak digarap, di luar scope).

- **24 Agu 2026** — Komponen bersama (§2/§0) + halaman Alat Peraga (§1)
  selesai. File baru:
  - `src/lib/library.ts` — kontrak query bersama (`parseListParam`,
    `parsePageParam`, `parseQueryParam`, `buildLibraryWhere`, `withParam`,
    `LIBRARY_PAGE_SIZE=12`, `JENJANG_LABELS`, `MAPEL_LABELS`).
  - `src/components/library/{LibrarySearchBar,LibraryCategoryChips,
    LibraryPagination,CtaBantuanBanner,AlatPeragaCard}.tsx`.
  - `src/lib/alatPeraga.ts` (query Local API, pola sama `content.ts`),
    `src/lib/routes.ts` ditambah `alatPeragaListPath`/`alatPeragaPath`.
  - `src/components/pages/{AlatPeragaListContent,AlatPeragaDetailContent}.tsx`
    + 4 route: `alat-peraga/page.tsx`, `alat-peraga/[slug]/page.tsx`,
    `en/alat-peraga/page.tsx`, `en/alat-peraga/[slug]/page.tsx`.

  Keputusan yang diambil di tempat (tidak ada arahan baru saat sesi ini):
  1. **Halaman detail = route asli** `alat-peraga/[slug]`, bukan modal/expand
     — tidak ada akses ke mockup asli di sesi ini, route lebih aman utk
     SEO & share link. Kalau mockup ternyata minta modal, tinggal ganti
     tombol "Detail" di `AlatPeragaCard`/hapus 2 route ini.
  2. **`LibrarySearchBar` pakai form GET biasa** (tanpa JS/`use client`) —
     cukup utk submit `?q=`, konsisten dgn Server Component pattern di
     `content.ts`. Kalau nanti butuh live-search/debounce, baru upgrade ke
     client component.
  3. **`CtaBantuanBanner` mengarah ke `/mitra`** — itu satu-satunya halaman
     yang sudah punya blok `contactForm` saat dicek (`scripts/seed-pages.mts`).
     Belum ada anchor id khusus di `ContactForm.tsx`, jadi link cuma ke
     halaman, bukan `#section`.
  4. **Hero tanpa gambar promo buku** — PRD/mockup minta "gambar promo buku
     statis" tapi tidak ada aset gambar yang bisa dipakai di sesi ini (belum
     diupload ke Media). Hero jadi teks+search doang. **Item susulan**: nanti
     kalau ada aset final, tambahkan gambar samping di
     `AlatPeragaListContent.tsx` (bisa contoh pola `gambarSamping` di
     `FeatureCards.tsx`).
  5. **`LibraryPagination`** pakai windowed pages + elipsis (halaman 1,
     terakhir, ±1 dari halaman aktif) — belum dites dgn data >12 halaman
     krn koleksi masih kosong (baru dimigrasi, belum diisi staf).

  Verifikasi: `npx tsc --noEmit` bersih. `next lint` gagal jalan di sesi ini
  (`next lint` versi 16 error "Invalid project directory" — kemungkinan
  butuh migrasi ke `eslint.config.*`, di luar scope sesi ini, **belum
  diperbaiki**). Tidak dites di browser — sesuai preferensi tersimpan
  ([[feedback_no_preview_unless_asked]]), skip preview kecuali diminta.
  Koleksi `alat-peraga` masih kosong di DB (belum diisi staf) — belum bisa
  cek visual kartu/grid dgn data asli.

- **24 Agu 2026** — Halaman Media Digital Interaktif (§1 #2) selesai. File
  baru:
  - `src/lib/mediaInteraktif.ts` (query Local API + `getPopularMediaInteraktifTags`).
  - `src/components/library/MediaInteraktifCard.tsx`.
  - `src/components/pages/MediaInteraktifListContent.tsx`.
  - `src/app/(frontend)/media-interaktif/page.tsx` + `en/media-interaktif/page.tsx`.
  - `src/lib/routes.ts` ditambah `mediaInteraktifListPath`.

  Keputusan yang diambil di tempat:
  1. **Tidak pakai `buildLibraryWhere`/kontrak `jenjang`/`mapel`** — koleksi
     ini cuma punya `tags` bebas, bukan taksonomi tetap. Ditulis query
     `where` sendiri di `mediaInteraktif.ts`.
  2. **Param `?tag=` baru** (di luar §2.2) buat "Pencarian Populer" — filter
     exact-match ke `tags.label`, terpisah dari `q` (contains di `judul`)
     supaya klik tag populer tidak nyasar nyari di judul.
  3. **"Pencarian Populer" dihitung dinamis** dari data (top-3 tag
     terbanyak), bukan hardcode — query terpisah `getPopularMediaInteraktifTags`,
     ambil semua doc (koleksi showcase-only, kecil) & hitung frekuensi di memori.
  4. **4 ikon fitur pakai emoji** — proyek tidak punya icon library
     (`lucide-react` dkk tidak dipakai di manapun, dicek dulu). Emoji jadi
     opsi paling konsisten dgn pola `ikon` di `LibraryCategoryChips` yang
     sudah ada.
  5. **Section "Bergabung dengan Komunitas" tidak dikerjakan** — sesuai §4.5,
     belum ketemu di kode manapun & di luar cakupan PRD v1.2. Ditandai
     "Belum" di checklist §4.2, bukan "Selesai" penuh — status tracker §3
     tetap ditulis "Selesai" krn item Library-nya sendiri (bukan section
     beranda terpisah ini) sudah utuh.

  Verifikasi: `npx tsc --noEmit` bersih. Tidak dites di browser sesuai
  instruksi user sesi ini — **QA manual dilakukan user sendiri**, bukan
  lewat preview di sini.

  **Catatan buat QA manual user:**
  - Koleksi `media-interaktif` kemungkinan masih kosong di DB (blm diisi
    staf, sama spt `alat-peraga`) — cek dulu ada minimal beberapa dokumen
    sblm nilai tampilan grid/list & "Pencarian Populer" (butuh data biar
    tag populer muncul, kalau kosong section itu otomatis hilang).
  - Cek link "Buka Link" tiap kartu beneran `target="_blank"` + valid
    (field `tautan` bebas teks, admin bisa salah ketik/lupa `https://`).
  - Cek tampilan list horizontal di mobile (`sm:flex-row` breakpoint) —
    belum dicoba resize di browser sungguhan.
  - Bandingkan hero (4 ikon emoji + copy "Interaktif/Mudah Digunakan/Sesuai
    Kurikulum/Aman & Terpercaya") ke mockup asli kalau ada — sesi ini tidak
    py akses ke mockup, cuma nurut task breakdown teks di §4.2 baris lama.
  - Cek apakah "Pencarian Populer" seharusnya gabung dgn filter `q` yg lagi
    aktif (skrg independen — klik tag reset pencarian teks, tidak
    ditambahkan sbg AND) — kalau mockup minta beda, tinggal ubah
    `MediaInteraktifListContent.tsx`.
  - Section "Bergabung dengan Komunitas" **sengaja dilewati** — kalau mockup
    Media Interaktif ternyata punya section itu, perlu diputuskan dulu apa
    ini scope PRD Fase 2 atau bukan (lihat §4.5) sblm dikerjakan.

- **24 Agu 2026** — Halaman Video Pembelajaran (§1 #3) selesai. File baru:
  - `src/lib/videoPembelajaran.ts` (query Local API pakai `buildLibraryWhere`
    kontrak §2.2 penuh — koleksi ini punya `jenjang`/`mapel` spt Alat Peraga,
    beda dari Media Interaktif yg cuma `tags` bebas).
  - `src/components/library/VideoPembelajaranCard.tsx`.
  - `src/components/pages/VideoPembelajaranListContent.tsx`.
  - `src/app/(frontend)/video-pembelajaran/page.tsx` + `en/video-pembelajaran/page.tsx`.
  - `src/lib/routes.ts` ditambah `videoPembelajaranListPath`.

  Keputusan yang diambil di tempat:
  1. **Tidak ada halaman detail/route `[slug]`** — koleksi `VideoPembelajaran`
     memang tidak punya field `slug` di skema (`VideoPembelajaran.ts`, beda
     dari `AlatPeraga`), jadi kartu langsung tautan ke video, bukan ke route
     internal.
  2. **Tombol "Tonton" = tautan eksternal langsung** (`target="_blank"`),
     bukan player/modal terbenam — utk `sumberTipe: "youtube"` arahkan ke
     `tautanYoutube` apa adanya, utk `"upload"` arahkan ke URL berkas Media
     (`berkasVideo.url`). Belum ada komponen video player di proyek ini,
     & OI-106 (YouTube vs upload) sendiri belum final — keputusan ini bisa
     diganti embed `<iframe>` YouTube begitu OI-106 turun. Helper
     `videoPembelajaranTontonHref()` di `videoPembelajaran.ts` jadi satu
     titik ubah kalau nanti perlu logic beda per sumber.
  3. **Card pakai overlay ikon play (▶) di atas thumbnail** — thumbnail wajib
     diisi di skema (`required: true`), jadi selalu ada gambar dasar; overlay
     cuma indikator visual "ini video", bukan interaktif/pemutar.
  4. **Grid 1/2/4 kolom** (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`) — beda
     dr Alat Peraga yg cuma sampai 4 kolom di desktop tapi mulai 1 kolom
     mobile penuh; konsisten pola kartu video landscape (`aspect-video`)
     yg lebih lebar drpd `aspect-[4/3]` Alat Peraga.

  Verifikasi: `npx tsc --noEmit` bersih. Tidak dites di browser — sesuai
  instruksi user sesi ini ("QA saya sendiri, bukan preview dari sini").

  **Catatan buat QA manual user:**
  - Koleksi `video-pembelajaran` kemungkinan masih kosong di DB (blm diisi
    staf) — cek dulu ada data biar grid & filter jenjang/mapel bisa dicoba.
  - Cek tombol "Tonton" beneran buka tab baru & URL-nya benar, khususnya
    utk video `sumberTipe: "upload"` (arahnya ke URL berkas Media, bukan
    player — pastikan browser bisa mainkan file itu langsung/download,
    tergantung format & header Content-Type dari storage).
  - `tautanYoutube` field teks bebas (bukan validasi format) — cek admin
    tidak salah ketik/lupa `https://` saat isi data.
  - Overlay ikon ▶ di thumbnail: pastikan kontras cukup & tidak nutup
    thumbnail terlalu banyak di berbagai ukuran gambar upload staf.
  - Belum ada keputusan final OI-106 (YouTube vs upload storage sendiri) —
    kalau nanti diputuskan salah satu saja, halaman ini & skema
    `VideoPembelajaran.ts` bisa disederhanakan (buang field yg tidak
    kepakai).
  - Bandingkan tampilan kartu (grid 4 kolom, overlay play, badge durasi
    pojok kanan-bawah) ke mockup asli kalau ada — sesi ini tidak py akses
    ke mockup, cuma nurut task breakdown teks di §4.3 baris lama.

- **24 Agu 2026** — Sesi recap (tanpa kode). Media Interaktif + Video
  Pembelajaran di-commit (`e0573c6`). Keputusan/konfirmasi dari user:
  1. **Urutan #4 (Buku/Bahan Ajar/Modul) dikerjakan PALING TERAKHIR**,
     setelah #5 Integrasi Beranda — beda dari urutan §1 asli ("nilai
     terbesar duluan"). Alasan: perlu setup Google Drive OAuth + API key
     dulu (OI-108), belum siap. Baris urutan §1/§3 belum diubah fisik,
     tapi acuan eksekusi sebenarnya: 1 Alat Peraga → 2 Media Interaktif →
     3 Video Pembelajaran → 5 Integrasi Beranda → 4 Buku/Bahan Ajar/Modul.
  2. **OI-106** dikonfirmasi: nanti pakai embed YouTube (bukan link keluar
     doang spt keputusan sementara di sesi Video Pembelajaran) — belum
     dikerjakan, nunggu sesi lanjutan `VideoPembelajaranCard`/
     `videoPembelajaranTontonHref()`.
  3. **OI-105** (checkout) masih belum diputuskan — tetap fallback
     "Hubungi Kami" spt rencana semula.
  4. **OI-108** (OAuth Drive) dikonfirmasi dikerjakan paling terakhir
     banget, sejalan dgn poin 1.
  5. **"Bergabung dengan Komunitas"** dikonfirmasi user: gaada hubungannya
     sama pengembangan Library Materi Guru ini — di luar scope permanen,
     bukan cuma "belum ada arahan".
  6. **TODO seed dummy data buat QA** — koleksi `alat-peraga`,
     `media-interaktif`, `video-pembelajaran` masih kosong di DB (demo &
     production pakai DB yg sama), jadi QA visual (grid, pagination
     >1 halaman, "Pencarian Populer") belum pernah dites data asli. Rencana:
     bikin `scripts/seed-library-dummy.mts` (pola sama `scripts/seed-pages.mts`),
     isi tiap koleksi ~15-20 dokumen dummy dgn variasi jenjang/mapel/tags
     biar filter & `LibraryPagination` (>12 item) ke-test. **Belum dibuat**
     — dikerjakan di sesi terpisah nanti oleh user sendiri.

- **26 Agu 2026** — Skrip `scripts/seed-library-dummy.mts` (`npm run
  seed:library-dummy`) dibuat & dijalankan, menuntaskan TODO poin 6 di atas.
  18 dokumen per koleksi (`alat-peraga`, `media-interaktif`,
  `video-pembelajaran`) — sengaja >12 biar `LibraryPagination` ke-test sampai
  halaman 2. Tidak upload berkas baru: cover/thumbnail pakai ulang dokumen
  Media yang sudah ada (round-robin). Idempotent — ditandai judul berawalan
  `[QA] `, dicek dulu sblm create, aman dijalankan ulang. Dihapus kapan saja
  lewat dasbor dgn cari prefiks itu. `npx tsc --noEmit` bersih, skrip
  dijalankan sukses (error `[revalidate] gagal menyegarkan halaman publik`
  yang muncul di log itu cuma noise — hook revalidate memang gagal di luar
  context Next request saat dipanggil dari CLI, bukan bug baru, data tetap
  ter-create). Selanjutnya: QA manual halaman Alat Peraga, Media Interaktif,
  Video Pembelajaran oleh user di `dev.gernastastaka.org` (branch `preview`).

- **26 Agu 2026** — Deploy `preview` ke `dev.gernastastaka.org` sempat gagal
  total (semua halaman "server error", termasuk favicon) krn `sharp` native
  binary (libvips) tidak ke-bundle ke runtime serverless Vercel — bukan bug
  Library Guru, ini masalah Turbopack/Next 16 + native module. Diperbaiki 2
  commit: `serverExternalPackages: ["sharp"]` lalu (krn belum cukup)
  `outputFileTracingIncludes` paksa sertakan `node_modules/@img/**` &
  `node_modules/sharp/**`. Lihat `next.config.mjs`.

  **QA manual Alat Peraga (temuan, BELUM DIPERBAIKI — ditunda, dikerjakan
  nanti sekaligus dgn revisi halaman lain):**
  1. **Search bar** — penempatan/layout belum sesuai mockup Figma.
  2. **Teks "Menampilkan 1–12 dari 86 produk"** — posisi/layout-nya belum
     sesuai Figma (posisi teks ini vs pagination perlu dicek ulang thd
     mockup).
  3. **`LibraryCategoryChips`** ("Jelajahi Berdasarkan Kategori") — layout
     kartu belum sesuai Figma.
  4. **Halaman detail (`alat-peraga/[slug]`)** — perlu didiskusikan ulang:
     isi & informasi apa saja yang seharusnya ditampilkan (keputusan
     sementara di §5 sesi 24 Agu cuma asumsi tanpa akses mockup detail).

  Belum dikerjakan sesi ini — user lanjut QA halaman berikutnya dulu, semua
  temuan di atas diperbaiki bareng nanti (kemungkinan butuh akses mockup
  Figma langsung, bukan cuma task breakdown teks).

  **QA manual Media Digital Interaktif (temuan, BELUM DIPERBAIKI — ditunda,
  sama spt Alat Peraga):**
  1. **Layout umum** — sama kayak Alat Peraga, perlu disesuaikan ulang ke
     Figma.
  2. **Tombol "Buka Link"** — PR terbuka: apa tetap tautan keluar biasa
     (`target="_blank"`, kondisi saat ini) atau sistemnya mau di-embed
     langsung saat diklik (mis. modal/iframe)? **Perlu didiskusikan dengan
     klien dulu** sebelum diputuskan/dikerjakan — jangan asumsikan salah
     satu di sesi perbaikan nanti tanpa konfirmasi ini.

  **QA manual Video Pembelajaran (temuan, BELUM DIPERBAIKI — ditunda, sama
  spt 2 halaman di atas):**
  1. **Layout umum** — sama, perlu disesuaikan ulang ke Figma (lebih teliti
     lagi menurut user).
  2. **Tombol "Tonton" — KEPUTUSAN BARU, bukan cuma catatan diskusi**: user
     memutuskan **halaman detail per video** (bukan redirect keluar ke
     YouTube spt implementasi saat ini). Klik "Tonton" tetap di website kita,
     video di-embed & bisa diputar langsung di halaman detail itu. Ini
     override keputusan sementara sesi 24 Agu ("tombol tonton = tautan
     eksternal langsung", lihat entri riwayat 24 Agu poin 2 & fungsi
     `videoPembelajaranTontonHref()` di `src/lib/videoPembelajaran.ts`) —
     **perlu dikerjakan nanti**:
     - Tambah route detail `video-pembelajaran/[slug]` (+ `en/`) — tapi
       skema `VideoPembelajaran.ts` **belum punya field `slug`** (beda dari
       `AlatPeraga` yang sudah punya), jadi perlu tambah field + migrasi dulu.
     - Ganti `VideoPembelajaranCard` dari link langsung jadi link ke route
       detail internal.
     - Halaman detail perlu komponen embed player (YouTube iframe utk
       `sumberTipe: "youtube"`; utk `sumberTipe: "upload"` pakai `<video>`
       tag native ke `berkasVideo.url`). Belum ada komponen video player di
       proyek ini sama sekali — ini genuinely baru.
     - `videoPembelajaranTontonHref()` kemungkinan tidak lagi dipakai kalau
       tombol jadi link internal ke `[slug]`, bukan href eksternal langsung
       — cek ulang saat pengerjaan.

- **26 Agu 2026** — Halaman **Buku, Bahan Ajar & Modul** (§1 #4) dibangun,
  dikerjakan lebih awal dari urutan yang disepakati (harusnya setelah #5
  Integrasi Beranda) atas permintaan user: **fokus tampilan & layout dulu,
  integrasi Google Drive/OAuth (OI-108) tetap ditunda**. File baru:
  - `src/lib/produk.ts` — query Local API (`getProdukList`,
    `getProdukTerbaru`, `getProdukBySlug`, `getProdukSlugs`) + label/format
    helper (`KATEGORI_PRODUK_LABELS`, `FORMAT_LABELS`,
    `FORMAT_LABELS_PENDEK`, `formatLabelPendek`, `formatHarga`).
  - `src/components/library/{ProdukCard,ProdukTerbaru,IkonKategoriProduk}.tsx`.
  - `src/components/pages/{ProdukListContent,ProdukDetailContent}.tsx`.
  - 4 route: `buku-bahan-ajar-modul/page.tsx`, `.../[slug]/page.tsx`, dan
    kembarannya di `en/`.
  - `src/lib/routes.ts` ditambah `produkListPath`/`produkPath`.
  - `scripts/seed-library-dummy.mts` ditambah 18 dokumen `produk` dummy
    (kategori/format/gratis-berbayar bervariasi; `i === 0` dipaksa berbayar
    krn dia produk sematan yang tampil di panel "Produk Terbaru" dan mockup
    menunjukkan tombol "Beli Sekarang!" di sana). Sudah dijalankan: 18
    dokumen ter-create di DB.

  Komponen bersama yang **diubah** (bukan file baru) — perlu diperhatikan
  sesi berikutnya karena dipakai 3 halaman lama juga:
  - `LibrarySearchBar` dapat prop `variant`: `"pill"` (bawaan, 3 halaman lama
    tidak berubah) dan `"kotak"` (input kotak + tombol persegi berikon kaca
    pembesar) yang dipakai halaman ini sesuai mockup. Sengaja tidak mengganti
    bawaannya: mockup 3 halaman lain belum ditinjau (temuan QA di atas).
  - `LibraryCategoryChips` ditata ulang jadi mendatar (ikon kiri, teks kanan)
    + prop `warna` (tint latar) & `ikon` sekarang `ReactNode` (bukan cuma
    emoji). Kartu Alat Peraga tidak mengoper ikon/warna, jadi tampil sbg
    teks di kartu putih — nyaris sama seperti sebelumnya.

  Keputusan yang diambil di tempat:
  1. **"Produk Terbaru" = produk dengan `urutan` terkecil**, bukan field
     `unggulan: checkbox` baru — menghindari ubah `payload.config` + migrasi
     ke DB yang sedang dipakai. Konsekuensi: "terbaru" berarti "yang
     disematkan staf lewat kolom Urutan", bukan dokumen termuda. Kalau nanti
     maunya benar-benar otomatis (`createdAt` terbaru), tinggal ganti `sort`
     di `getProdukTerbaru()`.
  2. **Gambar promo di hero = sampul produk sematan itu juga**, bukan aset
     terpisah — mockup memperlihatkan mockup buku yang sama di hero & panel
     "Produk Terbaru", dan belum ada berkas promo khusus di Media (masalah
     yang sama bikin hero Alat Peraga kosong, lihat entri 24 Agu poin 4).
  3. **Ada halaman detail `[slug]`** (ikut pola Alat Peraga) supaya tombol
     "Detail"/"Detail Produk" tidak jadi tautan mati. Isinya masih ringkas
     (sampul, tag, ringkasan, harga, format, fitur unggulan) — susunan
     informasinya belum ditinjau ke mockup, sama seperti PR terbuka soal isi
     halaman detail Alat Peraga.
  4. **Tombol aksi belum menyentuh transaksi**: produk berbayar → "Beli
     Sekarang" ke `/mitra` (OI-105 belum diputuskan); produk gratis → panel
     "Produk Terbaru" mengarah ke halaman detail, dan di detail `tautanDrive`
     ditampilkan apa adanya **tanpa form pendataan pengunjung (FR-104)**.
     Form gated + `leads` itu masih pekerjaan tersisa di §4.4.
  5. **`ProdukCard` pakai `object-contain`** (beda dari `AlatPeragaCard` yang
     `object-cover`) — sampulnya mockup buku tegak, kalau dipangkas judul
     bukunya ikut terpotong.
  6. **Ikon 4 kartu kategori ditaruh di file sendiri**
     (`IkonKategoriProduk.tsx`), bukan menambah `src/components/ikon.tsx`:
     set di sana terikat kontrak dengan `ikonOptions` di
     `src/payload/blocks/shared.ts` (pilihan staf di dasbor), sedangkan
     keempat ikon ini ditentukan kode dari `kategoriProduk`.
  7. **Teks "Menampilkan X–Y dari Z produk" ditaruh di bawah judul
     "Semua Buku, Bahan Ajar & Modul" (rata kiri, di atas grid)**, pagination
     sendirian di bawah grid — mengikuti mockup. Ini beda dari Alat Peraga
     yang menaruh keduanya menumpuk di bawah grid (temuan QA #2 halaman itu);
     halaman lama belum ikut diubah.

  Verifikasi: `npx tsc --noEmit` bersih. Skrip seed dijalankan sukses (error
  `[revalidate] gagal menyegarkan halaman publik` di log tetap cuma noise CLI,
  sama seperti sesi sebelumnya). **Tidak dites di browser** — sesuai preferensi
  tersimpan, preview hanya dijalankan kalau user minta.

  **Catatan buat QA manual user:**
  - Alamat halaman: `/buku-bahan-ajar-modul` (ID) & `/en/buku-bahan-ajar-modul`
    (EN). Belum ditautkan dari menu/beranda mana pun — itu bagian §4.5 yang
    masih "Belum".
  - Bandingkan ke mockup: hero (judul + deskripsi + search kotak + gambar
    promo kanan), panel "Produk Terbaru" (sampul kiri, judul/ringkasan/
    checklist format/2 tombol di tengah, daftar bintang fitur unggulan di
    kanan dgn garis pemisah), 4 kartu kategori berwarna, grid 4 kolom, teks
    "Menampilkan…", pagination, banner CTA.
  - Data dummy produk sengaja bervariasi: ada yang `PDF` saja & ada
    `PDF+Cetak`, ada "Gratis" (hijau) & ada harga (merah) — pastikan keduanya
    tampil benar di kartu.
  - Klik satu kartu kategori (mis. Modul) → cek `?kategori=modul` menyaring
    grid, dan pagination tetap membawa filter itu saat pindah halaman.
  - Halaman detail: cek tombol "Beli Sekarang" (produk berbayar) mendarat di
    `/mitra`, dan produk gratis menampilkan tautan Drive dummy
    (`https://drive.google.com/drive/folders/dummy-produk-N` — memang tidak
    bisa dibuka, itu data QA).
  - 3 halaman Library lama **tidak diubah tampilannya** sesi ini kecuali efek
    sampingan `LibraryCategoryChips` di Alat Peraga (kartu kategori kini
    mendatar) — kalau itu terlihat lebih buruk dari sebelumnya, catat sbg
    temuan, gampang dikembalikan.


- **26 Agu 2026** — **Revisi tampilan halaman Media Digital Interaktif ke
  mockup Figma** (menutup temuan QA #1 halaman itu) + penyeragaman sampul data
  dummy halaman Buku/Bahan Ajar/Modul. File baru:
  - `src/components/library/IkonMediaInteraktif.tsx` — 4 ikon keunggulan (SVG
    garis, menggantikan emoji dari sesi 24 Agu) + `IlustrasiMediaInteraktif`.

  File yang diubah:
  - `src/components/pages/MediaInteraktifListContent.tsx` — hero jadi 2 kolom
    (teks + ilustrasi, rata kiri, bukan center), 4 keunggulan kini berikon
    bulat + keterangan satu kalimat, pencarian & daftar dipindah ke SATU panel
    putih berjudul "Cari Kebutuhan Anda!", search bar pakai `variant="kotak"`.
  - `src/components/library/MediaInteraktifCard.tsx` — baris daftar (dipisah
    garis tipis `divide-y` dari induknya, bukan kartu putih sendiri-sendiri),
    tag pindah ke bawah deskripsi, tombol jadi panel "Buka Link" + alamat
    ringkas + tombol bulat panah.
  - `src/components/library/CtaBantuanBanner.tsx` — tata letak mendatar (teks
    kiri, tombol kanan) sesuai mockup. **Dipakai keempat halaman Library**,
    jadi 3 halaman lain ikut berubah — mockup masing-masing memperlihatkan
    banner yang sama, tapi tetap perlu dilihat lagi saat sesi Figma halaman itu.
  - `scripts/seed-library-dummy.mts` — sampul dummy `produk`.

  Keputusan yang diambil di tempat:
  1. **Teks "Menampilkan X–Y dari Z media" dihapus** dari halaman ini —
     mockup tidak memuatnya (beda dari halaman Buku, lihat §5 entri
     sebelumnya poin 7). Pagination tetap ada, muncul hanya kalau >1 halaman.
  2. **Ilustrasi hero digambar inline sbg SVG penampung sementara**, bukan
     `next/image` — ilustrasi 3D di mockup belum diunggah ke koleksi Media
     (masalah yang sama bikin hero Alat Peraga kosong, §5 entri 24 Agu poin 4).
     Ganti isi `IlustrasiMediaInteraktif` begitu aset finalnya ada.
  3. **Ilustrasi di banner CTA dilewati** (mockup memperlihatkan ilustrasi
     orang ber-headset) — alasan sama: asetnya belum ada. Bannernya tetap
     rapi tanpa itu.
  4. **Ikon tombol banner = gelembung obrolan, bukan logo WhatsApp** spt
     mockup: tidak ada nomor WhatsApp resmi di mana pun (dicek `SiteSettings`
     & seluruh `src/`), jadi tombol masih mendarat di `/mitra`. Ganti ikon +
     href sekaligus begitu nomornya tersedia.
  5. **Section "Bergabung dengan Komunitas" tetap tidak dikerjakan** meski
     ada di mockup — user sudah menyatakan section itu di luar scope permanen
     (§5 entri 24 Agu, sesi recap poin 5). Perlu konfirmasi ulang kalau
     mockup ini mengubah keputusan tsb.
  6. **Tombol "Buka Link" masih tautan keluar** (`target="_blank"`) — PR soal
     embed/modal (temuan QA #2 halaman ini) belum diputuskan, masih menunggu
     konfirmasi klien. Tidak diasumsikan sepihak di sesi ini.

  **Sampul data dummy `produk` diseragamkan** atas permintaan user: ke-18
  dokumen `[QA] ` di koleksi `produk` sekarang memakai satu berkas Media
  `cropped-Logo_GernasTastaka-01-300x124.webp` (id 110), bukan round-robin
  dokumen Media acak seperti 3 koleksi lain. Skrip seed dicari-berdasarkan-
  nama-berkas (bukan id keras) dan **menambal dokumen lama juga** — dokumen
  `[QA] ` yang sudah ada sampulnya di-`update` ke logo itu, supaya aturan baru
  tidak cuma berlaku di DB kosong. Sudah dijalankan: 18 dokumen ditambal,
  dijalankan ulang melaporkan 0 (idempotent). Cuma field `cover` yang di-
  `update` (tidak dilokalkan), judul/ringkasan EN dicek masih utuh setelahnya.

  Verifikasi: `npx tsc --noEmit` bersih. Skrip seed jalan sukses (error
  `[revalidate] gagal menyegarkan halaman publik` di log tetap noise CLI yang
  sama spt sesi sebelumnya). **Tidak dites di browser** — sesuai preferensi
  tersimpan, preview hanya dijalankan kalau user minta.

- **26 Agu 2026** — **Revisi tampilan halaman Alat Peraga ke mockup Figma**
  (menutup temuan QA #1, #2, #3 halaman itu). File baru:
  - `src/components/library/IkonAlatPeraga.tsx` — 2 ikon kartu kategori
    (bangun ruang utk Gernas Tastaka, tumpukan buku utk Gernas Tastaba),
    SVG berwarna inline sbg penampung sementara.

  File yang diubah:
  - `src/components/pages/AlatPeragaListContent.tsx` — hero jadi 2 kolom (teks
    rata kiri + gambar promo kanan, eyebrow "Library Materi Guru" dihapus krn
    tidak ada di mockup), search bar pakai `variant="kotak"`, kartu kategori
    pakai varian `lebar`, section daftar dapat judul "Semua Alat Peraga" dgn
    teks "Menampilkan X–Y dari Z produk" di bawahnya (rata kiri, di atas grid)
    & pagination sendirian di bawah grid, grid jadi 3 kolom (dari 4).
  - `src/components/library/AlatPeragaCard.tsx` — susunan mengikuti mockup:
    gambar → judul → subjudul → tag jenjang/mapel → tombol "Detail" rata kanan
    (sebelumnya tag di atas judul & tombol rata kiri). Tag pakai tint biru,
    tombol Detail jadi pil abu.
  - `src/components/library/LibraryCategoryChips.tsx` — prop `variant` baru:
    `"ringkas"` (bawaan, halaman Buku/Bahan Ajar/Modul **tidak berubah**) dan
    `"lebar"` (2 kolom, kartu lebih lapang, judul ikut warna aksen, tombol
    panah bundar di ujung kanan) yang dipakai halaman ini.
  - `src/lib/alatPeraga.ts` — `getAlatPeragaSematan()` baru (urutan terkecil,
    `limit: 1`) utk gambar promo hero.
  - `src/app/(frontend)/alat-peraga/page.tsx` + `en/` — `description` metadata
    diselaraskan dgn teks hero yang baru.

  Keputusan yang diambil di tempat:
  1. **Teks deskripsi hero tidak disalin mentah dari mockup** — mockup Alat
     Peraga memakai kalimat halaman Buku ("Kumpulan buku, modul dan bahan ajar
     berkualitas…"), jelas sisa salin-tempel di Figma. Dipakai kalimat yang
     mengikuti irama yang sama tapi menyebut alat peraga. Placeholder pencarian
     ikut mockup apa adanya ("Cari materi, topik, kelas, atau kata kunci…").
  2. **Gambar promo hero = sampul alat peraga sematan** (`urutan` terkecil),
     bukan aset terpisah — alasan & pola sama persis dgn halaman Buku (§5
     entri sebelumnya poin 2); belum ada berkas promo khusus di koleksi Media.
     Hero otomatis jadi satu kolom kalau koleksi kosong.
  3. **Deskripsi 2 kartu kategori tetap teks lama** — di mockup isinya lorem
     (`tghtrhrthbery54y65hjytyj7ikuykjy…`), bukan copy sungguhan.
  4. **Grid 3 kolom** (`lg:grid-cols-3`) mengikuti mockup — beda dari halaman
     Buku & Video yg 4 kolom. 12 item per halaman jadi pas 4 baris.
  5. **Ilustrasi orang ber-headset di banner CTA tetap dilewati** — asetnya
     belum ada, sama spt keputusan di sesi Media Interaktif (§5 entri
     sebelumnya poin 3). Bannernya sendiri sudah mendatar sesuai mockup.
  6. **Temuan QA #4 (isi halaman detail) tidak dikerjakan** — itu butuh diskusi
     informasi apa yang ditampilkan, bukan sekadar tata letak; mockup yang
     ditinjau sesi ini cuma halaman katalog.

  Verifikasi: `npx tsc --noEmit` bersih. **Tidak dites di browser** — sesuai
  preferensi tersimpan, preview hanya dijalankan kalau user minta.

---

## 6. Ringkasan Sesi QA 26 Agu 2026

Skrip dummy data dibuat, deploy `preview` diperbaiki (bug infra `sharp` di
Vercel, tidak terkait Library Guru), lalu QA manual dilakukan untuk 3
halaman yang sudah dibangun (Alat Peraga, Media Interaktif, Video
Pembelajaran) langsung di `dev.gernastastaka.org`. **Semua 3 halaman perlu
sesi perbaikan lanjutan** sebelum dianggap selesai penuh — status tracker §3
sengaja TIDAK diubah dulu dari "Selesai" (itu menandai "sudah dibangun",
bukan "sudah lolos QA visual/Figma"); rincian temuan tiap halaman ada di §5
di atas entri "26 Agu 2026" masing-masing.

Ringkas per halaman:
- **Alat Peraga**: ~~layout search bar, teks "Menampilkan X dari Y", &
  `LibraryCategoryChips` belum sesuai Figma~~ → **sudah diperbaiki** 26 Agu
  2026 (lihat entri §5 terakhir). Sisa yang terbuka: isi halaman detail
  (temuan #4) masih perlu didiskusikan ulang.
- **Media Interaktif**: ~~layout belum sesuai Figma~~ → **sudah diperbaiki**
  26 Agu 2026. Sisa yang terbuka: PR soal tombol "Buka Link" (tautan keluar
  vs embed) — **butuh konfirmasi klien**.
- **Video Pembelajaran**: ~~layout belum sesuai Figma~~ + ~~tombol "Tonton"
  harus jadi halaman detail dgn video ter-embed~~ → **keduanya sudah
  dikerjakan** 26 Agu 2026 (lihat entri §5 terakhir). Sisa yang terbuka: isi
  halaman detail belum ditinjau ke mockup (mockup yang ada baru halaman
  katalog), sama spt PR terbuka halaman detail Alat Peraga & Buku.

**Untuk sesi perbaikan berikutnya**: kemungkinan butuh akses langsung ke
file Figma (bukan cuma task breakdown teks di §4) supaya perbaikan layout
match betul, terutama utk 3 temuan layout di atas.

**TODO housekeeping — jangan lupa dibersihkan sebelum rilis produksi:**
18×4 dokumen dummy (judul berawalan `[QA] `, dibuat `scripts/seed-library-dummy.mts`)
di koleksi `alat-peraga`/`media-interaktif`/`video-pembelajaran`/`produk`
harus dihapus lewat dasbor sebelum situs ini dianggap siap tayang ke publik.
**Belum dihapus** — sengaja dipertahankan dulu krn skrip seed ini masih
dipakai ulang tiap kali perlu re-test setelah sesi perbaikan layout/Figma
berikutnya (termasuk nanti utk halaman ke-4, Buku/Bahan Ajar/Modul, kalau
sudah dikerjakan). Cara hapus: filter/cari judul `[QA] ` di tiap koleksi di
dasbor, hapus manual — skrip aman dijalankan ulang (idempotent) kalau nanti
butuh data dummy lagi.

- **26 Agu 2026** — **Revisi tampilan halaman Video Pembelajaran ke mockup
  Figma + halaman detail per video** (menutup temuan QA #1 & #2 halaman itu).

  Perubahan skema + migrasi (`migrations/20260826_161929_video_pembelajaran_slug.ts`,
  **sudah dijalankan ke DB yang dipakai sekarang**):
  - `slug` (wajib, unik) & `deskripsi` (localized) ditambah ke
    `src/payload/collections/VideoPembelajaran.ts`.
  - Migrasi hasil `migrate:create` **ditulis ulang manual**: mentahnya
    `ADD COLUMN "slug" varchar NOT NULL` yang pasti gagal krn tabelnya sudah
    berisi 18 dokumen QA. Urutan yang dipakai: kolom nullable → isi dari
    `judul` locale `id` (aturan slugify disalin dari `src/payload/fields/slug.ts`
    ke SQL) → tambal yang kosong/kembar dgn id → baru NOT NULL + indeks unik.
    Dicek setelahnya: 18/18 dokumen punya slug (`qa-video-pembelajaran-dummy-01`, dst.).

  File baru:
  - `src/components/library/VideoPilihanCarousel.tsx` — korsel mendatar
    (client component, `scrollBy` + scroll-snap).
  - `src/components/library/VideoPembelajaranPlayer.tsx` — pemutar: iframe
    `youtube-nocookie.com/embed/…` utk `sumberTipe: "youtube"`, `<video controls>`
    utk `"upload"`, dan penampung thumbnail+tautan kalau tautannya tidak dikenali.
  - `src/components/pages/VideoPembelajaranDetailContent.tsx` + route
    `video-pembelajaran/[slug]/page.tsx` & `en/video-pembelajaran/[slug]/page.tsx`.

  File yang diubah:
  - `src/components/pages/VideoPembelajaranListContent.tsx` — hero 2 kolom (teks
    rata kiri + gambar promo kanan, eyebrow "Library Materi Guru" dihapus krn
    tidak ada di mockup), search `variant="kotak"`, section "Video Pilihan",
    judul "Semua Video" + teks "Menampilkan X–Y dari Z video" di atas grid,
    pagination sendirian di bawah grid, grid 3 kolom (dari 4).
  - `src/components/library/VideoPembelajaranCard.tsx` — thumbnail membulat di
    dalam kartu → tag jenjang/mapel → judul; tombol "Tonton" dihapus, seluruh
    kartu menautkan ke halaman detail. Ikon ▶ sekarang cuma muncul saat hover.
  - `src/lib/videoPembelajaran.ts` — `slug`/`deskripsi` di view,
    `getVideoPembelajaranBySlug`, `getVideoPembelajaranSlugs`,
    `getVideoPembelajaranPilihan`, `youtubeVideoId()`, dan
    `videoPembelajaranTontonHref()` → `videoPembelajaranSumberHref()`.
  - `src/lib/routes.ts` — `videoPembelajaranPath()`.
  - Metadata `description` 2 route katalog diselaraskan dgn teks hero baru.
  - `scripts/seed-library-dummy.mts` — `deskripsi` untuk video dummy, plus
    penambal dokumen `[QA] ` lama (pola sama spt penyeragaman sampul `produk`).
    Sudah dijalankan: 18/18 dokumen punya deskripsi.

  Keputusan yang diambil di tempat:
  1. **Section di antara hero & "Semua Video" ditafsirkan sbg korsel "Video
     Pilihan"** — di mockup bidang itu kosong (gambarnya tidak ikut ter-render),
     yang terlihat cuma tombol panah bundar di tepi kanan. Isinya diambil dari
     video dgn `urutan` terkecil (pola sematan yang sama spt "Produk Terbaru" &
     hero Alat Peraga), 6 item. **Perlu dikonfirmasi ke mockup asli** — kalau
     ternyata bukan korsel video, bagian ini tinggal diganti/dihapus, sisanya
     tidak terpengaruh.
  2. **Teks deskripsi hero tidak disalin mentah dari mockup** — mockup halaman
     ini memakai kalimat halaman Buku ("Kumpulan buku, modul dan bahan ajar…"),
     sisa salin-tempel yang sama spt di mockup Alat Peraga. Dipakai kalimat
     seirama tapi menyebut video.
  3. **Gambar promo hero = thumbnail video sematan** — belum ada aset promo
     khusus di Media, alasan & pola sama dgn Alat Peraga/Buku.
  4. **`deskripsi` ikut ditambahkan ke skema** (bukan cuma `slug`) — tanpa itu
     halaman detail nyaris kosong: koleksi ini tidak punya field teks lain
     selain judul/durasi. Sekalian satu migrasi, tidak perlu migrasi kedua.
  5. **Embed pakai `youtube-nocookie.com`**, bukan `youtube.com` — tidak
     memasang cookie pelacak sampai videonya benar-benar diputar.
  6. **Isi halaman detail belum ditinjau ke mockup** (pemutar → tag → judul →
     durasi/tautan sumber → deskripsi → "Video Lainnya" → banner CTA) — mockup
     yang tersedia sesi ini cuma halaman katalog, sama spt PR terbuka isi
     halaman detail Alat Peraga (temuan QA #4 halaman itu) & Buku.

  Verifikasi: `npx tsc --noEmit` bersih; migrasi & skrip seed dijalankan sukses
  (error `[revalidate] gagal menyegarkan halaman publik` di log skrip tetap
  noise CLI yang sama spt sesi sebelumnya). **Tidak dites di browser** — sesuai
  preferensi tersimpan, preview hanya dijalankan kalau user minta.

  **Catatan buat QA manual user:**
  - Alamat: `/video-pembelajaran` & `/video-pembelajaran/<slug>` (+ `en/`).
  - Data dummy semuanya menunjuk ke satu tautan YouTube yang sama — pemutar di
    halaman detail akan menampilkan video itu; ganti/isi data asli untuk menilai
    beneran. `sumberTipe: "upload"` **belum pernah dites** krn koleksi Media
    masih menolak `video/*` (lihat catatan di `Media.ts`/`VideoPembelajaran.ts`).
  - Cek korsel "Video Pilihan" (poin 1 di atas) — bentuk & isinya asumsi.
  - **Temuan baru (belum dikerjakan, di luar cakupan sesi ini):** 4 route
    Library tidak ada satu pun di `src/app/(frontend)/sitemap.ts` — sitemap
    masih cuma memuat `pages` + `articles`. Berlaku juga utk Alat Peraga &
    Buku/Bahan Ajar/Modul, bukan cuma halaman ini.

---

- **7 Sep 2026 — Buku, Bahan Ajar & Modul: data dummy diganti materi asli dari Google Drive**

  Berkas baru: `scripts/fetch-drive-konten.mts`, `scripts/data-produk-drive.json`,
  `scripts/seed-produk-drive.mts`, `src/components/library/IkonTopikProduk.tsx`,
  `docs/RENCANA-INTEGRASI-DRIVE.md`,
  `migrations/20260907_053054_produk_topik.ts`.
  Diubah: `src/payload/collections/Produk.ts`, `src/lib/produk.ts`,
  `src/components/pages/ProdukListContent.tsx`,
  `src/components/pages/ProdukDetailContent.tsx`,
  `src/components/library/ProdukCard.tsx`,
  `src/components/library/LibraryCategoryChips.tsx`,
  `scripts/seed-library-dummy.mts`, `package.json`.

  Sumber data: folder Drive "Konten" `1ucyEM7NXmqJhQyNtnuNqZCePno37VF86`
  (pemilik `gernastastaka.online@gmail.com`, akses "siapa saja yang punya
  tautan") — 6 folder topik berisi 79 PDF lembar kegiatan matematika.
  18 dokumen `[QA] …` dihapus, diganti 79 dokumen asli.

  Keputusan yang diambil di tempat:
  1. **Field `topik` baru, bukan mengganti opsi `kategoriProduk`.** User minta
     6 folder Drive jadi kategori di halaman katalog. Mengganti isi
     `kategoriProduk` berarti membuang opsi Modul/Buku/LKS yang belum ada
     datanya tapi jelas akan dipakai (situsnya sendiri berjudul "Buku, Bahan
     Ajar & Modul"). Jadi `kategoriProduk` dipertahankan sbg **jenis materi**
     (label di dasbor diubah jadi "Jenis materi") dan `topik` ditambahkan sbg
     dimensi kedua. Kartu kategori di halaman kini memakai `topik`;
     `?kategori=` tetap jalan tapi tidak ada yang menautkannya lagi.
  2. **Sampul = gambar halaman pertama tiap PDF**, diambil dari
     `drive.google.com/thumbnail?id=…` lalu diunggah ke koleksi Media.
     Alternatifnya (logo Gernas untuk semua, spt data dummy) membuat 79 kartu
     kelihatan identik. Halaman pertama tiap materi kebetulan berisi judul +
     ilustrasi kegiatannya, jadi terbaca sbg sampul betulan.
  3. **Dokumen dicocokkan lewat file id Drive (`tautanDrive`), bukan slug.**
     Kalau berkas diganti nama di Drive, judul produk ikut berubah tapi
     slug/URL lama dipertahankan. Slug hanya ditulis saat dokumen dibuat.
  4. **`urutan` = indeks topik × 1000 + nomor berkas.** Dengan begitu katalog
     yang di-`sort: "urutan"` mengelompok per topik dengan sendirinya, tanpa
     perlu mengubah sort di `src/lib/produk.ts` (yang juga dipakai panel
     "Produk Terbaru").
  5. **`jenjang` semua diisi `["sd"]` sebagai asumsi yang dinyatakan terbuka**,
     bukan ditebak per berkas. Sebagian materi (Bilangan Bulat, Diagonal
     Bidang & Ruang, Mean/Median/Modus) sebenarnya SMP. `ringkasan` sengaja
     dibiarkan kosong daripada diisi kalimat karangan. Keduanya tidak ditimpa
     lagi saat skrip dijalankan ulang, jadi aman dibetulkan lewat dasbor.
  6. **`Pak Yadi.pdf` di folder akar tidak dimasukkan** — isinya #CeritaKelas
     (pengalaman Pak Oktoriyadi, SDN 10 Sengkuang Kuning), bahan artikel bukan
     bahan ajar.
  7. **Bagian produk dummy dihapus dari `seed-library-dummy.mts`** — kalau
     dibiarkan, menjalankannya akan memasukkan lagi 18 dokumen `[QA] …` yang
     justru dihapus `seed:produk-drive`, dan keduanya saling menimpa.
  8. **`LibraryCategoryChips` dapat prop `kolom`** (3/4) — 6 kartu di grid
     4 kolom menyisakan baris kedua yang timpang.

  Verifikasi: `npx tsc --noEmit` bersih; migrasi dijalankan ke DB yang dipakai
  user; `npm run seed:produk-drive` selesai 79/79 tanpa gagal, dan dijalankan
  ulang menghasilkan 0 dokumen baru (idempoten terbukti). Error
  `[revalidate] gagal menyegarkan halaman publik` di log skrip tetap noise CLI
  yang sama spt sesi sebelumnya. **Tidak dites di browser** — sesuai preferensi
  tersimpan, preview hanya dijalankan kalau user minta.

  **Catatan buat QA manual user:**
  - Alamat: `/buku-bahan-ajar-modul` (7 halaman, 79 produk) + `?topik=geometri`
    dst., dan `/buku-bahan-ajar-modul/<slug>` (+ `en/`).
  - Ikon 6 kartu topik digambar sendiri (`IkonTopikProduk.tsx`), **belum
    dicocokkan ke mockup Figma** — mockup yang ada cuma punya 4 kartu jenis.
  - Tombol unduh di halaman detail **langsung ke Drive tanpa form** — FR-104
    belum ditutup, sengaja, lihat `docs/RENCANA-INTEGRASI-DRIVE.md` §5.
  - Betulkan `jenjang` materi jenjang SMP dan isi `ringkasan` lewat dasbor
    (poin 5 di atas).

---

- **7 Sep 2026 (lanjutan) — Gerbang pendataan sebelum unduh materi gratis (FR-104)**

  Berkas baru: `src/lib/actions/unduh-materi.ts`,
  `src/components/library/UnduhMateriGate.tsx`,
  `src/components/library/TombolBagikan.tsx`,
  `migrations/20260907_061904_leads_email_opsional.ts`.
  Diubah: `src/payload/collections/Leads.ts`, `src/lib/produk.ts`,
  `src/components/pages/ProdukDetailContent.tsx`,
  `docs/RENCANA-INTEGRASI-DRIVE.md`.

  Alur baru di halaman detail materi gratis: isi nama + asal instansi (kontak
  opsional) → data masuk koleksi `leads` (`jenis: "unduhan-materi"`,
  `produkRef` terisi) → tombol Unduh + Pratinjau muncul, ditemani CTA donasi
  dan tombol berbagi.

  Keputusan yang diambil di tempat:
  1. **Berkas Drive tetap publik, gerbangnya longgar — pilihan sadar user.**
     Ditukar dengan tidak perlu memelihara kredensial Google sama sekali. Yang
     dicegah gerbang ini cuma pengambilan tanpa sengaja, bukan penyalahgunaan.
     Batasnya ditulis panjang di `unduh-materi.ts` supaya tidak ada yang
     mengira ini gerbang beneran.
  2. **`ProdukView.tautanDrive` diganti `punyaTautan: boolean`.** Kalau URL-nya
     tetap ada di tipe view, cepat atau lambat ada yang me-render-nya dan
     gerbangnya jadi tidak ada sama sekali (cukup lihat source). Sekarang
     kebocoran itu mustahil secara struktural — URL cuma dibaca di dalam server
     action.
  3. **Server action, bukan route handler.** `(payload)/api/[...slug]` sudah
     menguasai seluruh `/api/*`; menambah route di situ mengundang bentrok
     yang tidak perlu.
  4. **Data pengunjung diingat di `localStorage`, tapi tiap pembukaan tetap
     dicatat sbg lead baru.** Jadi guru tidak mengisi ulang tiap materi, tapi
     staf tetap tahu materi mana saja yang diambil — bukan cuma bahwa orangnya
     pernah mengunduh sesuatu. Konsekuensinya satu orang bisa punya banyak
     baris di Pesan Masuk; itu bentuk datanya, bukan duplikat.
  5. **`leads.email` jadi opsional** (migrasi drop NOT NULL) + `validate` yang
     tetap mewajibkannya untuk `jenis: "kontak"`. `required` di Payload tidak
     bisa bersyarat, jadi penegakannya dipindah ke validate. Kontak yang
     mengandung "@" masuk ke `email`, selain itu ke `phone` — menebak begitu
     lebih ramah daripada memaksa pengunjung memilih jenis kontaknya.
  6. **Tombol berbagi menyebarkan alamat halaman materi, bukan tautan Drive.**
     Penerima ikut mendarat di halaman yang punya formulir + CTA donasi, jadi
     berbagi tidak jadi jalan pintas.
  7. **Instagram tidak dibuatkan tombol** — tidak ada alamat berbagi yang bisa
     mengisi caption dari luar aplikasi. Opsi share sheet HP (`navigator.share`)
     ditawarkan dan **ditolak user**; yang dipakai WhatsApp + Facebook + Salin
     tautan.
  8. **CTA donasi memakai tombol CTA global Navigasi**, bukan tautan donasi
     terpisah — supaya alamat donasi cuma diatur di satu tempat.
  9. **Tautan tidak dibuka otomatis (`window.open`) sesudah formulir dikirim** —
     pemblokir popup hampir pasti menahannya karena pembukaan terjadi setelah
     `await`. Yang muncul tombol Unduh/Pratinjau untuk diklik. Satu klik ekstra,
     tapi tidak pernah gagal diam-diam.

  Verifikasi: `npx tsc --noEmit` bersih, `npm run build` sukses. Aturan lead
  diuji langsung ke DB: unduhan tanpa email **diterima**, unduhan dengan nomor
  HP **diterima** (masuk kolom `phone`), pesan Hubungi Kami tanpa email
  **ditolak** ("Isian berikut tidak valid: Email"); dokumen ujinya dihapus lagi.
  **Alur di browser belum dicoba** — sesuai preferensi tersimpan, preview hanya
  dijalankan kalau user minta.

  **Catatan buat QA manual user:**
  - Buka `/buku-bahan-ajar-modul/<slug>` mana pun → harusnya muncul formulir,
    bukan tombol unduh. Sesudah diisi: tombol Unduh + Pratinjau + kartu donasi
    + tombol berbagi. Muat ulang halaman/buka materi lain → formulir diganti
    satu tombol "Unduh Gratis" + tautan kecil "Ganti data".
  - Cek Pesan Masuk di dasbor: tiap pembukaan menambah satu baris berjenis
    "Unduhan Materi" dengan kolom "Materi yang diunduh" terisi.
  - **Pratinjau memakai iframe `drive.google.com/file/d/<id>/preview`** — ini
    bergantung pada berkasnya publik. Kalau suatu saat izin Drive diperketat,
    pratinjaunya yang pertama mati.
  - **OI-107 (kepatuhan data pribadi) sekarang jadi mendesak** — datanya sudah
    benar-benar masuk, kebijakan retensi/ekspornya masih belum ada.

- **7 Sep 2026 (lanjutan 2) — Video Pembelajaran: dummy diganti 7 video asli + pencarian dibikin lebih pintar**

  **Data.** 18 dokumen dummy "[QA] Video Pembelajaran …" diganti isi Sheet
  "Konten Youtube - Website" (milik admin@gernastastaka.org, kolom
  no/Judul/Link/Deskripsi) lewat `npm run seed:video-youtube`
  (scripts/seed-video-pembelajaran-youtube.mts). Thumbnail diunduh dari
  `i.ytimg.com` (turun bertahap maxres → sd → hq) dan diunggah jadi dokumen
  Media dengan `legacyPath: youtube:<id>`, jadi skrip aman diulang. Blok dummy
  video di `seed-library-dummy.mts` dihapus supaya kedua skrip tidak saling
  menimpa — skrip itu sekarang tinggal mengisi `alat-peraga`.

  **Hasil: 6 dari 7 baris masuk.** Baris ke-7 Sheet, "Faktor Bilangan
  Terbesar" (`https://youtu.be/3Z3ZUwjF338`), **tautannya mati** — semua
  varian thumbnail balas 404 dan oEmbed balas 403, artinya videonya
  dihapus/diprivatkan atau id-nya salah ketik di Sheet. 6 id lain sudah
  diverifikasi lewat oEmbed: judul & kanal (Gernas Tastaka) cocok persis.
  Perbaiki tautannya di Sheet lalu jalankan ulang skripnya; dokumen yang sudah
  ada akan diperbarui, bukan diduplikasi.

  Keputusan isi: `jenjang` tidak ada di Sheet → semua diisi `["sd"]` (topiknya
  KPK/FPB/faktor/pecahan/nilai tempat) dan bisa dikoreksi staf per video.
  Baris "Bernalar-Kontekstual-Sederhana-Mendasar" di ekor sebagian deskripsi
  tidak ikut dimasukkan — itu tag pilar, bukan kalimat, dan koleksi ini belum
  punya field `tags`. "Kepekaan Menjumlah Pecahan" memang kosong deskripsinya
  di Sheet; dibiarkan kosong, tidak dikarang.

  **Pencarian.** `buildLibraryWhere()` di `src/lib/library.ts` dulu cuma
  `judul contains <seluruh kalimat>` — mengetik dua kata atau kata yang cuma
  ada di deskripsi selalu nihil. Sekarang: `q` dipecah jadi kata (huruf kecil,
  tanpa tanda baca, kata 1 huruf dibuang, maks 6 kata), tiap kata jadi satu
  klausa `or` lintas kolom teks, lalu digabung `and` antar kata. Kolom yang
  dicari ditentukan pemanggil lewat `fields` (lihat §2.2). Kata yang kebetulan
  nama jenjang/mapel ("sd", "smp", "numerasi", "literasi", …) ikut dicocokkan
  ke field `jenjang`/`mapel`. `media-interaktif` tetap punya `where` sendiri
  (tak punya jenjang/mapel) tapi memakai pemecah kata yang sama, jadi perilaku
  4 kotak pencarian seragam.

  Verifikasi langsung ke DB (`npx tsc --noEmit` bersih, `npm run build`
  sukses): `q=pizza` → 1 video (kata itu cuma ada di deskripsi Pecahan
  Campuran, sebelumnya 0), `q=PECAHAN campuran` → 1, `q=kpk` → 1,
  `q=sd matematika` → 6, `q=kpk pizza` → 0 (AND bekerja), `q=telur dadar` → 1
  di Media Interaktif, `q=pecahan` → 10 di Buku/Bahan Ajar/Modul.

  Catatan: judul/deskripsi versi EN masih jatuh ke teks Indonesia (fallback) —
  terjemahannya lewat `npm run translate:export`/`import` seperti biasa.
  Preview browser tidak dijalankan, sesuai preferensi tersimpan.

- **7 Sep 2026 (lanjutan 3) — "Video Pilihan" diubah ke bentuk sorotan sesuai mockup baru**

  Mockup baru halaman Video Pembelajaran memperlihatkan blok "Video Pilihan"
  sbg **satu video sorotan per geseran**: thumbnail besar di kiri, lalu judul,
  baris tag, deskripsi, dan tombol "Tonton Video" di kanan, dengan tombol
  panah bulat di tepi. Sebelumnya blok itu berisi 3 kartu kecil yang bentuknya
  sama persis dengan grid "Semua Video" di bawahnya — jadi dua blok itu tampak
  kembar. `VideoPilihanCarousel` ditulis ulang; `VideoPembelajaranCard` tidak
  disentuh dan tetap dipakai grid (bentuknya sudah sesuai mockup).

  Mekanisme gesernya tetap `scrollBy` + scroll-snap, sekarang satu slide =
  satu lebar trek, jadi sapuan jari di HP ikut jalan tanpa kode tambahan.
  Panah muncul dari `sm` ke atas dan disembunyikan (`invisible`, bukan
  dilepas) di ujung trek supaya lebar trek tidak melompat.

  Keputusan: chip pertama di mockup berbunyi "Pembelajaran" sedangkan koleksi
  ini tidak punya field kategori/tag — jadi chip itu **teks tetap** di
  komponen ("Learning" untuk EN), sementara chip jenjang/mapel setelahnya
  tetap dari data. Kalau nanti staf mau mengatur label itu per video, koleksi
  ini butuh field `tags` seperti `media-interaktif`.

  Verifikasi: `npx tsc --noEmit` bersih, `npm run build` sukses. Tampilan di
  browser belum dicek, sesuai preferensi tersimpan (preview cuma kalau diminta).

- **7 Sep 2026 (lanjutan 4) — Banner "Belum menemukan yang anda cari?" pakai ilustrasi CS**

  Referensi baru dari user: kartu navy dengan ilustrasi CS menempel di tepi
  kiri bawah, teks di tengah, tombol garis-putih di kanan. `CtaBantuanBanner`
  disesuaikan — ilustrasinya `absolute bottom-0` + `object-bottom` supaya
  kakinya selalu rata dasar kartu berapa pun tinggi teksnya, dan `hidden`
  di bawah `lg` karena di layar sempit ia mendesak teks (dekoratif, `alt=""`).

  Berkasnya statis di `public/ilustrasi/cs-bantuan.png` (313×313, PNG
  transparan), bukan dokumen Media — banner ini memang tidak diatur dari CMS.

  Komponen ini dipakai 8 halaman sekaligus (4 daftar + 4 detail Library), jadi
  satu perubahan berlaku untuk Buku/Bahan Ajar/Modul, Video Pembelajaran,
  Media Interaktif, dan Alat Peraga.

  Yang **belum** ikut referensi: ikon tombolnya masih gelembung obrolan, bukan
  logo WhatsApp, karena nomor WhatsApp resmi belum ada di SiteSettings maupun
  kode — tombolnya masih mendarat di halaman Mitra. Begitu nomornya turun,
  ganti `href` jadi `wa.me/<nomor>` sekalian ikonnya.

  Verifikasi: `npx tsc --noEmit` bersih, `npm run build` sukses. Tampilan di
  browser belum dicek, sesuai preferensi tersimpan.

- **7 Sep 2026 (lanjutan 5) — Katalog Media Interaktif diisi VM Numerasi asli; kartu jadi grid; halaman detail dicoba lalu dibatalkan**

  Koleksi `media-interaktif` (18 dokumen dummy `[QA] …`) diisi 20 dokumen
  asli dari Repositori Mesin Virtual Numerasi (`prpic.id/vmnumerasi`) lewat
  skrip baru `scripts/seed-media-interaktif-vm.mts` (pola sama
  `seed-produk-drive.mts`: hapus dummy, unduh sampul tiap VM ke Media, lalu
  create/update per dokumen dikenali dari `tautan`). `seed-library-dummy.mts`
  tidak lagi mengisi dummy koleksi ini (menyusul pola yang sudah dipakai utk
  `produk`).

  `MediaInteraktifCard` diubah dari baris horizontal (mockup Fase 2 lama) jadi
  kartu grid selaras `ProdukCard` (sampul atas, judul, deskripsi, tag), dan
  `MediaInteraktifListContent` ikut dirender grid (`sm:grid-cols-2
  lg:grid-cols-4`), bukan `divide-y`.

  Sempat dicoba: field `kontenHtml` (`type: "code"`, HTML) + `slug` di koleksi
  ini, plus halaman detail `/media-interaktif/[slug]` yang menyematkan VM-nya
  langsung lewat `<iframe srcDoc>` (`sandbox="allow-scripts"`, tanpa
  `allow-same-origin`) — skrip seed di atas ikut mengunduh HTML tiap VM,
  membuang skrip analitik Cloudflare bawaannya, dan mengabsolutkan alamat aset
  relatif (`assets/...` → `https://prpic.id/vmnumerasi/assets/...`).
  **Dibatalkan** setelah diriviu: kartunya harus langsung membuka tautan
  eksternal saat diklik, bukan ke halaman detail. Halaman detail,
  `MediaInteraktifDetailContent`, dan `MediaInteraktifPlayer` dihapus lagi.

  Keputusan: field `kontenHtml` + `slug` (dan 20 dokumennya yang sudah
  terisi lengkap) **dibiarkan tersimpan** di koleksi — tidak dipakai front-end
  mana pun sekarang, siap dipakai kalau/ketika halaman detailnya dibangun
  ulang nanti tanpa perlu migrasi baru.

  Catatan migrasi: migrasi `20260907_151825_media_interaktif_html_slug`
  sempat punya bug — `\s` di dalam template literal JS ke-eat jadi huruf `s`
  biasa (bukan whitespace) sebelum sampai ke SQL, jadi backfill slug pertama
  salah (mis. "Pasang Keramik" → `pa-angkeramik`). Sudah diperbaiki di file
  migrasinya (`\\s`) dan 20 baris datanya dikoreksi ulang lewat Local API.
  Kalau menulis regex dgn class shorthand (`\s`, `\d`, dst.) di dalam
  `sql\`...\`` tagged template, selalu escape ganda.

  Verifikasi: `npx tsc --noEmit` bersih. Tampilan di browser belum dicek,
  sesuai preferensi tersimpan.

- **15 Sep 2026** — Perencanaan ulang §4.5, tanpa kode. User menunjukkan
  mockup lengkap (hero "Cari Kebutuhan Anda!", intro 2 kolom, Produk Terbaru
  + "Mengapa Guru Memilih", Perangkat Pembelajaran + panel statistik,
  Acara Terdekat, Bergabung dengan Komunitas, Tentang Gernas Tastaka) dan
  mengusulkan segmen khusus guru dgn landing page sendiri di navbar,
  mencakup 4 halaman Library + Jadwal Acara di `/belajar-bersama`.

  Keputusan user: nama **"Pojok Guru"** (`/pojok-guru`); pencarian hero
  **lintas koleksi** di `/pojok-guru/cari` (opsi A, bukan sekadar diarahkan
  ke `/buku-bahan-ajar-modul?q=`); poin "Mengapa Guru Memilih" **umum**;
  tujuan tombol "Gabung Sekarang" komunitas **belum diketahui**.

  Keputusan yang diambil sbg rekomendasi (belum dibantah user): halaman
  CMS bukan route kode; URL katalog tetap datar; beranda utama cukup 1
  teaser; koleksi `acara` jadi sumber tunggal. Nama "Ruang Guru" sengaja
  dihindari krn bentrok merek Ruangguru.

  Koreksi atas rencana 24 Agu: klaim "3 dari 5 elemen cukup reuse
  `featureCards`/`statCounter`/`ctaBanner`" tidak berlaku utk mockup ini —
  4 kartu + panel navy statistik & CTA adalah satu tata letak gabung, jadi
  butuh blok baru `perangkatGuru`. "Acara Terdekat" yg dulu di luar scope
  (OI-109) kini bisa digarap krn koleksi `acara` sudah ada (commit
  `9568de1`). §3 baris 5 dipecah jadi 5A–5F, §4.5 ditulis ulang.

  Catatan dokumen basi yang ditemukan sesi ini: centang FR-104 di §4.4
  masih kosong padahal gerbang unduhan sudah jadi (`635cccb`, lalu jadi
  pop-up di `f3cb608`).

- **15 Sep 2026** — Sesi 5A Pojok Guru selesai. Rincian di checklist 5A §4.5.
  File baru: `src/components/library/Breadcrumb.tsx`,
  `scripts/seed-pojok-guru.mts` (`npm run seed:pojok-guru`, idempoten),
  migrasi `20260915_123730_pojok_guru_navigasi` (aditif: 18 nilai enum preset,
  kolom `navigation_items.sorot`, kolom `anchor` di `pages_blocks_jadwal_acara`
  & versinya — sudah dijalankan ke DB asli). Diubah: `Navbar.tsx`,
  `Navigation.ts`, `nav.ts`, `navigation.ts`, `routes.ts`, `koleksi.ts`,
  `RenderBlocks.tsx`, `sitemap.ts`, `seed-pages.mts`, 7 komponen katalog.
  `npx tsc --noEmit` bersih.

  Keputusan di tempat: menu Pojok Guru di posisi ke-2 (setelah Beranda) dgn
  latar kuning muda — cukup menonjol tanpa menyaingi tombol Donasi merah;
  menu aktif = menu pertama yang memuat halaman ini (/mitra ada di dua menu);
  tautan ber-anchor tidak ikut menentukan menu aktif; breadcrumb menggantikan
  tautan "Kembali" di halaman detail (isinya sudah memuat tautan katalog).

  **Insiden (sudah pulih):** versi pertama skrip menulis `layout` beranda
  lewat `payload.update({ locale: "all" })` — ternyata tetap menghapus 29
  baris terjemahan Inggris beranda. Jaring pengaman skrip mendeteksinya, tapi
  tulis-balik lewat API tidak memulihkan. EN dipulihkan dengan INSERT SQL ke
  `pages_blocks_*_locales` dari cadangan JSON; diff terhadap cadangan = 0.
  Skrip lalu diubah: sisip blok & penanda lewat SQL. Memory
  `payload_blocks_update_wipes_locale` diperbarui. Versi 31–32 beranda di tab
  Versions dasbor adalah jejak insiden ini (isi sama, tanpa EN seperti semua
  versi lain) — jangan di-restore.

- **15 Sep 2026** — Sesi 5B Pojok Guru selesai: blok Hero Pencarian + halaman
  hasil `/pojok-guru/cari` lintas 4 katalog. Rincian di checklist 5B §4.5.
  File baru: `PencarianCepat.tsx`, `PencarianGuruContent.tsx`,
  `src/lib/pencarianGuru.ts`, 2 route `pojok-guru/cari`, ikon blok, migrasi
  `20260915_125414_pojok_guru_pencarian`. Diubah: `hero.ts`, `blocks/index.ts`,
  `LibrarySearchBar.tsx`, `RenderBlocks.tsx`, `routes.ts`
  (`pojokGuruCariPath`), `seed-pojok-guru.mts`. `npx tsc --noEmit` bersih.
  Diuji tanpa browser: `tsx --conditions=react-server` memanggil
  `cariPerangkatGuru` langsung ke DB asli (hasil ID sesuai, EN nihil — bug di
  checklist 5B).

  Keputusan di tempat: pencarian memakai ulang fungsi daftar katalog alih-alih
  query gabungan sendiri (konsistensi jumlah > hemat 4 query); halaman hasil
  `noindex`; jumlah kartu per grup = satu baris grid katalog aslinya; kata
  kunci EN di tag populer tetap kata Indonesia karena isi materi berbahasa
  Indonesia.

  **Posisi terakhir:** 5A & 5B selesai (belum dicek visual di browser).
  Berikutnya **5C** — intro 2 kolom + blok `produkSorotan`. Sebelum 5C
  sebaiknya perbaiki dulu bug pencarian `/en` (checklist 5B), karena tag
  populer `/en/pojok-guru` sekarang menuju hasil kosong.

- **15 Sep 2026** — Bug pencarian `/en` diperbaiki (checklist 5B). Akar
  masalah: `where` Payload tidak ikut `fallbackLocale`, jadi di `/en` hanya
  kolom EN (kosong) yang dicari. Perbaikan di satu tempat, `src/lib/library.ts`:
  field localized juga dicocokkan ke kolom `id` lewat path `judul.id` bila
  locale bukan `id`. Pemanggil (`produk.ts`, `alatPeraga.ts`,
  `videoPembelajaran.ts`, `mediaInteraktif.ts`) menyebut field mana yang
  localized — `penulis` (Produk) tidak, dan path `penulis.id` tidak sah.
  Filter tag Media Interaktif ikut diperbaiki. Tanpa migrasi. `npx tsc
  --noEmit` bersih; diuji dengan skrip sementara ke DB asli (ID = EN di semua
  kata uji, lihat checklist).

  **Posisi terakhir:** 5A, 5B, dan bug `/en` selesai. Berikutnya **5C**.

- **16 Sep 2026** — Sesi 5C Pojok Guru selesai: blok Pembuka 2 Kolom
  (`introDuaKolom`) + Produk Sorotan (`produkSorotan`), sesuai mockup section
  "Tumbuh Bersama…" dan "Produk Terbaru + Mengapa Guru Memilih…". Rincian di
  checklist 5C §4.5. File baru: `IntroDuaKolom.tsx`,
  `library/ProdukSorotan.tsx`, `library/DaftarFormat.tsx` (dipecah dari
  `ProdukTerbaru`), 2 ikon blok, migrasi `20260915_170426_pojok_guru_intro_produk`.
  Diubah: `konten.ts`, `koleksi.ts`, `blocks/index.ts`, `RenderBlocks.tsx`,
  `produk.ts` (`getProdukById`), `ProdukTerbaru.tsx`, `seed-pojok-guru.mts`
  (syarat buat ulang kini "belum ada blok `introDuaKolom` & masih 1 versi").
  `npx tsc --noEmit` bersih. Diuji tanpa browser: `getPageBySlug` di `id` & `en`
  mengembalikan 5 blok dengan teks kedua bahasa; Produk Sorotan otomatis
  "Bangun Datar Di Mana-Mana". Review Web Interface Guidelines: judul diberi
  `text-wrap: balance` + `break-words`; sisanya lolos.

  Keputusan di tempat: kalimat sorotan jadi field blok (Produk tak punya
  subjudul, menambah field koleksi = 79 dokumen kosong); relasi produk yang
  terhapus jatuh ke "Produk Terbaru" alih-alih menyembunyikan blok; judul
  panel alasan `<h2>` karena topiknya sejajar, bukan anak "Produk Terbaru".

  **Posisi terakhir:** 5A–5C selesai (belum dicek visual di browser). Poin
  alasan "cetak & digital" / "harga terjangkau" menunggu konfirmasi tim konten.
  Berikutnya **5D** — blok `perangkatGuru`.

- **16 Sep 2026** — Sesi 5D Pojok Guru selesai: blok Perangkat Guru
  (`perangkatGuru`) sesuai mockup "Perangkat Pembelajaran untuk Guru" + panel
  navy. Rincian di checklist 5D §4.5. Sebelum mulai, user menjawab pertanyaan
  terbuka 5D–5F (dicatat di §4.5.0 dan kepala tiap sesi).
  File baru: `src/lib/perangkatGuru.ts`, `library/PerangkatGuru.tsx`, ikon
  blok, migrasi `20260915_172457_pojok_guru_perangkat`. Diubah: `koleksi.ts`,
  `blocks/index.ts`, `RenderBlocks.tsx`, `payload-types.ts`,
  `seed-pojok-guru.mts` (syarat buat ulang kini "belum ada blok
  `perangkatGuru` & masih 1 versi"; `featureCards` sementara diganti).
  `npx tsc --noEmit` bersih.

  Keputusan di tempat: angka panel dihitung dari koleksi, bukan diketik (tidak
  pernah basi, sesuai "jangan dikarang"); kartu memilih katalog, bukan tautan
  bebas, supaya tujuan, nama bawaan, dan gambar bawaan selalu cocok; baris
  angka Alat Peraga tidak diisi selama isinya dummy `[QA]`.

  **Posisi terakhir:** 5A–5D selesai (belum dicek visual di browser, belum
  commit). Berikutnya **5E** — Acara Terdekat dengan isian acara terbaru saat
  tidak ada yang mendatang.

- **16 Sep 2026** — Sesi 5E Pojok Guru selesai: blok Jadwal Acara punya
  tampilan Geser untuk "Acara Terdekat". Rincian di checklist 5E §4.5.
  Migrasi `20260915_173330_pojok_guru_acara`. Diubah: `koleksi.ts`,
  `JadwalAcara.tsx` (+ `DeretAcara`, prop `ringkas` di kartu),
  `RenderBlocks.tsx`, `payload-types.ts`, `seed-pojok-guru.mts` (syarat buat
  ulang kini "belum ada blok `jadwalAcara` & masih 1 versi"; `callout`
  sementara diganti). `npx tsc --noEmit` bersih.

  Keputusan di tempat: tidak menambah opsi urutan — urutan yang ada sudah
  memenuhi keputusan user; Geser tanpa poster (mockup memakai kartu ringkas,
  poster 4:5 membuat baris terlalu tinggi); tautan "Lihat semua" hanya untuk
  Geser, Grid tetap memakai tombol buka-tutupnya.

  **Posisi terakhir:** 5A–5E selesai (belum dicek visual, belum commit).
  Berikutnya **5F** — Komunitas + Tentang ringkas; tombol Gabung →
  `/mitra#hubungi`, tanpa jumlah anggota.

- **16 Sep 2026** — Sesi 5F Pojok Guru selesai: blok Kartu Komunitas
  (`komunitas`) dan Tentang Ringkas + Fakta (`tentangRingkas`). Rincian di
  checklist 5F §4.5. File baru: `Komunitas.tsx`, `TentangRingkas.tsx`, 2 ikon
  blok, migrasi `20260915_173930_pojok_guru_komunitas`. Diubah: `konten.ts`,
  `shared.ts` (`ikonLengkapOptions`), `ikon.tsx` (+4 ikon), `blocks/index.ts`,
  `RenderBlocks.tsx`, `payload-types.ts`, `seed-pojok-guru.mts`. `npx tsc
  --noEmit` bersih.

  Keputusan di tempat: fakta Tentang memakai data situs, bukan mockup (tahun
  2017 vs 2018 di linimasa); daftar ikon diperluas tanpa menyentuh enum Kartu
  Kegiatan; komunitas tanpa field jumlah anggota sama sekali (bukan field
  kosong) supaya staf tidak tergoda mengisi angka tanpa sumber.

  5D–5F di-commit & di-push ke `preview` bersama dalam satu commit.

  **Posisi terakhir:** §4.5 Pojok Guru 5A–5F **selesai secara kode**, belum
  ada satu pun yang dicek visual di browser. Sisa: cek browser (terutama
  navbar `lg`, deret acara, panel navy), konfirmasi tim konten (poin alasan
  cetak/harga, tahun berdiri, judul "Acara Terdekat" saat semua acara lewat),
  aset ilustrasi, housekeeping dummy `[QA]` Alat Peraga (§6).


- **22 Sep 2026** — **Halaman Alat Peraga dihapus, digabung ke Buku, Bahan
  Ajar & Modul** (keputusan user). Alat peraga kini dokumen koleksi `produk`
  dengan `kategoriProduk: "alat-peraga"`, tampil di `/buku-bahan-ajar-modul`
  dan detailnya di `/buku-bahan-ajar-modul/[slug]`. URL `/alat-peraga` dibiarkan
  404 tanpa redirect (belum rilis produksi).

  Perilaku khusus Jenis materi Alat Peraga (cuma dipamerkan): di dasbor field
  Format/Status/Harga/Tautan Drive disembunyikan; di kartu, format+harga diganti
  label "Alat Peraga"; di detail, harga/format/tombol unduh-beli tidak tampil;
  Produk Terbaru melewati alat peraga; Produk Sorotan menyembunyikan format &
  tombol unduh bila staf memilih alat peraga.

  Dihapus: koleksi `AlatPeraga`, route `alat-peraga` (+`en/`), `AlatPeragaCard`,
  `IkonAlatPeraga`, `AlatPeragaListContent`, `AlatPeragaDetailContent`,
  `lib/alatPeraga.ts`, path di `routes.ts`, opsi `alatPeraga` di blok Perangkat
  Guru (kartu & sumber angka), opsi `/alat-peraga` di rute tetap navigasi,
  kelompok alat peraga di `/pojok-guru/cari`, dan `scripts/seed-library-dummy.mts`
  (+ `npm run seed:library-dummy`) yang isinya tinggal dummy alat peraga.

  Migrasi `20260922_085826_hapus_alat_peraga` (sudah dijalankan ke DB dev):
  diawali pembersihan data (hapus submenu "Alat Peraga" di menu Pojok Guru,
  hapus kartu `alatPeraga` di blok Perangkat Guru halaman Pojok Guru termasuk
  versinya), lalu drop 7 tabel `alat_peraga*` (18 dokumen dummy `[QA]`),
  tambah enum `alat-peraga`, `produk.status` jadi nullable. `DROP CONSTRAINT`/
  `DROP INDEX` hasil generate diberi `IF EXISTS` karena sudah ikut terhapus
  `DROP TABLE … CASCADE`. `seed-pojok-guru.mts` ikut disinkronkan.

  Akibat yang perlu diketahui: blok Perangkat Guru di Pojok Guru kini 3 kartu
  (bukan 2×2 penuh). Temuan QA #4 (isi detail alat peraga) gugur; alat peraga
  memakai detail produk apa adanya (tanpa galeri foto & isi paket seperti
  koleksi lama). `npx tsc --noEmit` bersih. **Tidak dicek di browser.**

- **22 Sep 2026 (lanjutan)** — Kartu filter "Alat Peraga" ditambahkan di
  halaman Buku, Bahan Ajar & Modul: kartu ke-7 setelah 6 topik, menuju
  `?kategori=alat-peraga`, ikon dari `IkonKategoriProduk` (sebelumnya tidak
  terpakai). Grid kartu jadi 4 kolom (4 + 3, sebelumnya 3 kolom), judul
  bagian "Jelajahi Berdasarkan Topik" diganti "Jelajahi Berdasarkan Kategori"
  (EN "Browse by Category") karena alat peraga bukan topik. Diubah:
  `ProdukListContent.tsx`, komentar `LibraryCategoryChips.tsx`. `npx tsc
  --noEmit` bersih. **Tidak dicek di browser.**

- **22 Sep 2026 (lanjutan 2)** — Kotak "Alat Peraga" di blok Perangkat Guru
  (Pojok Guru) **dikembalikan** atas permintaan user, supaya tetap 2×2. Katalog
  `alatPeraga` hidup lagi di `KatalogGuru`, tapi sumbernya koleksi `produk`
  dengan `kategoriProduk = alat-peraga` dan tautannya
  `/buku-bahan-ajar-modul?kategori=alat-peraga`. Kartu/angka "Buku, Bahan Ajar
  & Modul" kini tidak menghitung alat peraga (angka "semua materi" tidak
  dobel). Migrasi `20260922_121534_kartu_alat_peraga_pojok_guru` cuma menambah
  lagi nilai enum `alatPeraga`; baris kartunya (ID+EN, tabel utama & versi)
  dikembalikan lewat SQL dari backup — tidak bisa di dalam migrasi karena nilai
  enum baru tidak boleh dipakai di transaksi yang sama. `seed-pojok-guru.mts`
  disinkronkan. Kartu tampil tanpa gambar sampai ada produk alat peraga (atau
  staf unggah gambar kartu). `npx tsc --noEmit` bersih. Belum dicek di browser.
