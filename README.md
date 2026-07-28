# Gernas Tastaka — Website (Sprint 1: Migrasi Front-End)

Migrasi halaman publik Gernas Tastaka dari WordPress ke **Next.js 14 (App Router) + Tailwind CSS**, sesuai cakupan **PRD-GERNASTASTAKA-v1.1** (Fase 1 / Sprint 1 — front-end murni). Konten direplikasi setia dari WordPress export, dirapikan mengikuti **Design System v2.0**.

> Cakupan dokumen ini **hanya front-end**. Payload CMS, arsitektur backend, SEO teknis (redirect/sitemap/GSC), DNS/email, dan portabilitas database berada di dokumen **Backoffice & Teknis** terpisah (lihat PRD Bagian 11).

## Menjalankan

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build produksi (SSG)
```

## Struktur

```
src/
  app/                      # Routes (App Router)
    page.tsx                # Beranda
    tentang-gernas-tastaka/ # Profil + Penggerak + timeline + dampak
    galeri/  mitra/  donatur/
    tumbuh-bersama/  belajar-bersama/  publikasi/
    berita/[slug]/          # Detail 4 artikel (SSG)
  components/               # Komponen Design System v2.0
    Hero, ValueCards, StatCounterRow, TestimonialCarousel,
    Carousel, NewsCard, PartnerLogoGrid, VideoCard, CTABanner,
    IndonesiaMap, Navbar, Footer, ContactForm, DonationTierButtons
  data/                     # Konten hasil migrasi
    site.ts                 # slide, stat, testimoni, mitra, video, dsb.
    team.ts                 # 10 Penggerak (auto-generate dari WP export)
    news.ts                 # 4 artikel (auto-generate; junk di-exclude)
    training.ts             # 6 modul pelatihan + timeline
    gallery.ts              # daftar gambar galeri
public/media/               # 111 aset media hasil migrasi
```

## Cakupan konten (paritas WordPress)

- **8 halaman publik**: Beranda, Tentang, Galeri, Mitra, Donatur, Tumbuh Bersama, Belajar Bersama, Publikasi.
- **10 profil Penggerak** (kategori `penggerak`, id 19).
- **4 artikel/berita** (id 737, 733, 718, 730). 5 post junk (Lorem Ipsum, "Hello world!", shortcode mati) di-exclude sesuai Technical Brief Lampiran A.5.

## Catatan implementasi

- **Region Vercel (`vercel.json`)**: fungsi dikunci ke `sin1` (Singapura) agar satu
  benua dengan database Supabase (`ap-southeast-1`). Tanpa ini Vercel memakai
  default `iad1` (Washington DC), sehingga setiap query menempuh ~230 ms pulang
  pergi — dasbor Payload yang menembak puluhan query per halaman jadi terasa
  sangat lambat, padahal di komputer lokal (Indonesia → Singapura, ~25 ms) terasa
  wajar. JSON tidak bisa memuat komentar, jadi alasannya dicatat di sini: jangan
  ubah region tanpa memindahkan database-nya sekalian.
- **Design System v2.0** dipetakan ke token Tailwind (`tailwind.config.ts`): merah `#B4181F`, navy `#1B2A63`, biru `#1E4F9E`, kuning `#F6C321`; font **Plus Jakarta Sans**.
- **Donasi**: tombol "DONASI SEKARANG" sengaja tanpa aksi (payment gateway di luar cakupan — fase lanjutan).
- **Form kontak**: front-end only, fallback ke `mailto:` (belum ada backend submit).
- **IndonesiaMap**: siluet arsipelago tersstilisasi (bukan peta survei) untuk visual sebaran.
- **Peta typografi** belum 100% terverifikasi vs Figma (OI di PRD) — Plus Jakarta Sans dipakai sebagai pendekatan terdekat.
