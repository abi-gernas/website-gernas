import type { Field } from "payload";

/**
 * Field pengurut manual untuk koleksi data berulang (Penggerak, Mitra, Video,
 * Modul Pelatihan).
 *
 * Payload mengurutkan daftar berdasarkan `createdAt` secara bawaan, sehingga
 * urutan tampil di situs akan mengikuti urutan penambahan — bukan urutan yang
 * diinginkan staf. Angka eksplisit membuat urutannya bisa diatur tanpa
 * menghapus dan menambahkan ulang dokumen.
 */
export const urutanField = (): Field => ({
  name: "urutan",
  type: "number",
  label: "Urutan tampil",
  defaultValue: 100,
  admin: {
    position: "sidebar",
    step: 1,
    description:
      "Angka kecil tampil lebih dulu. Biarkan 100 bila urutannya tidak penting.",
  },
});
