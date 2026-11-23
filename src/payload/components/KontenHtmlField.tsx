"use client";

import { Button, CodeField, useField } from "@payloadcms/ui";
import type { CodeFieldClientComponent } from "payload";
import { useRef, useState, type DragEvent } from "react";

const BATAS_UKURAN = 1024 * 1024;

/**
 * Field Konten HTML di Media Interaktif: editor kode bawaan Payload ditambah
 * kotak "pilih atau tarik file .html". Isi file dibaca di browser lalu
 * dimasukkan ke field, sama persis dengan menempelnya manual. File tidak
 * diunggah ke penyimpanan mana pun.
 *
 * Handler drop dipasang di fase capture supaya file yang dijatuhkan di atas
 * editor Monaco juga tertangkap, bukan ditelan editornya.
 */
export const KontenHtmlField: CodeFieldClientComponent = (props) => {
  const { setValue } = useField<string>({ path: props.path });
  const inputRef = useRef<HTMLInputElement>(null);
  const [aktif, setAktif] = useState(false);
  const [pesan, setPesan] = useState<{ teks: string; galat: boolean } | null>(null);

  async function muat(file: File | undefined) {
    if (!file) return;
    if (!/\.html?$/i.test(file.name)) {
      setPesan({ teks: `${file.name} bukan file .html.`, galat: true });
      return;
    }
    if (file.size > BATAS_UKURAN) {
      setPesan({ teks: `${file.name} lebih dari 1 MB. Gambar sebaiknya ditautkan, bukan disisipkan.`, galat: true });
      return;
    }
    setValue(await file.text());
    setPesan({ teks: `Isi ${file.name} sudah dimasukkan. Klik Simpan untuk menyimpannya.`, galat: false });
  }

  function adaFile(e: DragEvent) {
    return e.dataTransfer.types.includes("Files");
  }

  return (
    <div
      onDragOverCapture={(e) => {
        if (!adaFile(e)) return;
        e.preventDefault();
        e.stopPropagation();
        setAktif(true);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setAktif(false);
      }}
      onDropCapture={(e) => {
        if (!adaFile(e)) return;
        e.preventDefault();
        e.stopPropagation();
        setAktif(false);
        void muat(e.dataTransfer.files[0]);
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "0.75rem",
          marginBottom: "0.75rem",
          padding: "1rem",
          border: `2px dashed ${aktif ? "var(--theme-success-500)" : "var(--theme-elevation-200)"}`,
          borderRadius: "var(--style-radius-m)",
          background: aktif ? "var(--theme-success-50)" : "var(--theme-elevation-50)",
        }}
      >
        <Button buttonStyle="secondary" size="small" margin={false} onClick={() => inputRef.current?.click()}>
          Pilih file .html
        </Button>
        <span style={{ color: "var(--theme-elevation-600)" }}>atau tarik file-nya ke kotak ini.</span>
        <input
          ref={inputRef}
          type="file"
          accept=".html,.htm,text/html"
          hidden
          onChange={(e) => {
            void muat(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
        {pesan && (
          <p
            role="status"
            style={{
              flexBasis: "100%",
              margin: 0,
              color: pesan.galat ? "var(--theme-error-500)" : "var(--theme-success-600)",
            }}
          >
            {pesan.teks}
          </p>
        )}
      </div>
      <CodeField {...props} />
    </div>
  );
};
