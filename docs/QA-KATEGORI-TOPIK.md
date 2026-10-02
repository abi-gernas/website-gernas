# QA dasbor: Kategori & Topik katalog Buku/Bahan Ajar/Modul

Diuji 2 Okt 2026 dengan Playwright (MCP) di **database lokal sementara**, bukan Supabase.
Akun admin uji sengaja tidak dibuat di Supabase.

## Menyiapkan lingkungan uji

1. Postgres lokal kosong (contoh port 54329, database `scratch`), lalu terapkan semua migrasi:

   ```bash
   export DATABASE_URI=postgresql://postgres@127.0.0.1:54329/scratch
   export DATABASE_URI_DIRECT=$DATABASE_URI
   npm run migrate
   ```

2. Buat akun admin uji (menolak jalan kalau `DATABASE_URI` bukan localhost). Email dan kata sandi
   acaknya ditulis ke `.env.qa` (tidak ikut git) — lihat
   [scripts/seed-qa-user.mts](../scripts/seed-qa-user.mts):

   ```bash
   npx tsx scripts/seed-qa-user.mts
   ```

3. Jalankan situs **di port 3000** (harus sama dengan `NEXT_PUBLIC_SERVER_URL`, kalau tidak
   simpan di dasbor ditolak 403 oleh pemeriksaan CSRF):

   ```bash
   npx next dev -p 3000
   ```

4. Buka `http://localhost:3000/admin/login`, masuk dengan akun dari langkah 2.

Kategori Matematika/Membaca beserta 6 topik awal sudah ikut terisi oleh migrasi.

## Skenario yang diuji (semua lolos)

| # | Langkah | Hasil yang diharapkan |
|---|---------|-----------------------|
| 1 | Menu dasbor | Kategori Produk & Topik Produk **tidak** ada di menu |
| 2 | Produk → Buat Baru → tombol **+** di Kategori → isi "Seni Rupa" → Simpan | Terbuat, slug `seni-rupa`, otomatis terpilih di form produk |
| 3 | Simpan tanpa nama di drawer | Ditolak: "Isian ini wajib diisi" |
| 4 | Buka dropdown Topik saat Kategori = Seni Rupa | "Tidak ada opsi" (topik tersaring per kategori) |
| 5 | Pilih Kategori, lalu tombol **+** di samping Topik → isi nama, ikon/warna → Simpan | Drawer terbuka dengan Kategori sudah terisi; setelah simpan topik otomatis terpilih |
| 6 | Isi judul + jenjang → Simpan produk | Tersimpan |
| 7 | Pilih topik, lalu ganti Kategori | Topik otomatis dikosongkan |
| 7b | Buka produk yang sudah ada | Kategori & Topik tetap terisi (tidak ikut dikosongkan) |
| 8 | `/buku-bahan-ajar-modul` | Pil kategori berurutan menurut `urutan`; kategori & topik baru langsung tampil |
| 9 | Klik pil Matematika lalu kartu Pecahan | URL `?kategori=matematika&topik=pecahan`, daftar tersaring, chip "Matematika › Pecahan" |
| 10 | Layar 390px | Tidak ada scroll horizontal, kartu tersusun satu kolom |
| 11 | `DELETE /api/kategori-produk/{id}` untuk kategori yang masih punya topik | 400: "Tidak bisa dihapus: masih dipakai 1 topik…" |

## Catatan

- Kategori & topik dikelola dari form Produk (tanpa menu): kategori lewat tombol **+** / pensil bawaan,
  topik juga lewat tombol **+** / pensil di samping kolomnya. Komponen pendukungnya:
  [TopikProdukField.tsx](../src/payload/components/TopikProdukField.tsx) (kosongkan topik saat kategori diganti,
  titipkan kategori) dan [KategoriTopikField.tsx](../src/payload/components/KategoriTopikField.tsx)
  (isi Kategori di drawer topik baru).
- Validasi di server tetap menolak topik yang bukan milik kategorinya (jaga-jaga bila diisi lewat API/seed).
- Error 400 di konsol browser saat pengujian adalah penolakan validasi yang disengaja (skenario 3).
