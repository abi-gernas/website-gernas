import "server-only";
import { getPayload } from "payload";
import config from "@payload-config";
import type { Media } from "@/payload-types";

/**
 * Satu instans Payload untuk seluruh server component.
 *
 * `getPayload` memang sudah menyimpan instansnya sendiri, tetapi menaruh
 * promise-nya di satu modul membuat setiap pemanggil memakai konfigurasi yang
 * sama dan menghindari dua sumber yang perlu diubah bila opsi koneksi berganti.
 */
export const payloadPromise = getPayload({ config });

/** URL & dimensi dari relasi Media yang sudah ter-populate; `null` bila masih id polos atau kosong. */
export function toImage(value: unknown): { url: string; width?: number; height?: number } | null {
  if (!value || typeof value !== "object") return null;
  const m = value as Media;
  if (!m.url) return null;
  return { url: m.url, width: m.width ?? undefined, height: m.height ?? undefined };
}
