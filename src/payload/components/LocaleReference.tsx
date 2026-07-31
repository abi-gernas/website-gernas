"use client";

import React, { useEffect, useState } from "react";
import { useConfig, useDocumentInfo, useLocale } from "@payloadcms/ui";

/** Ambil nilai di path bertitik ("blocks.2.content"), termasuk lewat indeks array. */
function ambilNilai(dokumen: unknown, path: string): unknown {
  let node: unknown = dokumen;
  for (const bagian of path.split(".")) {
    if (node == null) return undefined;
    node = (node as Record<string, unknown>)[bagian];
  }
  return node;
}

/** Ubah nilai field jadi teks polos — string apa adanya, dokumen richText (lexical) digabung per paragraf. */
function keTeksPolos(nilai: unknown): string {
  if (typeof nilai === "string") return nilai;
  if (nilai && typeof nilai === "object" && "root" in (nilai as Record<string, unknown>)) {
    const baris: string[] = [];
    const telusuri = (node: any) => {
      if (!node) return;
      if (node.type === "text" && typeof node.text === "string") baris.push(node.text);
      if (Array.isArray(node.children)) node.children.forEach(telusuri);
      if (node.type === "paragraph" || node.type === "listitem") baris.push("\n");
    };
    telusuri((nilai as any).root);
    return baris.join("").replace(/\n{2,}/g, "\n").trim();
  }
  return "";
}

/** Cache per dokumen supaya banyak field di satu halaman tidak memicu fetch berulang. */
const cacheDokumen = new Map<string, Promise<any>>();

function ambilDokumenSumber(apiRoute: string, slug: string, id: string | number | undefined, isGlobal: boolean) {
  const kunci = `${isGlobal ? "global" : "koleksi"}:${slug}:${id ?? ""}`;
  if (!cacheDokumen.has(kunci)) {
    const url = isGlobal
      ? `${apiRoute}/globals/${slug}?locale=id&depth=0`
      : `${apiRoute}/${slug}/${id}?locale=id&depth=0`;
    cacheDokumen.set(
      kunci,
      fetch(url, { credentials: "include" })
        .then((res) => (res.ok ? res.json() : null))
        .catch(() => null),
    );
  }
  return cacheDokumen.get(kunci)!;
}

/**
 * Kotak referensi di bawah field localized: menampilkan isi versi Indonesia
 * (bahasa sumber) supaya editor tak perlu bolak-balik pindah locale saat
 * mengisi versi Inggris.
 */
export const LocaleReference: React.FC<{ path?: string }> = ({ path }) => {
  const locale = useLocale();
  const { id, collectionSlug, globalSlug } = useDocumentInfo();
  const {
    config: { routes },
  } = useConfig();
  const [teksSumber, setTeksSumber] = useState<string | null>(null);

  const slug = collectionSlug ?? globalSlug;
  const isGlobal = Boolean(globalSlug);

  useEffect(() => {
    setTeksSumber(null);
    if (!path || !slug) return;
    if (locale.code === "id") return; // sedang mengisi versi sumbernya sendiri
    if (!isGlobal && !id) return; // dokumen baru, belum ada versi ID tersimpan

    let dibatalkan = false;
    ambilDokumenSumber(routes?.api ?? "/api", slug, id, isGlobal).then((dokumen) => {
      if (dibatalkan || !dokumen) return;
      const teks = keTeksPolos(ambilNilai(dokumen, path));
      setTeksSumber(teks || null);
    });
    return () => {
      dibatalkan = true;
    };
  }, [path, locale.code, id, slug, isGlobal, routes?.api]);

  if (!teksSumber) return null;

  return (
    <div
      style={{
        marginTop: "4px",
        padding: "6px 10px",
        borderRadius: "4px",
        background: "var(--theme-elevation-100)",
        border: "1px solid var(--theme-elevation-150)",
        fontSize: "12px",
        lineHeight: 1.5,
        color: "var(--theme-elevation-600)",
        whiteSpace: "pre-wrap",
      }}
    >
      <strong>🇮🇩 Indonesia:</strong> {teksSumber}
    </div>
  );
};
