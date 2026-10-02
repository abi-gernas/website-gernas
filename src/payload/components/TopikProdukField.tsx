"use client";

import { RelationshipField, useField, useFormFields } from "@payloadcms/ui";
import type { RelationshipFieldClientComponent } from "payload";
import { useEffect, useRef } from "react";
import { setKategoriProdukTerpilih } from "./kategoriProdukTerpilih";

/**
 * Field Topik pada form Produk: field relasi bawaan Payload (lengkap dengan
 * tombol "+" dan pensil, sama seperti Kategori) ditambah dua perilaku:
 *
 * 1. **Topik dikosongkan saat Kategori diganti.** Topik terikat pada satu
 *    kategori; membiarkan topik lama tetap terpilih hanya menyisakan nilai yang
 *    pasti ditolak saat disimpan.
 * 2. **Kategori terpilih dititipkan** (lihat `kategoriProdukTerpilih.ts`) supaya
 *    drawer "Topik baru" membuka dengan Kategori sudah terisi — lihat
 *    `KategoriTopikField.tsx`.
 */
export const TopikProdukField: RelationshipFieldClientComponent = (props) => {
  const kategori = useFormFields(([fields]) => fields.kategori?.value) as number | string | null | undefined;
  const { setValue } = useField<number | string | null>({ path: props.path });

  useEffect(() => {
    setKategoriProdukTerpilih(kategori);
    return () => setKategoriProdukTerpilih(null);
  }, [kategori]);

  const kategoriSebelumnya = useRef(kategori);
  useEffect(() => {
    if (kategoriSebelumnya.current !== kategori) {
      kategoriSebelumnya.current = kategori;
      setValue(null);
    }
  }, [kategori, setValue]);

  return <RelationshipField {...props} />;
};
