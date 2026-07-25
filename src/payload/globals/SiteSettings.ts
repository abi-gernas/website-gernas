import type { GlobalConfig } from "payload";

/**
 * Pengaturan situs yang dipakai lintas halaman (footer, kontak, sosial).
 * Menggantikan nilai statis di src/data/site.ts.
 */
export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Pengaturan Situs",
  admin: { group: "Pengaturan" },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Kontak",
          fields: [
            { name: "email", type: "email", label: "Email" },
            { name: "phone", type: "text", label: "Telepon" },
            { name: "address", type: "textarea", label: "Alamat" },
          ],
        },
        {
          label: "Media Sosial",
          fields: [
            {
              name: "social",
              type: "array",
              label: "Tautan",
              fields: [
                {
                  name: "platform",
                  type: "select",
                  label: "Platform",
                  options: [
                    { label: "Instagram", value: "instagram" },
                    { label: "Facebook", value: "facebook" },
                    { label: "YouTube", value: "youtube" },
                    { label: "X (Twitter)", value: "x" },
                    { label: "LinkedIn", value: "linkedin" },
                    { label: "TikTok", value: "tiktok" },
                  ],
                },
                { name: "url", type: "text", label: "URL" },
              ],
            },
          ],
        },
        {
          label: "Footer",
          fields: [
            { name: "footerText", type: "textarea", label: "Teks footer" },
          ],
        },
      ],
    },
  ],
};
