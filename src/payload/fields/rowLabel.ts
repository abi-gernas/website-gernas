/**
 * Dipasang di `admin.components` setiap field array supaya judul barisnya
 * memakai isi baris itu sendiri, bukan "Slide 01"/"Kartu 02".
 *
 * Nilainya jalur komponen, bukan komponennya: berkas ini ikut termuat oleh
 * CLI `payload migrate` di luar Next, dan mengimpor berkas .tsx di sana akan
 * gagal. Jalurnya dipetakan lewat `admin.importMap.baseDir` (= src/) di
 * payload.config.ts — jalankan `npm run generate:importmap` bila diubah.
 */
export const judulBaris = {
  RowLabel: "/payload/components/RowLabel#RowLabel",
} as const;
