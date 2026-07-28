# Manual Book: Migrasi Hosting Vercel → cPanel Dewaweb

> Status: referensi/opsional. Ditulis 2026-07-28 setelah audit "Setup Node.js App"
> tersedia di cPanel Dewaweb (akun tempat `gernastastaka.org` jadi main domain,
> sebelumnya menjalankan WordPress). Belum dieksekusi — dokumen ini disiapkan
> agar migrasi bisa dijalankan terukur kalau/ketika diputuskan.

## 0. Sebelum mulai: apakah ini masih masuk akal?

Migrasi ini **hanya layak** kalau kondisi berikut terpenuhi. Cek dulu sebelum
lanjut ke langkah teknis:

- [ ] Plan hosting Dewaweb punya RAM ≥ 1–2 GB yang dedicated untuk akun ini
      (cek di cPanel → Resource Usage). Shared hosting kecil sering gagal saat
      `next build` (butuh burst memori tinggi) atau proses Passenger di-kill
      saat traffic naik.
- [ ] Anda siap kehilangan **preview deployment otomatis** (`dev.gernastastaka.org`
      auto-update tiap push ke branch `preview`) — di cPanel ini harus dibangun
      manual (lihat §5).
- [ ] Anda siap proses deploy jadi **manual atau butuh CI/CD sendiri**, bukan
      "git push lalu otomatis live" seperti Vercel.
- [ ] WordPress yang sebelumnya jalan di document root domain ini sudah benar-benar
      tidak dipakai (DNS akan dialihkan sepenuhnya ke aplikasi Next.js).

Kalau salah satu di atas jadi masalah besar, pertimbangkan tetap di Vercel dan
Dewaweb hanya jadi registrar domain (lihat `docs/` lain / riwayat percakapan
soal setup DNS).

## 1. Perbedaan model yang perlu dipahami

| Aspek | Vercel (saat ini) | cPanel Node.js App (Passenger) |
|---|---|---|
| Proses | Serverless, spin up per-request | Satu proses Node persisten, dikelola Passenger |
| Build | Otomatis tiap push, isolated | Manual via cPanel UI atau SSH, di server yang sama |
| Image optimization | `next/image` + optimizer Vercel (sudah di-tuning di `next.config.mjs`) | Perlu `images.unoptimized: true` atau proxy sendiri — `sharp` butuh native binary yang cocok dengan arsitektur server |
| Preview per branch | Otomatis (`dev.gernastastaka.org`) | Harus dibuat manual: app Node terpisah + subdomain terpisah |
| SSL | Otomatis | AutoSSL (Let's Encrypt) cPanel, biasanya otomatis begitu DNS mengarah ke server |
| Revalidate/ISR | `revalidatePath` native | Tetap jalan (ini fitur Next, bukan Vercel-only) selama proses Node tidak di-restart terus |
| Database | Supabase Postgres (pooled) | Tetap bisa pakai Supabase yang sama — tidak perlu pindah DB |
| Media | Supabase Storage (S3) | Tetap bisa dipakai sama persis — tidak perlu pindah storage |

**Kabar baik:** database (Supabase Postgres) dan media (Supabase Storage) tidak
perlu dipindah sama sekali. Yang pindah cuma tempat proses Next.js-nya jalan.

## 2. Persiapan di cPanel

1. Masuk **cPanel → Setup Node.js App**
2. Buat aplikasi baru:
   - **Node.js version**: pilih yang paling dekat dengan yang dipakai lokal (cek `node -v` di mesin dev — proyek ini pakai Next 16 + React 19, butuh Node ≥ 20)
   - **Application mode**: Production
   - **Application root**: folder tempat kode di-upload, misal `gernastastaka-app`
   - **Application URL**: `gernastastaka.org` (domain utama)
   - **Application startup file**: `server.js` (lihat §3 — Next.js butuh custom entry point untuk Passenger, tidak bisa langsung `next start`)
3. Ulangi untuk domain kedua kalau mau replikasi preview (lihat §5)

## 3. Menyesuaikan aplikasi agar kompatibel Passenger

Passenger butuh entry file yang dia jalankan langsung (bukan lewat `npm run start`).
Buat `server.js` di root project:

```js
// server.js — entry point untuk Phusion Passenger di cPanel.
// Next.js normalnya dijalankan lewat `next start`, tapi Passenger butuh
// modul yang langsung listen di process.env.PORT yang dia inject sendiri.
import next from "next";
import http from "http";

const port = process.env.PORT || 3000;
const app = next({ dev: false });
const handle = app.getRequestHandler();

await app.prepare();
http.createServer((req, res) => handle(req, res)).listen(port);
```

Tambahkan juga di `next.config.mjs`:

```js
images: {
  // Passenger/shared hosting tidak menjamin `sharp` (native binary) jalan.
  // Kalau build gagal karena sharp, matikan optimizer built-in dulu —
  // gambar tetap tampil, cuma tidak di-resize/convert otomatis lagi.
  unoptimized: true,
  // ...config remotePatterns/deviceSizes yang sudah ada bisa dihapus
  // karena tidak relevan lagi tanpa optimizer aktif
}
```

> Jangan hapus config `deviceSizes`/`formats`/`minimumCacheTTL` yang ada sekarang
> kalau masih ragu — cukup tambahkan `unoptimized: true` di percobaan pertama,
> baru bereskan detail lain setelah build berhasil.

## 4. Environment variables

Isi persis seperti `.env.example` di root repo, lewat form **Environment
Variables** di halaman Setup Node.js App (bukan file `.env` biasa — cPanel
inject sendiri ke proses Passenger):

- `PAYLOAD_SECRET`
- `DATABASE_URI` (pooled, port 6543 — tetap ke Supabase, tidak berubah)
- `DATABASE_URI_DIRECT` (dipakai kalau jalankan `payload migrate` dari server ini)
- `NEXT_PUBLIC_SERVER_URL=https://gernastastaka.org`
- `S3_BUCKET`, `S3_ENDPOINT`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`

## 5. Preview environment (`dev.gernastastaka.org`)

Vercel otomatis bikin deployment terpisah tiap push ke branch `preview`. Di
cPanel, replikasi paling sederhana:

1. Buat **Node.js App kedua** di cPanel, root folder terpisah (misal
   `gernastastaka-app-preview`), Application URL `dev.gernastastaka.org`
2. Clone/pull branch `preview` ke folder itu secara terpisah dari folder production
3. Environment variable sama, kecuali `NEXT_PUBLIC_SERVER_URL=https://dev.gernastastaka.org`
4. Deploy ke sini **manual** tiap ada perubahan branch `preview` (lihat §6) — tidak otomatis seperti Vercel kecuali Anda bangun sendiri lewat webhook GitHub → script SSH

## 6. Alur deploy (manual, sampai ada otomasi)

Karena cPanel tidak terhubung ke GitHub seperti Vercel, tiap kali ada
perubahan kode:

```bash
# di server (lewat SSH atau Terminal bawaan cPanel), di dalam application root
git pull origin main          # atau `preview` untuk app preview
npm install
npm run generate:types        # kalau ada perubahan skema Payload
npm run build
```

Lalu klik tombol **"Restart"** di halaman Setup Node.js App cPanel supaya
Passenger reload proses dengan build baru.

> Kalau volume perubahan sering, pertimbangkan setup GitHub Actions yang SSH
> ke server dan jalankan urutan di atas otomatis tiap push — ini di luar
> cakupan dokumen ini, tanya lagi kalau sampai ke tahap itu.

## 7. Migrasi skema database (kalau perlu dari server ini)

```bash
npm run migrate:status   # cek migrasi yang belum jalan
npm run migrate          # pakai DATABASE_URI_DIRECT (port 5432) untuk DDL
```

Tidak wajib dijalankan dari server cPanel — bisa juga tetap dari mesin lokal
seperti biasa, karena Supabase-nya tidak pindah.

## 8. DNS (langkah terakhir, setelah aplikasi terbukti jalan)

**Jangan ubah DNS sebelum aplikasi di cPanel benar-benar bisa diakses dan
diuji** (lewat IP server langsung atau subdomain sementara). Baru setelah
yakin jalan:

- Zone Editor cPanel → arahkan A record `gernastastaka.org` (root) ke IP
  server hosting cPanel itu sendiri (bukan lagi `216.198.79.1` milik Vercel)
- `www` dan `dev` bisa CNAME ke domain utama atau A record IP yang sama
- Hapus/nonaktifkan domain di Vercel dashboard supaya tidak ada kebingungan
  dua tempat serving domain yang sama

## 9. Rollback plan

Simpan project di Vercel tetap aktif (jangan hapus) selama masa transisi.
Kalau ada masalah setelah DNS dialihkan ke cPanel:

1. Balikkan A/CNAME record di cPanel Zone Editor ke value Vercel (`216.198.79.1`
   dan `fc17f6da74b00adb.vercel-dns-017.com`, cek ulang value aktual di Vercel
   dashboard karena bisa berubah)
2. Tunggu propagasi (lihat catatan soal `dig @<nameserver>` di riwayat
   percakapan untuk verifikasi cepat tanpa nunggu TTL habis)

## Checklist ringkas

- [ ] Cek RAM/plan cPanel cukup
- [ ] Buat Node.js App di cPanel (production)
- [ ] Tambah `server.js`, set `images.unoptimized: true`
- [ ] Isi environment variables
- [ ] `npm install && npm run build`, pastikan jalan lewat IP/subdomain sementara
- [ ] Buat Node.js App kedua untuk preview (opsional)
- [ ] Test penuh: halaman publik, admin Payload, upload media, draft preview
- [ ] Baru ubah DNS di Zone Editor
- [ ] Verifikasi dengan `dig` ke nameserver otoritatif
- [ ] Matikan/hapus domain dari Vercel setelah yakin stabil
