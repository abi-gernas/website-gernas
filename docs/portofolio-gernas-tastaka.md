# Studi Kasus: Migrasi & Pembangunan Ulang Website Gernas Tastaka

**WordPress → Next.js 16 + Payload CMS, bilingual ID/EN, dasbor berbahasa Indonesia penuh**

> Dokumen ini disusun sebagai rekam jejak pengembangan untuk keperluan portofolio.
> Semua angka di dalamnya diambil langsung dari repositori (git log, isi kode,
> file migrasi) — bukan estimasi. Cara memverifikasi ulang ada di Bagian 10.

| | |
|---|---|
| **Klien** | Gernas Tastaka — organisasi nonprofit gerakan literasi & pendidikan |
| **Peran** | Pengembang tunggal (arsitektur, backend, frontend, CMS, migrasi data, dokumentasi) |
| **Periode** | 25 Juli – 4 Agustus 2026 (11 hari kalender) |
| **Jenis** | Migrasi platform + pembangunan ulang + CMS kustom |
| **Status** | Fase 1 selesai secara teknis; menunggu aksi non-koding dari klien (DNS, GSC) |

---

## 1. Ringkasan satu paragraf

Website Gernas Tastaka dipindahkan dari WordPress ke stack modern (Next.js 16 +
Payload CMS + PostgreSQL) dalam 11 hari, lengkap dengan migrasi 123 aset media,
8 halaman, dan seluruh konten organisasi. Yang membedakan proyek ini dari
"migrasi WordPress biasa": dasbor CMS-nya **berbahasa Indonesia penuh** dan
dirancang untuk staf nonprofit non-teknis, situsnya **dua bahasa (ID/EN)** dengan
pipeline terjemahan semi-otomatis yang membaca skema database sendiri, dan
halaman disusun dari **24 blok komposabel** sehingga tim konten bisa membangun
halaman baru tanpa menyentuh kode.

---

## 2. Konteks & masalah

Klien punya website WordPress yang sudah berjalan bertahun-tahun dengan masalah
klasik:

- **Konten tercampur sampah.** Export WordPress berisi 9 post, 5 di antaranya
  Lorem Ipsum, "Hello world!", dan shortcode mati dari plugin yang sudah dicopot.
- **Tim konten tidak berdaya.** Setiap perubahan tata letak butuh developer.
- **Tidak ada jalur bahasa Inggris**, padahal organisasi ini berhubungan dengan
  mitra dan donor internasional.
- **Ketergantungan hosting.** Klien ingin bisa memindahkan situs ke penyedia lain
  tanpa terkunci vendor.

Tantangan sebenarnya bukan "bikin website baru" — tapi memindahkan konten yang
hidup tanpa kehilangan peringkat pencarian, sambil menyerahkan kontrol konten ke
orang yang tidak pernah menulis satu baris kode pun.

---

## 3. Tech stack & alasan pemilihan

Bagian ini sengaja menyertakan *alasan*, bukan sekadar daftar logo.

| Lapisan | Pilihan | Alasan pemilihan |
|---|---|---|
| **Framework** | Next.js 16.2 (App Router) | Server Components + SSG untuk halaman publik yang mayoritas statis; satu codebase untuk situs publik dan dasbor admin |
| **UI** | React 19 + TypeScript (`strict: true`) | Type safety end-to-end sampai ke bentuk data CMS lewat tipe hasil generate |
| **CMS** | Payload CMS 3.86 | Berjalan *di dalam* aplikasi Next.js (bukan layanan terpisah), skema didefinisikan sebagai kode TypeScript, dan admin UI-nya bisa disisipi komponen React kustom — syarat mutlak untuk dasbor berbahasa Indonesia |
| **Database** | PostgreSQL (Supabase), via `@payloadcms/db-postgres` | Postgres standar tanpa fitur proprietary → `pg_dump`/`pg_restore` ke penyedia mana pun tetap jalan. Ini keputusan sadar demi portabilitas yang diminta klien |
| **Penyimpanan media** | Supabase Storage (S3-compatible) | Aset lepas dari filesystem server → hosting bisa pindah tanpa memindahkan gigabyte gambar |
| **Styling** | Tailwind CSS 3.4 | Token Design System dipetakan ke config; warna terpusat di satu berkas |
| **Rich text** | Lexical (`@payloadcms/richtext-lexical`) | Format JSON terstruktur — bisa ditelusuri per simpul, penting untuk pipeline terjemahan |
| **Deployment** | Vercel, region `sin1` (Singapura) | Sengaja dikunci satu benua dengan database (lihat Bagian 5.5) |
| **Plugin** | `plugin-seo`, `plugin-redirects`, `storage-s3`, `live-preview-react` | SEO parity & redirect 301 dikelola dari dasbor, bukan hardcode |

**Upgrade yang jadi prasyarat:** Payload 3.86 tidak kompatibel dengan Next 15.5.x,
sehingga proyek dinaikkan ke Next 16 + React 19 di hari pertama. Temuan ini
didokumentasikan sebelum implementasi dimulai, bukan ditemukan saat produksi.

---

## 4. Hasil yang terkuantifikasi

### 4.1 Volume pengerjaan

| Metrik | Angka |
|---|---|
| Periode pengembangan | 11 hari kalender (25 Jul – 4 Agu 2026) |
| Commit | 22 |
| Baris kode ditulis tangan (`src/` + `scripts/`) | **10.376 baris** |
| Baris migrasi database ditulis/ditambal tangan | **3.878 baris** |
| Total diff bersih (di luar berkas hasil generate & lockfile) | **~18.400 sisipan / ~2.900 penghapusan** di 314 perubahan berkas |
| Komponen React | 40 |
| Berkas migrasi database | 13 (semua reversible) |

> Catatan kejujuran angka: jumlah sisipan mentah `git log` adalah ~203.000 baris,
> tetapi mayoritasnya adalah snapshot JSON hasil generate Payload/Drizzle dan
> `package-lock.json`. Angka **~18.400** di atas sudah mengecualikan semua berkas
> hasil generate — itu angka yang benar untuk diklaim.

### 4.2 Konten yang dimigrasi

| Aset | Jumlah |
|---|---|
| Halaman publik | 8 |
| Aset media (dengan konversi WebP otomatis) | **123** |
| Profil Penggerak | 10 |
| Artikel/berita bersih | 4 (dari 9 post — 5 post sampah difilter) |
| Entri mitra | 19 |
| Entri video | 4 |
| Koleksi modul pelatihan | ✔ dimigrasi penuh |
| Halaman ter-build (ID + EN) | **29** |

### 4.3 Arsitektur CMS yang dihasilkan

| Komponen | Jumlah |
|---|---|
| Collection Payload | 9 |
| Global | 1 |
| **Blok konten komposabel** | **24** |
| Ikon pratinjau blok (SVG kustom) | 21 |
| Field ditandai `localized: true` | **72** |

### 4.4 Bilingual ID/EN

| Metrik | Angka |
|---|---|
| Nilai data diverifikasi utuh setelah migrasi localization | **374 / 374** |
| Teks diterjemahkan & diimpor ke database | 108 + 19 = **127**, dengan **0 ditolak** |
| Tabel `*_locales` ditemukan otomatis via `information_schema` | Tanpa satu pun daftar hardcode |

### 4.5 Efisiensi biaya operasional

| Optimasi | Dampak |
|---|---|
| Pemangkasan varian gambar (16 ukuran → 7) | **~50% lebih sedikit transformasi gambar** terhadap kuota Vercel |
| Cache TTL transformasi gambar | 1 detik → **1 tahun** (aset ber-hash, aman) |
| Region fungsi `sin1` vs default `iad1` | Latensi query DB turun dari **~230 ms → ~25 ms** per pulang-pergi (estimasi berbasis jarak geografis) |

Efeknya nyata: dasbor Payload menembakkan puluhan query per halaman, jadi
perbedaan region ini adalah selisih antara dasbor yang terasa responsif dan
dasbor yang terasa rusak.

---

## 5. Yang unik dari pengembangan ini

Ini bagian yang paling layak dipamerkan — hal-hal yang tidak muncul di template
atau tutorial.

### 5.1 Dasbor CMS berbahasa Indonesia penuh — bukan sekadar terjemahan menu

Payload menyediakan lokalisasi UI standar. Yang dibangun di sini lebih jauh:

- **Seluruh nama blok, field, dan deskripsi bantuan ditulis dalam bahasa
  Indonesia sehari-hari** — "Blok Kartu Berisi", "Blok Kata Mereka", "Blok Ajakan"
  — bukan istilah teknis diterjemahkan mentah.
- **21 ikon SVG pratinjau per blok**, supaya staf memilih blok berdasarkan bentuk
  visualnya, bukan menebak dari nama.
- **`PanduanDasbor.tsx`** — panduan penggunaan yang tampil langsung di dalam
  dasbor, bukan PDF terpisah yang tidak akan pernah dibuka.
- **`RowLabel.tsx`** — label baris otomatis, sehingga daftar 10 slide hero tidak
  tampil sebagai "Item 1, Item 2, Item 3…" melainkan judul slide sebenarnya.

Ini bukan permintaan tertulis di spesifikasi. Ini keputusan desain yang lahir dari
satu pertanyaan: *apakah staf yang tidak berbahasa Inggris teknis benar-benar bisa
memakai ini sendirian?*

### 5.2 `LocaleReference` — komponen kustom untuk pekerjaan penerjemahan

Masalah nyata: saat staf mengisi field bahasa Inggris di dasbor, teks Indonesianya
menghilang dari layar karena Payload menampilkan satu locale pada satu waktu.
Menerjemahkan jadi kerja membuka dua tab dan berpindah bolak-balik.

Solusinya adalah komponen React kustom yang disuntikkan ke admin UI Payload:
saat locale EN aktif, teks Indonesia dari field yang sama ditampilkan berdampingan
sebagai referensi. Komponen ini:

- Menelusuri path bertitik (`blocks.2.content`) termasuk melewati indeks array
- Meratakan dokumen Lexical richText jadi teks polos yang bisa dibaca
- Mem-*cache* fetch per dokumen supaya 30 field di satu halaman tidak memicu 30
  permintaan jaringan

194 baris kode yang menghilangkan seluruh friksi alur kerja terjemahan.

### 5.3 Menambal migrasi database yang diam-diam membuang data

Ini temuan paling teknis dari proyek ini, dan paling berharga.

Saat mengaktifkan localization di Payload, perintah `payload migrate:create`
menghasilkan SQL dari Drizzle yang polanya: `CREATE TABLE …_locales`, lalu
`DROP COLUMN` pada tabel asal — **tanpa satu pun `INSERT` yang memindahkan data
lama ke tabel baru**. Dijalankan apa adanya, seluruh konten Indonesia yang sudah
ada akan lenyap dalam senyap. Tidak ada error, tidak ada peringatan.

Yang dilakukan:

1. Setiap migrasi localization **ditambal manual**: `up()` menyalin data ke tabel
   `*_locales` sebagai locale `id` **sebelum** `DROP COLUMN`; `down()`
   mengembalikannya sebelum `DROP TABLE`.
2. Migrasi kedua menemukan jebakan lanjutan: memakai `UPDATE` biasa akan
   *melewati dalam senyap* baris blok yang belum punya baris locale. Diganti
   dengan `INSERT … ON CONFLICT DO UPDATE`.
3. Setiap migrasi diverifikasi dengan snapshot sebelum/sesudah:
   **82 kolom** pada migrasi pertama, **62/62 nilai tombol** pada kedua,
   **374/374 nilai** pada migrasi bilingual penuh. Rollback diuji, checksum identik.

Pelajarannya dicatat di dokumentasi repo agar tidak terulang: *jangan pernah pakai
keluaran mentah Drizzle apa adanya — periksa dulu apakah ada `DROP COLUMN` yang
membuang data sebelum dipindahkan.*

### 5.4 Pipeline terjemahan yang membaca skema database sendiri

Alih-alih daftar field hardcode yang akan basi begitu blok baru ditambahkan,
`translate:export` melakukan introspeksi ke `information_schema` untuk menemukan
semua tabel `*_locales` beserta kolomnya secara otomatis. Field localized baru
ikut terbaca tanpa menyentuh skrip.

Detail yang membuatnya benar-benar dipakai:

- **Melewati tabel versi draf** (`_pages_v`, `_articles_v`) — menerjemahkan riwayat
  draf itu sia-sia karena akan tertulis ulang begitu staf menyimpan lagi.
- **Menangani richText Lexical**: dokumen dipecah per simpul teks dengan kunci
  `…|kolom#n`. Saat impor, versi Indonesia dipakai sebagai kerangka dan simpul
  ke-n diganti — struktur paragraf, penebalan, dan tautan tetap utuh.
- **Hanya mengekspor yang versi Inggrisnya masih kosong**, sehingga menjalankan
  ulang setelah impor hanya mengeluarkan sisa yang benar-benar belum digarap.
- **Setiap entri diberi label konteks berbahasa manusia** ("Blok Kartu Nilai —
  kartu") supaya penerjemah tahu ia sedang menerjemahkan bagian apa.
- **`fallback: true`** — field Inggris yang kosong otomatis menampilkan versi
  Indonesia, jadi `/en` tidak pernah tampil bolong meski terjemahan belum 100%.

Alurnya menjadi: `export` → isi kolom `teks_en` → `import`. Bisa dijalankan
berulang, aman, dan tidak menyentuh gambar/tautan/warna di field lain.

### 5.5 Latensi sebagai keputusan arsitektur, bukan kebetulan

Vercel secara default menempatkan fungsi di `iad1` (Washington DC). Database ada
di `ap-southeast-1` (Singapura). Setiap query menyeberangi Pasifik dua kali.

Di komputer lokal (Indonesia → Singapura) semuanya terasa wajar, sehingga masalah
ini **tidak akan pernah muncul saat pengembangan** — hanya di produksi, dan hanya
terasa sebagai "dasbornya lambat". Fungsi dikunci ke `sin1` lewat `vercel.json`.

Karena JSON tidak bisa memuat komentar, alasannya ditulis di README dengan
peringatan eksplisit: *jangan ubah region tanpa memindahkan databasenya sekalian.*
Keputusan yang terdokumentasi, bukan angka ajaib yang membingungkan orang
berikutnya.

### 5.6 Arsitektur 24 blok: menyerahkan tata letak ke tim konten

Halaman tidak di-hardcode. Setiap halaman adalah susunan blok yang bisa
ditambah, diurutkan ulang, dan dihapus dari dasbor:

`hero` · `pageHero` · `richText` · `valueCards` · `featureCards` · `ideaCards` ·
`activityCards` · `callout` · `ctaBanner` · `statCounter` · `timeline` ·
`teamGrid` · `testimonials` · `partnerLogos` · `latestNews` · `gallery` ·
`videoGrid` · `trainingModules` · `programIntensif` · `indonesiaMap` ·
`contactForm` · `donationTiers` · `donationCampaigns` · `visiMisi`

Ditambah **live preview + draft mode**: staf melihat perubahan sebelum
dipublikasikan. Ini juga tidak diminta dalam spesifikasi — ditambahkan karena
tanpa itu, menyusun halaman dari 24 blok adalah menebak dalam gelap.

### 5.7 Portabilitas sebagai batasan desain

Klien ingin bisa pindah hosting kapan saja. Konsekuensinya dijaga sepanjang
proyek:

- PostgreSQL standar, **nol fitur proprietary Supabase** → `pg_dump`/`pg_restore`
  ke penyedia mana pun berfungsi
- Media di penyimpanan S3-compatible, bukan filesystem server
- 13 berkas migrasi berurutan & reversible → skema bisa dibangun ulang dari nol
- Manual book migrasi ke cPanel/Dewaweb ditulis sebagai referensi siap pakai

---

## 6. Praktik rekayasa

- **TypeScript `strict: true`** di seluruh proyek; tipe data CMS di-generate dari
  skema (`payload-types.ts`, 1.859 baris) sehingga frontend dan CMS tidak bisa
  saling berbohong soal bentuk data.
- **13 migrasi database berurutan dan reversible** — bukan `db push` yang merusak
  data.
- **Komentar kode dan pesan commit dalam bahasa Indonesia**, konsisten dengan
  bahasa dasbor dan dokumentasi. Proyek ini akan dilanjutkan oleh orang Indonesia.
- **Dokumentasi hidup di repo**, bukan di chat: rencana implementasi, status
  bilingual, panduan edit bahasa Inggris untuk tim konten, manual migrasi hosting,
  dan dokumen audit spesifikasi-vs-realita.
- **Audit mandiri terhadap spesifikasi.** Di tengah proyek disusun dokumen yang
  memetakan setiap kebutuhan fungsional ke bukti di kode, termasuk daftar jujur
  pekerjaan yang **belum** selesai dan pekerjaan yang dikerjakan **di luar**
  cakupan awal. Melacak scope creep secara terbuka, bukan menyembunyikannya.

---

## 7. Pekerjaan di luar cakupan awal yang tetap dikerjakan

Sejumlah pekerjaan besar tidak ada dalam spesifikasi awal namun dikerjakan karena
tanpa itu hasilnya tidak akan benar-benar terpakai:

| Pekerjaan | Skala |
|---|---|
| Dukungan bilingual ID/EN penuh (routing, localization 3 lapis, 3 migrasi, pipeline terjemahan) | Pekerjaan terbesar kedua setelah migrasi CMS itu sendiri |
| Live preview + draft mode | — |
| Referensi teks Indonesia berdampingan di dasbor (`LocaleReference`) | 194 baris |
| Optimasi kuota Vercel/Supabase | ~50% penghematan transformasi gambar |
| Manual book migrasi hosting ke cPanel | 180 baris |

---

## 8. Status jujur & batasan

Bagian ini penting justru untuk portofolio: menunjukkan kemampuan membedakan
"selesai" dari "selesai dan terbukti".

**Selesai & terverifikasi:**
Arsitektur, dasbor CMS, migrasi seluruh konten & media, dukungan bilingual,
sitemap/robots/meta tags, redirect 301 terpasang, build hijau untuk 29 halaman.

**Menunggu aksi non-koding dari klien** (bukan pekerjaan pengembangan):
- Cutover DNS — menunggu kredensial hosting dari klien
- Submit sitemap ke Google Search Console — menunggu akses properti
- Sesi pelatihan CMS untuk staf

**Belum diukur — jangan diklaim sebagai capaian:**
- **Skor Lighthouse & LCP.** Optimasi sudah dilakukan (varian gambar, cache TTL,
  region), tetapi angkanya belum diukur dan dicatat. Jangan mencantumkan skor
  performa di portofolio sebelum ada laporan Lighthouse tersimpan.
- **Kontras WCAG AA.** Belum ada audit terdokumentasi.
- **Demonstrasi `pg_dump`/`pg_restore`.** Prasyaratnya terpenuhi, demonstrasinya
  belum dijalankan.

> Menjalankan Lighthouse mobile dan audit kontras adalah pekerjaan beberapa jam
> yang akan mengubah tiga poin di atas menjadi angka konkret yang bisa dipamerkan.
> Layak dilakukan sebelum dokumen ini dipublikasikan.

---

## 9. Versi ringkas (siap tempel)

**Satu kalimat:**
> Memigrasikan website organisasi nonprofit dari WordPress ke Next.js 16 + Payload
> CMS dalam 11 hari — 123 aset media, 8 halaman, dan 24 blok konten komposabel —
> dengan dasbor CMS berbahasa Indonesia penuh dan dukungan dua bahasa ID/EN.

**Poin-poin untuk CV/portofolio:**

- Migrasi WordPress → Next.js 16 + Payload CMS + PostgreSQL, selesai dalam 11 hari
  kalender sebagai pengembang tunggal
- Merancang 24 blok konten komposabel + 9 collection sehingga tim konten
  non-teknis dapat menyusun halaman baru tanpa developer
- Membangun dasbor CMS berbahasa Indonesia penuh dengan 21 ikon pratinjau blok,
  panduan in-dasbor, dan komponen referensi terjemahan berdampingan
- Mengimplementasikan dukungan bilingual ID/EN dengan 72 field terlokalisasi;
  **memverifikasi 374/374 nilai data utuh** melalui migrasi yang ditambal manual
  setelah menemukan keluaran migrasi bawaan membuang data secara senyap
- Membangun pipeline terjemahan yang melakukan introspeksi skema database
  (`information_schema`) dan menangani rich text Lexical per simpul; 127 teks
  diimpor dengan 0 kegagalan
- Menurunkan konsumsi kuota transformasi gambar **~50%** dan latensi query
  database **~230 ms → ~25 ms** lewat penempatan region deployment
- Menjaga portabilitas penuh: PostgreSQL standar tanpa fitur proprietary,
  13 migrasi reversible, media di penyimpanan S3-compatible

---

## 10. Cara memverifikasi angka di dokumen ini

Setiap klaim di atas dapat diperiksa ulang dari repositori:

```bash
git log --oneline | wc -l
```

```bash
find src scripts -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.mts" \) ! -name "payload-types.ts" -exec wc -l {} + | tail -1
```

```bash
grep -r "localized: true" src/payload/ | wc -l
```

```bash
grep -ohE "slug: *\"[a-zA-Z]+\"" src/payload/blocks/*.ts | sort -u | wc -l
```

```bash
ls migrations/*.ts | wc -l
```

---

## Riwayat revisi

| Versi | Tanggal | Perubahan |
|---|---|---|
| 1.0 | 5 Agustus 2026 | Penyusunan awal — 22 commit (25 Jul – 4 Agu 2026) |
