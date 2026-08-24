# PRD Gernas Tastaka — Fase 2 v1.2: Library Materi untuk Guru

> **Tanggal:** 24 Agustus 2026
> **Menggantikan:** `PRD-GERNASTASTAKA-FASE2-v1.1` (dokumen eksternal, tidak ada
> di repo — ringkasan FR/OI-nya direkonstruksi dari `docs/checkpoint-prd-vs-realita.md`
> §5 dan catatan keputusan sesi 25 Jul 2026)
> **Status:** Draft — hasil review mockup desain Library, belum dikontrak
> (lihat OI-104)
> **Pemicu:** Review 6 mockup desain (Video Pembelajaran, Alat Peraga, Buku/Bahan
> Ajar & Modul, Media Digital Interaktif, homepage, beranda "Perangkat
> Pembelajaran untuk Guru") + klarifikasi user 24 Agu 2026

---

## 1. Latar Belakang & Tujuan

Fase 2 membangun **Library** — pusat materi pembelajaran untuk guru, terdiri
dari 4 kategori. Materi PDF gratis disimpan di **Google Drive** (bukan
Supabase Storage) untuk menghemat kuota storage berbayar, sesuai arahan
langsung user 24 Agu 2026. Sebagian materi (Buku/Bahan Ajar/Modul) berbayar.

Ini menggantikan model akses "publik penuh" yang sempat jadi opsi awal
(lihat `[[fase2-keputusan-desain]]`), dan memperluas cakupan v1.1 dari
1 Library generik menjadi **4 kategori terpisah** sesuai mockup terbaru.

## 2. Ruang Lingkup — 4 Kategori Library

| Kategori | Model akses | Penyimpanan file | Halaman mockup |
|---|---|---|---|
| **Buku, Bahan Ajar & Modul** | Gratis (gated form) **atau** berbayar (harga tertera, format PDF / PDF+Cetak) | Google Drive (PDF) | ✅ ditinjau |
| **Alat Peraga** | Showcase only — tombol "Detail", tanpa unduhan/checkout online | Media (Supabase, gambar produk) | ✅ ditinjau |
| **Video Pembelajaran** | Gratis, streaming | Perlu diputuskan: YouTube embed vs upload (lihat OI-106) | ✅ ditinjau |
| **Media Digital Interaktif** | Tautan eksternal (Roblox world, halaman HTML mandiri) — klik "Buka Link" langsung keluar situs | Tidak perlu file di sisi kita, cuma metadata + URL | ✅ ditinjau |

Di luar lingkup dokumen ini: sistem **Acara/Program** ("Bincang Gernas",
"Pelatihan Matematika" dengan tombol "Daftar Sekarang!") yang muncul di
beberapa mockup — belum ada collection-nya di kode, butuh PRD terpisah kalau
mau digarap (lihat §5 OI-109).

## 3. Keputusan yang Sudah Diambil (24 Agu 2026)

| # | Keputusan | Konteks |
|---|---|---|
| 1 | Checkout "Beli Sekarang" — **belum diputuskan**, dicatat sbg open issue | User eksplisit belum mau memilih antara payment gateway vs redirect WA |
| 2 | Yang berbayar **hanya** Buku/Bahan Ajar/Modul | Alat Peraga & Video tetap gratis/showcase, sesuai apa yang tergambar di mockup — bukan penambahan scope |
| 3 | Materi gratis **tetap gated form** (isi nama + asal instansi/sekolah sebelum link Drive terbuka) | Menegaskan ulang keputusan 25 Jul 2026, bukan diganti direct-download |
| 4 | OAuth Google Drive **masih belum dibuat** | Blocker FR-101 berlanjut dari 25 Jul 2026, belum ada progres |

## 4. Functional Requirements

### 4.1 Carry-over dari v1.1 (unchanged, masih berlaku)

| FR | Deskripsi | Status |
|---|---|---|
| FR-101 | Materi PDF gratis disimpan di Google Drive akun nonprofit, diakses via OAuth | ❌ Blocked — OAuth client belum dibuat di Google Cloud Console, folder materi belum disiapkan |
| FR-102 | UI kustom telusuri & cari materi | ❌ Belum — sekarang mencakup 4 kategori, bukan 1 (lihat §2) |
| FR-103 | Pratinjau materi dalam UI situs | ❌ Belum |
| FR-104 | Unduh materi gratis di-gate form (nama + asal instansi/sekolah/daerah) sebelum link Drive terbuka | ❌ Belum — keputusan model akses dikonfirmasi ulang di §3.3 |
| FR-105 | CMS CRUD collection `Kolaborasi` (portofolio kerja sama mitra) | ❌ Belum — di luar fokus dokumen ini, tidak berubah dari v1.1 |

### 4.2 Baru di v1.2

| FR | Deskripsi | Catatan |
|---|---|---|
| **FR-106** | Katalog Alat Peraga — grid produk (gambar, judul, jenjang, mapel), halaman detail per produk (foto, deskripsi, isi paket). **Tanpa** unduhan atau checkout online. | Kalau nanti alat peraga mau dijual online, itu FR baru (butuh stok + ongkir) — eksplisit di luar v1.2 |
| **FR-107** | Katalog Video Pembelajaran — grid video per jenjang/mapel, gratis, tanpa gate | Butuh keputusan hosting, lihat OI-106 |
| **FR-108** | Katalog Media Digital Interaktif — daftar aktivitas dengan tautan eksternal, field: judul, deskripsi, thumbnail, tag, URL. Klik "Buka Link" → keluar situs | Paling ringan, tidak bergantung ke OAuth Drive maupun checkout |
| **FR-109** | Varian format & harga di Buku/Bahan Ajar/Modul — field `format` (PDF / PDF+Cetak) dan `status` (Gratis / Berbayar + harga). Gratis → alur FR-104. Berbayar → FR-110 | Field harga tampil per mockup "LKS FONIK" (Rp20.000) |
| **FR-110** | Checkout "Beli Sekarang" untuk item berbayar | ❌ **BLOCKED — OI-105.** Lihat rekomendasi §6 |

## 5. Model Data — Collection Payload Baru/Ubah

Collection eksisting (`Video`, `ModulPelatihan`, `Leads`, `Categories`) tidak
punya field yang cocok untuk katalog produk (jenjang, mapel, format, harga,
tag) — jadi perlu collection baru, bukan perluasan collection lama, supaya
tidak mencampur data katalog dengan data operasional beranda/Tumbuh Bersama
yang sudah ada.

| Collection baru | Untuk | Field inti (usulan) |
|---|---|---|
| `Produk` | Buku, Bahan Ajar & Modul | judul, kategori (Modul/Buku/Bahan Ajar/LKS), jenjang, mapel, deskripsi, cover, format (PDF/PDF+Cetak), status (Gratis/Berbayar), harga, tautan Drive (file id) |
| `AlatPeraga` | Alat Peraga | judul, jenjang, mapel, deskripsi, galeri foto, isi paket |
| `VideoPembelajaran` | Video Pembelajaran | judul, jenjang, mapel, thumbnail, sumber video (lihat OI-106) — **collection terpisah dari `Video` yang sudah ada**, karena `Video` eksisting isinya rekaman Bincang Gernas untuk beranda/Tumbuh Bersama, tujuannya beda dari katalog per-mapel ini |
| `MediaInteraktif` | Media Digital Interaktif | judul, deskripsi, thumbnail, tag, tautan eksternal |

Untuk gated-download (FR-104), dua opsi:
- **Extend `Leads`** dengan field `jenis` (Kontak / Unduhan Materi), `asalInstansi`, relasi ke `Produk` yang diunduh.
- **Collection baru** `PermintaanUnduhan`, terpisah dari form Hubungi Kami.

Rekomendasi: extend `Leads` — field-nya (nama, dsb) sudah dekat, dan staf
cukup buka satu tempat untuk semua data pengunjung masuk. Perlu dikonfirmasi
saat masuk tahap desain teknis.

> **Catatan carry-over dari keputusan lama (belum ada tindak lanjut):**
> gated-download menambah scope di luar Lampiran A-2 SPK dan mengumpulkan
> **data pribadi guru** (nama, asal sekolah). Perlu kebijakan retensi, siapa
> yang boleh lihat/ekspor, dan dasar hukum pengumpulan — item adendum, jangan
> diam-diam masuk estimasi lama.

## 6. Open Issues

| ID | Isu | Status | Blocking |
|---|---|---|---|
| OI-101 | Model akses Library — publik + gated form | ✅ **Selesai** (dikonfirmasi ulang 24 Agu 2026) | — |
| OI-103 | Model data `Kolaborasi` sbg collection baru | ⏸️ Belum berubah dari v1.1, tidak direview kali ini | FR-105 |
| OI-104 | Kontrak Fase 2 belum ditandatangani | ❌ Masih terbuka | Semua FR Fase 2 — governance, bukan teknis |
| **OI-105** *(baru)* | Mekanisme checkout "Beli Sekarang" — payment gateway (mis. Midtrans/Xendit) vs redirect WhatsApp admin | ❌ **Belum diputuskan user**, ditunda sengaja | FR-110 |
| **OI-106** *(baru)* | Hosting Video Pembelajaran — YouTube embed (gratis, tanpa kuota) vs upload ke Supabase Storage (kuota berbayar, kontrol penuh) | ❌ Belum diputuskan | FR-107 |
| **OI-107** *(baru)* | Kebijakan retensi/akses data leads gated-download | ❌ Belum diputuskan, carry-over dari 25 Jul 2026 | FR-104 (compliance, bukan blocker teknis) |
| **OI-108** *(carry-over)* | OAuth Google Drive belum dibuat | ❌ Masih terbuka, tidak ada progres sejak 25 Jul 2026 | FR-101, FR-104, FR-109 (jalur gratis) |
| **OI-109** *(baru)* | Fitur Acara/Program ("Daftar Sekarang!") terlihat di mockup tapi tidak diminta dalam scope Library ini | ℹ️ Dicatat saja, PRD terpisah kalau mau digarap | — |

## 7. Dependensi & Urutan Kerja

```
OI-108 (OAuth Drive)  ──▶  FR-101, FR-104, FR-109 (jalur gratis)
OI-104 (kontrak)      ──▶  semua FR Fase 2 (mulai coding)
OI-105 (checkout)     ──▶  FR-110 saja
OI-106 (hosting video)──▶  FR-107 saja
```

FR-106 (Alat Peraga) dan FR-108 (Media Interaktif) **tidak bergantung ke
blocker manapun** di atas — bisa mulai duluan begitu OI-104 (kontrak) beres.

## 8. Rekomendasi Urutan Rilis

Supaya tidak semua fitur menunggu OAuth Drive & keputusan checkout beres
bersamaan:

1. **Sprint 1** — Media Digital Interaktif (FR-108) + Alat Peraga (FR-106). Paling ringan, tanpa dependency eksternal.
2. **Sprint 2** — Video Pembelajaran (FR-107), setelah OI-106 diputuskan.
3. **Sprint 3** — Buku/Bahan Ajar/Modul jalur gratis (FR-101–104, FR-109 sisi Gratis), begitu OI-108 (OAuth Drive) beres — ini nilai terbesar tapi paling terblokir.
4. **Sprint 4** — Checkout berbayar (FR-110), begitu OI-105 diputuskan. Kalau OI-105 belum selesai saat Sprint 3 rilis, sembunyikan/nonaktifkan tombol "Beli Sekarang" dan tampilkan link "Hubungi Kami" (WA) sebagai fallback sementara — jangan biarkan tombol mati tanpa aksi.

## Riwayat Revisi

| Versi | Tanggal | Perubahan |
|---|---|---|
| 1.1 | (eksternal, tidak tercatat tanggal di repo) | 1 Library generik, OI-101–104 |
| 1.2 | 24 Agu 2026 | Pecah jadi 4 kategori sesuai mockup (Buku/Alat Peraga/Video/Media Interaktif); FR-106–110 baru; OI-105–109 baru; OI-101 ditutup |
