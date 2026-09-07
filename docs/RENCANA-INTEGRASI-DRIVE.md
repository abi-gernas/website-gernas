# Rencana Integrasi Google Drive — Materi PDF

> **Acuan:** `docs/PRD-GERNASTASTAKA-FASE2-v1.2.md` (FR-101, FR-104, FR-109,
> OI-108) dan `docs/RENCANA-EKSEKUSI-LIBRARY-GURU.md`.
> **Ditulis:** 7 Sep 2026, sesi pengisian data asli koleksi `produk`.

Tujuan dokumen ini: menutup OI-108 secara bertahap, tanpa menunggu OAuth
selesai. Setiap tahap **bisa dirilis sendiri** dan tahap berikutnya cuma
mengganti satu fungsi, bukan menulis ulang.

Alasan memakai Drive sama sekali: PDF materi berukuran 3–7 MB per berkas.
79 berkas ≈ 300–500 MB — itu di luar jatah storage paket hosting/Supabase
yang dipakai situs sekarang. Drive dipakai sebagai penyimpanan berkas, situs
cuma menyimpan metadata + gambar sampul kecil.

---

## 0. Keadaan sekarang (SUDAH JALAN — 7 Sep 2026)

| Hal | Nilai |
| --- | --- |
| Sumber berkas | Folder Drive **"Konten"** `1ucyEM7NXmqJhQyNtnuNqZCePno37VF86`, pemilik `gernastastaka.online@gmail.com` |
| Akses | "Siapa saja yang punya tautan" (publik) |
| Kredensial | **Tidak ada** — tidak perlu OAuth/API key |
| Cara ambil daftar berkas | `npm run drive:fetch` → `scripts/fetch-drive-konten.mts` → `scripts/data-produk-drive.json` |
| Cara isi CMS | `npm run seed:produk-drive` → `scripts/seed-produk-drive.mts` |
| Hasil | 79 dokumen `produk`, 6 topik, sampul = gambar halaman pertama tiap PDF |
| Unduh oleh pengunjung | Langsung ke `drive.google.com/file/d/<id>/view` (tanpa gating form) |

**Batas yang diterima sadar di tahap ini:**

1. `fetch-drive-konten.mts` membaca endpoint `drive.google.com/embeddedfolderview`
   yang **bukan API resmi Google**. Tidak butuh kredensial, tapi bisa berubah
   sewaktu-waktu tanpa pemberitahuan. Kalau suatu hari `npm run drive:fetch`
   mengembalikan 0 berkas, itu penyebab pertama yang dicek — lompat ke Tahap 1.
2. Berkasnya harus tetap "siapa saja yang punya tautan". Begitu izinnya
   diperketat, baik daftar berkas maupun sampulnya berhenti bisa diambil.
3. **FR-104 (gating form) belum ada.** PRD mensyaratkan pengunjung mengisi nama +
   asal instansi sebelum tautan terbuka; sekarang tombol unduh langsung ke Drive.
   Ini ditutup di Tahap 3.
4. `jenjang` semua dokumen diisi `["sd"]` sebagai asumsi. Sebagian materi
   (Bilangan Bulat, Diagonal Bidang & Diagonal Ruang, Mean/Median/Modus)
   sebenarnya SMP. Betulkan per dokumen lewat dasbor — skrip tidak menimpanya
   lagi setelah dokumen dibuat.
5. `ringkasan` masih kosong untuk semua dokumen (kartu katalog jadi agak polos).
   Isi lewat dasbor, atau lihat gagasan otomatisasi di §6.

---

## 1. Yang perlu KAMU siapkan di Drive-mu

Ini bagian yang tidak bisa dikerjakan dari kode. Urutannya penting.

### 1.1 Pindahkan/salin materi ke akun Drive yang kamu kendalikan

Folder "Konten" sekarang milik `gernastastaka.online@gmail.com`. Selama
akun itu bukan kamu yang pegang, kamu tidak bisa mengubah izin, memindahkan
berkas, atau memberi akses ke service account nanti.

Pilihannya:

- **A (paling rapi).** Minta pemilik akun mentransfer kepemilikan folder
  "Konten" ke akun Drive organisasi yang kamu pegang. Drive → klik kanan folder
  → *Bagikan* → ubah peran akunmu jadi **Pemilik**. File id **tidak berubah**,
  jadi `data-produk-drive.json` dan seluruh `tautanDrive` di CMS tetap valid —
  tidak perlu jalankan ulang apa pun.
- **B.** Salin isinya ke Drive-mu (*Buat salinan* → pindahkan ke folder
  barumu). File id **berubah semua**. Konsekuensinya: ganti `FOLDER_AKAR` di
  `scripts/fetch-drive-konten.mts`, jalankan `npm run drive:fetch` +
  `npm run seed:produk-drive`. Skrip akan membuat **79 dokumen baru** (karena
  dicocokkan lewat file id) dan yang lama harus dihapus manual. Hindari kalau
  masih bisa pakai A.

> Jangan pilih B setelah situs live dan URL materinya sudah tersebar —
> slug produknya akan berubah dan tautan lama mati.

### 1.2 Struktur folder yang harus dijaga

Skrip membaca struktur ini, jadi pola penamaannya adalah kontrak:

```
Konten/                          ← FOLDER_AKAR di fetch-drive-konten.mts
├── 1. Geometri/                 ← nama folder = kunci di PETA_TOPIK
│   ├── 1. Bangun Datar Di Mana-Mana.pdf
│   ├── 2. Ternyata Mirip ya.pdf
│   └── …
├── 2. Bilangan Cacah/
├── 3. Pecahan/
├── 4. Bilangan Bulat/
├── 5. Statistika/
└── 6. Pengukuran/
```

Aturannya:

| Aturan | Kenapa |
| --- | --- |
| Nama berkas: `<nomor>. <Judul Materi>.pdf` | Nomor jadi urutan tampil, sisanya jadi judul produk di situs. Berkas tanpa nomor tetap masuk tapi ditaruh paling belakang. |
| Satu topik = satu folder, tidak bersarang lebih dalam | Skrip cuma turun satu tingkat. Sub-folder di dalam topik akan dilewati dengan peringatan. |
| Menambah folder topik baru = **wajib** update 3 tempat | `PETA_TOPIK` di `fetch-drive-konten.mts`, `options` field `topik` di `src/payload/collections/Produk.ts` (+ migrasi), dan `TOPIK_PRODUK_LABELS` + `topikKartu` di `src/lib/produk.ts` / `src/components/pages/ProdukListContent.tsx`. Skrip berhenti dengan pesan jelas kalau menemukan folder yang belum dipetakan, jadi tidak akan diam-diam salah. |
| Mengganti nama berkas: **aman** | Dokumen dicocokkan lewat file id, jadi judulnya ikut berubah tapi slug/URL-nya dipertahankan. |
| Memindahkan berkas antar folder topik: **aman** | `topik` dokumen ikut pindah pada `drive:fetch` + `seed:produk-drive` berikutnya. |
| Menghapus berkas dari Drive: **tidak** menghapus dokumennya di CMS | Sengaja — supaya salah hapus di Drive tidak menghilangkan halaman yang sudah terindeks. Hapus manual lewat dasbor. |
| Berkas non-PDF | Dilewati, muncul sebagai peringatan di log. |
| `Pak Yadi.pdf` di folder akar | Sengaja dikecualikan (`DILEWATI`) — isinya #CeritaKelas, bahan artikel bukan bahan ajar. |

### 1.3 (Opsional) tingkat jenjang sebagai sub-folder

Kalau kamu mau `jenjang` terisi otomatis dan berhenti jadi tebakan, ubah jadi:

```
1. Geometri/
├── SD/
│   └── 1. Bangun Datar Di Mana-Mana.pdf
└── SMP/
    └── 13. Diagonal Bidang dan Diagonal Ruang.pdf
```

Ini butuh perubahan kecil di `fetch-drive-konten.mts` (turun satu tingkat lagi,
nama sub-folder → nilai `jenjang`). **Putuskan ini sebelum Tahap 1**, karena
merapikan 79 berkas dua kali itu pekerjaan sia-sia. Kalau materinya memang
mayoritas SD dan cuma belasan yang SMP, membetulkannya lewat dasbor lebih murah.

---

## 2. Pembagian kerja di dasbor Payload

Sumber kebenaran koleksi `produk` sekarang **terbelah dua**: sebagian dari
Drive, sebagian dari staf. Kalau batas itu tidak jelas, suntingan staf akan
hilang diam-diam pada `seed:produk-drive` berikutnya. Ini batasnya.

### 2.1 Siapa memiliki field apa

| Field | Pemilik | Kalau disunting di dasbor |
| --- | --- | --- |
| `judul` | **Drive** (nama berkas) | Ditimpa saat skrip jalan lagi. Ganti nama berkasnya di Drive. |
| `topik` | **Drive** (nama folder) | Ditimpa. Pindahkan berkasnya antar folder di Drive. |
| `cover` | **Drive** (halaman pertama PDF) | Ditimpa. |
| `tautanDrive` | **Drive** (file id) | Ditimpa. Ini juga kunci pencocokan — **jangan diubah manual**, dokumennya akan terlihat sbg berkas baru. |
| `urutan` | **Drive** (nomor berkas + urutan folder) | Ditimpa. Ubah nomor di nama berkasnya. |
| `slug` | Drive **hanya saat dokumen dibuat** | Aman disunting. Skrip tidak pernah menimpanya lagi — justru itu yang menjaga URL tetap hidup saat berkas diganti nama. |
| `jenjang`, `mapel`, `kategoriProduk`, `status`, `format` | **Staf** | Aman. Skrip cuma mengisinya sekali saat dokumen dibuat. |
| `ringkasan`, `fiturUnggulan`, `harga`, field SEO | **Staf** | Aman, skrip tidak pernah menyentuhnya. |

Aturan singkat buat staf: **kalau isinya kelihatan datang dari nama berkas atau
nama folder di Drive, betulkan di Drive — bukan di dasbor.**

### 2.2 Cara menambah materi baru — **opsi A (diputuskan user, 7 Sep 2026)**

Isi awal 79 materi dimasukkan sekali secara gelondongan lewat skrip. Untuk
seterusnya, **materi baru ditambahkan manual lewat dasbor** — tidak ada
penjadwalan, tidak ada tombol tarik-dari-Drive.

Langkah staf:

1. Taruh PDF-nya di folder topik yang benar di Drive (tetap ikuti penamaan
   §1.2 — supaya kalau suatu saat skrip dijalankan lagi, berkas itu dikenali).
2. Di Drive, klik kanan berkas → *Bagikan* → pastikan **"Siapa saja yang punya
   tautan"**, lalu *Salin link*.
3. Di dasbor: **Produk (Buku/Bahan Ajar/Modul)** → *Create New*. Isi judul,
   tempel link tadi ke **Tautan Google Drive**, pilih Topik + Jenis materi +
   Jenjang + Mapel, unggah sampul, isi ringkasan.

Sampulnya: kalau tidak ada gambar khusus, pakai gambar halaman pertama PDF-nya
supaya seragam dengan 79 materi yang sudah ada. Alamatnya
`https://drive.google.com/thumbnail?id=<file id>&sz=w1000` — buka di browser,
simpan gambarnya, unggah lewat dasbor.

**Tidak akan bentrok dengan skrip.** Kalau `seed:produk-drive` dijalankan lagi
(mis. setelah folder Drive dirapikan), dokumen buatan staf dikenali lewat file
id di dalam tautannya — bentuk tautannya boleh beda (`?usp=sharing`,
`?usp=drivesdk`, tanpa query) — jadi **tidak dibuat duplikat**. Yang terjadi,
field milik Drive (§2.1) disamakan lagi dengan Drive: judul kembali mengikuti
nama berkas, sampul diganti halaman pertama PDF. Ringkasan, jenjang, mapel, dan
jenis materi buatan staf tetap utuh.

Konsekuensi yang harus diterima sadar: **tidak ada yang mengecek Drive
otomatis.** Kalau ada yang menaruh PDF di Drive tapi lupa membuat dokumennya di
dasbor, materi itu tidak akan pernah muncul di situs dan tidak ada peringatan
apa pun. Kalau suatu saat ini jadi masalah, dua jalan yang tadi ditolak masih
terbuka:

- **B — jadwalkan skripnya** lewat GitHub Actions (butuh `DATABASE_URI` +
  kredensial S3 sbg secret CI). Sebaiknya digabung dengan gerbang draft
  (`versions: { drafts: true }` seperti koleksi `Pages`/`Articles`) supaya
  materi baru masuk sbg draf yang menunggu dilengkapi, bukan langsung tayang
  setengah jadi.
- **C — tombol "Tarik dari Drive" di dasbor.** Paling enak dipakai, paling
  banyak kode. Jangan dikerjakan sebelum B terbukti kurang.

### 2.3 Hal yang perlu dijelaskan ke staf sebelum serah terima

- Menghapus berkas di Drive **tidak** menghapus halamannya di situs. Hapus
  dokumennya lewat dasbor juga.
- Dua field mirip di sidebar: **"Jenis materi"** (Modul/Buku/Bahan Ajar/LKS —
  bentuk materinya) dan **"Topik"** (Geometri/Pecahan/… — yang menentukan kartu
  di halaman katalog). Sekarang semua materi berjenis "Bahan Ajar", jadi yang
  perlu diperhatikan staf sehari-hari cuma Topik.
- Materi berbayar (`status: berbayar`) **belum punya alur checkout** — FR-110
  masih menunggu OI-105. Jangan menerbitkan produk berbayar dulu.

---

## 3. Tahap 1 — Drive API v3 + API key

**Kapan:** begitu `embeddedfolderview` terasa rapuh, atau begitu kamu mau CI
menjalankan `drive:fetch` otomatis. Tidak mendesak.

Berkas tetap "siapa saja yang punya tautan" — Drive API menerima **API key**
(bukan OAuth) untuk berkas publik, jadi tidak ada layar consent, tidak ada
refresh token yang bisa kedaluwarsa.

Langkah:

1. Google Cloud Console → buat project (mis. `gernas-web`) → **Enable API**
   → *Google Drive API*.
2. *Credentials* → *Create credentials* → **API key**. Batasi keynya:
   *API restrictions* → hanya Google Drive API. (Application restrictions tidak
   bisa dipakai karena dipanggil dari server, bukan browser.)
3. Simpan sebagai `GOOGLE_DRIVE_API_KEY` di `.env` — **jangan** pakai awalan
   `NEXT_PUBLIC_`, key ini tidak boleh sampai ke browser.
4. Ganti isi `ambilIsiFolder()` di `scripts/fetch-drive-konten.mts` dengan:

   ```ts
   const url = new URL("https://www.googleapis.com/drive/v3/files");
   url.searchParams.set("q", `'${folderId}' in parents and trashed = false`);
   url.searchParams.set("fields", "files(id,name,mimeType)");
   url.searchParams.set("pageSize", "1000");
   url.searchParams.set("key", process.env.GOOGLE_DRIVE_API_KEY!);
   const { files } = await fetch(url).then((r) => r.json());
   return files.map((f) => ({ id: f.id, nama: f.name }));
   ```

   Bentuk keluarannya sengaja sudah sama dengan yang sekarang, jadi sisa
   skripnya tidak perlu disentuh. Tambahkan paginasi (`nextPageToken`) kalau
   suatu saat satu folder isinya >1000 berkas.
5. Tidak ada perubahan di sisi situs. `seed-produk-drive.mts` tidak berubah.

**Batasnya:** berkas tetap harus publik, dan FR-104 tetap belum tertutup.

---

## 4. Tahap 2 — Service Account, berkas tidak lagi publik

**Kapan:** saat materi tidak boleh lagi bisa diunduh siapa saja yang menebak
tautan, atau saat FR-104 (gating form) mau benar-benar dijalankan.

Dipilih **service account**, bukan OAuth "Login with Google", karena situs
mengakses Drive **atas nama organisasi**, bukan atas nama pengunjung: tidak ada
alur login yang perlu dilewati, tidak ada refresh token yang bisa dicabut
diam-diam saat tidak ada yang memperhatikan.

Langkah:

1. Google Cloud Console (project yang sama) → *IAM & Admin* → **Service
   Accounts** → buat, mis. `gernas-web-drive@<project>.iam.gserviceaccount.com`.
2. Buat **JSON key**-nya, salin isinya (satu baris) ke `.env` sebagai
   `GOOGLE_SERVICE_ACCOUNT_JSON`. Di Vercel: Project Settings → Environment
   Variables. Jangan pernah commit berkas JSON-nya.
3. Di Drive: bagikan folder "Konten" ke alamat email service account itu
   sebagai **Pelihat (Viewer)**. Setelah itu izin "siapa saja yang punya
   tautan" boleh dicabut.
4. Scope yang diminta cukup `https://www.googleapis.com/auth/drive.readonly` —
   situs tidak pernah perlu menulis ke Drive.
5. Tambah `googleapis` (atau `google-auth-library` + `fetch` manual) ke
   dependencies, ganti pemanggilan API di `ambilIsiFolder()` dan di pengunduhan
   sampul (`pastikanSampul()` — `files.get?alt=media` untuk thumbnail, atau
   `thumbnailLink` dari `fields`).

> **Kuota:** service account punya Drive-nya sendiri tanpa jatah penyimpanan.
> Itu tidak jadi masalah di sini karena situs **hanya membaca**. Kalau suatu
> saat ada fitur yang mengunggah balik ke Drive, berkasnya harus diunggah ke
> Shared Drive (bukan My Drive) supaya kepemilikannya jatuh ke organisasi.

---

## 5. Tahap 3 — Unduhan lewat situs + gating form (FR-104)

Baru mungkin setelah Tahap 2, karena selama berkasnya publik, gating form
apa pun bisa dilewati dengan menyalin tautan Drive-nya.

Bentuknya:

1. Route handler `src/app/(frontend)/api/materi/[id]/route.ts` yang:
   - memeriksa apakah pengunjung sudah mengisi form (cookie/lead id yang
     tercatat di koleksi `Leads`),
   - kalau sudah, mengambil berkas dari Drive dengan kredensial service account
     dan mengalirkannya (`stream`) ke pengunjung.
2. Tombol unduh di `ProdukDetailContent.tsx` menunjuk ke route itu, bukan lagi
   ke `item.tautanDrive` langsung.
3. Field `tautanDrive` tetap ada — dipakai skrip sebagai kunci pencocokan dan
   sebagai jalan darurat kalau route unduhan bermasalah, tapi tidak lagi
   ditampilkan ke pengunjung.
4. Koleksi `Leads` sudah punya field yang dibutuhkan (dibuat di
   `migrations/20260824_075753_library_guru_collections.ts`) — tinggal
   menghubungkannya.

Sesudah tahap ini OI-108 bisa ditutup, dan FR-101/FR-104/FR-109 jalur gratis
selesai. FR-110 (checkout berbayar) tetap terpisah dan tetap menunggu OI-105.

---

## 6. Gagasan lanjutan (belum diputuskan, jangan dikerjakan tanpa arahan)

- **Isi `ringkasan` otomatis.** Teks tiap PDF bisa dibaca — halaman pertamanya
  memuat judul kegiatan, penulis, dan alat/bahan. Bisa dipakai untuk membuat
  ringkasan 1–2 kalimat per materi. Perlu keputusan: ditulis otomatis lalu
  ditinjau manusia, atau ditulis manusia dari awal. Jangan diterbitkan tanpa
  ditinjau — ini teks yang dibaca guru.
- **Nama penulis sebagai metadata.** Hampir semua PDF mencantumkan penulis dan
  asal sekolah (mis. "Ida Hariani, S. Pd – SDN 5 Semende Darat Ulu"). Itu
  atribusi yang pantas ditampilkan, dan butuh field baru `penulis` + migrasi.
- **`Pak Yadi.pdf` jadi artikel.** Isinya #CeritaKelas Pak Oktoriyadi (SDN 10
  Sengkuang Kuning, Kapuas Hulu). Cocok untuk koleksi `articles`, bukan
  `produk`.
- **Sitemap.** 4 route Library termasuk `/buku-bahan-ajar-modul` belum ada di
  `src/app/(frontend)/sitemap.ts` — temuan lama yang masih terbuka, sekarang
  jadi lebih terasa karena route detailnya bertambah dari 18 jadi 79.
