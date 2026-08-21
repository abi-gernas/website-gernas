# Checkpoint: PRD vs Realita Pengembangan

> **Tanggal audit:** 3 Agustus 2026
> **Basis:** 21 commit di branch `preview` (`64c3ce7` s.d. `3b55aa4`), 25 Jul – 3 Agu 2026
> **Dokumen acuan:**
> - `PRD-GERNASTASTAKA-v1.1` — Fase 1, front-end/migrasi halaman
> - `PRD-GERNASTASTAKA-BACKOFFICE-v1.0` — Fase 1, arsitektur/CMS/SEO/DNS/portabilitas
> - `PRD-GERNASTASTAKA-FASE2-v1.1` — Library Materi Guru & CMS Kolaborasi
>
> Dokumen ini **bukan** pengganti PRD. Ini foto kondisi: apa yang benar-benar
> ada di kode per hari ini, dipetakan ke FR di ketiga PRD, plus daftar
> pekerjaan yang dilakukan **di luar** PRD.

---

## 1. Ringkasan eksekutif

| Dokumen | FR selesai | Catatan |
|---|---|---|
| PRD v1.1 (Front-End Fase 1) | **4 / 4** | Semua target konten tercapai; NFR performa belum diukur ulang |
| PRD Backoffice v1.0 (Fase 1) | **2 / 5 penuh, 1 sebagian** | FR-007 sebagian, FR-008 & FR-009 belum |
| PRD Fase 2 | **0 / 5** | Belum dikontrak, belum dimulai |

**Yang menahan serah terima Fase 1:** FR-007 (redirect map belum lengkap, GSC
belum disubmit), FR-008 (DNS cutover), FR-009 (demonstrasi pg_dump/restore).
Ketiganya butuh aksi non-koding — kredensial dari klien atau sesi demonstrasi.

**Yang dikerjakan di luar PRD:** dukungan bilingual ID/EN penuh — pekerjaan
terbesar kedua setelah migrasi CMS itu sendiri, dan **sama sekali tidak ada di
PRD manapun**. Perlu diputuskan apakah masuk adendum SPK atau ditelan sebagai
scope creep. Lihat Bagian 4.

---

## 2. PRD-GERNASTASTAKA-v1.1 — Front-End Fase 1

### 2.1 Functional Requirements

| FR | Deskripsi ringkas | Status | Bukti |
|---|---|---|---|
| **FR-002** | 8 halaman hasil migrasi, layout dari komponen Design System v2.0 | ✅ **Selesai** | 8 slug di `scripts/seed-pages.mts`: `beranda`, `tentang-gernas-tastaka`, `galeri`, `mitra`, `donatur`, `tumbuh-bersama`, `belajar-bersama`, `publikasi`. Commit `c2e1b92` |
| **FR-003** | 10 profil Penggerak (nama, jabatan, foto) | ✅ **Selesai** | 10 entri di `scripts/seed-datasitus.mts` → collection `penggerak`, dirender lewat blok `teamGrid` |
| **FR-004** | 4 artikel/berita lengkap | ✅ **Selesai** | 4 entri di `scripts/data-artikel.ts`, seed via `scripts/seed-articles.mts`. Commit `e480559` |
| **FR-006** | UI sesuai Design System v2.0, responsif mobile & desktop | ✅ **Selesai** (visual) | 23 blok Payload + komponen di `src/components/`. Token warna terpusat di `src/components/warna.ts` |

**Melebihi target PRD:** selain 8 halaman / 10 profil / 4 artikel, ikut dimigrasi
**19 entri Mitra**, **4 entri Video**, koleksi **Modul Pelatihan**, dan **±123 aset
media** ke Supabase Storage dengan konversi WebP (commit `c504557`). PRD hanya
menyebut "147 media" sebagai dependency, tanpa FR eksplisit.

### 2.2 Non-Functional Requirements

| NFR | Target | Status |
|---|---|---|
| Lighthouse Performance ≥ 90 (mobile), LCP < 2,5 dtk | KPI No.3 | ⚠️ **Belum diverifikasi** — tidak ada laporan Lighthouse tersimpan di repo. Optimasi sudah dilakukan (commit `0b0cfa2`: batasi varian gambar, cache TTL 1 tahun, `regions: ["sin1"]` di `vercel.json`) tapi angkanya belum diukur & dicatat |
| Kontras teks WCAG AA | KPI No.7 | ⚠️ **Belum diverifikasi** — belum ada audit kontras terdokumentasi |

> **Aksi:** jalankan Lighthouse mobile pada halaman utama + audit kontras,
> simpan hasilnya sebagai lampiran serah terima. Ini dua KPI kontraktual yang
> saat ini tidak punya bukti.

### 2.3 Open Issues PRD v1.1

| ID | Isu | Status per hari ini |
|---|---|---|
| OI-001 | Referensi desain final | ✅ Selesai sejak PRD ditulis |
| OI-002 | 2 halaman orphan (`tentang-kami`, `kontak-kami`) — include/exclude? | ❌ **Masih terbuka** — tidak ada halaman/redirect untuk kedua slug ini di kode |
| OI-003 | 5 post junk — exclude, cek backlink | ❌ **Masih terbuka** — di-exclude dari migrasi (hanya 4 artikel bersih yang masuk), tapi konfirmasi klien & cek backlink belum terdokumentasi |
| OI-006 | Dokumen Backoffice & Teknis belum disusun | ✅ Selesai — dokumen sudah ada & rencana implementasinya di `docs/backoffice-implementation-plan.md` |

---

## 3. PRD-GERNASTASTAKA-BACKOFFICE-v1.0 — Fase 1

| FR | Deskripsi ringkas | Status | Bukti |
|---|---|---|---|
| **FR-001** | Next.js + Payload CMS + PostgreSQL berjalan, dasbor aktif | ✅ **Selesai** | Commit `0b22df3` (scaffold Payload 3.86) + `98be4aa` (terhubung Supabase, migrasi initial). Catatan: Next dinaikkan ke **16.2.11**, bukan 15.x — Payload 3.86 tidak mendukung Next 15.5.x (lihat `docs/backoffice-implementation-plan.md` §0) |
| **FR-005** | Dasbor CMS untuk staf non-teknis | ✅ **Selesai, melebihi target** | 9 collection + 1 global, 23 blok, dasbor **berbahasa Indonesia penuh** (`0be134b`), ikon preview per blok (`public/blok/*.svg`), panduan in-dasbor (`PanduanDasbor.tsx`), label baris otomatis (`RowLabel.tsx`), **live preview + draft mode** (`c2e1b92`, `0714be7`) — live preview tidak diminta PRD |
| **FR-007** | 301 redirect 100% URL lama + sitemap + meta tags + submit GSC | ⚠️ **Sebagian** | ✅ `sitemap.ts` & `robots.ts` ada (`fd587e4`); ✅ `generateMetadata` di semua route publik; ✅ plugin `@payloadcms/plugin-redirects` terpasang & diterjemahkan. ❌ **Redirect map belum lengkap** — hanya 1 redirect hardcoded (`/home-page → /`) di `next.config.mjs` (`d37f300`); tidak ada seed redirect dari `gernastastaka.WordPress...ALL_CONTENT.xml`. ❌ **Submit GSC belum ada bukti** |
| **FR-008** | Cutover DNS tanpa mengganggu email @gernastastaka.org | ❌ **Belum** | Domain utama masih belum dialihkan. Yang berjalan baru preview (`dev.gernastastaka.org` dari branch `preview`). Kredensial cPanel Dewaweb (OI-008) belum tercatat diterima |
| **FR-009** | Portabilitas DB (pg_dump/pg_restore ke server lain) | ❌ **Belum** | Prasyaratnya terpenuhi (Postgres standar via `@payloadcms/db-postgres`, tanpa fitur proprietary Supabase; 6 migration file rapi di `migrations/`), tapi **demonstrasi restore 1× belum dijalankan/didokumentasikan** |

### 3.1 Open Issues PRD Backoffice

| ID | Isu | Status per hari ini |
|---|---|---|
| OI-002 / OI-003 | Orphan pages & post junk untuk redirect map | ❌ Masih terbuka — memblokir FR-007 |
| OI-004 | Mekanisme auth CMS (SSO/MFA/role) | ✅ Terselesaikan by default — auth bawaan Payload (email+password), sesuai rekomendasi PRD |
| OI-005 | Tanggal mulai & target serah terima masih placeholder | ❌ Masih terbuka |
| OI-007 | Struktur props tiap Payload Block belum di-scaffold | ✅ Selesai — 23 blok terdefinisi di `src/payload/blocks/` |
| OI-008 | Kredensial cPanel Dewaweb untuk DNS cutover | ❌ Masih terbuka — memblokir FR-008 |

### 3.2 Milestone Backoffice

| Milestone | Status |
|---|---|
| Setup Arsitektur | ✅ Selesai |
| Build Dasbor CMS | ✅ Selesai |
| SEO Parity | ⚠️ Sebagian (sitemap+meta ✅, redirect map & GSC ❌) |
| DNS Cutover | ❌ Belum |
| Handover & Training CMS | ⚠️ Dokumentasi sebagian ada (`docs/panduan-edit-bahasa-inggris.md`, panduan in-dasbor); **sesi pelatihan 1× belum dijalankan** |
| Test Restore Portabilitas | ❌ Belum |

---

## 4. Pekerjaan di luar cakupan ketiga PRD

Ini bagian terpenting dokumen ini: sejumlah pekerjaan besar dikerjakan tanpa
dasar FR di PRD manapun. Perlu keputusan apakah masuk adendum atau tidak.

| Pekerjaan | Ukuran | Commit | Ada di PRD? |
|---|---|---|---|
| **Bilingual ID/EN penuh** — routing `/en/*`, localization 3 lapis di Payload (374 nilai diverifikasi utuh), 3 migration, skrip export/import terjemahan, 108+19 teks diterjemahkan | ~52.000 baris diff | `e08cf14` | ❌ **Tidak ada sama sekali** |
| **Referensi teks Indonesia di dasbor** saat mengisi field bahasa Inggris (komponen `LocaleReference`) | 194 baris | `acb7397` | ❌ Turunan dari bilingual |
| **Live preview + draft mode** + perbaikan kebocoran draft mode | — | `c2e1b92`, `0714be7` | ❌ Tidak diminta |
| **Optimasi kuota Vercel/Supabase** — batasi varian gambar, cache TTL, pooling DB, region `sin1` | — | `0b0cfa2`, `0714be7` | ❌ Tidak diminta (tapi wajar, menghindari biaya) |
| **Manual book migrasi hosting ke cPanel Dewaweb** | 180 baris | `e0c9ace` | ❌ Riset opsional, belum dieksekusi |
| **Blok Kegiatan Gernas & Program Intensif** di halaman Belajar Bersama | ~600 baris komponen | `3b55aa4` | ❌ **Konten baru** — PRD v1.1 eksplisit menyatakan "tanpa membuat konten baru" |

> **Catatan risiko:** PRD v1.1 Bagian 11 menyatakan "Pembuatan konten baru —
> disediakan klien" ada di luar cakupan. Blok Kegiatan Gernas & Program Intensif
> (`3b55aa4`) adalah struktur konten baru, bukan replikasi WordPress. Kalau ini
> permintaan klien di luar SPK, sebaiknya dicatat sebagai adendum.

---

## 5. PRD-GERNASTASTAKA-FASE2-v1.1 — belum dimulai

| FR | Deskripsi | Status |
|---|---|---|
| FR-101 | Materi PDF di Google Drive via OAuth akun nonprofit | ❌ Belum — tidak ada integrasi Drive di kode |
| FR-102 | UI kustom telusuri & cari materi | ❌ Belum |
| FR-103 | Pratinjau materi dalam UI situs | ❌ Belum |
| FR-104 | Unduh langsung dari UI situs | ❌ Belum |
| FR-105 | CMS CRUD portofolio/artikel kerja sama | ❌ Belum — tidak ada collection `Kolaborasi` |

Semua Open Issue Fase 2 (OI-101 s.d. OI-104) masih terbuka. Blocker utama tetap
**OI-101** (model akses Library: publik vs login guru) dan **OI-104** (kontrak
Fase 2 belum ditandatangani).

> **Catatan:** ada keputusan desain awal yang pernah dibahas untuk Fase 2
> (gated download di Library, collection Kolaborasi) yang **belum masuk ke PRD
> Fase 2 v1.1**. Kalau Fase 2 jadi dikontrak, PRD perlu dinaikkan ke v1.2 dulu.

---

## 6. Inventaris teknis saat ini

**Stack:** Next.js 16.2.11 · React 19 · Payload CMS 3.86 · PostgreSQL (Supabase) ·
Supabase Storage (S3) · Tailwind CSS · Vercel (region `sin1`)

**Collections (9):** `Articles`, `Categories`, `Media`, `Mitra`, `ModulPelatihan`,
`Pages`, `Penggerak`, `Users`, `Video`
**Globals (1):** `SiteSettings`

**Blok Payload (23):**
`activityCards`, `callout`, `contactForm`, `ctaBanner`, `donationCampaigns`,
`donationTiers`, `featureCards`, `gallery`, `hero`, `ideaCards`, `indonesiaMap`,
`latestNews`, `pageHero`, `partnerLogos`, `programIntensif`, `richText`,
`statCounter`, `teamGrid`, `testimonials`, `timeline`, `trainingModules`,
`valueCards`, `videoGrid`

**Route publik:** `/`, `/[...slug]`, `/berita/[slug]`, `/en`, `/en/[...slug]`,
`/en/berita/[slug]`, `/sitemap.xml`, `/robots.txt`, `/next/preview`,
`/next/exit-preview`

**Migration (6):** initial → legacy path → koleksi data situs → blok halaman →
localization (3 tahap) → blok kegiatan & program intensif

---

## 7. Sisa pekerjaan — prioritas

### Blocker serah terima Fase 1
1. **Redirect map lengkap (FR-007)** — generate dari `gernastastaka.WordPress.2026-07-18_ALL_CONTENT.xml`, isi ke plugin Redirects. Butuh keputusan OI-002 & OI-003 dari klien lebih dulu.
2. **Submit sitemap ke Google Search Console (FR-007)** — butuh akses/verifikasi properti.
3. **DNS cutover (FR-008)** — butuh kredensial cPanel Dewaweb dari klien (OI-008). MX record tidak boleh disentuh.
4. **Demonstrasi pg_dump/pg_restore (FR-009)** — 1× ke environment terpisah, dokumentasikan hasilnya.
5. **Ukur & catat Lighthouse + kontras WCAG AA** — dua KPI kontraktual tanpa bukti.
6. **Sesi pelatihan CMS 1×** untuk staf klien + dokumentasi serah terima.

### Utang teknis (non-blocker)
7. **SiteSettings belum tersambung ke frontend** — field `address` & `footerText` sudah dua bahasa di dasbor, tapi Footer masih membaca konstanta di `src/lib/nav.ts`. Mengeditnya di dasbor belum berpengaruh.
8. **Navigasi masih hardcode** di `src/lib/nav.ts` & `src/lib/i18n.ts` — tim konten tidak bisa mengubah menu sendiri.
9. **208 teks menunggu terjemahan EN** (terbanyak: alt gambar, tujuan modul, nama peran). Situs `/en` tetap tayang normal karena `fallback: true`.
10. **Foto/logo kolaborator** di blok Kegiatan Gernas & Program Intensif masih kosong.
11. **QA visual `/en`** belum dilakukan.

---

## 8. Cara memverifikasi ulang dokumen ini

```bash
git log --oneline | wc -l                        # jumlah commit
grep -oE 'slug: *"[a-z-]+"' scripts/seed-pages.mts | sort -u   # daftar halaman
npm run migrate:status                           # status migrasi DB
npm run translate:export                         # sisa teks belum diterjemahkan
```

---

## Riwayat revisi

| Versi | Tanggal | Perubahan | Penulis |
|---|---|---|---|
| 1.0 | 3 Agu 2026 | Audit awal — 21 commit dipetakan ke 3 PRD | — |
