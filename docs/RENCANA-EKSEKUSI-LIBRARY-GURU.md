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
5. **Integrasi Beranda** (§4.5) — dikerjakan **terakhir**, setelah minimal 1 halaman Library sudah punya route nyata untuk ditautkan. Ini bukan FR baru di PRD v1.2, ditambahkan 24 Agu 2026 setelah review mockup beranda terpisah (lihat §5).

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
| `q` | Kata kunci, cari di `judul` (contains, case-insensitive) | `?q=pecahan` |
| `jenjang` | Filter jenjang, bisa banyak dipisah koma | `?jenjang=sd,smp` |
| `mapel` | Filter mapel/program | `?mapel=matematika` |
| `kategori` | Cuma dipakai di Buku/Bahan Ajar/Modul (`kategoriProduk`) | `?kategori=modul` |
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
| 1 | Alat Peraga | Selesai | 24 Agu 2026 |
| 2 | Media Digital Interaktif | Belum | — |
| 3 | Video Pembelajaran | Belum | — |
| 4 | Buku, Bahan Ajar & Modul | Belum | — |
| 5 | Integrasi Beranda (§4.5) | Belum | — |

## 4. Task per Halaman

### 4.1 Alat Peraga (`FR-106`) — Selesai

- [x] Route `alat-peraga/page.tsx` (+ versi `en/`)
- [x] Bangun komponen bersama §2.3 (sekali, dipakai ulang)
- [x] Hero: judul, deskripsi, `LibrarySearchBar` — **tanpa gambar promo**, lihat catatan §5 (belum ada aset gambar, disusulkan)
- [x] `LibraryCategoryChips`: 2 kartu (Gernas Tastaka / Gernas Tastaba) — dikonfirmasi field asli `mapel`, href `?mapel=matematika` / `?mapel=membaca`
- [x] Grid `AlatPeragaCard` dari `payload.find({ collection: "alat-peraga", where, limit: 12, page })`
- [x] `LibraryPagination` + teks "Menampilkan X–Y dari Z produk"
- [x] `CtaBantuanBanner`
- [x] `generateMetadata` — statis (title/description manual), koleksi ini tidak ikut `seoPlugin` (cuma `pages`/`articles`), lihat `src/payload.config.ts`
- [x] Halaman detail: **route terpisah** `alat-peraga/[slug]/page.tsx` (+ `en/`) — diputuskan di tempat krn tidak ada akses ke mockup asli di sesi ini; route nyata lebih aman utk SEO/share drpd modal. Boleh dikoreksi ke modal nanti kalau mockup ternyata beda.

### 4.2 Media Digital Interaktif (`FR-108`)

- [ ] Route `media-interaktif/page.tsx` (+ `en/`)
- [ ] Hero + 4 ikon fitur (Interaktif/Mudah Digunakan/Sesuai Kurikulum/Aman & Terpercaya) — ini statis (bukan dari collection), taruh sbg konten halaman biasa
- [ ] `LibrarySearchBar` + "Pencarian Populer" (tag pintas — bisa hardcode atau ambil 3 tag terbanyak dari data, putuskan pas coding & catat di §5)
- [ ] List `MediaInteraktifCard` (bukan grid — mockup-nya list horizontal per baris)
- [ ] `CtaBantuanBanner`
- [ ] Section "Bergabung dengan Komunitas" di bawah — **cek dulu apakah ini statis punya semua 4 halaman atau cuma di sini**; kalau berulang, jadikan komponen bersama juga & update §2.3

### 4.3 Video Pembelajaran (`FR-107`)

- [ ] Route `video-pembelajaran/page.tsx` (+ `en/`)
- [ ] Ambil keputusan OI-106 kalau belum ada arahan baru (lihat §2.4)
- [ ] Grid `VideoPembelajaranCard`, filter jenjang/mapel + search
- [ ] `LibraryPagination`, `CtaBantuanBanner`

### 4.4 Buku, Bahan Ajar & Modul (`FR-101–104`, `FR-109`; **FR-110 blocked**)

- [ ] Route `buku-bahan-ajar-modul/page.tsx` (+ `en/`)
- [ ] Section "Produk Terbaru" (featured, 1 produk manual/pinned — cek apakah butuh field `unggulan: checkbox` baru di `Produk.ts`, atau cukup ambil produk `urutan` terkecil)
- [ ] `LibraryCategoryChips` 4 kartu: Modul/Buku/Bahan Ajar/LKS → href `?kategori=...`
- [ ] Grid `ProdukCard` — tampilkan `format` (gabungan label), `status`/`harga` ("Gratis" atau "Rp20.000")
- [ ] Tombol "Beli Sekarang" → **jangan bangun checkout**, arahkan ke fallback (lihat §2.4)
- [ ] Alur unduh gratis (FR-104): klik unduh → form gated (nama + `asalInstansi`) → submit ke `leads` (`jenis: "unduhan-materi"`, `produkRef`) → baru tampilkan `tautanDrive`. **Ini bagian paling besar di halaman ini**, mungkin perlu dipecah jadi sesi sendiri kalau kepanjangan (update tracker jadi `Sebagian` kalau begitu).
- [ ] `LibraryPagination` (mockup nunjukin sampai 68 halaman, pastikan pagination-nya handle angka besar dgn elipsis "...")
- [ ] `CtaBantuanBanner`

### 4.5 Integrasi Beranda

> Ditambahkan 24 Agu 2026: mockup beranda ("Cari Kebutuhan Anda!", "Perangkat
> Pembelajaran untuk Guru", stat counter, "Acara Terdekat", "Bergabung
> dengan Komunitas") sempat tidak masuk rencana awal — cuma 4 halaman
> katalog yang direncanakan, bukan perubahan beranda. Dikerjakan terakhir
> karena butuh route Library sungguhan buat ditautkan.

Sebelum coding apa pun di sini, cek dulu isi blok beranda saat ini di
dasbor (`Halaman` → `beranda`) — kemungkinan sudah berubah sejak baris ini
ditulis.

- [ ] **"Perangkat Pembelajaran untuk Guru" (4 kartu)** — **tidak perlu block baru.** Pakai block `featureCards` yang sudah ada (`src/payload/blocks/konten.ts`, field `cards[].warna` + `ctaField()` sudah pas buat 4 kartu warna beda + tombol "Lihat Produk →"). Tambahkan instance block ini di beranda lewat dasbor, isi `cta.href` ke 4 route Library. **Blocked** sampai minimal ada 1 route Library yang hidup.
- [ ] **Stat counter (45.000+ Peserta Didik, dst.)** — **tidak perlu block baru.** Pakai `statCounter` yang sudah ada. Cek dulu apakah beranda sekarang sudah punya statCounter lain ("16.000+ Total Pendidik" dari `scripts/seed-pages.mts`) — kalau sudah ada, ini cuma ubah angka/label lewat dasbor, bukan tambah section baru.
- [ ] **CTA "Belum menemukan yang anda cari?"** — **tidak perlu block baru.** Pakai `ctaBanner` yang sudah ada.
- [ ] **Hero search "Cari Kebutuhan Anda!" + "Pencarian Populer"** — **ini genuinely baru**, tidak ada block yang cocok (`hero`/`pageHero` di `src/payload/blocks/hero.ts` tidak punya field search). Perlu block baru, mis. `pencarianCepat`: field `tagPopuler` (array teks) + reuse komponen `LibrarySearchBar` dari §2.3. Submit search dari beranda perlu tujuan — putuskan di tempat: arahkan ke halaman Library mana (kemungkinan `buku-bahan-ajar-modul` sbg default) sambil cross-collection search belum ada, catat keputusannya di sini.
- [ ] **"Acara Terdekat"** (Webinar/Pelatihan/Bincang Gernas dengan "Daftar Sekarang!") — **di luar scope**, ini OI-109 di PRD (belum ada collection Acara/Program). Jangan dikerjakan di sesi ini kecuali user eksplisit minta collection barunya dibuat dulu.
- [ ] **"Bergabung dengan Komunitas"** — cek dulu apakah section ini sudah ada di beranda/halaman lain (belum ditemukan di kode saat rencana ini ditulis). Kalau belum ada, ini juga di luar cakupan PRD Fase 2 v1.2 — catat sbg temuan baru, jangan dikerjakan diam-diam tanpa konfirmasi user.

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
