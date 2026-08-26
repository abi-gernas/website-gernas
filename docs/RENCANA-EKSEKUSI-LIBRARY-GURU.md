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
| 2 | Media Digital Interaktif | Selesai | 24 Agu 2026 |
| 3 | Video Pembelajaran | Selesai | 24 Agu 2026 |
| 4 | Buku, Bahan Ajar & Modul | Selesai (tampilan) | 26 Agu 2026 |
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

### 4.2 Media Digital Interaktif (`FR-108`) — Selesai

- [x] Route `media-interaktif/page.tsx` (+ `en/`)
- [x] Hero + 4 ikon fitur (Interaktif/Mudah Digunakan/Sesuai Kurikulum/Aman & Terpercaya) — statis, emoji sbg ikon (proyek tidak pakai icon library), lihat §5
- [x] `LibrarySearchBar` + "Pencarian Populer" — **3 tag terbanyak dihitung dari data** (`getPopularMediaInteraktifTags`), bukan hardcode; klik tag pakai param baru `?tag=` (di luar kontrak §2.2 krn koleksi ini tidak punya jenjang/mapel), lihat §5
- [x] List `MediaInteraktifCard` (bukan grid — list horizontal per baris)
- [x] `CtaBantuanBanner`
- [ ] Section "Bergabung dengan Komunitas" — **sengaja tidak dikerjakan**, belum ditemukan di kode manapun (lihat §4.5), di luar cakupan PRD Fase 2 v1.2. Perlu konfirmasi user dulu sebelum digarap.

### 4.3 Video Pembelajaran (`FR-107`) — Selesai

- [x] Route `video-pembelajaran/page.tsx` (+ `en/`)
- [x] Ambil keputusan OI-106 kalau belum ada arahan baru (lihat §2.4) — dipakai `sumberTipe: "youtube"` sbg default skema (sudah ada), tidak ada arahan baru sesi ini
- [x] Grid `VideoPembelajaranCard`, filter jenjang/mapel + search (pakai `buildLibraryWhere` kontrak §2.2 penuh, sama spt Alat Peraga)
- [x] `LibraryPagination`, `CtaBantuanBanner`

### 4.4 Buku, Bahan Ajar & Modul (`FR-101–104`, `FR-109`; **FR-110 blocked**)

- [x] Route `buku-bahan-ajar-modul/page.tsx` (+ `en/`) — plus detail `[slug]` (+ `en/`) supaya tombol "Detail" punya tujuan nyata
- [x] Section "Produk Terbaru" (featured) — **tanpa field `unggulan` baru**: dipakai produk dengan `urutan` terkecil, jadi tidak perlu ubah skema + migrasi (lihat §5)
- [x] `LibraryCategoryChips` 4 kartu: Modul/Buku/Bahan Ajar/LKS → href `?kategori=...`
- [x] Grid `ProdukCard` — tampilkan `format` (gabungan label), `status`/`harga` ("Gratis" atau "Rp20.000")
- [x] Tombol "Beli Sekarang" → **checkout tidak dibangun**, diarahkan ke `/mitra` sbg fallback "Hubungi Kami" (lihat §2.4)
- [ ] Alur unduh gratis (FR-104): klik unduh → form gated (nama + `asalInstansi`) → submit ke `leads` (`jenis: "unduhan-materi"`, `produkRef`) → baru tampilkan `tautanDrive`. **Belum dikerjakan** — sesi ini fokus tampilan/layout atas permintaan user, integrasi Drive (OI-108) ditunda. Halaman detail sementara menampilkan `tautanDrive` apa adanya tanpa form pendataan.
- [x] `LibraryPagination` (mockup nunjukin sampai 68 halaman, pastikan pagination-nya handle angka besar dgn elipsis "...")
- [x] `CtaBantuanBanner`

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
- **Alat Peraga**: layout search bar, teks "Menampilkan X dari Y", &
  `LibraryCategoryChips` belum sesuai Figma. Isi halaman detail perlu
  didiskusikan ulang.
- **Media Interaktif**: layout belum sesuai Figma. PR terbuka soal tombol
  "Buka Link" (tautan keluar vs embed) — **butuh konfirmasi klien**.
- **Video Pembelajaran**: layout belum sesuai Figma. **Keputusan baru**:
  tombol "Tonton" harus jadi halaman detail dgn video ter-embed di website
  kita, bukan redirect ke YouTube — perlu field `slug` baru + komponen
  player baru, cukup besar buat sesi tersendiri.

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
