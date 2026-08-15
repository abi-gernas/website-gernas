import type { GlobalConfig } from "payload";
import { terapkanReferensiLokal } from "../fields/localeReference";
import { judulBaris } from "../fields/rowLabel";

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
  fields: terapkanReferensiLokal([
    {
      name: "items",
      type: "array",
      label: "Menu Utama",
      admin: { components: judulBaris },
      fields: [
        { name: "label", type: "text", localized: true, required: true, label: "Label" },
        {
          name: "href",
          type: "text",
          label: "Tautan",
          admin: {
            description:
              "Path relatif (mis. /mitra) atau URL penuh. Kosongkan bila menu ini punya submenu.",
          },
        },
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
          name: "children",
          type: "array",
          label: "Submenu",
          admin: { components: judulBaris },
          fields: [
            { name: "label", type: "text", localized: true, required: true, label: "Label" },
            { name: "href", type: "text", required: true, label: "Tautan" },
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
