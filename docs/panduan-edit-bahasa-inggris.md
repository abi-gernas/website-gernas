# Panduan Mengelola Versi Bahasa Inggris

Untuk tim konten Gernas Tastaka. Situs punya dua versi: Indonesia di `gernastastaka.org/` dan Inggris di `gernastastaka.org/en`.

---

## Yang paling penting dulu

**Versi Inggris tidak akan pernah kosong.** Kalau suatu teks belum diterjemahkan, halaman `/en` otomatis menampilkan versi Indonesianya. Jadi:

- Anda **tidak wajib** menerjemahkan apa pun sebelum menerbitkan.
- Menerjemahkan bisa bertahap, sedikit demi sedikit.
- Tidak ada risiko halaman `/en` tampil bolong atau rusak.

**Isi berita/artikel sengaja tidak dibuat dua bahasa.** Judul berita punya versi Inggris, tapi isi lengkapnya tetap Indonesia di kedua versi situs. Ini keputusan sadar supaya tim tidak terbebani menulis ulang tiap berita.

---

## Cara 1 — Lewat dasbor Payload (untuk edit sehari-hari)

Ini cara normal. Pakai ini kalau mau memperbaiki satu-dua kalimat.

1. Buka dasbor: `gernastastaka.org/admin`
2. Buka halaman/konten yang mau diedit, misalnya **Halaman → Beranda**.
3. Di **pojok kanan atas** ada pemilih bahasa bertuliskan **Indonesia**. Klik, pilih **English**.
4. Isian di layar sekarang menampilkan versi Inggris. Ketik terjemahannya.
5. Klik **Save**.

**Yang perlu diperhatikan:**

- Kotak yang **kosong** artinya belum diterjemahkan → situs akan menampilkan versi Indonesia di tempat itu. Itu normal, bukan error.
- Kalau Anda mengosongkan kembali kotak yang sudah diisi, teksnya kembali menampilkan versi Indonesia.
- **Tidak semua isian punya versi Inggris.** Yang tidak berubah saat Anda ganti bahasa berarti memang dipakai bareng — misalnya gambar, tautan/URL, warna, nomor telepon, email, nama orang, dan nama mitra. Ini disengaja: mengubahnya di satu bahasa akan mengubahnya di kedua bahasa.
- **Menyimpan saat mode English tidak menghapus versi Indonesia.** Keduanya disimpan terpisah.

### Isian mana saja yang punya versi Inggris

Hampir semua teks yang dibaca pengunjung:

| Bagian | Contoh |
|---|---|
| Halaman | judul halaman, judul SEO, deskripsi SEO |
| Hero & judul bagian | judul, judul sorot (yang kuning), deskripsi |
| Kartu | judul, subjudul, isi kartu, isi Visi/Misi |
| Teks bebas | seluruh isi paragraf di blok Teks Bebas |
| Tombol & tautan kecil | "Mari Belajar!", "Penggerak", "Selengkapnya →" |
| Testimoni | kutipan dan jabatan/asal (nama orang tidak) |
| Linimasa | teks peristiwa (angka tahun tidak) |
| Statistik | keterangan angka dan akhiran (mis. "ribu") |
| Kartu ide | judul ide, label kelas, label topik |
| Kampanye donasi | nama kampanye |
| Kategori artikel | nama kategori |
| Gambar | teks alternatif (alt) dan keterangan |
| Penggerak | nama peran/jabatan (nama orang tidak) |
| Video | judul video |
| Modul pelatihan | judul modul dan poin-poin tujuan |
| Judul berita | judul artikel (isi artikel tidak) |

---

## Cara 2 — Terjemahan borongan lewat file (untuk banyak teks sekaligus)

Pakai ini kalau ada banyak teks yang belum diterjemahkan dan tidak praktis satu-satu di dasbor. Perlu akses terminal.

### Langkah 1 — Keluarkan yang belum diterjemahkan

```bash
npm run translate:export
```

Menghasilkan `scripts/i18n/translations.json`, berisi **hanya** teks yang versi Inggrisnya masih kosong. Bentuknya:

```json
[
  {
    "key": "pages_blocks_callout|6a67...|judul",
    "context": "pages:beranda > Blok Kotak Sorot > judul",
    "teks_id": "Tentang Gernas Tastaka",
    "teks_en": ""
  }
]
```

### Langkah 2 — Isi kolom `teks_en`

Kirim file itu ke AI penerjemah (ChatGPT/Gemini/Claude) dengan permintaan seperti:

> Tolong isi field `teks_en` pada setiap objek di JSON ini dengan terjemahan bahasa Inggris dari `teks_id`. Gunakan `context` sebagai petunjuk di mana teks itu tampil. **Jangan ubah** `key`, `context`, atau `teks_id`. Nama orang dan nama lembaga jangan diterjemahkan. Kembalikan JSON utuh dengan struktur yang sama.

Simpan hasilnya **menimpa** `scripts/i18n/translations.json`.

### Langkah 3 — Masukkan kembali ke situs

```bash
npm run translate:import
```

Skrip akan menyebut berapa kolom yang ditulis. Entri yang `teks_en`-nya dibiarkan kosong akan dilewati — aman, tinggal diisi lain kali.

### Langkah 4 — Pastikan

```bash
npm run translate:export
```

Kalau tertulis **"0 teks belum punya versi Inggris"**, semuanya sudah terjemah.

### Catatan soal paragraf panjang

Isi blok **Teks Bebas** dipecah per paragraf, ditandai `#0`, `#1`, dan seterusnya di akhir `key`, dengan `context` bertuliskan "(paragraf 1)". Ini disengaja supaya AI menerjemahkan kalimat biasa, bukan menyunting struktur JSON. Penebalan, daftar, dan tautan di dalam paragraf tetap utuh.

> **Penting:** jangan mengedit isi paragraf versi Indonesia di dasbor di antara langkah 1 dan 3. Nomor paragraf bisa bergeser dan terjemahan masuk ke tempat yang salah. Kalau terlanjur, ulangi dari langkah 1.

---

## Yang belum bilingual (dan alasannya)

| Hal | Kenapa |
|---|---|
| Isi lengkap artikel berita | Keputusan tim — menghindari kewajiban menulis ulang tiap berita |
| Alamat URL halaman (slug) | `/en/tentang-gernas-tastaka` tetap pakai kata Indonesia. Mengubahnya akan memutus tautan yang sudah tersebar dan peringkat Google |
| Nama orang & nama mitra | Nama diri tidak diterjemahkan |
| Menu navigasi & footer | Sudah dua bahasa, **tapi diatur di kode** ([`src/lib/nav.ts`](../src/lib/nav.ts)), bukan di dasbor. Minta bantuan pengembang untuk mengubahnya |
| Teks antarmuka | Label seperti "Kirim Pesan", "Baca Selengkapnya" juga di kode ([`src/lib/i18n.ts`](../src/lib/i18n.ts)) |
| Pengaturan Situs (alamat, teks footer) | Sudah bisa dua bahasa di dasbor, **tapi footer saat ini masih membaca dari kode**, jadi mengubahnya di dasbor belum berpengaruh. Perlu disambungkan pengembang |

---

## Kalau ada yang salah

**Teks Inggris tidak muncul, masih tampil Indonesia.**
Kemungkinan besar isian versi Inggrisnya memang masih kosong — itu perilaku normal (fallback). Cek di dasbor dengan mengganti pemilih bahasa ke English.

**Sudah diisi tapi situs belum berubah.**
Halaman di-cache. Tunggu sebentar, atau minta pengembang menjalankan ulang penerbitan.

**Salah mengisi dan ingin kembali ke bahasa Indonesia.**
Kosongkan isian versi Inggrisnya, lalu Save. Situs otomatis kembali menampilkan versi Indonesia.

**Menambah bahasa ketiga.**
Perlu pengembang: tambah kode bahasa di `localization` pada [`src/payload.config.ts`](../src/payload.config.ts), buat folder rute baru seperti `src/app/(frontend)/en/`, lalu jalankan migrasi database.
