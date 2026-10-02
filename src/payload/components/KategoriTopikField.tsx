"use client";

import { RelationshipField, useDocumentInfo, useField, useFormInitializing } from "@payloadcms/ui";
import type { RelationshipFieldClientComponent } from "payload";
import { useEffect, useRef } from "react";
import { getKategoriProdukTerpilih } from "./kategoriProdukTerpilih";

/**
 * Field Kategori pada form Topik Produk. Saat topik baru dibuat dari tombol "+"
 * di form Produk, Kategori-nya langsung diisi dengan kategori produk yang
 * sedang dibuka — tanpa ini staf harus memilihnya lagi, dan kalau lupa, topik
 * masuk kategori lain lalu tak muncul di daftar Topik produk.
 *
 * Hanya mengisi saat dokumen baru dan kolom masih kosong.
 */
export const KategoriTopikField: RelationshipFieldClientComponent = (props) => {
  const { id } = useDocumentInfo();
  const { value, setValue } = useField<number | string | null>({ path: props.path });

  // Menunggu form selesai diinisialisasi: mengisi lebih awal akan ditimpa state awalnya.
  const sedangInisialisasi = useFormInitializing();
  const sudahDiisi = useRef(false);

  useEffect(() => {
    if (sedangInisialisasi || sudahDiisi.current) return;
    sudahDiisi.current = true;
    if (id || value) return;
    const titipan = getKategoriProdukTerpilih();
    if (titipan) setValue(titipan);
  }, [sedangInisialisasi, id, value, setValue]);

  return <RelationshipField {...props} />;
};
