# Rencana Implementasi — Backoffice & Teknis Gernas Tastaka

Acuan: **PRD-GERNASTASTAKA-BACKOFFICE-v1.0** (Fase 1). Menutup OI-006.
DB: **Supabase (cloud)** — Postgres standar, hindari fitur proprietary demi portabilitas (FR-009 / KPI No.6).
Basis kode: Next.js App Router (front-end PRD v1.1 sudah jadi, konten masih statis di `src/data/*.ts`).

Status: **DRAFT rencana — belum ada kode ditulis.**

---

## 0. Temuan teknis (hasil eksekusi — bukan lagi asumsi)

**Modul 1 sudah dikerjakan.** Catatan yang berbeda dari perkiraan awal:

1. **Payload 3.86 tidak mendukung Next 15.5.x.** Rentang peer yang diterima:
   `>=15.2.9 <15.3 || >=15.3.9 <15.4 || >=15.4.11 <15.5 || >=16.2.6 <17`.
   Karena itu app dinaikkan ke **Next 16.2.11** (stabil terbaru, didukung), bukan 15.x.
   Satu-satunya breaking change yang kena: `params` di `berita/[slug]` kini asinkron.
2. **Node 25 bermasalah dengan toolchain Payload.**
   - `npm install` 6 paket Payload sekaligus → **OOM crash** (RAM mesin 8 GB).
     Solusi: install bertahap per paket + `NODE_OPTIONS=--max-old-space-size=6144`.
   - CLI Payload (`generate:importmap`, `generate:types`) gagal:
     `ERR_REQUIRE_ASYNC_MODULE` pada `@payloadcms/richtext-lexical` (interop tsx/Node 25).
   - **Rekomendasi: pasang Node 22 LTS** (`brew install node@22`) untuk kerja Payload.
     Symlink `node@20`/`node@21` di Homebrew mesin ini semuanya menunjuk ke Node 25 —
     tidak ada LTS asli terpasang. Build Next sendiri jalan normal di Node 25.
3. **Postgres lokal rusak.** `postgresql@14` & `@15` gagal jalan
   (`icu4c` mismatch: butuh `libicui18n.73.dylib`, terpasang icu4c@78).
   Tidak diperbaiki — di luar cakupan & butuh izin. Verifikasi DB akan langsung
   memakai Supabase.
4. `sharp` tidak boleh diimpor lewat top-level `await import()` di `payload.config.ts`
   (esbuild CJS). Dipakai import statis biasa.
5. `@payloadcms/next/routes` hanya mengekspor `GRAPHQL_POST` &
   `GRAPHQL_PLAYGROUND_GET` — tidak ada `GRAPHQL_GET`/`GRAPHQL_OPTIONS`.
6. `.gitignore` semula `.env*` ikut mengabaikan `.env.example`; ditambah `!.env.example`.

---

## 1. Prasyarat & Open Issues yang memblokir

| Item | Butuh dari | Blok modul |
|---|---|---|
| Supabase project + connection string (pooled 6543 & direct 5432) | Encode Craft (buat) | 1,2,5 |
| `PAYLOAD_SECRET`, env produksi Vercel | Encode Craft | 1,2 |
| Struktur props final tiap Block (OI-007) — sesi teknis Design System v2.0 Bagian 2 | Tech Lead | 2 |
| Daftar lengkap URL WordPress lama (redirect map) | dari `gernastastaka.WordPress...ALL_CONTENT.xml` (sudah ada) | 3 |
| Google Search Console akses/verifikasi (OI, dependency §9) | Encode Craft | 3 |
| Kredensial cPanel Dewaweb / Zone Editor (OI-008) | Klien | 4 |
| Keputusan orphan pages & post junk (OI-002, OI-003) | Klien | 3 |
| Auth CMS: default email+password Payload (OI-004) | sudah default, tak blok | 2 |

---

## 2. Modul 1 — Setup Arsitektur (FR-001 · US-000 · High)

**Tujuan:** Next.js + Payload CMS + PostgreSQL(Supabase) berjalan; admin `/admin` aktif; DB terkoneksi.

### 2.1 Upgrade & dependensi
- Upgrade `next@15`, `react@19`, `react-dom@19`, `eslint-config-next@15`.
- Tambah: `payload`, `@payloadcms/next`, `@payloadcms/db-postgres`, `@payloadcms/richtext-lexical`, `@payloadcms/plugin-seo`, `@payloadcms/plugin-redirects`, `sharp` (image processing), storage adapter (lihat 2.4).

### 2.2 Restrukturisasi App Router ke route groups
```
src/app/
  (frontend)/            # SELURUH halaman publik yang ada dipindah ke sini
    layout.tsx           # layout front-end existing
    page.tsx  tentang-.../  galeri/  mitra/ ... berita/[slug]/
  (payload)/             # dikelola Payload
    layout.tsx           # RootLayout dari @payloadcms/next
    admin/[[...segments]]/page.tsx
    api/[...slug]/route.ts
    api/graphql/route.ts
```
- `globals.css` front-end tetap; admin pakai style Payload sendiri (isolasi).
- Verifikasi tidak ada konflik root layout (html/body dipisah per group).

### 2.3 `payload.config.ts`
- `db: postgresAdapter({ pool: { connectionString: DATABASE_URI } })`.
- Editor: `lexicalEditor`.
- Daftar collections & globals (Modul 2).
- Plugins: seo, redirects, storage.
- `admin.meta` branding minimal: logo + aksen BiruGernas `#1E4F9E` (§7 — tanpa kustomisasi visual berat).

### 2.4 Koneksi Supabase & migrasi (penting utk portabilitas)
- **Runtime (Vercel serverless):** pakai **pooled** connection (pgBouncer, port 6543, `?pgbouncer=true`).
- **Migrasi/DDL (Drizzle):** pakai **direct** connection (port 5432).
- Env: `DATABASE_URI` (pooled), `DATABASE_URI_DIRECT` (migrasi).
- Migrasi via Payload/Drizzle: `payload migrate:create`, `payload migrate`. Simpan file migrasi di repo → skema reproducible (mendukung FR-009).
- **Aturan portabilitas:** JANGAN pakai Supabase Auth, RLS sebagai andalan logika, atau ekstensi non-standar. Auth = Payload. Skema = Postgres standar.

### 2.5 Storage media (keputusan)
- Local disk tidak cocok di Vercel (ephemeral). Opsi:
  - **Supabase Storage (S3-compatible)** via `@payloadcms/storage-s3` — konsisten satu vendor, endpoint S3 standar (cukup portabel).
  - **Vercel Blob** via `@payloadcms/storage-vercel-blob` — mudah, tapi proprietary Vercel.
- **Rekomendasi Fase 1:** Supabase Storage (S3 adapter). *Perlu konfirmasi.*

**Acceptance (FR-001):** buka URL staging → login `/admin` → dasbor termuat tanpa error, koneksi DB aktif.

---

## 3. Modul 2 — Dasbor CMS (FR-005 · US-001/002/003 · High)

**Tujuan:** staf non-teknis membuat & menyunting halaman/artikel tanpa developer (KPI No.5: min. 1 halaman + 1 artikel mandiri).

### 3.1 Collections & Globals
- **Users** (auth email+password; field `role`: admin/editor — minimal, OI-004).
- **Media** (upload, alt, caption).
- **Pages** (title, slug, `layout: blocks[]`, SEO group) → US-002.
- **Articles/Berita** (title, slug, `coverImage`, `category` relasi, `publishedAt`, `content` richText lexical, SEO) → US-003.
- **Categories**.
- **Redirects** (dari plugin) → Modul 3.
- **Globals:** `SiteSettings` (kontak, sosial, footer), `Navigation` (menu) — memetakan `src/lib/nav.ts` & `src/data/site.ts`.

### 3.2 Blocks (memetakan komponen Design System v2.0 yang sudah ada) — tergantung OI-007
Map 1:1 komponen `src/components/*` → Payload Block (props final dari sesi Design System v2.0 Bagian 2):

| Komponen existing | Block Payload | Field utama (draft) |
|---|---|---|
| `Hero` | `heroBlock` | heading, subheading, media, CTA[] |
| `StatCounterRow` | `statCounterBlock` | stats[]{label,value,suffix} |
| `Carousel` | `carouselBlock` | slides[]{image,caption,link} |
| `ValueCards` / grid | `gridBlock` | items[]{icon,title,text}, columns |
| `TestimonialCarousel` | `testimonialBlock` | testimonials[] |
| `PartnerLogoGrid` | `partnerLogoBlock` | logos[] (Media[]) |
| `VideoCard` | `videoBlock` | url, thumbnail, title |
| `CTABanner` | `ctaBlock` | heading, button |
| `NewsCard` listing | `latestNewsBlock` | limit, category filter |
| `ContactForm` | `contactBlock` | heading, recipient (front-end only, sesuai PRD v1.1) |
| `DonationTierButtons` | `donationTierBlock` | tiers[] (tanpa payment — fase lanjut) |
| `IndonesiaMap` | `mapBlock` | points[] |

> US-002 minimal (hero, counter, carousel, grid) = prioritas; sisanya menyusul agar paritas layout tercapai.

### 3.3 Rewire front-end: statis → Payload
- Ganti import `src/data/*.ts` dengan **Local API** Payload (`getPayload()` di server components) / `payload.find()`.
- Halaman dinamis dari `Pages`: `app/(frontend)/[...slug]/page.tsx` render `<RenderBlocks>` berdasarkan `layout`.
- Halaman `berita/[slug]` ambil dari `Articles`.
- Pertahankan SSG/ISR: `generateStaticParams` + revalidate (atau on-demand revalidation via Payload hooks `afterChange`).

### 3.4 Seed / migrasi konten awal
- Script `src/seed/` meng-import konten existing ke Payload:
  - `team.ts` (10 Penggerak), `news.ts` (4 artikel — junk tetap di-exclude per OI-003), `training.ts`, `gallery.ts`, `site.ts`.
  - Upload 111 aset `public/media/` ke Media collection.
- Dijalankan sekali; idempotent.

### 3.5 Branding admin & UAT
- Logo + warna aksen minimal (§7). Tanpa kustomisasi visual berat (jaga biaya Tarif Kemitraan).
- **Acceptance (FR-005):** sesi UAT — staf membuat 1 halaman + 1 artikel tanpa bantuan developer.

---

## 4. Modul 3 — SEO Parity (FR-007 · US-006 · High · KPI No.2)

> **Perubahan scope (2026-07-25):** atas instruksi klien langsung ke Encode Craft,
> **redirect map URL WordPress lama DIHAPUS dari cakupan** — domain/URL lama tidak
> akan dipertahankan aksesnya. Ini mengubah FR-007 dari yang tertulis di SPK
> (kontrak menyebut "100% redirect coverage"). **Belum ada konfirmasi tertulis
> dari klien Gernas Tastaka** — komunikasi/adendum kontrak jadi tanggung jawab
> Encode Craft, di luar sesi kerja ini. Berikut yang dieksekusi tetap sesuai
> instruksi terbaru (tanpa redirect map):
> - ~~Redirect map 301 dari URL WordPress lama~~ — dicoret
> - ~~OI-002 (2 halaman orphan)~~ — tidak relevan lagi
> - ~~OI-003 (5 post junk)~~ — tidak relevan lagi
> - Collection **Redirects** di Payload dibiarkan terpasang (tidak diisi) —
>   opsional dipakai in-house bila ada kebutuhan lain nanti.

**Tujuan (revisi):** sitemap & meta terpasang; submit GSC.

### 4.1 Sitemap, robots, metadata
- `app/(frontend)/sitemap.ts` (dinamis dari Articles, + halaman statis).
- `app/robots.ts`.
- `generateMetadata()` tiap halaman artikel ambil dari group **SEO**
  (`@payloadcms/plugin-seo`): title, description, OG image.
- Canonical URL, OG/Twitter tags.

### 4.2 Google Search Console
- Verifikasi domain (DNS TXT / file), submit `sitemap.xml`.
- **Manual step pasca-DNS-cutover.** Butuh akses GSC (dependency §9).
- **Acceptance (FR-007, revisi):** sitemap & meta tags terpasang; submission GSC
  terkonfirmasi. Pantau trafik pasca-cutover (baseline baru, tanpa jaminan
  paritas ke situs lama karena redirect tidak dipasang).

---

## 5. Modul 4 — DNS Cutover (FR-008 · US-007 · High · KPI No.4)

**Tujuan:** domain `gernastastaka.org` → Vercel **tanpa mengubah MX** (email `@gernastastaka.org` tetap normal).

### 5.1 Pra-cutover (runbook)
- Rekam DNS saat ini di cPanel Dewaweb: A, CNAME, **MX (JANGAN diubah)**, TXT/SPF/DKIM/DMARC.
- Turunkan TTL A/CNAME jauh sebelum cutover (mis. 300s).
- Uji kirim/terima email baseline (sebelum).
- Tambah domain di Vercel, siapkan verifikasi.

### 5.2 Cutover
- Arahkan **A / CNAME** (apex + `www`) ke Vercel. **MX & record email dibiarkan utuh.**
- Tunggu propagasi; verifikasi SSL Vercel terbit.
- Uji kirim/terima email (sesudah) → 0 gangguan.

### 5.3 Rollback
- Simpan snapshot zona lama; bila gangguan → kembalikan A/CNAME ke origin lama.
- **Blok:** kredensial cPanel/Zone Editor (OI-008) dari klien.
- **Acceptance (FR-008):** domain menunjuk situs baru; uji email sebelum & sesudah → 0 gangguan; DNS terverifikasi propagasi.

---

## 6. Modul 5 — Portabilitas DB (FR-009 · US-008 · Medium · KPI No.6)

**Tujuan:** buktikan `pg_dump`/`pg_restore` ke Postgres lain di luar Supabase berhasil utuh.

- **Audit anti-proprietary:** pastikan skema tak bergantung pada Supabase Auth/RLS/ekstensi non-standar (dijaga sejak Modul 1).
- Script `scripts/db-portability-test.sh`:
  - `pg_dump` dari Supabase (schema + data, format `custom`/`plain`).
  - `pg_restore`/`psql` ke **Postgres terpisah** (Docker lokal `postgres:16`).
  - Validasi: hitung baris per tabel, jalankan app terhadap DB hasil restore → dasbor & data pulih.
- Dokumentasikan langkah (untuk jaminan bebas vendor lock-in ke klien).
- **Acceptance (FR-009):** 1x demonstrasi `pg_dump`→`pg_restore` ke server terpisah, data & skema pulih utuh.

---

## 7. Deploy (Vercel) & Environment

- Env di Vercel: `DATABASE_URI` (pooled), `DATABASE_URI_DIRECT`, `PAYLOAD_SECRET`, storage keys (S3/Supabase), `NEXT_PUBLIC_SERVER_URL`.
- Build: jalankan `payload migrate` saat deploy (build command / release step).
- Biaya di atas tier gratis ditagihkan ke klien (dependency §9).
- Preview deploy untuk UAT sebelum DNS cutover.

---

## 8. Urutan Milestone (selaras PRD §10) & dependensi

1. **Setup Arsitektur** (Modul 1) — butuh Supabase + env. *(Blok jika belum ada connection string.)*
2. **Build Dasbor CMS** (Modul 2) — butuh OI-007 (props Block) & Design System v2.0 final.
3. **Seed konten** — dari `src/data/*` + media.
4. **SEO Parity** (Modul 3) — butuh daftar URL lama (sudah ada di XML) + akses GSC.
5. **Test Restore Portabilitas** (Modul 5) — setelah DB berisi data migrasi.
6. **DNS Cutover** (Modul 4) — butuh OI-008 (cPanel). Dilakukan setelah UAT lulus.
7. **Handover & Training CMS** — 1 sesi pelatihan staf + dokumentasi dasbor.

> Catatan urutan: **Portabilitas (5) sebaiknya dites sebelum DNS cutover (6)** agar jaminan bebas lock-in tervalidasi saat situs masih di staging.

---

## 9. Peta FR → Acceptance (PRD §8)

| FR | Kondisi Lolos |
|---|---|
| FR-001 | Dasbor termuat tanpa error, koneksi DB aktif |
| FR-005 | Min. 1 halaman + 1 artikel dibuat/disunting staf mandiri (UAT) |
| FR-007 | Redirect map 100%; sitemap+meta terpasang; GSC terkonfirmasi |
| FR-008 | 0 gangguan email; DNS terverifikasi propagasi |
| FR-009 | Data & skema pulih utuh 1x demonstrasi |

---

## 10. Keputusan yang perlu ditutup sebelum coding

1. **Upgrade Next 15 dalam satu app** (rekomendasi) vs app Payload terpisah. → menentukan Modul 1.
2. **Supabase connection string** (pooled + direct) & pembuatan project.
3. **Storage media:** Supabase Storage S3 (rekomendasi) vs Vercel Blob.
4. **OI-007:** jadwalkan sesi teknis props Block sebelum Modul 2 coding.
5. **OI-002 / OI-003:** keputusan orphan pages & post junk untuk redirect map.
6. **OI-008:** kredensial cPanel Dewaweb untuk cutover.
