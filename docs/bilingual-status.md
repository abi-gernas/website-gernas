# Status Bilingual ID/EN — 30 Juli 2026

Catatan lanjutan supaya sesi berikutnya tidak perlu mengulang eksplorasi. Ditulis setelah lapisan kode selesai & migrasi produksi sudah dijalankan.

## Sudah selesai

**Lapisan 1 — UI/routing** (`src/lib/i18n.ts`, folder mirror `src/app/(frontend)/en/`, Navbar/Footer/ContactForm/dst locale-aware). Sudah diverifikasi jalan.

**Lapisan 2 — localization CMS.** `localization: { locales: [id, en], defaultLocale: "id", fallback: true }` di `src/payload.config.ts`. 35 field ditandai `localized: true`: `title` Pages & Articles, `heading` di 15 blok, hero/pageHero (title/highlight/description), dan judul kartu/kotak (valueCards, featureCards, callout, ctaBanner, donationTiers). Isi panjang (richText, isi artikel, kutipan, linimasa) sengaja **tidak** dilokalkan. `fallback: true` artinya field Inggris yang kosong otomatis menampilkan versi Indonesia — jadi `/en` tidak pernah tampil bolong.

**Migrasi database** — `migrations/20260730_091756_tambah_localization.ts`. Keluaran mentah `payload migrate:create` untuk kasus localization MEMBUANG data lama tanpa menyalinnya (drizzle generate CREATE TABLE + DROP COLUMN tanpa INSERT). File ini sudah ditambal manual: `up()` menyalin 82 kolom ke tabel `*_locales` sebagai locale `id` sebelum DROP; `down()` mengembalikan data sebelum DROP TABLE. Sudah diuji end-to-end (checksum identik, rollback aman) dan **sudah dijalankan ke database yang dipakai project ini** (`npm run migrate`, sukses). Kalau bikin migrasi skema serupa di masa depan, jangan pakai keluaran mentah drizzle apa adanya — selalu cek apakah ada DROP COLUMN yang membuang data tanpa dipindahkan dulu.

**Skrip terjemahan** — `scripts/i18n/export-translations.mts` & `scripts/i18n/import-translations.mts` (didaftarkan sebagai `npm run translate:export` / `npm run translate:import`). Cara kerja:
- `translate:export` membaca skema database secara otomatis (lewat `information_schema`, bukan daftar hardcode) untuk menemukan semua field localized yang versi Inggrisnya masih kosong, lalu menulis `scripts/i18n/translations.json` — array `{ key, context, teks_id, teks_en }`. File ini di-gitignore (data kerja, bukan source).
- `translate:import` membaca file itu (setelah `teks_en` diisi) dan menulis balik ke kolom yang tepat lewat UPSERT per-kolom ke tabel `*_locales` — aman karena tabel itu cuma berisi kolom yang diterjemahkan, tidak menyentuh gambar/tautan/warna di field lain. Baris dengan `teks_en` kosong dilewati; menjalankan `translate:export` lagi setelahnya hanya akan mengeluarkan sisa yang benar-benar belum diterjemahkan.
- Sudah diuji end-to-end di database lokal terpisah (bukan database asli): isi 5 contoh, jalankan import, verifikasi tersimpan benar, tidak menyentuh field lain.

**Label tombol ikut dilokalkan (tambahan 30 Jul malam).** Semula teks tombol sengaja TIDAK dilokalkan, jadi di `/en` tombol masih berbahasa Indonesia ("Mari Belajar!", "Penggerak"). Sekarang sudah: `localized: true` ditambahkan ke `label` di `ctaField()` ([shared.ts](../src/payload/blocks/shared.ts)) — otomatis berlaku untuk semua blok yang memakainya — plus dua array tautan kecil di [konten.ts](../src/payload/blocks/konten.ts) (`valueCards.cards.links.label` dan `callout.tautanTambahan.label`). Migrasinya `migrations/20260730_161555_tambah_localized_tombol.ts`, ditambal manual dengan pola yang sama seperti migrasi sebelumnya (salin dulu ke `*_locales`, baru DROP COLUMN). Bedanya: tabel `*_locales` yang sudah ada dari migrasi sebelumnya diisi pakai `INSERT … ON CONFLICT DO UPDATE`, bukan `UPDATE` biasa — kalau ada baris blok yang belum punya baris locale `id`, `UPDATE` akan diam-diam melewatinya dan teks tombolnya hilang. Sudah dijalankan ke database asli; diverifikasi 62/62 nilai tombol utuh di locale `id` (snapshot sebelum/sesudah), 19 label diterjemahkan & diimpor, `tsc --noEmit` bersih.

**Bilingual penuh (31 Jul).** Cakupan diperluas ke SEMUA field konten atas permintaan user, kecuali dua hal yang sengaja dikecualikan (keputusan user): **isi lengkap artikel berita** (`articles.excerpt` + `content`) dan **nama diri** (nama orang, nama mitra). Slug URL juga tetap satu versi — mengubahnya memutus tautan & peringkat Google. Yang ditambahkan: richText halaman & isi kartu Visi/Misi, kutipan + jabatan testimoni, teks linimasa, label & akhiran statistik, kartu ide (judul/kelas/topik), nama kampanye donasi, kotak pengantar modul, awalan tautan callout, kategori artikel, alt & caption Media, nama peran Penggerak, judul Video, judul + tujuan Modul Pelatihan, alamat & teks footer SiteSettings. Migrasi `migrations/20260730_164524_bilingual_penuh.ts`, ditambal dengan pola yang sama; diverifikasi **374/374 nilai utuh** (snapshot sebelum/sesudah). `npm run build` hijau (29 halaman ID+EN).

Dua hal yang ikut diperbaiki di sesi ini:
- `src/lib/datasitus.ts` menerima parameter `locale` tapi **tidak pernah meneruskannya** ke `payload.find()`. Dulu tidak masalah (koleksi itu belum punya field localized); begitu Penggerak/Video/Modul/Mitra dilokalkan, ini jadi bug diam — sudah disambung `locale` + `fallbackLocale`.
- `scripts/i18n/*` kini menangani **richText (jsonb)**. Dokumen Lexical dipecah per simpul teks dengan kunci `…|kolom#n`; saat impor, dokumen versi `id` dipakai sebagai kerangka lalu simpul ke-n diganti — struktur paragraf/penebalan/tautan tetap utuh. Helper `simpulTeks()` dipisah ke `scripts/i18n/richtext.mts` supaya bisa dipakai kedua skrip tanpa mengeksekusi skrip ekspor. Sudah diuji end-to-end di DB asli (1 paragraf + 1 kategori, lalu dibersihkan lagi).
- `resolveRootSlug` di skrip ekspor dulu berasumsi semua tabel akar punya kolom `slug` — pecah begitu Media/Video/SiteSettings ikut localized. Sekarang memilih kolom pengenal yang tersedia.

**Panduan untuk tim konten:** [`docs/panduan-edit-bahasa-inggris.md`](panduan-edit-bahasa-inggris.md).

## Status saat ini (belum selesai)

1. ~~`scripts/i18n/translations.json` sudah di-export (108 entri)...~~ **SELESAI 30 Jul 2026**: user mengembalikan file terjemahan (hasil AI eksternal, 108 entri, semua `teks_en` terisi), sudah ditimpakan ke `scripts/i18n/translations.json`, dan `npm run translate:import` sudah dijalankan — **108 kolom Inggris berhasil ditulis ke database, 0 ditolak/dilewati**. Verifikasi ulang dengan `npm run translate:export` menunjukkan **0 teks yang masih kosong** — semua field localized (title Pages/Articles, heading 15 blok, hero/pageHero, judul kartu/kotak) sudah punya versi Inggris.
2. Label tombol: **SELESAI** — lihat bagian di atas. 19 label diterjemahkan, `translate:export` ulang menunjukkan 0 sisa.
3. Semua perubahan kode di atas (payload.config.ts, field localized di blocks/collections, lib/pages.ts & lib/content.ts yang menyambungkan `locale`/`fallbackLocale`, payload-types.ts hasil generate ulang, kedua migration file, scripts/i18n/*, package.json) **masih belum di-commit ke git**.
4. **208 teks menunggu diterjemahkan** — hasil `translate:export` setelah cakupan diperluas (12.400 karakter; terbanyak: 76 alt gambar, 35 tujuan modul, 24 nama peran). Situs `/en` tetap tayang normal tanpa ini karena fallback. Alurnya: export → isi `teks_en` → `npm run translate:import`.
5. **SiteSettings belum tersambung ke frontend.** Field `address` & `footerText` sudah bisa dua bahasa di dasbor, tapi Footer masih membaca dari konstanta `contact` di `src/lib/nav.ts`, bukan dari global itu — jadi mengeditnya di dasbor belum berpengaruh ke situs. Perlu disambungkan kalau memang mau dipakai.
6. Navigasi & teks antarmuka **sudah** dua bahasa, tapi lewat kode (`src/lib/nav.ts`, `src/lib/i18n.ts`), bukan CMS — tim konten tidak bisa mengubahnya sendiri.
7. Belum diverifikasi visual di browser (`/en`) — ditunda, user akan QA manual sendiri.

## Kalau melanjutkan di sesi baru

Cukup baca file ini + jalankan `git status` untuk lihat file yang berubah. Tidak perlu eksplorasi ulang skema Payload atau menguji ulang migrasinya — itu semua sudah dilakukan dan hasilnya didokumentasikan di sini.
