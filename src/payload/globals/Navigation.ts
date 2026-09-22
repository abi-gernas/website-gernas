import type { Field, GlobalConfig } from "payload";
import { terapkanReferensiLokal } from "../fields/localeReference";
import { judulBaris } from "../fields/rowLabel";
import { revalidateNavigasi } from "../hooks/revalidate";

/**
 * Rute tetap di kode (bukan dokumen Payload) yang sering dijadikan tujuan
 * menu — ditawarkan sebagai pilihan cepat di field Tautan Kustom supaya staf
 * tidak perlu mengetik atau menyalin path secara manual.
 */
const RUTE_TETAP = [
  { label: "Beranda", value: "/" },
  { label: "Tentang Gernas Tastaka", value: "/tentang-gernas-tastaka" },
  { label: "Galeri", value: "/galeri" },
  { label: "Mitra", value: "/mitra" },
  { label: "Donatur", value: "/donatur" },
  { label: "Tumbuh Bersama", value: "/tumbuh-bersama" },
  { label: "Belajar Bersama", value: "/belajar-bersama" },
  { label: "Publikasi", value: "/publikasi" },
  { label: "Pojok Guru", value: "/pojok-guru" },
  { label: "Buku, Bahan Ajar & Modul", value: "/buku-bahan-ajar-modul" },
  { label: "Video Pembelajaran", value: "/video-pembelajaran" },
  { label: "Media Interaktif", value: "/media-interaktif" },
  { label: "Jadwal Acara", value: "/belajar-bersama#jadwal-acara" },
];

const LAINNYA = "__custom__";

/**
 * Field tujuan tautan: pilih halaman dari koleksi Pages (selalu akurat, tidak
 * mungkin salah ketik) atau isi tautan kustom untuk rute tetap di kode,
 * anchor (#...), atau URL eksternal.
 */
function tautanFields(opts: { defaultPreset?: string } = {}): Field[] {
  return [
    {
      name: "linkType",
      type: "radio",
      label: "Jenis Tautan",
      defaultValue: "custom",
      options: [
        { label: "Halaman CMS (Pages)", value: "page" },
        { label: "Tautan Kustom", value: "custom" },
      ],
      admin: { layout: "horizontal" },
    },
    {
      name: "page",
      type: "relationship",
      relationTo: "pages",
      label: "Pilih Halaman",
      admin: {
        condition: (_data, siblingData) => siblingData?.linkType === "page",
      },
    },
    {
      name: "preset",
      type: "select",
      label: "Rute Cepat",
      defaultValue: opts.defaultPreset ?? LAINNYA,
      options: [
        ...RUTE_TETAP.map((r) => ({ label: `${r.label} (${r.value})`, value: r.value })),
        { label: "Lainnya / isi manual…", value: LAINNYA },
      ],
      admin: {
        condition: (_data, siblingData) => siblingData?.linkType === "custom",
      },
    },
    {
      name: "custom",
      type: "text",
      label: "Path / URL",
      admin: {
        description: "Path relatif (mis. /mitra#anchor) atau URL penuh.",
        condition: (_data, siblingData) =>
          siblingData?.linkType === "custom" &&
          (!siblingData?.preset || siblingData.preset === LAINNYA),
      },
    },
  ];
}

/**
 * Struktur menu navbar — menggantikan daftar statis di src/lib/nav.ts agar
 * tim konten bisa mengubah menu sendiri dari dasbor.
 */
export const Navigation: GlobalConfig = {
  slug: "navigation",
  label: "Navigasi",
  admin: { group: "Pengaturan" },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  hooks: {
    afterChange: [revalidateNavigasi],
  },
  fields: terapkanReferensiLokal([
    {
      name: "ctaButton",
      type: "group",
      label: "Tombol CTA (mis. Donasi)",
      fields: [
        {
          name: "enabled",
          type: "checkbox",
          label: "Tampilkan tombol",
          defaultValue: true,
        },
        {
          name: "label",
          type: "text",
          localized: true,
          label: "Label",
          defaultValue: "Donasi",
          admin: {
            condition: (_data, siblingData) => siblingData?.enabled !== false,
          },
        },
        ...tautanFields({ defaultPreset: "/donatur" }),
      ],
    },
    {
      name: "items",
      type: "array",
      label: "Menu Utama",
      admin: { components: judulBaris },
      fields: [
        { name: "label", type: "text", localized: true, required: true, label: "Label" },
        ...tautanFields(),
        {
          name: "hidden",
          type: "checkbox",
          label: "Sembunyikan",
          defaultValue: false,
          admin: {
            description: "Menu tetap tersimpan di sini, hanya tidak ditampilkan di navbar.",
          },
        },
        {
          name: "sorot",
          type: "checkbox",
          label: "Tampilkan menonjol",
          defaultValue: false,
          admin: {
            description:
              "Menu diberi latar kuning muda agar mudah ditemukan, mis. “Pojok Guru”. Cukup satu menu saja — kalau banyak, tidak ada yang menonjol.",
          },
        },
        {
          name: "children",
          type: "array",
          label: "Submenu",
          admin: { components: judulBaris },
          fields: [
            { name: "label", type: "text", localized: true, required: true, label: "Label" },
            ...tautanFields(),
            { name: "desc", type: "text", localized: true, label: "Deskripsi singkat" },
            {
              name: "hidden",
              type: "checkbox",
              label: "Sembunyikan",
              defaultValue: false,
              admin: {
                description: "Submenu tetap tersimpan di sini, hanya tidak ditampilkan di navbar.",
              },
            },
          ],
        },
      ],
    },
  ]),
};
